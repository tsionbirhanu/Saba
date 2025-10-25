import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.NEXTAUTH_SECRET!);
    const userId = decoded.id;

    const body = await req.json();
    const { productId, comment } = body;

    if (!productId || !comment) {
      return NextResponse.json(
        { error: "Product ID and comment are required" },
        { status: 400 }
      );
    }

    const newComment = await prisma.comment.create({
      data: {
        userId,
        productId,
        comment,
      },
    });

    return NextResponse.json(
      { message: "Comment added successfully", newComment },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 }
    );
  }
}
