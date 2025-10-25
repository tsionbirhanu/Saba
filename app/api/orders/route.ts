// app/api/orders/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const token = authHeader.split(" ")[1];
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const decoded: any = jwt.verify(token, process.env.NEXTAUTH_SECRET!);

    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { buyerId: decoded.id }, // Orders made by the user as buyer
          { product: { designerId: decoded.id } } // Orders for products of the user as designer
        ]
      },
      include: {
        product: true,
        buyer: true
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ orders });
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
// app/api/orders/route.ts
export async function POST(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const token = authHeader.split(" ")[1];
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const decoded: any = jwt.verify(token, process.env.NEXTAUTH_SECRET!);
    const { productId, quantity, totalAmount } = await req.json();

    const order = await prisma.order.create({
      data: {
        productId,
        buyerId: decoded.id,
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
