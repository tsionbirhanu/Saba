// app/api/orders/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

export async function GET(req: Request) {
  const auth = requireAuth(req);
  if (auth.response) return auth.response;

  try {
    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { buyerId: auth.user.id }// Orders for products of the user as designer
        ]
      },
      include: {
        product: true,
        buyer: {
          select: { id: true, name: true, email: true, role: true, profileImage: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
// app/api/orders/route.ts
export async function POST(req: Request) {
  const auth = requireAuth(req);
  if (auth.response) return auth.response;

  try {
    const { productId, quantity, totalAmount } = await req.json();

    const order = await prisma.order.create({
      data: {
        productId,
        buyerId: auth.user.id,
        quantity,
        totalAmount,
        status: "PENDING"
      }
    });

    return NextResponse.json({ order });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not create order" }, { status: 500 });
  }
}
