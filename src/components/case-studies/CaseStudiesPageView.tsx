"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  pursuitFilters,
  pursuitGoals,
  pursuitSection,
} from "@/content/pursuits";
import { FilterBar } from "@/components/shared/FilterBar";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import { PageContainer, PageSection } from "@/components/shared/PageContainer";
import { clipUp, fadeUp, staggerContainer } from "@/lib/motion";

export function CaseStudiesPageView() {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filtered = useMemo(() => {
    if (activeFilter === "All") return pursuitGoals;
    return pursuitGoals.filter((goal) => goal.tags.includes(activeFilter));
  }, [activeFilter]);

  return (
    <PageSection
      padX={false}
      className="bg-[var(--wiro-black)] px-[var(--wiro-page-pad)] pb-32 pt-[120px] text-[var(--wiro-romance)]"
    >
      <PageContainer>
        <RevealGroup variants={staggerContainer(0.1, 0)} className="mb-10">
          <Reveal clip variants={clipUp}>
            <h1 className="text-h1">{pursuitSection.headline[0]}</h1>
          </Reveal>
          <Reveal clip variants={clipUp}>
            <h1 className="text-h1 text-[var(--wiro-mauve)]">
              {pursuitSection.headline[1]}
            </h1>
          </Reveal>
          <Reveal variants={fadeUp} className="mt-10 max-w-[820px]">
            <p className="text-[length:var(--wiro-body)] leading-[var(--wiro-body-lh)] tracking-[-0.03em] text-[var(--wiro-romance)]/75">
              {pursuitSection.lead}
            </p>
          </Reveal>
        </RevealGroup>

        <FilterBar
          filters={[...pursuitFilters]}
          active={activeFilter}
          onChange={setActiveFilter}
          variant="on-dark"
          className="mb-16"
        />

        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((goal, i) => (
            <Reveal key={goal.slug} variants={fadeUp} delay={i * 0.04}>
              <article className="flex h-full min-h-[min(420px,70vw)] flex-col justify-between rounded-lg border border-[var(--wiro-romance)]/20 p-8 md:p-10">
                <div>
                  <h2 className="text-[length:var(--wiro-h4)] tracking-[-0.04em]">
                    {goal.title}
                  </h2>
                  <p className="mt-4 text-base leading-6 tracking-[-0.03em] text-[var(--wiro-romance)]/75">
                    {goal.description}
                  </p>
                </div>
                <ul className="mt-8 flex flex-wrap gap-2">
                  {goal.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-[var(--wiro-romance)]/25 px-3 py-1 text-xs tracking-[-0.02em] text-[var(--wiro-mauve)]"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal variants={fadeUp} className="mt-16">
          <Link
            href="/case-studies/shopify-developer"
            className="inline-flex items-center justify-center rounded-[20px] border border-[var(--wiro-romance)]/35 px-4 py-2.5 text-base tracking-[-0.03em] text-[var(--wiro-romance)] transition-colors hover:bg-[var(--wiro-romance)] hover:text-[var(--wiro-cod-gray)]"
          >
            Read our first case study — Shopify developer explainer
          </Link>
        </Reveal>
      </PageContainer>
    </PageSection>
  );
}
