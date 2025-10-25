// app/api/designers/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(
  req: Request,
  { params }: { params: { id: string } } | any
) {
  try {
    // If params is a promise, unwrap it
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Designer ID is required" }, { status: 400 });
    }

    const designer = await prisma.designerProfile.findUnique({
      where: { userId: id },
      include: {
        user: {
          select: { id: true, name: true, email: true, profileImage: true },
        },
        products: {
          select: { id: true, name: true, price: true, image: true, createdAt: true },
        },
      },
    });

    if (!designer) {
      return NextResponse.json({ error: "Designer not found" }, { status: 404 });
    }

    return NextResponse.json(designer);
  } catch (error) {
    console.error("Error fetching designer:", error);
    return NextResponse.json({ error: "Failed to fetch designer" }, { status: 500 });
  }
}

export async function PUT(req: Request, context: { params: { id: string } }) {
  try {
    const { params } = context;
    // If params is a promise, await it
    const { id } = await params;

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.NEXTAUTH_SECRET!);

    // Only allow the designer to update their own profile
    if (decoded.id !== id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { bio, skills, portfolio, socialLinks, contactInfo } = body;

    const updatedDesigner = await prisma.designerProfile.update({
      where: { userId: id },
      data: { bio, skills, portfolio, socialLinks, contactInfo },
    });

    return NextResponse.json(updatedDesigner);
  } catch (error) {
    console.error("Error updating designer profile:", error);
    return NextResponse.json({ error: "Failed to update designer" }, { status: 500 });
  }
}