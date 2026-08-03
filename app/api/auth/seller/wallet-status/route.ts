import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req, ["DESIGNER"]);
    if (auth.response) return auth.response;

    const user = await prisma.user.findUnique({
      where: { id: auth.user.id },
      select: {
        id: true,
        email: true,
        walletVerified: true,
        cardanoAddress: true,
        walletConnectedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({
        status: "error",
        message: "User not found",
      });
    }

    if (user.walletVerified && user.cardanoAddress) {
      return NextResponse.json({
        status: "connected",
        walletAddress: user.cardanoAddress,
        connectedAt: user.walletConnectedAt,
      });
    }

    const searchAddress = req.nextUrl.searchParams.get("address");

    if (searchAddress) {
      const otherUserWithWallet = await prisma.user.findFirst({
        where: {
          cardanoAddress: searchAddress,
          id: { not: auth.user.id },
          walletVerified: true,
        },
        select: {
          email: true,
          name: true,
          walletConnectedAt: true,
        },
      });

      if (otherUserWithWallet) {
        return NextResponse.json({
          status: "connected_to_other",
          walletAddress: searchAddress,
          connectedToUser: {
            email: otherUserWithWallet.email,
            name: otherUserWithWallet.name,
            connectedAt: otherUserWithWallet.walletConnectedAt,
          },
          message: `This wallet is already connected to ${otherUserWithWallet.email}`,
        });
      }
    }

    return NextResponse.json({
      status: "not_connected",
    });
  } catch (error) {
    console.error("Wallet status error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to check wallet status",
      },
      { status: 500 }
    );
  }
}
