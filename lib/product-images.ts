const legacyImageMap: Record<string, string> = {
  "/images/traditional_dress_1.jpg": "/images/traditional_dress.jpg",
};

export function normalizeProductImage(image: string | null | undefined) {
  if (!image) return "/images/dress.jpg";
  const trimmed = image.trim();
  if (!trimmed) return "/images/dress.jpg";
  if (trimmed.startsWith("images/")) return `/${trimmed}`;

  try {
    const url = new URL(trimmed);
    if (isAppHost(url.hostname)) {
      return legacyImageMap[url.pathname] || url.pathname;
    }
  } catch {
    // Local image paths are not valid absolute URLs, which is expected here.
  }

  return legacyImageMap[trimmed] || trimmed;
}

export function normalizeImageFields<T>(value: T): T {
  if (!value || typeof value !== "object" || value instanceof Date) return value;

  if (Array.isArray(value)) {
    return value.map((item) => normalizeImageFields(item)) as T;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => {
      if (typeof item === "string" && ["image", "profileImage", "idImage"].includes(key)) {
        return [key, normalizeProductImage(item)];
      }

      return [key, normalizeImageFields(item)];
    })
  ) as T;
}

function isAppHost(hostname: string) {
  const appHosts = new Set(["localhost", "127.0.0.1"]);

  for (const value of [process.env.NEXT_PUBLIC_APP_URL, process.env.VERCEL_URL]) {
    if (!value) continue;
    try {
      appHosts.add(new URL(value.startsWith("http") ? value : `https://${value}`).hostname);
    } catch {
      appHosts.add(value.replace(/^https?:\/\//, "").split("/")[0]);
    }
  }

  return appHosts.has(hostname);
}
