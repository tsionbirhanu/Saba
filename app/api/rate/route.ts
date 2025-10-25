// app/api/rate/route.ts
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    // 1. Get the Bearer token
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 2. Decode the token
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as { id: string };
    const userId = decoded.id;

    // 3. Parse request body
    const body = await req.json();
    const { productId, rate } = body as { productId: string; rate: number };

    if (!productId || rate === undefined)
      return NextResponse.json(
        { error: "Missing productId or rate" },
        { status: 400 }
      );

    // 4. Check if a rating already exists
    const existingRating = await prisma.rating.findFirst({
      where: { userId, productId },
    });

    let rating;
    if (existingRating) {
      // Update existing rating
      rating = await prisma.rating.update({
        where: { id: existingRating.id },
        data: { rate },
      });
    } else {
      // Create new rating
      rating = await prisma.rating.create({
        data: { userId, productId, rate },
      });
    }

    // 5. Return the rating
    return NextResponse.json(rating, { status: 201 });
  } catch (error: any) {
    console.error("Error recording rating:", error);
    return NextResponse.json(
      { error: "Failed to record rating" },
      { status: 500 }
    );
  }
}
