import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(req: Request) {
  const auth = requireAuth(req);
  if (auth.response) return auth.response;

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: auth.user.id }, { receiverId: auth.user.id }],
      },
      orderBy: { timestamp: "desc" },
      include: {
        sender: {
          select: { id: true, name: true, email: true, role: true, profileImage: true },
        },
        receiver: {
          select: { id: true, name: true, email: true, role: true, profileImage: true },
        },
      },
    });

    const conversations = new Map<string, {
      user: {
        id: string;
        name: string;
        email: string;
        role: string;
        profileImage?: string | null;
      };
      lastMessage: {
        id: string;
        text: string;
        timestamp: Date;
        senderId: string;
      };
    }>();

    for (const message of messages) {
      const otherUser = message.senderId === auth.user.id ? message.receiver : message.sender;
      if (conversations.has(otherUser.id)) continue;

      conversations.set(otherUser.id, {
        user: otherUser,
        lastMessage: {
          id: message.id,
          text: message.text,
          timestamp: message.timestamp,
          senderId: message.senderId,
        },
      });
    }

    return NextResponse.json(Array.from(conversations.values()));
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}
