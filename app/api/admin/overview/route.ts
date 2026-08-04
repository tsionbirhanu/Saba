import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(req: Request) {
  const auth = requireAuth(req, ["ADMIN"]);
  if (auth.response) return auth.response;

  try {
    const [
      totalUsers,
      totalDesigners,
      verifiedDesigners,
      pendingDesigners,
      totalOrders,
      paidRevenue,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.designerProfile.count(),
      prisma.designerProfile.count({ where: { isVerified: true } }),
      prisma.designerProfile.count({ where: { isVerified: false } }),
      prisma.order.count(),
      prisma.order.aggregate({
        where: { status: "PAID" },
        _sum: { totalAmount: true },
      }),
    ]);

    return NextResponse.json({
      totalUsers,
      totalDesigners,
      verifiedDesigners,
      pendingDesigners,
      totalOrders,
      totalRevenue: paidRevenue._sum.totalAmount || 0,
    });
  } catch (error) {
    console.error("Admin overview error:", error);
    return NextResponse.json({ error: "Failed to fetch admin overview" }, { status: 500 });
  }
}
