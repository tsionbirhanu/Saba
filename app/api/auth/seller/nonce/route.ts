import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { requireAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req, ["DESIGNER"]);
    if (auth.response) return auth.response;

    const user = await prisma.user.findUnique({
      where: { id: auth.user.id },
    });

    if (!user || user.role !== "DESIGNER") {
      return NextResponse.json(
        { error: "Only designers can request verification" },
        { status: 403 }
      );
    }

    const timestamp = Date.now();
    const randomBytes = crypto.randomBytes(16).toString("hex");
    const nonce = `saba-auth-${timestamp}-${randomBytes}`;

    await prisma.user.update({
      where: { id: auth.user.id },
      data: { walletNonce: nonce },
    });

    console.log("Generated nonce for user:", {
      userId: auth.user.id,
      noncePreview: nonce.substring(0, 30) + "...",
      timestamp,
    });

    return NextResponse.json({
      success: true,
      nonce,
      hexNonce: stringToHex(nonce),
      expiresIn: "5 minutes",
      timestamp,
    });
  } catch (error) {
    console.error("Nonce generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate verification challenge" },
      { status: 500 }
    );
  }
}

function stringToHex(str: string): string {
  return Array.from(str)
    .map((char) => char.charCodeAt(0).toString(16).padStart(2, "0"))
    .join("");
}
