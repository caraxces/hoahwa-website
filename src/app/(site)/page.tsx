import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { AboutSection } from "@/components/home/AboutSection";
import { CaseCarousel } from "@/components/home/CaseCarousel";
import { GrowthPitch } from "@/components/home/GrowthPitch";
import { ServicesAccordion } from "@/components/home/ServicesAccordion";
import { BuildingNow } from "@/components/home/BuildingNow";
import { NewsletterCta } from "@/components/home/NewsletterCta";
import { pageMetadata } from "@/lib/seo";

const HOME_TITLE = "Hoahwa | Shopify Web Design & Development Studio";

export const metadata: Metadata = {
  ...pageMetadata({
    title: HOME_TITLE,
    description:
      "Boutique studio building high-performance Shopify storefronts, CRO audits and growth retainers. Fixed scope, fixed price, direct access to the people who design and build.",
    path: "/",
  }),
  // Bypass the "%s | Hoahwa" template so the brand is not repeated.
  title: { absolute: HOME_TITLE },
};

export default function HomePage() {
  return (
    <div data-name="div.page-wrap-color-change">
      <Hero />
      <AboutSection />
      <CaseCarousel />
      <GrowthPitch />
      <ServicesAccordion />
      {/* VideoTeaser hidden until /video-editor has real English copy (still placeholder, noindex). */}
      <BuildingNow />
      <NewsletterCta />
    </div>
  );
}
