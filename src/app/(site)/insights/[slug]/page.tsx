import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InsightArticleView } from "@/components/insights/InsightArticleView";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getAllInsightSlugs,
  getInsightPost,
  getRelatedInsights,
} from "@/lib/insights-db";
import {
  articleSchema,
  breadcrumbSchema,
  pageMetadata,
  parseInsightDate,
} from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllInsightSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getInsightPost(slug);
  if (!post) return { title: "Insight" };

  return pageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/insights/${slug}`,
    type: "article",
    publishedTime: parseInsightDate(post.date),
    tags: post.tags,
  });
}

export default async function InsightArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = getInsightPost(slug);

  if (!post) notFound();

  const related = getRelatedInsights(slug);
  const path = `/insights/${slug}`;

  return (
    <>
      <JsonLd
        data={[
          articleSchema({
            title: post.title,
            description: post.excerpt,
            path,
            datePublished: parseInsightDate(post.date),
            tags: post.tags,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Insights", path: "/insights" },
            { name: post.title, path },
          ]),
        ]}
      />
      <InsightArticleView post={post} related={related} />
    </>
  );
}
