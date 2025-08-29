// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Use remotePatterns (domains is deprecated in Next 15)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    // Pre-configure allowed quality values to silence Next 16 warning
    qualities: [60],
  },
};

export default nextConfig;
