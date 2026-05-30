import Link from "next/link";
import { growthPitch } from "@/content/home";
import { figmaAssets } from "@/content/figma-assets";
import { ShopifyPremierBadge } from "@/components/shared/ShopifyPremierBadge";
import { FlowerImageCard } from "@/components/motion/FlowerImageCard";
import { Reveal } from "@/components/motion/Reveal";
import { PageContainer, PageSection } from "@/components/shared/PageContainer";
import { fadeUp } from "@/lib/motion";

export function GrowthPitch() {
  return (
    <PageSection
      className="bg-[var(--wiro-romance)] pb-[121px] pt-20 text-[var(--wiro-cod-gray)]"
      data-node-id="1:887"
    >
      <PageContainer>
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
          <div className="flex max-w-[556px] flex-1 flex-col justify-center lg:pr-24">
            <Reveal variants={fadeUp}>
              <ShopifyPremierBadge className="mb-8" />
            </Reveal>
            <Reveal variants={fadeUp}>
              <h2 className="mb-10 text-[length:var(--wiro-h2)] leading-[var(--wiro-h2)] tracking-[-0.04em]">
                {growthPitch.headline.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h2>
            </Reveal>
            <Reveal variants={fadeUp}>
              <div className="mb-10 flex max-w-[556px] flex-col gap-6 text-base leading-6 tracking-[-0.03em]">
                {growthPitch.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </Reveal>
            <Reveal variants={fadeUp}>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-[20px] border border-[var(--wiro-cod-gray)] px-4 py-2.5 text-base tracking-[-0.03em] transition-colors hover:bg-[var(--wiro-cod-gray)] hover:text-[var(--wiro-romance)]"
              >
                {growthPitch.cta}
              </Link>
            </Reveal>
          </div>
          <Reveal
            variants={fadeUp}
            className="relative w-full overflow-visible lg:w-[660px] lg:shrink-0"
          >
            <FlowerImageCard
              src={figmaAssets.growthPitchImage}
              size="lg"
              className="rounded-[10px] [&_.flower-image-card__media]:rounded-[10px]"
            />
          </Reveal>
        </div>
      </PageContainer>
    </PageSection>
  );
}
