"use client";

import dynamic from "next/dynamic";
import type { PortfolioPageConfig } from "@/content/portfolio/schema";
import "@/app/p/portfolio.css";

const PortfolioPageClient = dynamic(
  () => import("@/components/portfolio/PortfolioPageClient").then((m) => m.PortfolioPageClient),
  { ssr: false, loading: () => <p className="p-8 text-white/50">Loading preview…</p> },
);

export function PortfolioBuilderPreview({ config }: { config: PortfolioPageConfig }) {
  return (
    <div className="overflow-hidden rounded-lg border border-[var(--wiro-romance)]/20 bg-black">
      <div className="border-b border-[var(--wiro-romance)]/10 px-4 py-2 text-xs text-[var(--wiro-mauve)]">
        Live preview
      </div>
      <div className="portfolio-preview-embedded h-[calc(100vh-220px)] min-h-[480px] overflow-auto">
        <PortfolioPageClient config={config} embedded />
      </div>
    </div>
  );
}
