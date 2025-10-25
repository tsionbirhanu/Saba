// app/api/orders/[id]/status/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Unwrap params
    const { id: orderId } = await context.params;

    // Check Authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.NEXTAUTH_SECRET!);

    // Get new status from request body
    const body = await req.json();
    const { status } = body; // expected values: PAID, DELIVERED, CANCELLED

    if (!status)
      return NextResponse.json({ error: "Status is required" }, { status: 400 });

    // Update the order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return NextResponse.json({ order: updatedOrder });
  } catch (error: any) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Could not update order status" },
      { status: 500 }
    );
  }
}
