import { veHero } from "@/content/video-editor";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import { PageSection } from "@/components/shared/PageContainer";
import { clipUp, staggerContainer } from "@/lib/motion";
import { VeArrowMark } from "./VeArrowMark";

/**
 * Artboard hero — a 742×390 framed panel centred in the viewport with design
 * tool corner handles and guide lines running behind it. The guides sit at 50%
 * so they stay aligned to the board's centre whatever the section height is.
 */
export function VeHero() {
  return (
    <PageSection
      padX={false}
      className="relative grid min-h-[820px] place-items-center overflow-hidden px-[var(--wiro-page-pad)] py-20"
    >
      <span className="ve-guide ve-guide--v" aria-hidden />
      <span className="ve-guide ve-guide--h" aria-hidden />

      <div className="ve-board p-[30px] max-md:p-6">
        <span className="ve-board__dot ve-board__dot--tl" aria-hidden />
        <span className="ve-board__dot ve-board__dot--tr" aria-hidden />
        <span className="ve-board__dot ve-board__dot--bl" aria-hidden />
        <span className="ve-board__dot ve-board__dot--br" aria-hidden />

        <p className="text-[11px] font-medium uppercase tracking-[-0.11px]">
          {veHero.eyebrow}
        </p>

        <RevealGroup
          className="mt-1.5 w-[651px] max-w-full"
          variants={staggerContainer(0.08, 0)}
        >
          {veHero.headline.map((line) => (
            <Reveal key={line} clip variants={clipUp}>
              <h1 className="text-[54.6px] font-semibold uppercase leading-[44.8px] tracking-[-2.73px] max-lg:text-[40px] max-lg:leading-9 max-lg:tracking-[-1.8px] max-sm:text-[32px] max-sm:leading-[30px] max-sm:tracking-[-1.3px]">
                {line}
              </h1>
            </Reveal>
          ))}
        </RevealGroup>

        <p className="mt-6 w-[300px] max-w-full text-[12px] font-medium leading-[15.6px] tracking-[-0.12px] lg:absolute lg:left-[30px] lg:top-[169px] lg:mt-0">
          {veHero.lead}
        </p>

        <VeArrowMark className="ml-auto mt-6 h-24 w-24 text-[var(--ve-accent)] lg:absolute lg:right-[30px] lg:top-[86px] lg:mt-0 lg:h-[190px] lg:w-[190px]" />

        <p className="mt-5 flex flex-col gap-1 text-[18px] font-semibold uppercase tracking-[-0.36px] lg:absolute lg:bottom-[30px] lg:left-[30px] lg:mt-0 lg:flex-row lg:items-center lg:gap-[22px]">
          {veHero.tags.map((tag, i) => (
            <span key={tag} className="lg:flex lg:items-center lg:gap-[22px]">
              {tag}
              {i < veHero.tags.length - 1 ? (
                <i className="hidden not-italic text-[var(--ve-ink)]/35 lg:inline">
                  /
                </i>
              ) : null}
            </span>
          ))}
        </p>
      </div>
    </PageSection>
  );
}
