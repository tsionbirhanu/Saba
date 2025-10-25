// app/api/designers/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const designers = await prisma.designerProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
      },
    });

    return NextResponse.json(designers);
  } catch (error) {
    console.error("Error fetching designers:", error);
    return NextResponse.json({ error: "Failed to fetch designers" }, { status: 500 });
  }
}
