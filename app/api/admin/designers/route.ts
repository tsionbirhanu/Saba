// app/api/admin/designers/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    if (decoded.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

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
