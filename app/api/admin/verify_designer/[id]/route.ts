import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getErrorMessage } from "@/lib/errors";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(req, ["ADMIN"]);
    if (auth.response) return auth.response;

    const { id } = await params;

    const updatedDesigner = await prisma.designerProfile.update({
      where: { userId: id },
      data: { isVerified: true, verifiedAt: new Date() },
    });

    return NextResponse.json(updatedDesigner);
  } catch (error: unknown) {
    console.error("Error verifying designer:", error);
    return NextResponse.json(
      { error: getErrorMessage(error) || "Failed to verify designer" },
      { status: 500 }
    );
  }
}
