import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
  const products = await prisma.product.findMany({
    where: { designerProfile: { isVerified: true } },
    select: { id: true, updatedAt: true },
  });

  return [
    "",
    "/shop",
    "/about",
    "/contact",
    "/blog",
    ...products.map((product) => `/products/${product.id}`),
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: path.startsWith("/products/")
      ? products.find((product) => path.endsWith(product.id))?.updatedAt
      : new Date(),
  }));
}
