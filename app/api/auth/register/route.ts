import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const hashed = await hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashed, role },
      include: { designerProfile: true },
    });

    // Auto-create designer profile
    if (role === "DESIGNER") {
      await prisma.designerProfile.create({
        data: { userId: user.id },
      });
    }

    return NextResponse.json({ message: "Registered successfully", user });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
