"use client";

import { motion } from "framer-motion";
import { LogoMarquee } from "@/components/figma/LogoMarquee";
import { ScrubText } from "@/components/figma/ScrubText";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import { PageContainer, PageSection } from "@/components/shared/PageContainer";
import { figmaAssets } from "@/content/figma-assets";
import { fadeUp, staggerContainer } from "@/lib/motion";

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
    <PageSection
      className="bg-[var(--wiro-romance)] py-20"
      data-node-id="1:528"
    >
      <PageContainer>
        <RevealGroup
          className="mb-[113px] flex flex-col gap-10 lg:flex-row lg:justify-between"
          variants={staggerContainer(0.1, 0.05)}
        >
          <Reveal variants={fadeUp}>
            <p
              className="shrink-0 text-[length:var(--wiro-body)] leading-[var(--wiro-body-lh)] tracking-[-0.03em] text-[var(--wiro-mauve)]"
              data-node-id="1:532"
            >
              About us
            </p>
          </Reveal>
          <motion.div variants={fadeUp} className="min-w-0 flex-1">
            <ScrubText />
          </motion.div>
        </RevealGroup>
        <Reveal variants={fadeUp}>
          <LogoMarquee
            logos={clientLogos}
            fadeFrom="romance"
            className="h-[139px]"
            testId="client-logos-marquee"
          />
        </Reveal>
      </PageContainer>
    </PageSection>
  );
}
