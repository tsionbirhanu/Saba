"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bot, Loader2, Send } from "lucide-react";
import { ApiAiProductPick, askStyleAssistant } from "@/lib/api-client";

type AiStyleAssistantProps = {
  productId?: string;
  categoryId?: string;
};

export function AiStyleAssistant({ productId, categoryId }: AiStyleAssistantProps) {
  const [message, setMessage] = useState("");
  const [picks, setPicks] = useState<ApiAiProductPick[]>([]);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [usedAi, setUsedAi] = useState<boolean | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setStatus("");

    try {
      const response = await askStyleAssistant({ message: trimmed, productId, categoryId });
      setPicks(response.picks || []);
      setUsedAi(response.usedAi);
      setStatus(response.picks?.length ? "" : response.message || "No matching products found yet.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Style assistant is temporarily unavailable.");
      setPicks([]);
      setUsedAi(false);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="bg-white rounded-lg border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
          <Bot className="w-5 h-5" />
        </span>
        <div>
          <h2 className="font-bold text-gray-900">AI Style Assistant</h2>
          <p className="text-sm text-gray-600">Ask for an occasion, style, or budget.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Modern gabi for a wedding, budget 5000 birr"
          className="min-w-0 flex-1 px-4 py-2 border rounded-lg text-sm"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-11 h-10 rounded-lg bg-primary text-white flex items-center justify-center disabled:opacity-60"
          aria-label="Ask style assistant"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>

      {usedAi === false && picks.length > 0 && (
        <p className="mt-3 text-xs text-gray-500">Showing catalog fallback matches while AI is unavailable.</p>
      )}
      {status && <p className="mt-3 text-sm text-gray-600">{status}</p>}

      {picks.length > 0 && (
        <div className="mt-4 space-y-3">
          {picks.map((pick) => (
            <Link
              key={pick.product.id}
              href={`/products/${pick.product.id}`}
              className="flex gap-3 rounded-lg border border-gray-100 p-3 hover:border-primary/40 hover:bg-gray-50 transition"
            >
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                <Image
                  src={pick.product.image || "/images/dress.jpg"}
                  alt={pick.product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-gray-900 truncate">{pick.product.name}</p>
                <p className="text-sm font-semibold text-primary">Birr {pick.product.price.toLocaleString()}</p>
                <p className="text-xs text-gray-600 line-clamp-2">{pick.reason}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
