import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getErrorMessage } from "@/lib/errors";
import { notificationEmail, notifyUser } from "@/lib/notifications";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(req, ["ADMIN"]);
    if (auth.response) return auth.response;

    const { id } = await params;

    const body = await req.json().catch(() => ({}));
    const isVerified = body.action === "reject" ? false : true;

    const updatedDesigner = await prisma.designerProfile.update({
      where: { userId: id },
      data: {
        isVerified,
        verifiedAt: isVerified ? new Date() : null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
      },
    });

    const type = isVerified ? "DESIGNER_APPROVED" : "DESIGNER_REJECTED";
    const title = isVerified ? "Designer verification approved" : "Designer verification rejected";
    const message = isVerified
      ? "Your designer profile has been approved. Your products can now appear in the marketplace."
      : "Your designer verification was rejected. Please review your profile information and submit again.";

    await notifyUser({
      userId: updatedDesigner.userId,
      type,
      title,
      message,
      link: "/seller-dashboard",
      email: {
        to: updatedDesigner.user.email,
        subject: title,
        html: notificationEmail(title, message, "/seller-dashboard"),
      },
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
