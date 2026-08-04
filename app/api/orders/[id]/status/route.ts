// app/api/orders/[id]/status/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { notificationEmail, notifyUser } from "@/lib/notifications";
import { notifyOrderDesigners } from "@/lib/orders";

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
        items: {
          include: {
            designerProfile: {
              select: { userId: true },
            },
          },
        },
        product: {
          include: {
            designerProfile: {
              select: { userId: true },
            },
          },
        },
        buyer: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const isAdmin = auth.user.role === "ADMIN";
    const isBuyer = order.buyerId === auth.user.id;
    const isDesigner =
      order.product.designerProfile.userId === auth.user.id ||
      order.items.some((item) => item.designerProfile.userId === auth.user.id);

    if (!isAdmin && !isBuyer && !isDesigner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (status === "DELIVERED" && !isAdmin && !isDesigner) {
      return NextResponse.json({ error: "Only the seller can mark an order delivered" }, { status: 403 });
    }

    if (status === "CANCELLED" && !isAdmin && !isBuyer) {
      return NextResponse.json({ error: "Only the buyer can cancel an order" }, { status: 403 });
    }

    if (status === "PAID" && !isAdmin) {
      return NextResponse.json({ error: "Payments must be confirmed by the payment provider" }, { status: 403 });
    }

    // Update the order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    if (status === "DELIVERED" && order.status !== "DELIVERED") {
      await notifyUser({
        userId: order.buyerId,
        type: "ORDER_DELIVERED",
        title: "Order delivered",
        message: "Your order has been marked as delivered.",
        link: "/buyer-dashboard",
        email: {
          to: order.buyer.email,
          subject: "Your Saba order was delivered",
          html: notificationEmail("Order delivered", "Your order has been marked as delivered.", "/buyer-dashboard"),
        },
      });

      await notifyOrderDesigners(
        order.id,
        "Order delivered",
        `Order ${order.id} was marked as delivered.`,
        "ORDER_DELIVERED"
      );
    }

    return NextResponse.json({ order: updatedOrder });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Could not update order status" },
      { status: 500 }
    );
  }
}
