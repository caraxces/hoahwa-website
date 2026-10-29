import Link from "next/link";
import { Suspense } from "react";
import { TreePageClient } from "@/components/tree/TreePageView";
import { linksCopy, treePageSeo } from "@/content/tree";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "HoaHwa Links · short links that grow into trees",
  description: treePageSeo.metaDescription,
  path: "/tree",
});

function TreeInteractiveFallback() {
  return (
    <div className="tree-app tree-workshop flex min-h-[280px] items-center justify-center bg-[#f4ece0] text-sm text-black/50">
      Growing the grove…
    </div>
  );
}

function TreePageShell() {
  return (
    <section
      className="tree-page-shell w-full bg-[#f4ece0] px-6 py-10 text-sm leading-relaxed text-[#40372e]"
      aria-labelledby="tree-page-title"
    >
      <div className="mx-auto max-w-3xl">
        <h1 id="tree-page-title" className="text-2xl font-semibold tracking-tight text-[#2b241d]">
          {treePageSeo.h1}
        </h1>
        <p className="mt-2">{treePageSeo.intro}</p>
        <nav className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[#8a6a2f]" aria-label="HoaHwa Links">
          <Link href="/tree/market/" className="underline-offset-4 hover:underline">
            {linksCopy.market} →
          </Link>
          <Link href="/case-studies/" className="underline-offset-4 hover:underline">
            Case studies
          </Link>
        </nav>
      </div>
    </section>
  );
}

export default function TreePage() {
  return (
    <>
      {/* The tool comes first so the QR stays in the first viewport; the
          crawlable copy follows it in the static HTML. */}
      <Suspense fallback={<TreeInteractiveFallback />}>
        <TreePageClient />
      </Suspense>
      <TreePageShell />
    </>
  );
}
