import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: [],
  transpilePackages: [],
  experimental: {
    // Other experimental features
  },
  // Correct Next.js 16 syntax for turbopack
  turbopack: {
    root: import.meta.dirname,
  }
}

export default nextConfig;
