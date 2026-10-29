import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

// Required for `output: "export"` — generate robots.txt at build time.
export const dynamic = "force-static";

/**
 * robots.txt generated at build time. Allows all indexable content, blocks the
 * internal demo tooling, and points crawlers at the sitemap. /p/ and
 * /portfolio/ stay crawlable on purpose: their pages carry `noindex`, which a
 * crawler can only see if it is allowed to fetch them.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/vibe-demo/"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
