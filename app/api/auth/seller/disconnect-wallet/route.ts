// app/api/auth/seller/disconnect-wallet/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import jwt from "jsonwebtoken"

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization header missing" },
        { status: 401 }
      )
    }

    const token = authHeader.split(" ")[1]
    let decoded: any;
    
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")
    } catch (jwtError) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      )
    }

    // Get user with current wallet info
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { designerProfile: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Get the wallet address before disconnecting (for logging)
    const walletAddress = user.cardanoAddress

    // Disconnect wallet - update ALL related fields
    const updatedUser = await prisma.user.update({
      where: { id: decoded.id },
      data: {
        walletVerified: false,
        cardanoAddress: null,
        walletNonce: null,
        walletConnectedAt: null,
        updatedAt: new Date()
      }
    })

    // Also update designer profile if exists
    if (user.designerProfile) {
      await prisma.designerProfile.update({
        where: { userId: decoded.id },
        data: {
          walletAddress: null,
          walletVerified: false,
          walletVerifiedAt: null,
          walletName: null,
          updatedAt: new Date()
        }
      })
    }

    console.log(`✅ Wallet disconnected for user: ${decoded.id} (${user.email})`)
    console.log(`✅ Disconnected wallet address: ${walletAddress}`)

    return NextResponse.json({
      success: true,
      message: "Wallet disconnected successfully",
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        walletVerified: updatedUser.walletVerified,
        walletAddress: null,
        disconnectedAt: new Date().toISOString()
      }
    })

  } catch (error: any) {
    console.error("❌ Wallet disconnect error:", error)
    return NextResponse.json(
      { 
        error: "Failed to disconnect wallet",
        details: error.message 
      },
      { status: 500 }
    )
  }
}