"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { saveReview } from "@/lib/api-client";

type ReviewFormProps = {
  productId: string;
  productName?: string;
  onSaved?: () => void | Promise<void>;
};

export function ReviewForm({ productId, productName, onSaved }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setStatus("");

    try {
      await saveReview({ productId, rating, comment });
      setStatus("Review saved.");
      setComment("");
      await onSaved?.();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not save review.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border rounded-lg p-4 bg-white space-y-3">
      {productName && <h4 className="font-medium text-gray-900">Review {productName}</h4>}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setRating(value)}
            className="p-1"
            aria-label={`${value} stars`}
          >
            <Star
              className={`w-5 h-5 ${
                value <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder="Share your thoughts"
        className="w-full px-3 py-2 border rounded-lg text-sm min-h-20"
      />
      <Button disabled={isSaving} size="sm" className="bg-primary hover:bg-primary/90 text-white">
        {isSaving ? "Saving..." : "Save Review"}
      </Button>
      {status && <p className="text-sm text-gray-600">{status}</p>}
    </form>
  );
}
