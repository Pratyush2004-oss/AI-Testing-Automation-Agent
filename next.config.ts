import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: [
    "playwright",
    "playwright-core",
    "@browserbasehq/sdk",
  ],
  outputFileTracingIncludes: {
    "/api/**/*": ["./node_modules/playwright-core/browsers.json"],
  },
};

export default nextConfig;
