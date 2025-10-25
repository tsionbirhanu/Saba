// app/api/rate/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  
    const decoded: any = jwt.verify(token, process.env.NEXTAUTH_SECRET!);
    const userId = decoded.id;

    const body = await req.json();
    const { productId, rate } = body;

    if (!productId || rate === undefined) {
      return NextResponse.json({ error: "Missing productId or rate" }, { status: 400 });
    }

    let rating;
    const existing = await prisma.rating.findFirst({
      where: { userId, productId },
    });

    if (existing) {
      rating = await prisma.rating.update({
        where: { id: existing.id },
        data: { rate: parseInt(rate) },
      });
    } else {
      rating = await prisma.rating.create({
        data: { userId, productId, rate: parseInt(rate) },
      });
    }

    return NextResponse.json(rating, { status: 201 });
  } catch (error: any) {
    console.error("Error recording rating:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
