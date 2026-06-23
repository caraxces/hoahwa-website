import { aeoHero, aeoPlans } from "@/content/aeo";
import { ServicePlanCard } from "@/components/service/ServicePlanCard";
import { ShopifyPremierBadge } from "@/components/shared/ShopifyPremierBadge";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import { PageContainer, PageSection } from "@/components/shared/PageContainer";
import { clipUp, fadeUp, staggerContainer } from "@/lib/motion";

export function AeoHero() {
  return (
    <PageSection
      padX={false}
      className="bg-[var(--wiro-black)] px-[var(--wiro-page-pad)] pb-[121px] pt-[120px] text-[var(--wiro-romance)]"
    >
      <PageContainer>
        <RevealGroup className="relative w-full" variants={staggerContainer(0.08, 0)}>
          <Reveal clip variants={clipUp}>
            <h1 className="text-h1">{aeoHero.headline[0]}</h1>
          </Reveal>
          <Reveal variants={fadeUp} className="relative">
            <h1 className="text-h1 text-[var(--wiro-mauve)]">
              {aeoHero.headline[1]}
            </h1>
            <div className="absolute right-0 top-0 hidden lg:block">
              <ShopifyPremierBadge variant="light" size="lg" />
            </div>
          </Reveal>
        </RevealGroup>

        <RevealGroup
          className="mt-36 flex flex-col gap-10 lg:flex-row lg:justify-between"
          variants={staggerContainer(0.1, 0.05)}
        >
          <Reveal variants={fadeUp}>
            <p className="text-[length:var(--wiro-body)] leading-[var(--wiro-body-lh)] tracking-[-0.03em] text-[var(--wiro-mauve)]">
              {aeoHero.aboutLabel}
            </p>
          </Reveal>
          <Reveal variants={fadeUp} className="max-w-[867px] flex-1">
            <p className="text-[length:40px] leading-[44px] tracking-[-0.04em]">
              {aeoHero.aboutLead}
            </p>
            <p className="mt-11 text-[length:40px] leading-[44px] tracking-[-0.04em]">
              {aeoHero.aboutStat.split("+35%")[0]}
              <span className="text-[var(--wiro-chenin)]">+35%</span>
              {aeoHero.aboutStat.split("+35%")[1]}
            </p>
          </Reveal>
        </RevealGroup>

        <div className="mt-10 grid gap-6 pt-10 lg:grid-cols-3">
          {aeoPlans.map((plan) => (
            <ServicePlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </PageContainer>
    </PageSection>
  );
}
