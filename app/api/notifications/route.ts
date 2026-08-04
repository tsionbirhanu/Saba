import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const auth = requireAuth(req);
  if (auth.response) return auth.response;

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: auth.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const unreadCount = await prisma.notification.count({
      where: {
        userId: auth.user.id,
        OR: [{ read: false }, { readAt: null }],
      },
    });

    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    console.error("Notification fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const auth = requireAuth(req);
  if (auth.response) return auth.response;

  try {
    const body = await req.json().catch(() => ({}));
    const id = typeof body.id === "string" ? body.id : null;

    await prisma.notification.updateMany({
      where: {
        userId: auth.user.id,
        ...(id ? { id } : {}),
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notification update error:", error);
    return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 });
  }
}
