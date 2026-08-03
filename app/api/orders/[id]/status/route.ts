// app/api/orders/[id]/status/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

const VALID_STATUSES = new Set(["PENDING", "PAID", "DELIVERED", "CANCELLED"]);

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Unwrap params
    const { id: orderId } = await context.params;

    const auth = requireAuth(req);
    if (auth.response) return auth.response;

    // Get new status from request body
    const body = await req.json();
    const { status } = body; // expected values: PAID, DELIVERED, CANCELLED

    if (!status || !VALID_STATUSES.has(status))
      return NextResponse.json({ error: "Status is required" }, { status: 400 });

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        product: {
          include: {
            designerProfile: {
              select: { userId: true },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const isAdmin = auth.user.role === "ADMIN";
    const isBuyer = order.buyerId === auth.user.id;
    const isDesigner = order.product.designerProfile.userId === auth.user.id;

    if (!isAdmin && !isBuyer && !isDesigner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update the order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return NextResponse.json({ order: updatedOrder });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Could not update order status" },
      { status: 500 }
    );
  }
}
