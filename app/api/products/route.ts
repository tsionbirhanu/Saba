import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { getErrorMessage } from "@/lib/errors";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const designerProfileId = searchParams.get("designerProfileId");

    const filters: { categoryId?: string; designerProfileId?: string } = {};
    if (categoryId) filters.categoryId = categoryId;
    if (designerProfileId) filters.designerProfileId = designerProfileId;

    const products = await prisma.product.findMany({
      where: filters,
      include: {
        designerProfile: {
          select: {
            id: true,
            bio: true,
            user: {
              select: { id: true, name: true, profileImage: true, email: true },
            },
          },
        },
        category: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products, { status: 200 });
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

    const { name, description, price, image, categoryId } = await req.json();

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
