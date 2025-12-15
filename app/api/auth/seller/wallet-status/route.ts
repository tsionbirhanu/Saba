import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import jwt from "jsonwebtoken"

export async function GET(req: NextRequest) {
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
      decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key-change-this")
    } catch (jwtError) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      )
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        walletVerified: true,
        cardanoAddress: true,
        walletConnectedAt: true
      }
    })

    if (!user) {
      return NextResponse.json({
        status: "error",
        message: "User not found"
      })
    }

    // If user already has wallet connected
    if (user.walletVerified && user.cardanoAddress) {
      return NextResponse.json({
        status: "connected",
        walletAddress: user.cardanoAddress,
        connectedAt: user.walletConnectedAt
      })
    }

    // Check if any other user has connected the wallet (if address provided)
    const searchAddress = req.nextUrl.searchParams.get('address')
    
    if (searchAddress) {
      const otherUserWithWallet = await prisma.user.findFirst({
        where: {
          cardanoAddress: searchAddress,
          id: { not: decoded.id },
          walletVerified: true
        },
        select: {
          email: true,
          name: true,
          walletConnectedAt: true
        }
      })

      if (otherUserWithWallet) {
        return NextResponse.json({
          status: "connected_to_other",
          walletAddress: searchAddress,
          connectedToUser: {
            email: otherUserWithWallet.email,
            name: otherUserWithWallet.name,
            connectedAt: otherUserWithWallet.walletConnectedAt
          },
          message: `This wallet is already connected to ${otherUserWithWallet.email}`
        })
      }
    }

    return NextResponse.json({
      status: "not_connected"
    })

  } catch (error: any) {
    console.error("Wallet status error:", error)
    return NextResponse.json(
      { 
        status: "error",
        message: "Failed to check wallet status"
      },
      { status: 500 }
    )
  }
}