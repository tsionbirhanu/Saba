import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { getErrorMessage } from "@/lib/errors";

export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req, ["DESIGNER"]);
    if (auth.response) return auth.response;

    const user = await prisma.user.findUnique({
      where: { id: auth.user.id },
      include: { designerProfile: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const walletAddress = user.cardanoAddress;

    const updatedUser = await prisma.user.update({
      where: { id: auth.user.id },
      data: {
        walletVerified: false,
        cardanoAddress: null,
        walletNonce: null,
        walletConnectedAt: null,
        updatedAt: new Date(),
      },
    });

    if (user.designerProfile) {
      await prisma.designerProfile.update({
        where: { userId: auth.user.id },
        data: {
          walletAddress: null,
          walletVerified: false,
          walletVerifiedAt: null,
          updatedAt: new Date(),
        },
      });
    }

    console.log(`Wallet disconnected for user: ${auth.user.id} (${user.email})`);
    console.log(`Disconnected wallet address: ${walletAddress}`);

    return NextResponse.json({
      success: true,
      message: "Wallet disconnected successfully",
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        walletVerified: updatedUser.walletVerified,
        walletAddress: null,
        disconnectedAt: new Date().toISOString(),
      },
    });
  } catch (error: unknown) {
    console.error("Wallet disconnect error:", error);
    return NextResponse.json(
      {
        error: "Failed to disconnect wallet",
        details: getErrorMessage(error),
      },
      { status: 500 }
    );
  }
}
