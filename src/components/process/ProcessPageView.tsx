import Link from "next/link";
import { processAfterLaunch, processHero, processPhases } from "@/content/process";
import { TeamSection } from "@/components/shared/TeamSection";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import { PageContainer, PageSection } from "@/components/shared/PageContainer";
import { clipUp, fadeUp, staggerContainer } from "@/lib/motion";

export function ProcessPageView() {
  return (
    <>
      <PageSection
        padX={false}
        className="bg-[var(--wiro-black)] px-[var(--wiro-page-pad)] pb-20 pt-[120px] text-[var(--wiro-romance)]"
      >
        <PageContainer>
          <Reveal variants={fadeUp}>
            <p className="text-[length:var(--wiro-body)] tracking-[-0.03em] text-[var(--wiro-mauve)]">
              {processHero.eyebrow}
            </p>
          </Reveal>

          <RevealGroup variants={staggerContainer(0.08, 0.05)} className="mt-4">
            <Reveal clip variants={clipUp}>
              <h1 className="text-h1">
                <span className="block">{processHero.headline[0]}</span>
                <span className="block text-[var(--wiro-mauve)]">{processHero.headline[1]}</span>
              </h1>
            </Reveal>
            <Reveal variants={fadeUp} className="mt-10 max-w-[820px]">
              <p className="text-[length:40px] leading-[44px] tracking-[-0.04em] text-[var(--wiro-romance)]/85">
                {processHero.lead}
              </p>
            </Reveal>
          </RevealGroup>

          <Reveal variants={fadeUp} className="mt-16">
            <Link
              href="/case-studies/shopify-developer"
              className="inline-flex items-center justify-center rounded-[20px] border border-[var(--wiro-romance)]/35 px-4 py-2.5 text-base tracking-[-0.03em] text-[var(--wiro-romance)] transition-colors hover:bg-[var(--wiro-romance)] hover:text-[var(--wiro-cod-gray)]"
            >
              Read the Shopify explainer case study
            </Link>
          </Reveal>
        </PageContainer>
      </PageSection>

      <PageSection className="bg-[var(--wiro-romance)] py-24 text-[var(--wiro-cod-gray)]">
        <PageContainer>
          <h2 className="text-h3">
            <span className="text-[var(--wiro-mauve)]">A 5‑phase</span>
            <span> delivery process</span>
          </h2>

          <div className="mt-16 grid gap-6">
            {processPhases.map((phase) => (
              <section
                key={phase.number}
                className="rounded-lg border border-[var(--wiro-cod-gray)]/15 bg-white/70 p-8 md:p-10"
              >
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm font-medium tracking-[-0.02em] text-[var(--wiro-mauve)]">
                      Phase {phase.number} <span className="text-[var(--wiro-cod-gray)]/50">· {phase.timeframe}</span>
                    </p>
                    <h3 className="mt-2 text-[length:var(--wiro-h4)] tracking-[-0.04em]">
                      {phase.title}
                    </h3>
                    <p className="mt-3 max-w-[760px] text-base leading-6 tracking-[-0.03em] text-[var(--wiro-cod-gray)]/70">
                      {phase.subtitle}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 md:justify-end">
                    {phase.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-[var(--wiro-cod-gray)]/15 bg-white/80 px-3 py-1 text-xs tracking-[-0.02em]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  {phase.deliverables.map((d) => (
                    <div
                      key={d.label}
                      className="rounded-lg border border-[var(--wiro-cod-gray)]/10 bg-white/80 p-5"
                    >
                      <p className="text-sm font-medium tracking-[-0.02em] text-[var(--wiro-cod-gray)]">
                        {d.label}
                      </p>
                      <p className="mt-2 text-sm leading-6 tracking-[-0.02em] text-[var(--wiro-cod-gray)]/70">
                        {d.value}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </PageContainer>
      </PageSection>

      <PageSection
        padX={false}
        className="bg-[var(--wiro-black)] px-[var(--wiro-page-pad)] py-24 text-[var(--wiro-romance)]"
      >
        <PageContainer>
          <RevealGroup variants={staggerContainer(0.08, 0.05)}>
            <Reveal variants={fadeUp}>
              <p className="text-[length:var(--wiro-body)] tracking-[-0.03em] text-[var(--wiro-mauve)]">
                {processAfterLaunch.eyebrow}
              </p>
            </Reveal>
            <Reveal clip variants={clipUp} className="mt-4">
              <h2 className="text-h1">
                <span className="block">{processAfterLaunch.headline[0]}</span>
                <span className="block text-[var(--wiro-mauve)]">{processAfterLaunch.headline[1]}</span>
              </h2>
            </Reveal>
          </RevealGroup>

          <div className="mt-16 grid gap-10 md:grid-cols-2">
            {processAfterLaunch.items.map((item) => (
              <div key={item.title} className="rounded-lg border border-white/15 p-8">
                <h3 className="text-[length:var(--wiro-h4)] tracking-[-0.04em]">
                  {item.title}
                </h3>
                <p className="mt-4 text-base leading-6 tracking-[-0.03em] text-[var(--wiro-romance)]/75">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </PageContainer>
      </PageSection>

      <TeamSection />
    </>
  );
}

