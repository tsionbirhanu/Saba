import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

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

    return NextResponse.json(products);
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.NEXTAUTH_SECRET!);
    const userId = decoded.id;

    // Find the designer profile
    const designer = await prisma.designerProfile.findUnique({
      where: { userId },
    });

    if (!designer)
      return NextResponse.json(
        { error: "Only designers can create products" },
        { status: 403 }
      );

    const body = await req.json();
    const { name, description, price, image, categoryId } = body;

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
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
