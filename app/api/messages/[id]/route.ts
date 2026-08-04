// app/api/messages/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { notifyRecentMessage } from "@/lib/notifications";

// GET all messages between logged-in user and the other user
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: otherUserId } = await context.params; // unwrap params

    const auth = requireAuth(req);
    if (auth.response) return auth.response;
    const userId = auth.user.id;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      orderBy: { timestamp: "asc" },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

// POST a new message
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: receiverId } = await context.params; // unwrap params

    const auth = requireAuth(req);
    if (auth.response) return auth.response;
    const senderId = auth.user.id;

    const body = await req.json();
    const { text } = body;

    if (!text)
      return NextResponse.json({ error: "Message text required" }, { status: 400 });

    const message = await prisma.message.create({
      data: { senderId, receiverId, text },
      include: {
        sender: { select: { name: true } },
        receiver: { select: { email: true } },
      },
    });

    await notifyRecentMessage({
      receiverId,
      receiverEmail: message.receiver.email,
      senderName: message.sender.name || "A Saba user",
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
