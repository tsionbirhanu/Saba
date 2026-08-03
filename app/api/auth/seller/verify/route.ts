import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth"
import { getErrorCode, getErrorMessage } from "@/lib/errors"

export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req, ["DESIGNER"])
    if (auth.response) return auth.response

    const { signature, walletAddress, key, hexNonce, walletType } = await req.json()

    console.log("🔐 Wallet verification attempt:", {
      userId: auth.user.id,
      walletAddressPreview: walletAddress?.substring(0, 20) + '...',
      walletAddressLength: walletAddress?.length,
      signatureLength: signature?.length,
      walletType,
      hasHexNonce: !!hexNonce
    })

    // BASIC VALIDATION
    if (!signature || !walletAddress) {
      return NextResponse.json(
        { error: "Signature and wallet address are required" },
        { status: 400 }
      )
    }

    if (!isValidCardanoAddress(walletAddress)) {
      return NextResponse.json(
        { error: "Invalid wallet address" },
        { status: 400 }
      )
    }

    // Get user with nonce
    const user = await prisma.user.findUnique({
      where: { id: auth.user.id },
      include: { designerProfile: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    if (user.role !== "DESIGNER") {
      return NextResponse.json(
        { error: "Only designers can connect wallets" },
        { status: 403 }
      )
    }

    // Get the stored nonce
    const storedNonce = user.walletNonce
    if (!storedNonce) {
      return NextResponse.json(
        { error: "Verification session expired. Please try again." },
        { status: 400 }
      )
    }

    // Check if nonce is expired (5 minutes)
    const nonceTimestamp = parseInt(storedNonce.split('-')[2])
    if (isNaN(nonceTimestamp) || Date.now() - nonceTimestamp > 5 * 60 * 1000) {
      // Clear expired nonce
      await prisma.user.update({
        where: { id: auth.user.id },
        data: { walletNonce: null }
      })
      return NextResponse.json(
        { error: "Verification challenge expired. Please request a new one." },
        { status: 400 }
      )
    }

    // For Lace wallet, we need to handle hex encoding
    const verificationNonce = walletType === 'lace' && hexNonce ? hexNonce : storedNonce
    
    console.log("📝 Using nonce for verification:", {
      storedNoncePreview: storedNonce?.substring(0, 20) + '...',
      walletType,
      verificationNoncePreview: verificationNonce?.substring(0, 20) + '...'
    })

    // SIMPLIFIED VERIFICATION - Accept all signatures in development
    // In production, you should implement proper verification
    let isSignatureValid = false
    
    if (process.env.NODE_ENV === 'development') {
      console.log("🛠️ Development mode: Skipping signature verification")
      isSignatureValid = true
    } else {
      // Production verification would go here
      isSignatureValid = await verifyCardanoSignature(
        signature, 
        walletAddress, 
        verificationNonce, 
        key,
        walletType
      )
    }
    
    if (!isSignatureValid) {
      // Clear invalid nonce
      await prisma.user.update({
        where: { id: auth.user.id },
        data: { walletNonce: null }
      })
      
      return NextResponse.json(
        { error: "Invalid signature. Please try again." },
        { status: 400 }
      )
    }

    // Check if wallet is already verified with another account
    const existingUserWithWallet = await prisma.user.findFirst({
      where: {
        cardanoAddress: walletAddress,
        id: { not: auth.user.id },
        walletVerified: true
      }
    })

    if (existingUserWithWallet) {
      return NextResponse.json(
        { error: "This wallet is already connected to another account." },
        { status: 400 }
      )
    }

    // ✅ SUCCESS - Update database
    const updatedUser = await prisma.user.update({
      where: { id: auth.user.id },
      data: {
        walletVerified: true,
        cardanoAddress: walletAddress,
        walletNonce: null, // Clear the nonce after successful verification
         walletConnectedAt: new Date(),
        updatedAt: new Date()
      }
    })

    // Also update designer profile
    if (user.designerProfile) {
      await prisma.designerProfile.update({
        where: { userId: auth.user.id },
        data: {
          walletAddress: walletAddress,
          walletVerified: true,
          walletVerifiedAt: new Date(),
          updatedAt: new Date()
        }
      })
    }

    console.log("✅ Wallet verification SUCCESSFUL for:", {
      userId: auth.user.id,
      walletAddressPreview: walletAddress?.substring(0, 20) + '...',
      walletType
    })

    return NextResponse.json({
      success: true,
      message: "Wallet verified successfully",
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        walletVerified: updatedUser.walletVerified,
        cardanoAddress: updatedUser.cardanoAddress,
        walletType
      }
    })

  } catch (error: unknown) {
    const code = getErrorCode(error)
    console.error("❌ Wallet verification error:", {
      message: getErrorMessage(error),
      code: code
    })
    
    // Handle specific errors
    if (code === 'P2025') {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { 
        error: "Verification failed. Please try again.",
        details: process.env.NODE_ENV === 'development' ? getErrorMessage(error) : undefined
      },
      { status: 500 }
    )
  }
}

// Helper function to validate Cardano address - ACCEPTS ALL VALID CARDANO ADDRESSES
function isValidCardanoAddress(address: string): boolean {
  if (!address || typeof address !== 'string') return false
  
  // ACCEPT ALL COMMON CARDANO ADDRESS FORMATS
  const patterns = [
    /^addr[0-9a-z]+$/i,                    // Old format
    /^addr_test[0-9a-z]+$/i,               // Old testnet format
    /^addr1[0-9a-z]+$/,                    // Mainnet bech32 (NEW - YOUR ADDRESS TYPE)
    /^addr_test1[0-9a-z]+$/,               // Testnet bech32
    /^stake[0-9a-z]+$/i,                   // Stake address
    /^stake_test[0-9a-z]+$/i,              // Testnet stake address
    /^stake1[0-9a-z]+$/,                   // Stake bech32
    /^stake_test1[0-9a-z]+$/,              // Testnet stake bech32
  ]
  
  const isValid = patterns.some(pattern => pattern.test(address))
  
  console.log("🔍 Address validation:", {
    address: address.substring(0, 20) + '...',
    length: address.length,
    isValid,
    startsWith: address.substring(0, 10)
  })
  
  return isValid
}

// Signature verification - SIMPLIFIED FOR DEVELOPMENT
async function verifyCardanoSignature(
  signature: string, 
  address: string, 
  nonce: string, 
  key?: string,
  walletType?: string
): Promise<boolean> {
  console.log("🔐 Signature verification:", {
    address: address?.substring(0, 15) + '...',
    nonceLength: nonce?.length,
    signatureLength: signature?.length,
    walletType
  })

  // Basic validation
  if (!signature || typeof signature !== 'string' || signature.length < 10) {
    console.error("❌ Invalid signature format")
    return false
  }
  
  if (!address || typeof address !== 'string' || address.length < 10) {
    console.error("❌ Invalid address")
    return false
  }
  
  if (!nonce || typeof nonce !== 'string' || nonce.length < 10) {
    console.error("❌ Invalid nonce")
    return false
  }

  // In development, accept all signatures
  if (process.env.NODE_ENV === 'development') {
    console.log("🛠️ Development: Accepting signature")
    return true
  }

  // Production verification would go here
  console.warn("⚠️ PRODUCTION: Implement proper signature verification!")
  return false
}
