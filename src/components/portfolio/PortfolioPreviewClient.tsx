"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PortfolioPageClient } from "@/components/portfolio/PortfolioPageClient";
import type { PortfolioPageConfig } from "@/content/portfolio/schema";
import { fetchPublishedPage } from "@/lib/portfolio-auth-api";

function PreviewContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug")?.trim() ?? "";
  const [config, setConfig] = useState<PortfolioPageConfig | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setError("Missing page slug. Use ?slug=your-page");
      return;
    }

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError("");
      const result = await fetchPublishedPage(slug);
      if (cancelled) return;

      if (!result.ok) {
        setError(result.error);
        setConfig(null);
      } else {
        setConfig(result.page.config as PortfolioPageConfig);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

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
