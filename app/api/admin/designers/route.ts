// app/api/admin/designers/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const auth = requireAuth(req, ["ADMIN"]);
    if (auth.response) return auth.response;

    const designers = await prisma.designerProfile.findMany({
      select: {
        id: true,
        userId: true,
        bio: true,
        skills: true,
        portfolio: true,
        socialLinks: true,
        contactInfo: true,
        isVerified: true,
        verifiedAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(designers);
  } catch (error) {
    console.error("Error fetching designers:", error);
    return NextResponse.json({ error: "Failed to fetch designers" }, { status: 500 });
  }
}
