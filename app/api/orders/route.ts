// app/api/orders/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { orderInclude } from "@/lib/orders";
import { notificationEmail, notifyUser } from "@/lib/notifications";
import { normalizeImageFields } from "@/lib/product-images";

export async function GET(req: Request) {
  const auth = requireAuth(req);
  if (auth.response) return auth.response;

  try {
    const designer = await prisma.designerProfile.findUnique({
      where: { userId: auth.user.id },
      select: { id: true },
    });

    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { buyerId: auth.user.id },
          ...(designer
            ? [{ product: { designerProfileId: designer.id } }]
            : []),
          ...(designer
            ? [{ items: { some: { designerProfileId: designer.id } } }]
            : []),
        ]
      },
      include: orderInclude,
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ orders: normalizeImageFields(orders) });
  } catch {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
// app/api/orders/route.ts
export async function POST(req: Request) {
  const auth = requireAuth(req);
  if (auth.response) return auth.response;

  try {
    const { productId, quantity } = await req.json();
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { designerProfile: { include: { user: true } } },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const safeQuantity = Math.max(1, Math.floor(Number(quantity) || 1));
    const totalAmount = product.price * safeQuantity;

    const order = await prisma.order.create({
      data: {
        productId,
        buyerId: auth.user.id,
        quantity: safeQuantity,
        totalAmount,
        status: "PENDING",
        items: {
          create: {
            productId,
            designerProfileId: product.designerProfileId,
            quantity: safeQuantity,
            unitPrice: product.price,
            totalAmount,
          },
        },
      },
      include: orderInclude,
    });

    await notifyUser({
      userId: auth.user.id,
      type: "ORDER_PLACED",
      title: "Order placed",
      message: `Your order for ${product.name} has been placed.`,
      link: "/buyer-dashboard",
      email: {
        to: auth.user.email,
        subject: "Your Saba order was placed",
        html: notificationEmail("Order placed", `Your order for ${product.name} has been placed.`, "/buyer-dashboard"),
      },
    });

    await notifyUser({
      userId: product.designerProfile.userId,
      type: "ORDER_PLACED",
      title: "New order",
      message: `${auth.user.email} placed an order for ${product.name}.`,
      link: "/seller-dashboard",
      email: {
        to: product.designerProfile.user.email,
        subject: "New Saba order",
        html: notificationEmail("New order", `${auth.user.email} placed an order for ${product.name}.`, "/seller-dashboard"),
      },
    });

    return NextResponse.json({ order: normalizeImageFields(order) });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not create order" }, { status: 500 });
  }
}
