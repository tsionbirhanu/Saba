import { prisma } from "@/lib/prisma";
import { notificationEmail, notifyUser } from "@/lib/notifications";

export const orderInclude = {
  items: {
    include: {
      product: {
        include: {
          category: { select: { id: true, name: true } },
          designerProfile: {
            select: {
              id: true,
              userId: true,
              isVerified: true,
              user: { select: { id: true, name: true, email: true, profileImage: true } },
            },
          },
          _count: { select: { favorites: true, orders: true } },
        },
      },
    },
  },
  product: {
    include: {
      category: { select: { id: true, name: true } },
      designerProfile: {
        select: {
          id: true,
          userId: true,
          isVerified: true,
          user: { select: { id: true, name: true, email: true, profileImage: true } },
        },
      },
      _count: { select: { favorites: true, orders: true } },
    },
  },
  buyer: {
    select: { id: true, name: true, email: true, role: true, profileImage: true },
  },
};

export async function notifyOrderDesigners(
  orderId: string,
  title: string,
  body: string,
  type: "ORDER_PLACED" | "ORDER_PAID" | "ORDER_DELIVERED" = "ORDER_PLACED"
) {
  const rows = await prisma.orderItem.findMany({
    where: { orderId },
    select: {
      designerProfile: {
        select: { userId: true, user: { select: { email: true } } },
      },
    },
    distinct: ["designerProfileId"],
  });

  if (rows.length === 0) return;

  await Promise.all(
    rows.map((row) =>
      notifyUser({
        userId: row.designerProfile.userId,
        type,
        title,
        message: body,
        link: "/seller-dashboard",
        email: {
          to: row.designerProfile.user.email,
          subject: title,
          html: notificationEmail(title, body, "/seller-dashboard"),
        },
      })
    )
  );
}
