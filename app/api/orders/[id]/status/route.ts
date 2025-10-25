// app/api/orders/[id]/status/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const token = authHeader.split(" ")[1];
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const decoded: any = jwt.verify(token, process.env.NEXTAUTH_SECRET!);
    const { status } = await req.json(); // expected: PAID, DELIVERED, CANCELLED

    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json({ order });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not update order status" }, { status: 500 });
  }
}
