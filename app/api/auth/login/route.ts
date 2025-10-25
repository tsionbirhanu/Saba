import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email },
    include: { designerProfile: true },
  });

  if (!user) return NextResponse.json({ error: "Invalid email" }, { status: 404 });

  const valid = await compare(password, user.password);
  if (!valid) return NextResponse.json({ error: "Wrong password" }, { status: 401 });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.NEXTAUTH_SECRET!,
    { expiresIn: "7d" }
  );

  return NextResponse.json({ token, user });
}
