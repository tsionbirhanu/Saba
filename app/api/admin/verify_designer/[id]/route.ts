import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    if (decoded.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedDesigner = await prisma.designerProfile.update({
      where: { userId: params.id },
      data: { isVerified: true, verifiedAt: new Date() },
    });

    return NextResponse.json(updatedDesigner);
  } catch (error) {
    console.error("Error verifying designer:", error);
    return NextResponse.json({ error: "Failed to verify designer" }, { status: 500 });
  }
}
