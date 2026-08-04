import { NextResponse } from "next/server";
import { getOptionalAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { callGeminiJson } from "@/lib/ai/gemini";
import { getCatalogProducts } from "@/lib/ai/catalog";

type SearchIntent = {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  keywords?: string[];
};

export async function GET(req: Request) {
  const authUser = getOptionalAuthUser(req);
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || searchParams.get("search") || "").trim().slice(0, 400);
  const category = searchParams.get("category") || undefined;
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const sort = searchParams.get("sort") || "newest";

  if (!q) {
    const products = await getCatalogProducts({ category, minPrice, maxPrice, sort });
    return NextResponse.json({ products, filters: { category, minPrice, maxPrice, keywords: [] }, usedAi: false });
  }

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  let intent: SearchIntent | null = null;

  try {
    intent = await callGeminiJson<SearchIntent>({
      feature: "smart-search",
      userId: authUser?.id,
      maxTokens: 260,
      systemInstruction:
        "Convert marketplace natural-language search into structured filters. Return JSON only: {\"category\":\"existing category or empty\",\"minPrice\":number|null,\"maxPrice\":number|null,\"keywords\":[\"term\"]}. Use only provided categories.",
      parts: [
        {
          text: JSON.stringify({
            query: q,
            existingFilters: { category, minPrice, maxPrice, sort },
            categories: categories.map((item) => item.name),
          }),
        },
      ],
    });
  } catch (error) {
    console.error("Smart search AI fallback:", error);
  }

  const validCategory = categories.find((item) => item.name.toLowerCase() === intent?.category?.toLowerCase());
  const keywordSearch = normalizeKeywords(intent?.keywords).join(" ") || q;
  const products = await getCatalogProducts({
    category: validCategory?.name || category,
    search: keywordSearch,
    minPrice: intent?.minPrice ?? minPrice,
    maxPrice: intent?.maxPrice ?? maxPrice,
    sort,
  });

  return NextResponse.json({
    products,
    filters: {
      category: validCategory?.name || category || "",
      minPrice: intent?.minPrice ?? minPrice ?? "",
      maxPrice: intent?.maxPrice ?? maxPrice ?? "",
      keywords: normalizeKeywords(intent?.keywords),
    },
    usedAi: Boolean(intent),
  });
}

function normalizeKeywords(keywords: unknown) {
  if (!Array.isArray(keywords)) return [];
  return keywords.map((keyword) => String(keyword).trim()).filter(Boolean).slice(0, 8);
}
