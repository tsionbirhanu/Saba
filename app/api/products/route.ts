import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOptionalAuthUser, requireAuth } from "@/lib/auth";
import { getErrorMessage } from "@/lib/errors";
import { normalizeProductImage } from "@/lib/product-images";
import { attachReviewSummaries, getDesignerReviewSummaries } from "@/lib/reviews";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const category = searchParams.get("category");
    const designerProfileId = searchParams.get("designerProfileId");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort") || "newest";
    const authUser = getOptionalAuthUser(req);

    const filters: {
      categoryId?: string;
      designerProfileId?: string;
      price?: { gte?: number; lte?: number };
      category?: { name: { contains: string; mode: "insensitive" } };
      designerProfile?: {
        isVerified?: boolean;
        userId?: string;
      };
      OR?: Array<{
        name?: { contains: string; mode: "insensitive" };
        description?: { contains: string; mode: "insensitive" };
      }>;
    } = {};
    if (categoryId) filters.categoryId = categoryId;
    if (category && category !== "all") {
      filters.category = {
        name: { contains: category.replace(/-/g, " "), mode: "insensitive" },
      };
    }
    if (designerProfileId) filters.designerProfileId = designerProfileId;
    const requestedDesigner = designerProfileId
      ? await prisma.designerProfile.findUnique({
          where: { id: designerProfileId },
          select: { userId: true },
        })
      : null;
    const canViewUnverifiedDesignerProducts =
      Boolean(requestedDesigner && authUser?.id === requestedDesigner.userId) || authUser?.role === "ADMIN";
    if (!canViewUnverifiedDesignerProducts) {
      filters.designerProfile = { isVerified: true };
    }
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.gte = Number(minPrice);
      if (maxPrice) filters.price.lte = Number(maxPrice);
    }
    if (search) {
      filters.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const orderBy =
      sort === "price-low"
        ? { price: "asc" as const }
        : sort === "price-high"
          ? { price: "desc" as const }
          : sort === "popular"
            ? { orderItems: { _count: "desc" as const } }
            : { createdAt: "desc" as const };

    const products = await prisma.product.findMany({
      where: filters,
      include: {
        designerProfile: {
          select: {
            id: true,
            bio: true,
            isVerified: true,
            user: {
              select: { id: true, name: true, profileImage: true, email: true },
            },
          },
        },
        category: {
          select: { id: true, name: true },
        },
        _count: {
          select: { favorites: true, orders: true, orderItems: true },
        },
      },
      orderBy,
    });

    const designerSummaries = await getDesignerReviewSummaries(products.map((product) => product.designerProfileId));
    const productsWithReviews = await attachReviewSummaries(
      products.map((product) => ({
        ...product,
        designerProfile: {
          ...product.designerProfile,
          reviewSummary: designerSummaries.get(product.designerProfileId) || { averageRating: 0, reviewCount: 0 },
        },
        _count: {
          ...product._count,
          orders: product._count.orderItems,
        },
        image: normalizeProductImage(product.image),
      }))
    );

    return NextResponse.json(
      productsWithReviews,
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = requireAuth(req, ["DESIGNER"]);
    if (auth.response) return auth.response;

    const designer = await prisma.designerProfile.findUnique({
      where: { userId: auth.user.id },
    });

    if (!designer) {
      return NextResponse.json(
        { error: "Only designers can create products" },
        { status: 403 }
      );
    }

    const { name, description, price, image, categoryId, stock } = await req.json();

    if (!name || !description || !price || !image || !categoryId) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: stock === undefined || stock === "" ? 1 : Number(stock),
        image,
        designerProfile: { connect: { id: designer.id } },
        category: { connect: { id: categoryId } },
      },
      include: {
        category: true,
        designerProfile: {
          include: { user: { select: { name: true, email: true } } },
        },
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
