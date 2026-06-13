import { insightsDatabase } from "@/content/insight-articles";
import type { InsightPostRecord } from "@/lib/insights-types";

export type InsightPostListItem = Pick<
  InsightPostRecord,
  "slug" | "title" | "date" | "tags"
>;

export function getAllInsightPosts(): InsightPostListItem[] {
  return insightsDatabase.posts.map(({ slug, title, date, tags }) => ({
    slug,
    title,
    date,
    tags,
  }));
}

export function getAllInsightSlugs(): string[] {
  return insightsDatabase.posts.map((post) => post.slug);
}

export function getInsightPost(slug: string): InsightPostRecord | undefined {
  return insightsDatabase.posts.find((post) => post.slug === slug);
}

export function getRelatedInsights(
  slug: string,
  limit = 3,
): InsightPostListItem[] {
  const current = getInsightPost(slug);
  if (!current) return [];

  const tagSet = new Set(current.tags);
  return insightsDatabase.posts
    .filter((post) => post.slug !== slug)
    .map((post) => ({
      post,
      score: post.tags.filter((tag) => tagSet.has(tag)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => ({
      slug: post.slug,
      title: post.title,
      date: post.date,
      tags: post.tags,
    }));
}
