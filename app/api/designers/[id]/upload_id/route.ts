// app/api/designers/[id]/upload_id/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getErrorMessage } from "@/lib/errors";
import { configureCloudinary } from "@/lib/cloudinary";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // unwrap the promise
    const auth = requireAuth(req, ["DESIGNER"]);
    if (auth.response) return auth.response;

    if (auth.user.id !== id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const nationalId = formData.get("nationalId") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload file to Cloudinary
    const cloudinary = configureCloudinary();
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "id_cards" },
        (error, result) => {
          if (error) reject(error);
          else if (result?.secure_url) resolve({ secure_url: result.secure_url });
          else reject(new Error("Cloudinary upload did not return a URL"));
        }
      );
      stream.end(buffer);
    });

    // Update designer profile in DB
    const updated = await prisma.designerProfile.update({
      where: { userId: id },
      data: {
        nationalId,
        idImage: result.secure_url,
      },
    });

    return NextResponse.json({ message: "ID uploaded", profile: updated });
  } catch (error: unknown) {
    console.error("Error uploading ID:", error);
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
