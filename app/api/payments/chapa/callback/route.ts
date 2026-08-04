import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyOrderDesigners } from "@/lib/orders";
import { verifyChapaPayment } from "@/lib/payments/chapa";
import { notificationEmail, notifyUser } from "@/lib/notifications";

async function markPaid(txRef: string) {
  const verification = await verifyChapaPayment(txRef);
  const chapaStatus = verification.data?.status?.toLowerCase();

  if (chapaStatus !== "success") {
    return { paid: false };
  }

  const existingOrder = await prisma.order.findFirst({ where: { paymentRef: txRef } });
  if (!existingOrder) {
    throw new Error("Order not found for Chapa transaction.");
  }

  if (existingOrder.status === "PAID") {
    return { paid: true, orderId: existingOrder.id };
  }

  const order = await prisma.order.update({
    where: { id: existingOrder.id },
    data: { status: "PAID", paidAt: new Date() },
    include: { buyer: true },
  });

  await notifyUser({
    userId: order.buyerId,
    type: "ORDER_PAID",
    title: "Payment received",
    message: "Your payment cleared successfully.",
    link: "/buyer-dashboard",
    email: {
      to: order.buyer.email,
      subject: "Your Saba payment cleared",
      html: notificationEmail("Payment received", "Your payment cleared successfully.", "/buyer-dashboard"),
    },
  });
  await notifyOrderDesigners(order.id, "Payment cleared", `Payment cleared for order ${order.id}.`, "ORDER_PAID");

  return { paid: true, orderId: order.id };
}

export async function GET(req: NextRequest) {
  const txRef = req.nextUrl.searchParams.get("tx_ref");
  if (!txRef) {
    return NextResponse.json({ error: "tx_ref is required" }, { status: 400 });
  }

  try {
    const result = await markPaid(txRef);
    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
    return NextResponse.redirect(`${appUrl}/checkout/success?paid=${result.paid ? "1" : "0"}`);
  } catch (error) {
    console.error("Chapa callback error:", error);
    return NextResponse.json({ error: "Could not verify payment" }, { status: 500 });
  }
}
