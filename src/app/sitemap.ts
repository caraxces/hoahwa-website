import type { MetadataRoute } from "next";
import { getAllInsightPosts } from "@/lib/insights-db";
import { absoluteUrl, parseInsightDate } from "@/lib/seo";

// Required for `output: "export"` — generate the sitemap at build time.
export const dynamic = "force-static";

/**
 * Static sitemap generated at build time (compatible with `output: "export"`).
 * Lists every indexable public route. Demo/preview/builder/admin routes are
 * intentionally excluded — they are also disallowed in robots.ts.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Core marketing routes with hand-tuned priority/cadence.
  const staticRoutes: Array<{
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }> = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/shopify-theme-builds", priority: 0.9, changeFrequency: "monthly" },
    { path: "/audits", priority: 0.9, changeFrequency: "monthly" },
    { path: "/growth-retainers", priority: 0.9, changeFrequency: "monthly" },
    {
      path: "/ai-search-optimization",
      priority: 0.9,
      changeFrequency: "monthly",
    },
    { path: "/book", priority: 0.9, changeFrequency: "monthly" },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" },
    { path: "/process", priority: 0.7, changeFrequency: "monthly" },
    { path: "/case-studies", priority: 0.8, changeFrequency: "weekly" },
    {
      path: "/case-studies/shopify-developer",
      priority: 0.7,
      changeFrequency: "monthly",
    },
    {
      path: "/case-studies/hoahwa-com",
      priority: 0.8,
      changeFrequency: "monthly",
    },
    {
      path: "/case-studies/vietfolk-winter-2026",
      priority: 0.8,
      changeFrequency: "monthly",
    },
    { path: "/video-editor", priority: 0.8, changeFrequency: "monthly" },
    { path: "/insights", priority: 0.8, changeFrequency: "weekly" },
    { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
    { path: "/cookie-policy", priority: 0.2, changeFrequency: "yearly" },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // One entry per insight article, dated from its publish date.
  const insightEntries: MetadataRoute.Sitemap = getAllInsightPosts().map(
    (post) => ({
      url: absoluteUrl(`/insights/${post.slug}`),
      lastModified: parseInsightDate(post.date) ?? now,
      changeFrequency: "yearly",
      priority: 0.6,
    }),
  );

  return [...staticEntries, ...insightEntries];
}
