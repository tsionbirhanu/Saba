import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.NEXTAUTH_SECRET!);
    const userId = decoded.id;
    const productId = params.id;

    const deleted = await prisma.favorite.deleteMany({
      where: { userId, productId },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ message: "Favorite not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Removed from favorites" }, { status: 200 });
  } catch (error: any) {
    console.error("Error removing favorite:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
