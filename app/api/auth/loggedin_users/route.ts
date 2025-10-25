import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return NextResponse.json({ error: "No token" }, { status: 401 });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as { id: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { designerProfile: true },
    });
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
