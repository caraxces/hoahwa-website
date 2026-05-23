"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { insightFilters, insightPosts } from "@/content/insights";
import { FilterBar } from "@/components/shared/FilterBar";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import { PageContainer, PageSection } from "@/components/shared/PageContainer";
import { clipUp, fadeUp, staggerContainer } from "@/lib/motion";

export function InsightsPageView() {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filtered = useMemo(() => {
    if (activeFilter === "All") return insightPosts;
    return insightPosts.filter((p) => p.tags.includes(activeFilter));
  }, [activeFilter]);

  return (
    <PageSection
      className="bg-[var(--wiro-romance)] pb-32 pt-[120px] text-[var(--wiro-cod-gray)]"
    >
      <PageContainer>
        <RevealGroup variants={staggerContainer(0.1, 0)} className="mb-16">
          <Reveal clip variants={clipUp}>
            <h1 className="text-h1 text-[var(--wiro-mauve)]">Read the latest</h1>
          </Reveal>
          <Reveal clip variants={clipUp}>
            <h1 className="text-h1">eCom Insights</h1>
          </Reveal>
        </RevealGroup>

        <FilterBar
          filters={insightFilters}
          active={activeFilter}
          onChange={setActiveFilter}
          className="mb-12"
        />

        <ul className="border-t border-[var(--wiro-cod-gray)]">
          {filtered.map((post, i) => (
            <Reveal key={post.slug} as="li" variants={fadeUp} delay={i * 0.03}>
              <Link
                href="#"
                className="group flex flex-col gap-4 border-b border-[var(--wiro-cod-gray)] py-10 transition-opacity hover:opacity-80 md:flex-row md:items-start md:gap-12"
              >
                <div className="flex shrink-0 flex-col gap-2 md:w-48">
                  <span className="text-sm tracking-[-0.03em] text-[var(--wiro-mauve)]">
                    {post.date}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs tracking-[-0.02em] text-[var(--wiro-cod-gray)]/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-h3 text-[var(--wiro-cod-gray)]/25 transition-colors group-hover:text-[var(--wiro-cod-gray)]/50">
                  {post.title}
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </PageContainer>
    </PageSection>
  );
}
