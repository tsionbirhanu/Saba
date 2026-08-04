import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { prisma } from "@/lib/prisma";
import { notifyOrderDesigners } from "@/lib/orders";
import { verifyChapaPayment } from "@/lib/payments/chapa";
import { notificationEmail, notifyUser } from "@/lib/notifications";

function signaturesMatch(actual: string | null, expected: string) {
  if (!actual) return false;
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}

function verifyWebhookSignature(req: Request, rawBody: string) {
  const secret = process.env.CHAPA_WEBHOOK_SECRET;
  if (!secret) return true;

  const payloadSignature = createHmac("sha256", secret).update(rawBody).digest("hex");
  const secretSignature = createHmac("sha256", secret).update(secret).digest("hex");

  return (
    signaturesMatch(req.headers.get("x-chapa-signature"), payloadSignature) ||
    signaturesMatch(req.headers.get("chapa-signature"), secretSignature)
  );
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    if (!verifyWebhookSignature(req, rawBody)) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
    }

    const body = JSON.parse(rawBody);
    const txRef = body.tx_ref || body.trx_ref || body.reference;
    if (!txRef) {
      return NextResponse.json({ error: "tx_ref is required" }, { status: 400 });
    }

    const verification = await verifyChapaPayment(txRef);
    if (verification.data?.status?.toLowerCase() !== "success") {
      return NextResponse.json({ received: true, paid: false });
    }

    const existingOrder = await prisma.order.findFirst({ where: { paymentRef: txRef } });
    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (existingOrder.status === "PAID") {
      return NextResponse.json({ received: true, paid: true });
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

    return NextResponse.json({ received: true, paid: true });
  } catch (error) {
    console.error("Chapa webhook error:", error);
    return NextResponse.json({ error: "Could not handle webhook" }, { status: 500 });
  }
}
