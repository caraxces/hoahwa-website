import { getAllInsightPosts } from "@/lib/insights-db";

export type InsightPost = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
};

export const insightFilters = [
  "All",
  "A/B Testing",
  "CRO",
  "Shopify",
  "Growth",
  "eCommerce",
  "Tech Integration",
] as const;

export const insightPosts: InsightPost[] = getAllInsightPosts();
