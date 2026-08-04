import { NextResponse } from "next/server";
import { getOptionalAuthUser } from "@/lib/auth";
import { callGeminiJson } from "@/lib/ai/gemini";
import { compactCatalog, fallbackProductPicks, getCatalogProducts } from "@/lib/ai/catalog";

type StyleAssistantResponse = {
  picks?: Array<{ productId: string; reason: string }>;
};

export async function POST(req: Request) {
  const authUser = getOptionalAuthUser(req);

  try {
    const body = await req.json();
    const message = typeof body.message === "string" ? body.message.trim().slice(0, 500) : "";
    const categoryId = typeof body.categoryId === "string" ? body.categoryId : undefined;

    if (!message) {
      return NextResponse.json({ error: "Tell the style assistant what you are looking for." }, { status: 400 });
    }

    const catalog = await getCatalogProducts({ categoryId, limit: 60 });
    if (catalog.length === 0) {
      return NextResponse.json({ picks: [], usedAi: false, message: "No products are available yet." });
    }

    try {
      const ai = await callGeminiJson<StyleAssistantResponse>({
        feature: "style-assistant",
        userId: authUser?.id,
        maxTokens: 500,
        systemInstruction:
          "You are Saba Marketplace's style assistant. Recommend only products from the provided catalog. Return JSON only: {\"picks\":[{\"productId\":\"catalog-id\",\"reason\":\"short buyer-facing reason\"}]} with 3 to 5 picks. Never invent IDs.",
        parts: [
          {
            text: JSON.stringify({
              buyerRequest: message,
              catalog: compactCatalog(catalog),
            }),
          },
        ],
      });

      const catalogById = new Map(catalog.map((product) => [product.id, product]));
      const picks = (ai.picks || [])
        .filter((pick) => catalogById.has(pick.productId))
        .slice(0, 5)
        .map((pick) => ({
          product: catalogById.get(pick.productId),
          reason: pick.reason?.slice(0, 180) || "A strong match from the current catalog.",
        }))
        .filter((pick) => pick.product);

      if (picks.length > 0) {
        return NextResponse.json({ picks, usedAi: true });
      }
    } catch (error) {
      console.error("Style assistant AI fallback:", error);
    }

    return NextResponse.json({
      picks: fallbackProductPicks(catalog, message),
      usedAi: false,
    });
  } catch (error) {
    console.error("Style assistant error:", error);
    return NextResponse.json({ error: "Could not run the style assistant." }, { status: 500 });
  }
}
