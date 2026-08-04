const legacyImageMap: Record<string, string> = {
  "/images/traditional_dress_1.jpg": "/images/traditional_dress.jpg",
};

export function normalizeProductImage(image: string | null | undefined) {
  if (!image) return "/images/dress.jpg";

  try {
    const url = new URL(image);
    if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
      return legacyImageMap[url.pathname] || url.pathname;
    }
  } catch {
    // Local image paths are not valid absolute URLs, which is expected here.
  }

  return legacyImageMap[image] || image;
}
