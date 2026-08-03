import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

export async function GET(req: Request) {
  const auth = requireAuth(req);
  if (auth.response) return auth.response;

  try {
    const user = await prisma.user.findUnique({
      where: { id: auth.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        role: true,
        profileImage: true,
        createdAt: true,
        updatedAt: true,
        cardanoAddress: true,
        walletVerified: true,
        walletConnectedAt: true,
        designerProfile: true,
      },
    });
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
