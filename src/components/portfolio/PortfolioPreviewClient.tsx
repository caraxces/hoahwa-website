"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PortfolioPageClient } from "@/components/portfolio/PortfolioPageClient";
import type { PortfolioPageConfig } from "@/content/portfolio/schema";
import { fetchPublishedPage } from "@/lib/portfolio-auth-api";

/** Fetch outcome tagged with the slug it belongs to, so a stale response for a
 *  previous slug can never be shown as the current one. */
type PreviewResult = {
  slug: string;
  config: PortfolioPageConfig | null;
  error: string;
};

function PreviewContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug")?.trim() ?? "";
  const [result, setResult] = useState<PreviewResult | null>(null);

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;

    (async () => {
      // Awaiting first keeps every setState off the effect's synchronous path.
      const res = await fetchPublishedPage(slug);
      if (cancelled) return;

      setResult(
        res.ok
          ? { slug, config: res.page.config as PortfolioPageConfig, error: "" }
          : { slug, config: null, error: res.error },
      );
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const settled = result?.slug === slug;
  const loading = Boolean(slug) && !settled;
  const error = slug
    ? (settled ? result.error : "")
    : "Missing page slug. Use ?slug=your-page";
  const config = settled ? result.config : null;

  if (loading) {
    return (
      <div className="portfolio-page flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-white/60">Loading page…</p>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="portfolio-page flex min-h-screen flex-col items-center justify-center gap-4 bg-black px-6 text-center text-white">
        <p className="text-lg">{error || "Page not found."}</p>
        <p className="text-sm text-white/50">
          Pages expire after 100 days or must be published from the builder.
        </p>
        <a href="/portfolio/builder/" className="text-[#c8f542] underline">
          Go to Portfolio Builder
        </a>
      </div>
    );
  }

  return <PortfolioPageClient config={config} />;
}

export function PortfolioPreviewClient() {
  return (
    <Suspense
      fallback={
        <div className="portfolio-page flex min-h-screen items-center justify-center bg-black text-white">
          <p className="text-white/60">Loading…</p>
        </div>
      }
    >
      <PreviewContent />
    </Suspense>
  );
}
