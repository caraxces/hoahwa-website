"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getRelatedLinks } from "@/content/related";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import { PageContainer, PageSection } from "@/components/shared/PageContainer";
import { RelatedReading } from "@/components/shared/RelatedReading";
import { clipUp, fadeUp, staggerContainer } from "@/lib/motion";

export type CaseStudyContent = {
  meta: {
    eyebrow: string;
    headline: readonly [string, string];
    lead: string;
    measured: string;
  };
  stats: ReadonlyArray<{ value: string; label: string }>;
  chapters: ReadonlyArray<{ num: string; title: string; body: readonly string[] }>;
  stack: ReadonlyArray<{ label: string; value: string }>;
  /** Optional screenshots, rendered between the chapters and the stack. */
  gallery?: ReadonlyArray<{
    src: string;
    alt: string;
    width: number;
    height: number;
    caption: string;
  }>;
  /** Optional link to a live artefact (demo, store) — plain anchor, real page load. */
  demo?: { href: string; label: string; note: string };
  cta: { headline: readonly [string, string]; body: string; cta: string };
};

/**
 * Shared page shell for long-form case studies: dark hero with measured stats,
 * numbered chapters on the warm surface, optional gallery + demo link, the
 * stack list, and the closing CTA. Content is data; each case study supplies
 * its own file under `content/`.
 */
export function CaseStudyLayout({ content }: { content: CaseStudyContent }) {
  const { meta, stats, chapters, stack, gallery, demo, cta } = content;
  const pathname = usePathname();
  const related = getRelatedLinks(pathname);

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
                {meta.eyebrow}
              </p>
            </Reveal>
            <Reveal clip variants={clipUp}>
              <h1 className="mt-4 text-h1">
                {meta.headline[0]}
                <span className="block text-[var(--wiro-mauve)]">
                  {meta.headline[1]}
                </span>
              </h1>
            </Reveal>
            <Reveal variants={fadeUp} className="mt-10 max-w-[860px]">
              <p className="text-[length:var(--wiro-body)] leading-[var(--wiro-body-lh)] tracking-[-0.03em] text-[var(--wiro-romance)]/80">
                {meta.lead}
              </p>
            </Reveal>
          </RevealGroup>

          <div className="mt-20 grid grid-cols-2 gap-8 border-t border-[var(--wiro-romance)]/20 pt-12 lg:grid-cols-4">
            {stats.map((stat, i) => (
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
              {meta.measured}
            </p>
          </Reveal>
        </PageContainer>
      </PageSection>

      <PageSection className="bg-[var(--wiro-spring-wood)] py-24 text-[var(--wiro-cod-gray)]">
        <PageContainer>
          <div className="flex flex-col gap-20">
            {chapters.map((chapter) => (
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

      {gallery?.length || demo ? (
        <PageSection className="bg-[var(--wiro-romance)] py-24 text-[var(--wiro-cod-gray)]">
          <PageContainer>
            <Reveal clip variants={clipUp}>
              <h2 className="text-h3">
                The work<span className="text-[var(--wiro-mauve)]">.</span>
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              {gallery?.map((shot, i) => (
                <Reveal
                  key={shot.src}
                  variants={fadeUp}
                  delay={i * 0.05}
                  className={i === 0 ? "md:col-span-2" : undefined}
                >
                  <figure>
                    <Image
                      src={shot.src}
                      alt={shot.alt}
                      width={shot.width}
                      height={shot.height}
                      sizes={i === 0 ? "(max-width: 1360px) 100vw, 1312px" : "(max-width: 768px) 100vw, 640px"}
                      loading="lazy"
                      className="h-auto w-full rounded-lg border border-[var(--wiro-cod-gray)]/10"
                    />
                    <figcaption className="mt-3 text-sm leading-5 tracking-[-0.02em] text-[var(--wiro-cod-gray)]/70">
                      {shot.caption}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
            {demo ? (
              <Reveal variants={fadeUp} className={`${gallery?.length ? "mt-12" : "mt-8"} flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6`}>
                {/* Static microsite, not a Next.js route — plain anchor forces a real page load */}
                <a
                  href={demo.href}
                  className="inline-flex w-fit items-center justify-center rounded-full border border-[var(--wiro-cod-gray)]/30 px-5 py-2.5 text-base tracking-[-0.03em] transition-colors hover:bg-[var(--wiro-cod-gray)] hover:text-[var(--wiro-romance)]"
                >
                  {demo.label} →
                </a>
                <p className="text-sm leading-5 tracking-[-0.02em] text-[var(--wiro-cod-gray)]/60">
                  {demo.note}
                </p>
              </Reveal>
            ) : null}
          </PageContainer>
        </PageSection>
      ) : null}

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
            {stack.map((row, i) => (
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

      {related.length > 0 ? (
        <PageSection className="bg-[var(--wiro-spring-wood)] py-24 text-[var(--wiro-cod-gray)]">
          <PageContainer>
            <RelatedReading links={related} />
          </PageContainer>
        </PageSection>
      ) : null}

      <PageSection className="bg-[var(--wiro-romance)] py-24 text-[var(--wiro-cod-gray)]">
        <PageContainer>
          <RevealGroup variants={staggerContainer(0.08, 0)}>
            <Reveal clip variants={clipUp}>
              <h2 className="text-h3">
                {cta.headline[0]}
                <span className="block text-[var(--wiro-mauve)]">{cta.headline[1]}</span>
              </h2>
            </Reveal>
            <Reveal variants={fadeUp} className="mt-8 max-w-[620px]">
              <p className="text-[length:var(--wiro-body)] leading-[var(--wiro-body-lh)] tracking-[-0.03em]">
                {cta.body}
              </p>
            </Reveal>
            <Reveal variants={fadeUp}>
              <Link
                href="/book"
                className="mt-10 inline-flex items-center justify-center rounded-full bg-[var(--wiro-mauve)] px-6 py-2.5 text-base tracking-[-0.03em] text-[var(--wiro-cod-gray)] transition-opacity hover:opacity-90"
              >
                {cta.cta}
              </Link>
            </Reveal>
          </RevealGroup>
        </PageContainer>
      </PageSection>
    </>
  );
}
