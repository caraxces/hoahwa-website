import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

// Required for `output: "export"` — generate robots.txt at build time.
export const dynamic = "force-static";

/**
 * robots.txt generated at build time. Allows all indexable content, blocks the
 * internal demo/preview/builder tooling, and points crawlers at the sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/p/", "/portfolio/", "/vibe-demo/"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
