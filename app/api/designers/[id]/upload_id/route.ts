// app/api/designers/[id]/upload_id/route.ts
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse, NextRequest } from "next/server";

cloudinary.config({
  cloud_name: "dbv5nikjh",
  api_key: "524975245944111",
  api_secret: "K3yw9qV5vXFF4oJQZutLGmZVbF0",
});

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // unwrap the promise

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const nationalId = formData.get("nationalId") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload file to Cloudinary
    const result: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "id_cards" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
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
  } catch (error: any) {
    console.error("Error uploading ID:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
