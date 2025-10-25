// app/api/messages/[id]/read/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const message = await prisma.message.update({
      where: { id: params.id },
      data: { isRead: true },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error marking message as read:", error);
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 });
  }
}
