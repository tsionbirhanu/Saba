import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Find seller
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.role !== "DESIGNER") {
      return NextResponse.json(
        { error: "Only designers can authenticate with wallet" },
        { status: 403 }
      );
    }

    // Generate cryptographically secure nonce
    const nonce = crypto.randomBytes(32).toString("hex");

    await prisma.user.update({
      where: { id: user.id },
      data: {
        walletNonce: nonce,
        walletVerified: false,
      },
    });

    return NextResponse.json({
      nonce,
      message: "Nonce generated. Sign this with your Cardano wallet.",
    });
  } catch (error) {
    console.error("Nonce error:", error);
    return NextResponse.json(
      { error: "Failed to generate nonce" },
      { status: 500 }
    );
  }
}
