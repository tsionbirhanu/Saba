import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { getClientIp, rateLimit } from "@/lib/rate-limit"
import { getErrorCode, getErrorDetails } from "@/lib/errors"
import type { Prisma } from "@prisma/client"
import { notificationEmail, notifyUser } from "@/lib/notifications"

const SALT_ROUNDS = 10
const PUBLIC_ROLES = new Set(["BUYER", "DESIGNER"])

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json()
    const normalizedEmail = String(email || "").toLowerCase().trim()

    const limited = rateLimit({
      key: `register:${getClientIp(req)}:${normalizedEmail}`,
      limit: 3,
      windowMs: 60 * 60 * 1000,
    })
    if (limited) return limited

    console.log("Registration attempt:", { name, email: normalizedEmail, role })

    // Validate input
    if (!name || !normalizedEmail || !password || !role) {
      console.error("Missing fields:", { name, email: normalizedEmail, hasPassword: !!password, role })
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(normalizedEmail)) {
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

    if (!PUBLIC_ROLES.has(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    })

    if (existingUser) {
      console.error("User already exists:", normalizedEmail)
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    const isDesigner = role === "DESIGNER"
    const userData: Prisma.UserCreateInput = {
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: isDesigner ? "DESIGNER" : "BUYER",
      ...(isDesigner
        ? {
            designerProfile: {
              create: {
                isVerified: false,
              },
            },
          }
        : {}),
    }

    console.log("Creating user with data:", {
      name,
      email: normalizedEmail,
      role: userData.role,
      designerProfile: isDesigner,
    })

    // Create user
    const user = await prisma.user.create({
      data: userData,
      include: {
        designerProfile: true
      }
    })

    console.log("User created successfully:", user.id)

    await notifyUser({
      userId: user.id,
      type: "ACCOUNT_REGISTERED",
      title: "Welcome to Saba",
      message: isDesigner
        ? "Your designer account was created. You can prepare products while waiting for admin verification."
        : "Your buyer account was created successfully. Welcome to Saba Marketplace.",
      link: isDesigner ? "/seller-dashboard" : "/shop",
      email: {
        to: user.email,
        subject: "Welcome to Saba Marketplace",
        html: notificationEmail(
          "Welcome to Saba Marketplace",
          isDesigner
            ? "Your designer account was created. You can prepare products while waiting for admin verification."
            : "Your buyer account was created successfully. Welcome to Saba Marketplace.",
          isDesigner ? "/seller-dashboard" : "/shop"
        ),
      },
    })

    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      designerProfile: user.designerProfile,
    }

    return NextResponse.json(
      { 
        success: true,
        message: "User created successfully", 
        user: userWithoutPassword 
      },
      { status: 201 }
    )

  } catch (error: unknown) {
    const details = getErrorDetails(error)
    const code = getErrorCode(error)
    console.error("Registration error details:", {
      ...details,
      code,
    })
    
    // Handle Prisma errors
    if (code === 'P2002') {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      )
    }
    
    if (code === 'P2003') {
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
