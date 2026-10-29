import Link from "next/link";
import { MarketView } from "@/components/tree/MarketView";
import { linksCopy, marketPageSeo } from "@/content/tree";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: marketPageSeo.metaTitle,
  description: marketPageSeo.metaDescription,
  path: "/tree/market",
});

function MarketPageShell() {
  return (
    <section
      className="market-page-shell w-full bg-[#f4ece0] px-6 py-10 text-sm leading-relaxed text-[#34402f]"
      aria-labelledby="market-page-title"
    >
      <div className="mx-auto max-w-3xl">
        <h1 id="market-page-title" className="text-2xl font-semibold tracking-tight text-[#2b241d]">
          {marketPageSeo.h1}
        </h1>
        <p className="mt-2">{marketPageSeo.intro}</p>
        <nav className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[#405d3e]" aria-label="Tree market">
          <Link href="/tree/" className="underline-offset-4 hover:underline">
            {linksCopy.brand} workshop →
          </Link>
          <Link href="/case-studies/" className="underline-offset-4 hover:underline">
            Case studies
          </Link>
        </nav>
      </div>
    </section>
  );
}

export default function MarketPage() {
  return (
    <>
      {/* The island comes first; the crawlable copy follows it. */}
      <MarketView />
      <MarketPageShell />
    </>
  );
}
