// app/api/designers/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getDesignerReviewSummaries } from "@/lib/reviews";

export async function GET() {
  try {
    const designers = await prisma.designerProfile.findMany({
      where: { isVerified: true },
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

    const summaries = await getDesignerReviewSummaries(designers.map((designer) => designer.id));

    return NextResponse.json(
      designers.map((designer) => ({
        ...designer,
        reviewSummary: summaries.get(designer.id) || { averageRating: 0, reviewCount: 0 },
      }))
    );
  } catch (error) {
    console.error("Error fetching designers:", error);
    return NextResponse.json({ error: "Failed to fetch designers" }, { status: 500 });
  }
}
