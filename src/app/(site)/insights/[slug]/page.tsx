import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InsightArticleView } from "@/components/insights/InsightArticleView";
import {
  getAllInsightSlugs,
  getInsightPost,
  getRelatedInsights,
} from "@/lib/insights-db";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllInsightSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getInsightPost(slug);
  if (!post) return { title: "Insight | Hoahwa" };

  return {
    title: `${post.title} | Hoahwa Insights`,
    description: post.excerpt,
  };
}

export default async function InsightArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = getInsightPost(slug);

  if (!post) notFound();

  const related = getRelatedInsights(slug);

  return <InsightArticleView post={post} related={related} />;
}
