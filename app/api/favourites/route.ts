import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const auth = requireAuth(req);
    if (auth.response) return auth.response;

    const favorites = await prisma.favorite.findMany({
      where: { userId: auth.user.id },
      include: {
        product: {
          include: {
            category: { select: { id: true, name: true } },
            designerProfile: {
              select: {
                id: true,
                userId: true,
                user: {
                  select: { id: true, name: true, email: true, profileImage: true },
                },
              },
            },
            _count: { select: { favorites: true, orders: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(favorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = requireAuth(req);
    if (auth.response) return auth.response;
    const userId = auth.user.id;

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
  } catch (error) {
    console.error("Error adding favorite:", error);
    return NextResponse.json({ error: "Failed to add favorite" }, { status: 500 });
  }
}
