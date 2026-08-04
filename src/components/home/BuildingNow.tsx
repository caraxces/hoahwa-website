"use client";

import Link from "next/link";
import { buildingNow } from "@/content/home";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import { PageContainer, PageSection } from "@/components/shared/PageContainer";
import { clipUp, fadeUp, staggerContainer } from "@/lib/motion";

/**
 * Honest "where we are" section. Replaces the testimonials carousel that used
 * quotes and client names we could not stand behind.
 */
export function BuildingNow() {
  return (
    <PageSection className="bg-[var(--wiro-spring-wood)] pb-[160px] pt-[200px] text-[var(--wiro-cod-gray)]">
      <PageContainer>
        <RevealGroup variants={staggerContainer(0.1, 0)} className="mb-20">
          <Reveal variants={fadeUp}>
            <p className="text-[length:var(--wiro-body)] leading-[var(--wiro-body-lh)] tracking-[-0.03em] text-[var(--wiro-mauve)]">
              {buildingNow.eyebrow}
            </p>
          </Reveal>
          <Reveal clip variants={clipUp}>
            <h2 className="mt-6 text-h1">{buildingNow.headline[0]}</h2>
          </Reveal>
          <Reveal clip variants={clipUp}>
            <h2 className="text-h1 text-[var(--wiro-mauve)]">
              {buildingNow.headline[1]}
            </h2>
          </Reveal>
          <Reveal variants={fadeUp} className="mt-10 max-w-[720px]">
            <p className="text-[length:var(--wiro-body)] leading-[var(--wiro-body-lh)] tracking-[-0.03em] text-[var(--wiro-cod-gray)]/75">
              {buildingNow.lead}
            </p>
          </Reveal>
        </RevealGroup>

        <div className="grid gap-6 md:grid-cols-2">
          {buildingNow.items.map((item, i) => (
            <Reveal key={item.num} variants={fadeUp} delay={i * 0.06}>
              <article className="flex h-full flex-col justify-between rounded-lg bg-[var(--wiro-romance)] p-10 md:p-12">
                <div>
                  <span className="text-[length:var(--wiro-body)] tracking-[-0.03em] text-[var(--wiro-mauve)]">
                    {item.num}
                  </span>
                  <h3 className="mt-6 text-[length:var(--wiro-h4)] leading-tight tracking-[-0.04em]">
                    {item.title}
                  </h3>
                  <p className="mt-5 text-base leading-6 tracking-[-0.03em] text-[var(--wiro-cod-gray)]/75">
                    {item.body}
                  </p>
                </div>
                <Link
                  href={item.href}
                  className="mt-10 inline-flex w-fit items-center justify-center rounded-full border border-[var(--wiro-cod-gray)]/30 px-4 py-2.5 text-base tracking-[-0.03em] transition-colors hover:bg-[var(--wiro-cod-gray)] hover:text-[var(--wiro-romance)]"
                >
                  {item.linkLabel}
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </PageContainer>
    </PageSection>
  );
}
