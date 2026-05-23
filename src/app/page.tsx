import { Hero } from "@/components/home/Hero";
import { AboutSection } from "@/components/home/AboutSection";
import { CaseCarousel } from "@/components/home/CaseCarousel";
import { GrowthPitch } from "@/components/home/GrowthPitch";
import { ServicesAccordion } from "@/components/home/ServicesAccordion";
import { Testimonials } from "@/components/home/Testimonials";
import { BlogTeaser } from "@/components/home/BlogTeaser";
import { NewsletterCta } from "@/components/home/NewsletterCta";

export default function HomePage() {
  return (
    <div data-name="div.page-wrap-color-change">
      <Hero />
      <AboutSection />
      <CaseCarousel />
      <GrowthPitch />
      <ServicesAccordion />
      <Testimonials />
      <BlogTeaser />
      <NewsletterCta />
    </div>
  );
}
