import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/verifyToken"; // ✅ centralized auth helper

// ✅ GET all products (optionally filtered by category or designer)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const designerProfileId = searchParams.get("designerProfileId");

    const filters: any = {};
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
  } catch (error: any) {
    console.error("❌ Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// ✅ POST (create product) — only for authenticated designers
export async function POST(req: Request) {
  try {
    const user = await verifyToken(req); // centralized token verification
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // check if the user has a designer profile
    const designer = await prisma.designerProfile.findUnique({
      where: { userId: user.id },
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
  } catch (error: any) {
    console.error("❌ Error creating product:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
