import {
  buildContact,
  buildFaqs,
  buildHero,
  buildPlans,
} from "@/content/build";
import { BuildWhySection } from "@/components/build/BuildWhySection";
import { CaseCarousel } from "@/components/home/CaseCarousel";
import { GrowthPitch } from "@/components/home/GrowthPitch";
import { Testimonials } from "@/components/home/Testimonials";
import { ServiceFaqContact } from "@/components/service/ServiceFaqContact";
import { ServiceHero } from "@/components/service/ServiceHero";

export function BuildPageView() {
  return (
    <div data-name="div.page-wrap-color-change">
      <ServiceHero
        headline={[buildHero.headline[0], buildHero.headline[1]]}
        aboutLabel={buildHero.aboutLabel}
        aboutBody={buildHero.aboutBody}
        plans={buildPlans}
        nodeId="3:10471"
      />
      <BuildWhySection />
      <CaseCarousel />
      <GrowthPitch />
      <Testimonials />
      <ServiceFaqContact
        faqs={buildFaqs}
        contactTitle={buildContact.title}
        contactServices={buildContact.services}
        nodeId="3:11106"
      />
    </div>
  );
}
