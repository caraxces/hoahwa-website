"use client";

import Link from "next/link";
import {
  caseStudyChapters,
  caseStudyCta,
  caseStudyMeta,
  caseStudyStack,
  caseStudyStats,
} from "@/content/case-study-hoahwa";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import { PageContainer, PageSection } from "@/components/shared/PageContainer";
import { clipUp, fadeUp, staggerContainer } from "@/lib/motion";

export function HoahwaCaseStudyView() {
  return (
    <>
      <PageSection
        padX={false}
        className="bg-[var(--wiro-black)] px-[var(--wiro-page-pad)] pb-24 pt-[120px] text-[var(--wiro-romance)]"
      >
        <PageContainer>
          <RevealGroup variants={staggerContainer(0.08, 0.05)}>
            <Reveal variants={fadeUp}>
              <p className="text-[length:var(--wiro-body)] tracking-[-0.03em] text-[var(--wiro-mauve)]">
                {caseStudyMeta.eyebrow}
              </p>
            </Reveal>
            <Reveal clip variants={clipUp}>
              <h1 className="mt-4 text-h1">{caseStudyMeta.headline[0]}</h1>
            </Reveal>
            <Reveal clip variants={clipUp}>
              <h1 className="text-h1 text-[var(--wiro-mauve)]">
                {caseStudyMeta.headline[1]}
              </h1>
            </Reveal>
            <Reveal variants={fadeUp} className="mt-10 max-w-[860px]">
              <p className="text-[length:var(--wiro-body)] leading-[var(--wiro-body-lh)] tracking-[-0.03em] text-[var(--wiro-romance)]/80">
                {caseStudyMeta.lead}
              </p>
            </Reveal>
          </RevealGroup>

          <div className="mt-20 grid grid-cols-2 gap-8 border-t border-[var(--wiro-romance)]/20 pt-12 lg:grid-cols-4">
            {caseStudyStats.map((stat, i) => (
              <Reveal key={stat.label} variants={fadeUp} delay={i * 0.05}>
                <p className="text-[length:56px] leading-none tracking-[-0.06em] text-[var(--wiro-mauve)]">
                  {stat.value}
                </p>
                <p className="mt-3 text-sm leading-5 tracking-[-0.02em] text-[var(--wiro-romance)]/70">
                  {stat.label}
                </p>
              </Reveal>
            ))}
          </div>
          <Reveal variants={fadeUp}>
            <p className="mt-8 text-xs tracking-[-0.02em] text-[var(--wiro-romance)]/45">
              {caseStudyMeta.measured}
            </p>
          </Reveal>
        </PageContainer>
      </PageSection>

      <PageSection className="bg-[var(--wiro-spring-wood)] py-24 text-[var(--wiro-cod-gray)]">
        <PageContainer>
          <div className="flex flex-col gap-20">
            {caseStudyChapters.map((chapter) => (
              <Reveal key={chapter.num} variants={fadeUp}>
                <article className="flex flex-col gap-8 lg:flex-row lg:gap-20">
                  <div className="lg:w-[300px] lg:shrink-0">
                    <span className="text-base tracking-[-0.03em] text-[var(--wiro-mauve)]">
                      {chapter.num}
                    </span>
                    <h2 className="mt-3 text-[length:var(--wiro-h4)] leading-tight tracking-[-0.04em]">
                      {chapter.title}
                    </h2>
                  </div>
                  <div className="flex max-w-[760px] flex-1 flex-col gap-5">
                    {chapter.body.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-[length:var(--wiro-body)] leading-[var(--wiro-body-lh)] tracking-[-0.03em]"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </PageContainer>
      </PageSection>

      <PageSection
        padX={false}
        className="bg-[var(--wiro-black)] px-[var(--wiro-page-pad)] py-24 text-[var(--wiro-romance)]"
      >
        <PageContainer>
          <Reveal clip variants={clipUp}>
            <h2 className="text-h3">
              The stack<span className="text-[var(--wiro-mauve)]">.</span>
            </h2>
          </Reveal>
          <dl className="mt-12 border-t border-[var(--wiro-romance)]/20">
            {caseStudyStack.map((row, i) => (
              <Reveal key={row.label} variants={fadeUp} delay={i * 0.04}>
                <div className="flex flex-col gap-1 border-b border-[var(--wiro-romance)]/20 py-6 sm:flex-row sm:items-baseline sm:gap-10">
                  <dt className="text-base tracking-[-0.03em] text-[var(--wiro-mauve)] sm:w-[200px] sm:shrink-0">
                    {row.label}
                  </dt>
                  <dd className="text-base leading-6 tracking-[-0.03em]">
                    {row.value}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </PageContainer>
      </PageSection>

      <PageSection className="bg-[var(--wiro-romance)] py-24 text-[var(--wiro-cod-gray)]">
        <PageContainer>
          <RevealGroup variants={staggerContainer(0.08, 0)}>
            <Reveal clip variants={clipUp}>
              <h2 className="text-h3">{caseStudyCta.headline[0]}</h2>
            </Reveal>
            <Reveal clip variants={clipUp}>
              <h2 className="text-h3 text-[var(--wiro-mauve)]">
                {caseStudyCta.headline[1]}
              </h2>
            </Reveal>
            <Reveal variants={fadeUp} className="mt-8 max-w-[620px]">
              <p className="text-[length:var(--wiro-body)] leading-[var(--wiro-body-lh)] tracking-[-0.03em]">
                {caseStudyCta.body}
              </p>
            </Reveal>
            <Reveal variants={fadeUp}>
              <Link
                href="/book"
                className="mt-10 inline-flex items-center justify-center rounded-full bg-[var(--wiro-mauve)] px-6 py-2.5 text-base tracking-[-0.03em] text-[var(--wiro-cod-gray)] transition-opacity hover:opacity-90"
              >
                {caseStudyCta.cta}
              </Link>
            </Reveal>
          </RevealGroup>
        </PageContainer>
      </PageSection>
    </>
  );
}
