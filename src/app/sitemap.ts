import type { MetadataRoute } from "next";
import { getAllInsightPosts } from "@/lib/insights-db";
import { insightRewritesA } from "@/content/insight-rewrites-a";
import { insightRewritesB } from "@/content/insight-rewrites-b";
import { absoluteUrl, parseInsightDate } from "@/lib/seo";

// Required for `output: "export"` — generate the sitemap at build time.
export const dynamic = "force-static";

/** Calendar last-modified dates from `git log -1 --format=%cs -- <route files>`. */
function lastModifiedFromDate(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00.000Z`);
}

/**
 * Static sitemap generated at build time (compatible with `output: "export"`).
 * Lists every indexable public route. Demo/preview/builder/admin routes are
 * intentionally excluded — they are also disallowed in robots.ts.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Core marketing routes with hand-tuned priority/cadence.
  const staticRoutes: Array<{
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    lastModified: string;
  }> = [
    { path: "/", priority: 1, changeFrequency: "weekly", lastModified: "2026-10-28" },
    { path: "/tree", priority: 0.8, changeFrequency: "weekly", lastModified: "2026-10-28" },
    {
      path: "/tree/market",
      priority: 0.7,
      changeFrequency: "daily",
      lastModified: "2026-10-28",
    },
    {
      path: "/shopify-theme-builds",
      priority: 0.9,
      changeFrequency: "monthly",
      lastModified: "2026-06-23",
    },
    { path: "/audits", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-06-23" },
    {
      path: "/growth-retainers",
      priority: 0.9,
      changeFrequency: "monthly",
      lastModified: "2026-06-23",
    },
    {
      path: "/ai-search-optimization",
      priority: 0.9,
      changeFrequency: "monthly",
      lastModified: "2026-06-23",
    },
    { path: "/book", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-08-04" },
    { path: "/about", priority: 0.7, changeFrequency: "monthly", lastModified: "2026-09-05" },
    { path: "/process", priority: 0.7, changeFrequency: "monthly", lastModified: "2026-06-23" },
    {
      path: "/case-studies",
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified: "2026-06-23",
    },
    {
      path: "/case-studies/shopify-developer",
      priority: 0.7,
      changeFrequency: "monthly",
      lastModified: "2026-06-23",
    },
    {
      path: "/case-studies/hoahwa-com",
      priority: 0.8,
      changeFrequency: "monthly",
      lastModified: "2026-08-04",
    },
    {
      path: "/case-studies/vietfolk-winter-2026",
      priority: 0.8,
      changeFrequency: "monthly",
      lastModified: "2026-09-05",
    },
    {
      path: "/case-studies/bloombound-3d-landing-page",
      priority: 0.8,
      changeFrequency: "monthly",
      lastModified: "2026-09-08",
    },
    {
      path: "/case-studies/ke-audio-story-studio",
      priority: 0.8,
      changeFrequency: "monthly",
      lastModified: "2026-10-28",
    },
    {
      path: "/case-studies/tarotto-programmatic-seo",
      priority: 0.8,
      changeFrequency: "monthly",
      lastModified: "2026-09-08",
    },
    {
      path: "/case-studies/notch-agent-train",
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified: "2026-10-28",
    },
    { path: "/build-log", priority: 0.7, changeFrequency: "weekly", lastModified: "2026-10-28" },
    {
      path: "/apps/bloombound",
      priority: 0.6,
      changeFrequency: "monthly",
      lastModified: "2026-10-28",
    },
    { path: "/apps/ke", priority: 0.7, changeFrequency: "monthly", lastModified: "2026-10-28" },
    { path: "/insights", priority: 0.8, changeFrequency: "weekly", lastModified: "2026-10-28" },
    { path: "/contact", priority: 0.6, changeFrequency: "yearly", lastModified: "2026-09-05" },
    { path: "/privacy", priority: 0.2, changeFrequency: "yearly", lastModified: "2026-09-05" },
    { path: "/terms", priority: 0.2, changeFrequency: "yearly", lastModified: "2026-09-05" },
    {
      path: "/cookie-policy",
      priority: 0.2,
      changeFrequency: "yearly",
      lastModified: "2026-09-05",
    },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: lastModifiedFromDate(route.lastModified),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // One entry per insight article, dated from its publish date — or from the
  // full rewrite (2026-10-28) for the posts that started as stubs.
  const rewritten = new Set([...Object.keys(insightRewritesA), ...Object.keys(insightRewritesB)]);
  const insightEntries: MetadataRoute.Sitemap = getAllInsightPosts().flatMap(
    (post) => {
      const iso = parseInsightDate(post.date);
      if (!iso) return [];
      return [
        {
          url: absoluteUrl(`/insights/${post.slug}`),
          lastModified: rewritten.has(post.slug) ? lastModifiedFromDate("2026-10-28") : new Date(iso),
          changeFrequency: "yearly" as const,
          priority: 0.6,
        },
      ];
    },
  );

  return [...staticEntries, ...insightEntries];
}
