import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCartSummary } from "@/lib/cart";
import {
  buildChapaUrls,
  getChapaCheckoutPhoneNumber,
  initializeChapaPayment,
  isChapaEnabled,
} from "@/lib/payments/chapa";
import { orderInclude, notifyOrderDesigners } from "@/lib/orders";
import { notificationEmail, notifyUser } from "@/lib/notifications";

export async function POST(req: Request) {
  const auth = requireAuth(req, ["BUYER", "ADMIN"]);
  if (auth.response) return auth.response;

  try {
    const body = await req.json();
    const { cart, subtotal } = await getCartSummary(auth.user.id);

    if (cart.items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty" }, { status: 400 });
    }

    const contactName = String(body.contactName || "").trim();
    const contactEmail = String(body.contactEmail || auth.user.email || "").trim();
    const contactPhone = String(body.contactPhone || "").trim();
    const shippingAddress = String(body.shippingAddress || "").trim();
    const shippingCity = String(body.shippingCity || "").trim();
    const shippingNotes = String(body.shippingNotes || "").trim();

    if (!contactName || !contactEmail || !contactPhone || !shippingAddress || !shippingCity) {
      return NextResponse.json({ error: "Contact and shipping details are required" }, { status: 400 });
    }

    const firstItem = cart.items[0];
    const txRef = `saba-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
    const paymentProvider = (process.env.PAYMENT_PROVIDER || "manual").toLowerCase();
    let checkoutUrl: string | null = null;

    if (isChapaEnabled()) {
      const { callbackUrl, returnUrl } = buildChapaUrls(txRef);
      checkoutUrl = await initializeChapaPayment({
        amount: subtotal,
        email: contactEmail,
        firstName: contactName.split(" ")[0] || "Customer",
        lastName: contactName.split(" ").slice(1).join(" "),
        phoneNumber: getChapaCheckoutPhoneNumber(contactPhone),
        txRef,
        callbackUrl,
        returnUrl,
        customization: {
          title: "Saba Marketplace",
          description: "Saba marketplace order",
        },
      });
    }

    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          productId: firstItem.productId,
          buyerId: auth.user.id,
          quantity: cart.items.reduce((sum, item) => sum + item.quantity, 0),
          totalAmount: subtotal,
          status: paymentProvider === "chapa" ? "PENDING" : "PAID",
          paymentProvider,
          paymentRef: txRef,
          chapaCheckoutUrl: checkoutUrl,
          paidAt: paymentProvider === "chapa" ? null : new Date(),
          contactName,
          contactEmail,
          contactPhone,
          shippingAddress,
          shippingCity,
          shippingNotes: shippingNotes || null,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              designerProfileId: item.product.designerProfileId,
              quantity: item.quantity,
              unitPrice: item.product.price,
              totalAmount: item.product.price * item.quantity,
            })),
          },
        },
        include: orderInclude,
      });

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      return createdOrder;
    });

    await notifyUser({
      userId: auth.user.id,
      type: "ORDER_PLACED",
      title: "Order placed",
      message: `Your order for Br ${subtotal.toLocaleString()} has been placed.`,
      link: "/buyer-dashboard",
      email: {
        to: contactEmail,
        subject: "Your Saba order was placed",
        html: notificationEmail("Order placed", `Your order for Br ${subtotal.toLocaleString()} has been placed.`, "/buyer-dashboard"),
      },
    });

    await notifyOrderDesigners(
      order.id,
      "New order",
      `${auth.user.email} placed an order for Br ${subtotal.toLocaleString()}.`,
      "ORDER_PLACED"
    );

    return NextResponse.json({ order, checkoutUrl });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not place order" },
      { status: 500 }
    );
  }
}
