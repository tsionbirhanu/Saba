import { prisma } from "@/lib/prisma";
import { normalizeProductImage } from "@/lib/product-images";
import { attachReviewSummaries, getDesignerReviewSummaries } from "@/lib/reviews";

export type CatalogProduct = Awaited<ReturnType<typeof getCatalogProducts>>[number];

export type ProductFilters = {
  category?: string;
  categoryId?: string;
  search?: string;
  minPrice?: string | number | null;
  maxPrice?: string | number | null;
  sort?: string | null;
  limit?: number;
};

export async function getCatalogProducts(filters: ProductFilters = {}) {
  const where: {
    categoryId?: string;
    price?: { gte?: number; lte?: number };
    category?: { name: { contains: string; mode: "insensitive" } };
    designerProfile?: { isVerified: boolean };
    OR?: Array<{
      name?: { contains: string; mode: "insensitive" };
      description?: { contains: string; mode: "insensitive" };
      category?: { name: { contains: string; mode: "insensitive" } };
    }>;
  } = {};
  where.designerProfile = { isVerified: true };

  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.category && filters.category !== "all") {
    where.category = { name: { contains: filters.category.replace(/-/g, " "), mode: "insensitive" } };
  }

  const minPrice = toNumber(filters.minPrice);
  const maxPrice = toNumber(filters.maxPrice);
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
      { category: { name: { contains: filters.search, mode: "insensitive" } } },
    ];
  }

  const orderBy =
    filters.sort === "price-low"
      ? { price: "asc" as const }
      : filters.sort === "price-high"
        ? { price: "desc" as const }
        : filters.sort === "popular"
          ? { orderItems: { _count: "desc" as const } }
          : { createdAt: "desc" as const };

  const products = await prisma.product.findMany({
    where,
    include: {
      designerProfile: {
        select: {
          id: true,
          isVerified: true,
          user: { select: { id: true, name: true, email: true, profileImage: true } },
        },
      },
      category: { select: { id: true, name: true } },
      _count: { select: { favorites: true, orders: true, orderItems: true } },
    },
    orderBy,
    take: filters.limit,
  });

  const designerSummaries = await getDesignerReviewSummaries(products.map((product) => product.designerProfileId));
  return attachReviewSummaries(
    products.map((product) => ({
      ...product,
      image: normalizeProductImage(product.image),
      designerProfile: {
        ...product.designerProfile,
        reviewSummary: designerSummaries.get(product.designerProfileId) || { averageRating: 0, reviewCount: 0 },
      },
    }))
  );
}

export function compactCatalog(products: CatalogProduct[]) {
  return products.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description.slice(0, 220),
    price: product.price,
    category: product.category.name,
    designer: product.designerProfile.user.name,
    rating: product.reviewSummary?.averageRating || 0,
    reviews: product.reviewSummary?.reviewCount || 0,
    favorites: product._count.favorites,
    orders: product._count.orderItems || product._count.orders || 0,
  }));
}

export function fallbackProductPicks(products: CatalogProduct[], message: string, count = 5) {
  const terms = message
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .filter((term) => term.length > 2);

  return [...products]
    .map((product) => {
      const haystack = `${product.name} ${product.description} ${product.category.name}`.toLowerCase();
      const score =
        terms.reduce((sum, term) => sum + (haystack.includes(term) ? 2 : 0), 0) +
        (product.reviewSummary?.averageRating || 0) +
        product._count.favorites * 0.2 +
        product._count.orderItems * 0.4;
      return { product, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(({ product }) => ({
      product,
      reason: "Matched from the current catalog using category, keyword, rating, and popularity signals.",
    }));
}

function toNumber(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}
