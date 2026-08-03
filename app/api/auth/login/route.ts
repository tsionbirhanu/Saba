import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { getJwtSecret } from "@/lib/jwt"
import { getClientIp, rateLimit } from "@/lib/rate-limit"
import { getErrorMessage } from "@/lib/errors"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    const normalizedEmail = String(email || "").toLowerCase().trim()

    const limited = rateLimit({
      key: `login:${getClientIp(req)}:${normalizedEmail}`,
      limit: 5,
      windowMs: 15 * 60 * 1000,
    })
    if (limited) return limited

    console.log("Login attempt for:", normalizedEmail)

    if (!normalizedEmail || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Find user with designer profile
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: {
        designerProfile: true
      }
    })

    if (!user) {
      console.error("User not found:", normalizedEmail)
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      console.error("Invalid password for:", normalizedEmail)
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      getJwtSecret(),
      { expiresIn: "7d" }
    )

    console.log("Login successful for:", user.id)

    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      cardanoAddress: user.cardanoAddress,
      walletVerified: user.walletVerified,
      walletConnectedAt: user.walletConnectedAt,
      designerProfile: user.designerProfile,
    }

    return NextResponse.json({
      success: true,
      token,
      user: userWithoutPassword
    })

  } catch (error: unknown) {
    console.error("Login error:", getErrorMessage(error))
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
