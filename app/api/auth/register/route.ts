import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json()

    console.log("Registration attempt:", { name, email, role })

    // Validate input
    if (!name || !email || !password || !role) {
      console.error("Missing fields:", { name, email, password, role })
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.error("User already exists:", email)
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Prepare user data
    const userData: any = {
      name,
      email,
      password: hashedPassword,
      role: role === "DESIGNER" ? "DESIGNER" : "BUYER",
      walletVerified: false,
      cardanoAddress: null,
      walletNonce: null
    }

    // Add designer profile if role is DESIGNER
    if (role === "DESIGNER") {
      userData.designerProfile = {
        create: {
          isVerified: false,
          walletAddress: null,
          walletVerified: false
        }
      }
    }

    console.log("Creating user with data:", userData)

    // Create user
    const user = await prisma.user.create({
      data: userData,
      include: {
        designerProfile: role === "DESIGNER"
      }
    })

    console.log("User created successfully:", user.id)

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { 
        success: true,
        message: "User created successfully", 
        user: userWithoutPassword 
      },
      { status: 201 }
    )

  } catch (error: any) {
    console.error("Registration error details:", {
      message: error.message,
      code: error.code,
      stack: error.stack
    })
    
    // Handle Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      )
    }
    
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: "Invalid data provided" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    )
  }
}