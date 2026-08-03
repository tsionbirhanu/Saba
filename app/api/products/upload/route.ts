import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { requireAuth } from "@/lib/auth";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_URL?.split("@")[1],
  api_key: process.env.CLOUDINARY_URL?.split("//")[1]?.split(":")[0],
  api_secret: process.env.CLOUDINARY_URL?.split(":")[2]?.split("@")[0],
});

export async function POST(req: Request) {
  try {
    const auth = requireAuth(req, ["DESIGNER"]);
    if (auth.response) return auth.response;

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file)
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader
        .upload_stream({ folder: "products" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(buffer);
    });

    return NextResponse.json(uploadResponse);
  } catch (error) {
    console.error("Error uploading product image:", error);
    return NextResponse.json({ error: "Failed to upload product image" }, { status: 500 });
  }
}
