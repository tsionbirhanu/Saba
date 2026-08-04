"use client";

import { useRouter } from "next/navigation";
import { ReviewForm } from "@/components/review-form";

export function ProductReviewForm({ productId }: { productId: string }) {
  const router = useRouter();

  return <ReviewForm productId={productId} onSaved={() => router.refresh()} />;
}
