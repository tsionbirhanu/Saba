// app/api/products/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getOptionalAuthUser, requireAuth } from "@/lib/auth";
import { normalizeProductImage } from "@/lib/product-images";
import { getDesignerReviewSummary, getReviewSummary } from "@/lib/reviews";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // params is a Promise
) {
  try {
    const { id } = await context.params;
    const authUser = getOptionalAuthUser(req);

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        designerProfile: {
          include: {
            user: {
              select: { id: true, name: true, email: true, profileImage: true },
            },
          },
        },
        category: true,
        _count: {
          select: { favorites: true, orders: true, orderItems: true },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const canViewUnverified =
      product.designerProfile.isVerified ||
      product.designerProfile.userId === authUser?.id ||
      authUser?.role === "ADMIN";

    if (!canViewUnverified) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const reviewSummary = await getReviewSummary(product.id);
    const designerReviewSummary = await getDesignerReviewSummary(product.designerProfileId);

    return NextResponse.json({
      ...product,
      designerProfile: {
        ...product.designerProfile,
        reviewSummary: designerReviewSummary,
      },
      _count: {
        ...product._count,
        orders: product._count.orderItems,
      },
      reviewSummary,
      image: normalizeProductImage(product.image),
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // params is a Promise
) {
  try {
    const { id: productId } = await context.params;

    const auth = requireAuth(req, ["DESIGNER", "ADMIN"]);
    if (auth.response) return auth.response;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        designerProfile: {
          select: { userId: true },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (auth.user.role !== "ADMIN" && product.designerProfile.userId !== auth.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.product.delete({ where: { id: productId } });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
