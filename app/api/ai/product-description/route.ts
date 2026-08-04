import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { callGeminiJson } from "@/lib/ai/gemini";

type DescriptionResponse = {
  description?: string;
};

export async function POST(req: Request) {
  const auth = requireAuth(req, ["DESIGNER", "ADMIN"]);
  if (auth.response) return auth.response;

  try {
    const body = await req.json();
    const name = String(body.name || "").trim().slice(0, 100);
    const categoryName = String(body.categoryName || "").trim().slice(0, 80);
    const keywords = String(body.keywords || "").trim().slice(0, 240);

    if (!name || !categoryName) {
      return NextResponse.json({ error: "Product name and category are required." }, { status: 400 });
    }

    try {
      const ai = await callGeminiJson<DescriptionResponse>({
        feature: "product-description",
        userId: auth.user.id,
        maxTokens: 320,
        systemInstruction:
          "Write polished marketplace product descriptions for Ethiopian handmade fashion. Return JSON only: {\"description\":\"editable product description\"}. Keep it 70-120 words, warm, specific, and do not make unverifiable claims.",
        parts: [
          {
            text: JSON.stringify({ name, categoryName, keywords }),
          },
        ],
      });

      if (ai.description) {
        return NextResponse.json({ description: ai.description.slice(0, 900), usedAi: true });
      }
    } catch (error) {
      console.error("Description AI fallback:", error);
    }

    return NextResponse.json({
      description: fallbackDescription(name, categoryName, keywords),
      usedAi: false,
    });
  } catch (error) {
    console.error("Description route error:", error);
    return NextResponse.json({ error: "Could not generate a description." }, { status: 500 });
  }
}

function fallbackDescription(name: string, categoryName: string, keywords: string) {
  const detail = keywords ? ` Details to highlight: ${keywords}.` : "";
  return `${name} is a handmade ${categoryName.toLowerCase()} piece created for buyers who want authentic style with everyday quality.${detail} Edit this description with fabric, sizing, care, and occasion details before publishing.`;
}
