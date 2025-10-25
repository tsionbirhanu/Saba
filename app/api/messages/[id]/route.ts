// app/api/messages/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// GET all messages between logged-in user and the other user
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: otherUserId } = await context.params; // unwrap params

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.NEXTAUTH_SECRET!);
    const userId = decoded.id;

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
  } catch (error: any) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST a new message
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: receiverId } = await context.params; // unwrap params

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.NEXTAUTH_SECRET!);
    const senderId = decoded.id;

    const body = await req.json();
    const { text } = body;

    if (!text)
      return NextResponse.json({ error: "Message text required" }, { status: 400 });

    const message = await prisma.message.create({
      data: { senderId, receiverId, text },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error: any) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
