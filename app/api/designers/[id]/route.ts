// app/api/designers/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getOptionalAuthUser, requireAuth } from "@/lib/auth";
import { getDesignerReviewSummary } from "@/lib/reviews";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // unwrap the promise
    const authUser = getOptionalAuthUser(req);

    if (!id) {
      return NextResponse.json({ error: "Designer ID is required" }, { status: 400 });
    }

    const designer = await prisma.designerProfile.findUnique({
      where: { userId: id },
      include: {
        user: {
          select: { id: true, name: true, email: true, profileImage: true },
        },
        products: {
          select: { id: true, name: true, price: true, image: true, createdAt: true },
        },
      },
    });

    if (!designer) {
      return NextResponse.json({ error: "Designer not found" }, { status: 404 });
    }

    if (!designer.isVerified && designer.userId !== authUser?.id && authUser?.role !== "ADMIN") {
      return NextResponse.json({ error: "Designer not found" }, { status: 404 });
    }

    const reviewSummary = await getDesignerReviewSummary(designer.id);

    return NextResponse.json({
      ...designer,
      reviewSummary,
    });
  } catch (error) {
    console.error("Error fetching designer:", error);
    return NextResponse.json({ error: "Failed to fetch designer" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // unwrap the promise

    const auth = requireAuth(req, ["DESIGNER"]);
    if (auth.response) return auth.response;

    // Only allow the designer to update their own profile
    if (auth.user.id !== id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { bio, skills, portfolio, socialLinks, contactInfo } = body;

    const updatedDesigner = await prisma.designerProfile.update({
      where: { userId: id },
      data: { bio, skills, portfolio, socialLinks, contactInfo },
    });

    return NextResponse.json(updatedDesigner);
  } catch (error) {
    console.error("Error updating designer profile:", error);
    return NextResponse.json({ error: "Failed to update designer" }, { status: 500 });
  }
}
