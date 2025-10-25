import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.NEXTAUTH_SECRET!);
    const otherUserId = params.id;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: decoded.id, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: decoded.id },
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

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> } // params is a Promise now
) {
  try {
    // Wait for the params to resolve
    const { id: receiverId } = await context.params;

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.NEXTAUTH_SECRET!);
    const senderId = decoded.id;

    const body = await req.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json({ error: "Message text required" }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        text,
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error: any) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
