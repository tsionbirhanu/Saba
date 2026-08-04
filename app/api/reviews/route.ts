import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { getReviewSummary, hasDeliveredProductOrder } from "@/lib/reviews";

const reviewInclude = {
  user: {
    select: {
      id: true,
      name: true,
      profileImage: true,
    },
  },
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      where: { productId },
      include: reviewInclude,
      orderBy: { createdAt: "desc" },
    });
    const summary = await getReviewSummary(productId);

    return NextResponse.json({ reviews, summary });
  } catch (error) {
    console.error("Review fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = requireAuth(req, ["BUYER", "ADMIN"]);
  if (auth.response) return auth.response;

  try {
    const { productId, rating, comment } = await req.json();
    const parsedRating = Number(rating);

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return NextResponse.json({ error: "Rating must be a whole number from 1 to 5" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: productId }, select: { id: true } });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const canReview = auth.user.role === "ADMIN" || await hasDeliveredProductOrder(auth.user.id, productId);
    if (!canReview) {
      return NextResponse.json(
        { error: "You can only review products from delivered orders" },
        { status: 403 }
      );
    }

    const review = await prisma.review.upsert({
      where: {
        userId_productId: {
          userId: auth.user.id,
          productId,
        },
      },
      update: {
        rating: parsedRating,
        comment: String(comment || "").trim() || null,
      },
      create: {
        userId: auth.user.id,
        productId,
        rating: parsedRating,
        comment: String(comment || "").trim() || null,
      },
      include: reviewInclude,
    });
    const summary = await getReviewSummary(productId);

    return NextResponse.json({ review, summary });
  } catch (error) {
    console.error("Review save error:", error);
    return NextResponse.json({ error: "Failed to save review" }, { status: 500 });
  }
}
