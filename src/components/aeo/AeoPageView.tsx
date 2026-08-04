import { AeoHero } from "@/components/aeo/AeoHero";
import { AeoWhySection } from "@/components/aeo/AeoWhySection";
import { aeoContactServices, aeoFaqs } from "@/content/aeo";
import { CaseCarousel } from "@/components/home/CaseCarousel";
import { GrowthPitch } from "@/components/home/GrowthPitch";
import { BuildingNow } from "@/components/home/BuildingNow";
import { ServiceFaqContact } from "@/components/service/ServiceFaqContact";

export function AeoPageView() {
  return (
    <div data-name="div.page-wrap-color-change">
      <AeoHero />
      <AeoWhySection />
      <CaseCarousel />
      <GrowthPitch />
      <BuildingNow />
      <ServiceFaqContact
        faqs={aeoFaqs}
        contactTitle={["Lets Talk", "AI Search"]}
        contactServices={[...aeoContactServices]}
      />
    </div>
  );
}
