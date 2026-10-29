import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.figma.com",
        pathname: "/api/mcp/asset/**",
      },
    ],
  },
};

export default function config(phase: string): NextConfig {
  if (phase !== PHASE_DEVELOPMENT_SERVER) return nextConfig;
  // Local browsers use the same origin; production still exports static files for PHP hosting.
  return {
    ...nextConfig,
    output: undefined,
    async rewrites() {
      return {
        beforeFiles: [{
          source: "/api/short-links.php",
          destination: process.env.NEXT_PUBLIC_SHORT_LINKS_API_URL ?? "https://hoahwa.com/api/short-links.php",
        }],
      };
    },
  };
}
