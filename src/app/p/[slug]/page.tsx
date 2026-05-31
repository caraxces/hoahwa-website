import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortfolioPageClient } from "@/components/portfolio/PortfolioPageClient";
import { getAllPortfolioSlugs, getPortfolioPage } from "@/content/portfolio/pages";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllPortfolioSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getPortfolioPage(slug);
  if (!page) return { title: "Portfolio | Hoahwa" };

  return {
    title: page.meta.title,
    description: page.meta.description,
  };
}

export default async function PortfolioSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const config = getPortfolioPage(slug);

  if (!config) notFound();

  return <PortfolioPageClient config={config} />;
}
