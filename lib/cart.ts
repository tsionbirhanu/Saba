import { prisma } from "@/lib/prisma";
import { normalizeImageFields } from "@/lib/product-images";

const cartInclude = {
  items: {
    include: {
      product: {
        include: {
          category: { select: { id: true, name: true } },
          designerProfile: {
            select: {
              id: true,
              userId: true,
              user: { select: { id: true, name: true, email: true, profileImage: true } },
            },
          },
          _count: { select: { favorites: true, orders: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" as const },
  },
};

export async function getOrCreateCart(userId: string) {
  return prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
    include: cartInclude,
  });
}

export async function getCartSummary(userId: string) {
  const cart = await getOrCreateCart(userId);
  const normalizedCart = normalizeImageFields(cart);
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return { cart: normalizedCart, itemCount, subtotal };
}

export function normalizeQuantity(quantity: unknown) {
  const parsed = Number(quantity);
  if (!Number.isFinite(parsed)) return 1;
  return Math.max(1, Math.min(99, Math.floor(parsed)));
}
