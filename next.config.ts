import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: [
  "playwright",
  "playwright-core",
  "@browserbasehq/sdk",
]
};

export default nextConfig;
