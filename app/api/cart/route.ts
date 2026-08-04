import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCartSummary, getOrCreateCart, normalizeQuantity } from "@/lib/cart";

export async function GET(req: Request) {
  const auth = requireAuth(req);
  if (auth.response) return auth.response;

  try {
    return NextResponse.json(await getCartSummary(auth.user.id));
  } catch (error) {
    console.error("Cart fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = requireAuth(req, ["BUYER", "ADMIN"]);
  if (auth.response) return auth.response;

  try {
    const { productId, quantity } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const cart = await getOrCreateCart(auth.user.id);
    await prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
      update: {
        quantity: { increment: normalizeQuantity(quantity) },
      },
      create: {
        cartId: cart.id,
        productId,
        quantity: normalizeQuantity(quantity),
      },
    });

    return NextResponse.json(await getCartSummary(auth.user.id));
  } catch (error) {
    console.error("Cart add error:", error);
    return NextResponse.json({ error: "Failed to add cart item" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const auth = requireAuth(req, ["BUYER", "ADMIN"]);
  if (auth.response) return auth.response;

  try {
    const { productId, quantity } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const cart = await getOrCreateCart(auth.user.id);
    const nextQuantity = normalizeQuantity(quantity);
    await prisma.cartItem.update({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
      data: { quantity: nextQuantity },
    });

    return NextResponse.json(await getCartSummary(auth.user.id));
  } catch (error) {
    console.error("Cart update error:", error);
    return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const auth = requireAuth(req, ["BUYER", "ADMIN"]);
  if (auth.response) return auth.response;

  try {
    const body = await req.json().catch(() => ({}));
    const cart = await getOrCreateCart(auth.user.id);

    if (body.productId) {
      await prisma.cartItem.deleteMany({
        where: {
          cartId: cart.id,
          productId: body.productId,
        },
      });
    } else {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    return NextResponse.json(await getCartSummary(auth.user.id));
  } catch (error) {
    console.error("Cart delete error:", error);
    return NextResponse.json({ error: "Failed to remove cart item" }, { status: 500 });
  }
}
