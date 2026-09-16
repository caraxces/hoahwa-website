import type { Metadata } from "next";
import { Suspense } from "react";
import { TreePageView } from "@/components/tree/TreePageView";
import { treeCopy } from "@/content/tree";

export const metadata: Metadata = {
  title: "Forest | Hoahwa",
  description: treeCopy.kicker,
};

function TreeFallback() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#151515] text-sm text-[var(--wiro-romance)]/60">
      Growing the forest…
    </div>
  );
}

export default function TreePage() {
  return (
    <Suspense fallback={<TreeFallback />}>
      <TreePageView />
    </Suspense>
  );
}
