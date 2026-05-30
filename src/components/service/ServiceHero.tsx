import type { ServicePlan } from "@/content/service";
import { figmaAssets } from "@/content/figma-assets";
import { ServicePlanCard } from "@/components/service/ServicePlanCard";
import { LatestCaseBadge } from "@/components/figma/LatestCaseBadge";
import { ShopifyPremierBadge } from "@/components/shared/ShopifyPremierBadge";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import { PageContainer, PageSection } from "@/components/shared/PageContainer";
import { clipUp, fadeUp, staggerContainer } from "@/lib/motion";
import { FlowerImageCard } from "@/components/motion/FlowerImageCard";

type ServiceHeroProps = {
  headline: [string, string];
  aboutLabel: string;
  aboutBody: string;
  aboutHighlight?: { text: string; className?: string };
  heroImage?: string;
  plans: ServicePlan[];
  nodeId?: string;
};

export function ServiceHero({
  headline,
  aboutLabel,
  aboutBody,
  aboutHighlight,
  heroImage = figmaAssets.buildHeroImage,
  plans,
  nodeId,
}: ServiceHeroProps) {
  return (
    <PageSection
      padX={false}
      className="bg-[var(--wiro-black)] px-[var(--wiro-page-pad)] pb-[121px] pt-[120px] text-[var(--wiro-romance)]"
      data-node-id={nodeId}
    >
      <PageContainer>
        <Reveal variants={fadeUp}>
          <LatestCaseBadge />
        </Reveal>

        <RevealGroup
          className="relative mt-8 w-full"
          variants={staggerContainer(0.08, 0)}
        >
          <Reveal clip variants={clipUp}>
            <h1 className="text-h1">{headline[0]}</h1>
          </Reveal>
          <Reveal
            variants={fadeUp}
            className="relative z-10 mt-0 flex flex-wrap items-center gap-5 overflow-visible"
          >
            <FlowerImageCard
              src={heroImage}
              sizes="300px"
              priority
              overlapText
            />
            <h1 className="relative z-0 text-h1 text-[var(--wiro-mauve)]">
              {headline[1]}
            </h1>
          </Reveal>
          <div className="absolute right-0 top-[65%] hidden lg:block">
            <ShopifyPremierBadge variant="light" size="lg" />
          </div>
        </RevealGroup>

        <RevealGroup
          className="mt-36 flex flex-col gap-10 lg:flex-row lg:justify-between"
          variants={staggerContainer(0.1, 0.05)}
        >
          <Reveal variants={fadeUp}>
            <p className="text-[length:var(--wiro-body)] leading-[var(--wiro-body-lh)] tracking-[-0.03em] text-[var(--wiro-mauve)]">
              {aboutLabel}
            </p>
          </Reveal>
          <Reveal variants={fadeUp} className="max-w-[867px] flex-1">
            {aboutHighlight ? (
              <p className="text-[length:40px] leading-[44px] tracking-[-0.04em]">
                {aboutBody.split(aboutHighlight.text)[0]}
                <span className={aboutHighlight.className}>{aboutHighlight.text}</span>
                {aboutBody.split(aboutHighlight.text)[1]}
              </p>
            ) : (
              <p className="text-[length:40px] leading-[44px] tracking-[-0.04em]">
                {aboutBody}
              </p>
            )}
          </Reveal>
        </RevealGroup>

        <div className="mt-10 grid gap-6 pt-10 lg:grid-cols-3">
          {plans.map((plan) => (
            <ServicePlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </PageContainer>
    </PageSection>
  );
}
