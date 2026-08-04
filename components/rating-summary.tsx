import { Star } from "lucide-react";
import type { ApiReviewSummary } from "@/lib/api-client";

type RatingSummaryProps = {
  summary?: ApiReviewSummary;
  size?: "sm" | "md";
  showCount?: boolean;
};

export function RatingSummary({ summary, size = "sm", showCount = true }: RatingSummaryProps) {
  const averageRating = summary?.averageRating || 0;
  const reviewCount = summary?.reviewCount || 0;
  const iconSize = size === "md" ? "w-5 h-5" : "w-4 h-4";

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5" aria-label={`${averageRating.toFixed(1)} out of 5 stars`}>
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`${iconSize} ${
              index < Math.round(averageRating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
      {showCount && (
        <span className="text-xs text-gray-600">
          {reviewCount > 0 ? `${averageRating.toFixed(1)} (${reviewCount})` : "No reviews"}
        </span>
      )}
    </div>
  );
}
