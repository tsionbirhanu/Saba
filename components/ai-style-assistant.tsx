"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Bot, Loader2, Send, Sparkles, X } from "lucide-react";
import { ApiAiProductPick, askStyleAssistant } from "@/lib/api-client";

type AiStyleAssistantProps = {
  productId?: string;
  categoryId?: string;
};

export function AiStyleAssistant({ productId, categoryId }: AiStyleAssistantProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [picks, setPicks] = useState<ApiAiProductPick[]>([]);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [usedAi, setUsedAi] = useState<boolean | null>(null);

  const canShow = pathname.startsWith("/shop") || pathname.startsWith("/products/");
  if (!canShow) return null;

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
    <div className="fixed bottom-5 right-4 z-50 sm:bottom-6 sm:right-6">
      {isOpen && (
        <section className="mb-3 flex max-h-[min(620px,calc(100vh-120px))] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Bot className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-bold text-gray-900">Style Assistant</h2>
                <p className="text-xs text-gray-600">Find real products from Saba.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              aria-label="Close style assistant"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            {picks.length === 0 && !status && (
              <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
                Tell me the occasion, style, size, or budget. I will suggest products that already exist in the catalog.
              </div>
            )}

            {usedAi === false && picks.length > 0 && (
              <p className="mb-3 text-xs text-gray-500">Showing catalog fallback matches while AI is unavailable.</p>
            )}
            {status && <p className="mb-3 text-sm text-gray-600">{status}</p>}

            {picks.length > 0 && (
              <div className="space-y-3">
                {picks.map((pick) => (
                  <Link
                    key={pick.product.id}
                    href={`/products/${pick.product.id}`}
                    onClick={() => setIsOpen(false)}
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
                      <p className="truncate font-medium text-gray-900">{pick.product.name}</p>
                      <p className="text-sm font-semibold text-primary">Birr {pick.product.price.toLocaleString()}</p>
                      <p className="line-clamp-2 text-xs text-gray-600">{pick.reason}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 border-t p-3">
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Wedding gabi, budget 5000 birr"
              className="min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white disabled:opacity-60"
              aria-label="Ask style assistant"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="ml-auto flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-primary/90"
        aria-label="Open style assistant"
      >
        <Sparkles className="h-4 w-4" />
        Style help
      </button>
    </div>
  );
}
