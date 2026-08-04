import { AuditFaqContact } from "@/components/audits/AuditFaqContact";
import { AuditHero } from "@/components/audits/AuditHero";
import { AuditWhySection } from "@/components/audits/AuditWhySection";
import { CaseCarousel } from "@/components/home/CaseCarousel";
import { GrowthPitch } from "@/components/home/GrowthPitch";
import { BuildingNow } from "@/components/home/BuildingNow";

export function AuditsPageView() {
  return (
    <div data-name="div.page-wrap-color-change">
      <AuditHero />
      <AuditWhySection />
      <CaseCarousel />
      <GrowthPitch />
      <BuildingNow />
      <AuditFaqContact />
    </div>
  );
}
