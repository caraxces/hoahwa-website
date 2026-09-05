"use client";

import Link from "next/link";
import {
  aboutCta,
  aboutHero,
  aboutPrinciples,
  aboutStory,
} from "@/content/about";
import { TeamSection } from "@/components/shared/TeamSection";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import { PageContainer, PageSection } from "@/components/shared/PageContainer";
import { clipUp, fadeUp, staggerContainer } from "@/lib/motion";

export function AboutPageView() {
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
                {aboutHero.eyebrow}
              </p>
            </Reveal>
            <h1 className="mt-4 text-h1">
              <Reveal as="span" clip variants={clipUp} className="block">
                {aboutHero.headline[0]}
              </Reveal>
              <Reveal
                as="span"
                clip
                variants={clipUp}
                className="block text-[var(--wiro-mauve)]"
              >
                {aboutHero.headline[1]}
              </Reveal>
            </h1>
            <Reveal variants={fadeUp} className="mt-10 max-w-[760px]">
              <p className="text-[length:var(--wiro-body)] leading-[var(--wiro-body-lh)] tracking-[-0.03em] text-[var(--wiro-romance)]/75">
                {aboutHero.lead}
              </p>
            </Reveal>
          </RevealGroup>
        </PageContainer>
      </PageSection>

      <PageSection className="bg-[var(--wiro-spring-wood)] py-24 text-[var(--wiro-cod-gray)]">
        <PageContainer>
          <div className="flex flex-col gap-12 lg:flex-row lg:justify-between lg:gap-20">
            <Reveal clip variants={clipUp} className="lg:shrink-0">
              <h2 className="text-h3">{aboutStory.headline}</h2>
            </Reveal>
            <div className="flex max-w-[760px] flex-1 flex-col gap-6">
              {aboutStory.body.map((paragraph, i) => (
                <Reveal key={paragraph} variants={fadeUp} delay={i * 0.06}>
                  <p className="text-[length:var(--wiro-body)] leading-[var(--wiro-body-lh)] tracking-[-0.03em]">
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </PageContainer>
      </PageSection>

      <TeamSection />

      <PageSection
        padX={false}
        className="bg-[var(--wiro-black)] px-[var(--wiro-page-pad)] py-24 text-[var(--wiro-romance)]"
      >
        <PageContainer>
          <Reveal clip variants={clipUp}>
            <h2 className="text-h3">
              How we work<span className="text-[var(--wiro-mauve)]">.</span>
            </h2>
          </Reveal>
          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {aboutPrinciples.map((item, i) => (
              <Reveal key={item.num} variants={fadeUp} delay={i * 0.06}>
                <article className="h-full rounded-lg border border-[var(--wiro-romance)]/20 p-8 md:p-10">
                  <span className="text-base tracking-[-0.03em] text-[var(--wiro-mauve)]">
                    {item.num}
                  </span>
                  <h3 className="mt-5 text-[length:var(--wiro-h4)] tracking-[-0.04em]">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-base leading-6 tracking-[-0.03em] text-[var(--wiro-romance)]/75">
                    {item.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </PageContainer>
      </PageSection>

      <PageSection className="bg-[var(--wiro-romance)] py-24 text-[var(--wiro-cod-gray)]">
        <PageContainer>
          <RevealGroup variants={staggerContainer(0.08, 0)}>
            <Reveal clip variants={clipUp}>
              <h2 className="text-h3">{aboutCta.headline[0]}</h2>
            </Reveal>
            <Reveal clip variants={clipUp}>
              <h2 className="text-h3 text-[var(--wiro-mauve)]">
                {aboutCta.headline[1]}
              </h2>
            </Reveal>
            <Reveal variants={fadeUp} className="mt-8 max-w-[620px]">
              <p className="text-[length:var(--wiro-body)] leading-[var(--wiro-body-lh)] tracking-[-0.03em]">
                {aboutCta.body}
              </p>
            </Reveal>
            <Reveal variants={fadeUp}>
              <Link
                href="/book"
                className="mt-10 inline-flex items-center justify-center rounded-full bg-[var(--wiro-mauve)] px-6 py-2.5 text-base tracking-[-0.03em] text-[var(--wiro-cod-gray)] transition-opacity hover:opacity-90"
              >
                {aboutCta.cta}
              </Link>
            </Reveal>
          </RevealGroup>
        </PageContainer>
      </PageSection>
    </>
  );
}
