import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { callGeminiJson, getGeminiVisionModel, imageUrlToGeminiPart } from "@/lib/ai/gemini";

type ImageTagsResponse = {
  categoryName?: string;
  tags?: string[];
};

export async function POST(req: Request) {
  const auth = requireAuth(req, ["DESIGNER", "ADMIN"]);
  if (auth.response) return auth.response;

  try {
    const body = await req.json();
    const name = String(body.name || "").trim().slice(0, 100);
    const imageUrl = String(body.imageUrl || "").trim();
    const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

    if (!name || !imageUrl) {
      return NextResponse.json({ error: "Product name and image URL are required." }, { status: 400 });
    }

    try {
      const imagePart = await imageUrlToGeminiPart(imageUrl);
      const ai = await callGeminiJson<ImageTagsResponse>({
        feature: "image-tags",
        userId: auth.user.id,
        model: getGeminiVisionModel(),
        maxTokens: 260,
        systemInstruction:
          "Suggest marketplace categorization for a product photo. Return JSON only: {\"categoryName\":\"one existing category name or empty string\",\"tags\":[\"tag\"]}. Use 3 to 5 concise tags. Do not invent categories outside the provided list.",
        parts: [
          {
            text: JSON.stringify({
              productName: name,
              existingCategories: categories.map((category) => category.name),
            }),
          },
          imagePart,
        ],
      });

      const validCategory = categories.find(
        (category) => category.name.toLowerCase() === ai.categoryName?.toLowerCase()
      );

      return NextResponse.json({
        categoryName: validCategory?.name || "",
        categoryId: validCategory?.id || "",
        tags: normalizeTags(ai.tags),
        usedAi: true,
      });
    } catch (error) {
      console.error("Image tags AI fallback:", error);
    }

    const fallback = fallbackTags(name, categories.map((category) => category.name));
    const category = categories.find((item) => item.name === fallback.categoryName);
    return NextResponse.json({
      categoryName: category?.name || "",
      categoryId: category?.id || "",
      tags: fallback.tags,
      usedAi: false,
    });
  } catch (error) {
    console.error("Image tags route error:", error);
    return NextResponse.json({ error: "Could not suggest tags." }, { status: 500 });
  }
}

function normalizeTags(tags: unknown) {
  if (!Array.isArray(tags)) return [];
  return tags
    .map((tag) => String(tag).trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 5);
}

function fallbackTags(name: string, categories: string[]) {
  const lower = name.toLowerCase();
  const categoryName =
    categories.find((category) => lower.includes(category.toLowerCase().split(" ")[0])) || categories[0] || "";
  return {
    categoryName,
    tags: name
      .toLowerCase()
      .split(/[^a-z0-9]+/i)
      .filter((tag) => tag.length > 2)
      .slice(0, 5),
  };
}
