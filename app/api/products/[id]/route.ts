// app/api/products/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // params is a Promise
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        designerProfile: {
          include: { user: true },
        },
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error: any) {
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

    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.NEXTAUTH_SECRET!);
    const userId = decoded.id;

    const designer = await prisma.designerProfile.findUnique({
      where: { userId },
    });

    if (!designer)
      return NextResponse.json({ error: "Only designers can delete" }, { status: 403 });

    await prisma.product.delete({ where: { id: productId } });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
