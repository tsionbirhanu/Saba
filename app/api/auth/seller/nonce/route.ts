import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import jwt from "jsonwebtoken"
import crypto from "crypto"

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
      decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key-change-this")
    } catch (jwtError) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      )
    }

    // Check if user is a designer
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    })

    if (!user || user.role !== "DESIGNER") {
      return NextResponse.json(
        { error: "Only designers can request verification" },
        { status: 403 }
      )
    }

    // Generate a secure random nonce with timestamp
    const timestamp = Date.now()
    const randomBytes = crypto.randomBytes(16).toString('hex')
    const nonce = `saba-auth-${timestamp}-${randomBytes}`

    // Store nonce in user record
    await prisma.user.update({
      where: { id: decoded.id },
      data: { walletNonce: nonce }
    })

    console.log("✅ Generated nonce for user:", {
      userId: decoded.id,
      noncePreview: nonce.substring(0, 30) + '...',
      timestamp
    })

    return NextResponse.json({ 
      success: true,
      nonce,
      hexNonce: stringToHex(nonce), // Provide hex version for Lace wallet
      expiresIn: "5 minutes",
      timestamp
    })

  } catch (error: any) {
    console.error("❌ Nonce generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate verification challenge" },
      { status: 500 }
    )
  }
}

// Helper function to convert string to hex
function stringToHex(str: string): string {
  return Array.from(str).map(c => 
    c.charCodeAt(0).toString(16).padStart(2, '0')
  ).join('')
}