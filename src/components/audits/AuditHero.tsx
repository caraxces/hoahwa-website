import Image from "next/image";
import { auditHero, auditPlans } from "@/content/audits";
import { figmaAssets } from "@/content/figma-assets";
import { AuditPlanCard } from "@/components/audits/AuditPlanCard";
import { LatestCaseBadge } from "@/components/figma/LatestCaseBadge";
import { ShopifyPremierBadge } from "@/components/shared/ShopifyPremierBadge";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import { PageContainer, PageSection } from "@/components/shared/PageContainer";
import { clipUp, fadeUp, staggerContainer } from "@/lib/motion";

export function AuditHero() {
  return (
    <PageSection
      padX={false}
      className="bg-[var(--wiro-black)] px-[var(--wiro-page-pad)] pb-[121px] pt-[120px] text-[var(--wiro-romance)]"
      data-node-id="3:5094"
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
            <h1 className="text-h1">{auditHero.headline[0]}</h1>
          </Reveal>
          <Reveal variants={fadeUp} className="mt-0 flex flex-wrap items-center gap-5">
            <div className="relative h-[88px] w-[300px] shrink-0 overflow-hidden rounded-lg">
              <Image
                src={figmaAssets.growthPitchImage}
                alt=""
                fill
                className="object-cover"
                sizes="300px"
                priority
              />
            </div>
            <h1 className="text-h1 text-[var(--wiro-mauve)]">{auditHero.headline[1]}</h1>
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
              {auditHero.aboutLabel}
            </p>
          </Reveal>
          <Reveal variants={fadeUp} className="max-w-[867px] flex-1">
            <p className="text-[length:40px] leading-[44px] tracking-[-0.04em]">
              {auditHero.aboutLead[0]}
            </p>
            <p className="mt-11 text-[length:40px] leading-[44px] tracking-[-0.04em]">
              {auditHero.aboutRoi.split("+2,600%")[0]}
              <span className="text-[var(--wiro-chenin)]">+2,600%</span>
              {auditHero.aboutRoi.split("+2,600%")[1]}
            </p>
          </Reveal>
        </RevealGroup>

        <div className="mt-10 grid gap-6 pt-10 lg:grid-cols-3">
          {auditPlans.map((plan) => (
            <AuditPlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </PageContainer>
    </PageSection>
  );
}
