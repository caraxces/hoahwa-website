"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { LatestCaseBadge } from "@/components/figma/LatestCaseBadge";
import { LogoMarquee } from "@/components/figma/LogoMarquee";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import { PageContainer, PageSection } from "@/components/shared/PageContainer";
import { awardLogos, figmaAssets } from "@/content/figma-assets";
import {
  clipUp,
  fadeUp,
  scaleIn,
  slideFromRight,
  staggerContainer,
  fadeIn,
} from "@/lib/motion";

export function Hero() {
  return (
    <PageSection
      className="bg-[var(--wiro-black)] pb-[121px] pt-[120px]"
      data-node-id="1:441"
    >
      <PageContainer>
        <RevealGroup
          className="flex flex-col gap-8"
          variants={staggerContainer(0.12, 0.08)}
        >
          <motion.div variants={fadeUp}>
            <LatestCaseBadge />
          </motion.div>

          <div className="relative w-full" data-node-id="1:451">
            <Reveal clip variants={clipUp} className="block">
              <div className="text-h1 text-[var(--wiro-romance)]" data-node-id="1:454">
                eCommerce
              </div>
            </Reveal>

            <div
              className="mt-0 flex flex-wrap items-center gap-5 md:gap-8"
              data-node-id="1:457"
            >
              <Reveal variants={scaleIn} className="relative h-[88px] w-[300px] shrink-0 overflow-hidden rounded-lg">
                <motion.div
                  className="relative h-full w-full"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Image
                    src={figmaAssets.heroGrowthInline}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="300px"
                    priority
                  />
                </motion.div>
              </Reveal>
              <Reveal clip variants={clipUp} className="block">
                <span
                  className="text-h1 text-[var(--wiro-mauve)]"
                  data-node-id="1:461"
                >
                  Growth
                </span>
              </Reveal>
            </div>

            <div className="flex items-end justify-between gap-6">
              <Reveal clip variants={clipUp} className="block">
                <span
                  className="text-h1 text-[var(--wiro-romance)]"
                  data-node-id="1:464"
                >
                  Specialists
                </span>
              </Reveal>
              <Reveal variants={slideFromRight} className="hidden md:block">
                <div
                  className="shrink-0 text-right text-xs leading-tight text-[var(--wiro-romance)]"
                  data-node-id="1:465"
                >
                  <span className="mb-1 block text-[10px] opacity-80">SHOPIFY</span>
                  <span className="block font-medium">PREMIER</span>
                  <span className="block font-medium">PARTNER</span>
                </div>
              </Reveal>
            </div>
          </div>

          <Reveal variants={scaleIn}>
            <motion.div
              className="relative mt-4 aspect-[1312/640] w-full overflow-hidden rounded-lg"
              data-node-id="1:490"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src={figmaAssets.heroVideoPoster}
                alt="Showreel"
                fill
                className="object-cover"
                sizes="(max-width: 1360px) 100vw, 1312px"
                priority
              />
              <motion.div
                className="pointer-events-none absolute inset-0 bg-black/20"
                initial={{ opacity: 0.4 }}
                whileHover={{ opacity: 0.15 }}
                transition={{ duration: 0.4 }}
              />
            </motion.div>
          </Reveal>

          <motion.div variants={fadeIn}>
            <LogoMarquee
              logos={awardLogos.map((a) => ({
                src: a.src,
                alt: a.alt,
                width: a.w,
              }))}
              fadeFrom="black"
              testId="hero-awards-marquee"
            />
          </motion.div>
        </RevealGroup>
      </PageContainer>
    </PageSection>
  );
}
