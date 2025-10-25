import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1️⃣ Get the actual params
    const { id } = await params;

    // 2️⃣ Get and verify JWT token
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // 3️⃣ Check if user is admin
    if (decoded.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 4️⃣ Update the designer profile
    const updatedDesigner = await prisma.designerProfile.update({
      where: { userId: id },
      data: { isVerified: true, verifiedAt: new Date() },
    });

    return NextResponse.json(updatedDesigner);
  } catch (error: any) {
    console.error("Error verifying designer:", error);
    return NextResponse.json({ error: error.message || "Failed to verify designer" }, { status: 500 });
  }
}
