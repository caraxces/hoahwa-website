import { aeoWhy } from "@/content/aeo";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import { PageContainer, PageSection } from "@/components/shared/PageContainer";
import { fadeUp, staggerContainer } from "@/lib/motion";

export function AeoWhySection() {
  return (
    <PageSection
      padX={false}
      className="bg-[var(--wiro-romance)] px-[var(--wiro-page-pad)] py-28 text-[var(--wiro-cod-gray)]"
    >
      <PageContainer>
        <RevealGroup
          className="flex flex-col gap-10 lg:flex-row lg:justify-between"
          variants={staggerContainer(0.1, 0.05)}
        >
          <Reveal variants={fadeUp}>
            <p className="text-[length:var(--wiro-body)] leading-[var(--wiro-body-lh)] tracking-[-0.03em] opacity-60">
              {aeoWhy.label}
            </p>
          </Reveal>
          <div className="max-w-[867px] flex-1">
            <Reveal variants={fadeUp}>
              <h2 className="text-[length:var(--wiro-h2)] leading-[var(--wiro-h2)] tracking-[-0.04em]">
                {aeoWhy.headline[0]}{" "}
                <span className="text-[var(--wiro-mauve)]">
                  {aeoWhy.headline[1]}
                </span>
              </h2>
            </Reveal>
            {aeoWhy.body.map((paragraph) => (
              <Reveal key={paragraph.slice(0, 24)} variants={fadeUp}>
                <p className="mt-8 text-[length:var(--wiro-body)] leading-[var(--wiro-body-lh)] tracking-[-0.03em] opacity-80">
                  {paragraph}
                </p>
              </Reveal>
            ))}
          </div>
        </RevealGroup>

        <RevealGroup
          className="mt-24 flex flex-col gap-10 lg:flex-row lg:justify-between"
          variants={staggerContainer(0.1, 0.05)}
        >
          <Reveal variants={fadeUp} className="max-w-[420px]">
            <h2 className="text-[length:var(--wiro-h2)] leading-[var(--wiro-h2)] tracking-[-0.04em]">
              {aeoWhy.pointsHeadline[0]}{" "}
              <span className="text-[var(--wiro-mauve)]">
                {aeoWhy.pointsHeadline[1]}
              </span>
            </h2>
          </Reveal>
          <Reveal variants={fadeUp} className="max-w-[867px] flex-1">
            <p className="text-[length:40px] leading-[44px] tracking-[-0.04em]">
              {aeoWhy.pointsBody}
            </p>
          </Reveal>
        </RevealGroup>
      </PageContainer>
    </PageSection>
  );
}
