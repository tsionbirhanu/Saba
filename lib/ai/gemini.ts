import { prisma } from "@/lib/prisma";

type GeminiPart = { text: string } | { inlineData: { mimeType: string; data: string } };

type GeminiJsonOptions = {
  feature: string;
  userId?: string | null;
  systemInstruction: string;
  parts: GeminiPart[];
  maxTokens?: number;
  maxOutputTokens?: number;
  timeoutMs?: number;
  model?: string;
};

type GeminiUsage = {
  promptTokenCount?: number;
  candidatesTokenCount?: number;
  totalTokenCount?: number;
};

const DEFAULT_MODEL = "gemini-2.5-flash";
const DEFAULT_TIMEOUT_MS = 10000;
const MAX_OUTPUT_TOKENS = 700;

export class AiUnavailableError extends Error {
  constructor(message = "AI is not configured or temporarily unavailable.") {
    super(message);
    this.name = "AiUnavailableError";
  }
}

export function getGeminiApiKey() {
  return process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";
}

export function getGeminiModel(model?: string) {
  return model || process.env.GEMINI_MODEL || DEFAULT_MODEL;
}

export function getGeminiVisionModel() {
  return process.env.GEMINI_VISION_MODEL || process.env.GEMINI_MODEL || DEFAULT_MODEL;
}

export async function callGeminiJson<T>({
  feature,
  userId,
  systemInstruction,
  parts,
  maxTokens,
  maxOutputTokens = 500,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  model,
}: GeminiJsonOptions): Promise<T> {
  const apiKey = getGeminiApiKey();
  const selectedModel = getGeminiModel(model);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  let usage: GeminiUsage | undefined;

  try {
    if (!apiKey) {
      throw new AiUnavailableError("Missing GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY.");
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
          contents: [
            {
              role: "user",
              parts,
            },
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: Math.min(maxTokens ?? maxOutputTokens, MAX_OUTPUT_TOKENS),
            responseMimeType: "application/json",
          },
        }),
        signal: controller.signal,
      }
    );

    const payload = await response.json().catch(() => null);
    usage = payload?.usageMetadata;

    if (!response.ok) {
      throw new AiUnavailableError(payload?.error?.message || "Gemini request failed.");
    }

    const content = payload?.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part.text || "")
      .join("");

    if (typeof content !== "string" || !content.trim()) {
      throw new AiUnavailableError("Gemini returned an empty response.");
    }

    const parsed = parseJsonContent<T>(content);
    await logAiUsage({ userId, feature, model: selectedModel, usage, success: true });
    return parsed;
  } catch (error) {
    await logAiUsage({
      userId,
      feature,
      model: selectedModel,
      usage,
      success: false,
      error: error instanceof Error ? error.message : "Unknown AI error",
    });
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function imageUrlToGeminiPart(imageUrl: string): Promise<GeminiPart> {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new AiUnavailableError("Could not read the uploaded product image.");
  }

  const contentType = response.headers.get("content-type") || "image/jpeg";
  const bytes = Buffer.from(await response.arrayBuffer());

  return {
    inlineData: {
      mimeType: contentType,
      data: bytes.toString("base64"),
    },
  };
}

function parseJsonContent<T>(content: string): T {
  try {
    return JSON.parse(content) as T;
  } catch {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new AiUnavailableError("Gemini did not return valid JSON.");
    return JSON.parse(jsonMatch[0]) as T;
  }
}

async function logAiUsage({
  userId,
  feature,
  model,
  usage,
  success,
  error,
}: {
  userId?: string | null;
  feature: string;
  model: string;
  usage?: GeminiUsage;
  success: boolean;
  error?: string;
}) {
  try {
    await prisma.aiUsage.create({
      data: {
        userId: userId || undefined,
        feature,
        provider: "gemini",
        model,
        promptTokens: usage?.promptTokenCount,
        completionTokens: usage?.candidatesTokenCount,
        totalTokens: usage?.totalTokenCount,
        success,
        error: error?.slice(0, 500),
      },
    });
  } catch (logError) {
    console.error("Failed to log AI usage", logError);
  }
}
