"use client";

import { LogoMarquee } from "@/components/figma/LogoMarquee";
import { AboutIntro } from "@/components/home/AboutIntro";
import { AboutScrollFrame } from "@/components/home/AboutScrollFrame";
import { Reveal } from "@/components/motion/Reveal";
import { PageContainer, PageSection } from "@/components/shared/PageContainer";
import { figmaAssets } from "@/content/figma-assets";
import { fadeUp } from "@/lib/motion";

const clientLogos = [
  { src: figmaAssets.awardUkEcom, alt: "WatchHouse", width: 200 },
  { src: figmaAssets.awardEuropean, alt: "Sisters and Seekers", width: 170 },
  { src: figmaAssets.awardUkEcom, alt: "Brother and Kin", width: 170 },
  { src: figmaAssets.awardEuropean, alt: "Kick Game", width: 160 },
  { src: figmaAssets.awardUkEcom, alt: "Duke + Dexter", width: 200 },
  { src: figmaAssets.awardEuropean, alt: "Swyft", width: 110 },
  { src: figmaAssets.awardUkEcom, alt: "Secret Linen", width: 190 },
];

export function AboutSection() {
  return (
    <PageSection className="bg-[var(--wiro-romance)] py-20" data-node-id="1:528">
      <PageContainer>
        <div className="relative z-20 mb-10" data-about-intro>
          <AboutIntro />
        </div>

        <AboutScrollFrame />

        <Reveal variants={fadeUp}>
          <LogoMarquee
            logos={clientLogos}
            fadeFrom="romance"
            className="mt-[113px] h-[139px]"
            testId="client-logos-marquee"
          />
        </Reveal>
        <div id="frame-sequence-end" className="h-px w-full" aria-hidden />
      </PageContainer>
    </PageSection>
  );
}
