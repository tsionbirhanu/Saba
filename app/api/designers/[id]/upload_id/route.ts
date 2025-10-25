import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: "dbv5nikjh",
  api_key: "524975245944111",
  api_secret: "K3yw9qV5vXFF4oJQZutLGmZVbF0",
});

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const nationalId = formData.get("nationalId") as string;

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const upload = await cloudinary.uploader.upload_stream({ folder: "id_cards" });

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "id_cards" },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(buffer);
  });

  const updated = await prisma.designerProfile.update({
    where: { userId: params.id },
    data: { nationalId, idImage: (result as any).secure_url },
  });

  return NextResponse.json({ message: "ID uploaded", profile: updated });
}
