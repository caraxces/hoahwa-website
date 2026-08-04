import {
  growthContact,
  growthFaqs,
  growthHero,
  growthPlans,
} from "@/content/growth";
import { figmaAssets } from "@/content/figma-assets";
import { GrowthWhySection } from "@/components/growth/GrowthWhySection";
import { CaseCarousel } from "@/components/home/CaseCarousel";
import { GrowthPitch } from "@/components/home/GrowthPitch";
import { BuildingNow } from "@/components/home/BuildingNow";
import { ServiceFaqContact } from "@/components/service/ServiceFaqContact";
import { ServiceHero } from "@/components/service/ServiceHero";

export function GrowthPageView() {
  return (
    <div data-name="div.page-wrap-color-change">
      <ServiceHero
        headline={[growthHero.headline[0], growthHero.headline[1]]}
        aboutLabel={growthHero.aboutLabel}
        aboutBody={growthHero.aboutBody}
        plans={growthPlans}
        heroImage={figmaAssets.growthPitchImage}
      />
      <GrowthWhySection />
      <CaseCarousel />
      <GrowthPitch />
      <BuildingNow />
      <ServiceFaqContact
        faqs={growthFaqs}
        contactTitle={growthContact.title}
        contactServices={growthContact.services}
      />
    </div>
  );
}
