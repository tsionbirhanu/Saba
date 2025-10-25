import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.NEXTAUTH_SECRET!);
    const userId = decoded.id;

    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

  
    const existing = await prisma.favorite.findFirst({
      where: { userId, productId },
    });

    if (existing) {
      return NextResponse.json({ message: "Already in favorites" }, { status: 200 });
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId,
        productId,
      },
    });

    return NextResponse.json(favorite, { status: 201 });
  } catch (error: any) {
    console.error("Error adding favorite:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
