import { prisma } from "@/lib/prisma";

export type ReviewSummary = {
  averageRating: number;
  reviewCount: number;
};

const emptySummary: ReviewSummary = {
  averageRating: 0,
  reviewCount: 0,
};

export function roundRating(value: number | null | undefined) {
  return value ? Math.round(value * 10) / 10 : 0;
}

export async function getReviewSummary(productId: string): Promise<ReviewSummary> {
  const aggregate = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: { _all: true },
  });

  return {
    averageRating: roundRating(aggregate._avg.rating),
    reviewCount: aggregate._count._all,
  };
}

export async function getReviewSummaries(productIds: string[]) {
  if (productIds.length === 0) return new Map<string, ReviewSummary>();

  const grouped = await prisma.review.groupBy({
    by: ["productId"],
    where: { productId: { in: productIds } },
    _avg: { rating: true },
    _count: { _all: true },
  });

  return new Map(
    grouped.map((row) => [
      row.productId,
      {
        averageRating: roundRating(row._avg.rating),
        reviewCount: row._count._all,
      },
    ])
  );
}

export async function attachReviewSummaries<T extends { id: string }>(products: T[]) {
  const summaries = await getReviewSummaries(products.map((product) => product.id));

  return products.map((product) => ({
    ...product,
    reviewSummary: summaries.get(product.id) || emptySummary,
  }));
}

export async function getDesignerReviewSummary(designerProfileId: string): Promise<ReviewSummary> {
  const aggregate = await prisma.review.aggregate({
    where: {
      product: { designerProfileId },
    },
    _avg: { rating: true },
    _count: { _all: true },
  });

  return {
    averageRating: roundRating(aggregate._avg.rating),
    reviewCount: aggregate._count._all,
  };
}

export async function getDesignerReviewSummaries(designerProfileIds: string[]) {
  if (designerProfileIds.length === 0) return new Map<string, ReviewSummary>();

  const reviews = await prisma.review.findMany({
    where: {
      product: { designerProfileId: { in: designerProfileIds } },
    },
    select: {
      rating: true,
      product: { select: { designerProfileId: true } },
    },
  });

  const buckets = new Map<string, { total: number; count: number }>();
  reviews.forEach((review) => {
    const designerProfileId = review.product.designerProfileId;
    const current = buckets.get(designerProfileId) || { total: 0, count: 0 };
    buckets.set(designerProfileId, {
      total: current.total + review.rating,
      count: current.count + 1,
    });
  });

  return new Map(
    Array.from(buckets.entries()).map(([designerProfileId, summary]) => [
      designerProfileId,
      {
        averageRating: roundRating(summary.total / summary.count),
        reviewCount: summary.count,
      },
    ])
  );
}

export async function hasDeliveredProductOrder(userId: string, productId: string) {
  const order = await prisma.order.findFirst({
    where: {
      buyerId: userId,
      status: "DELIVERED",
      OR: [
        { productId },
        { items: { some: { productId } } },
      ],
    },
    select: { id: true },
  });

  return Boolean(order);
}
