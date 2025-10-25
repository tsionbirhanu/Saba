import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // disables optimization so query strings work
  },
};

export default nextConfig;
