import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable local images with query strings
  images: {
    localPatterns: [
      {
        pattern: "/images/*", // allow any file in /images
      },
    ],
  },
};

export default nextConfig;
