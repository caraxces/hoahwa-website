"use client";

import { motion } from "framer-motion";
import { LatestCaseBadge } from "@/components/figma/LatestCaseBadge";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import { FlowerImageFill } from "@/components/motion/FlowerImageFill";
import { PageContainer, PageSection } from "@/components/shared/PageContainer";
import { ShopifyPremierBadge } from "@/components/shared/ShopifyPremierBadge";
import { FlowerImageCard } from "@/components/motion/FlowerImageCard";
import { figmaAssets } from "@/content/figma-assets";
import {
  clipUp,
  fadeUp,
  scaleIn,
  slideFromRight,
  staggerContainer,
} from "@/lib/motion";

export function Hero() {
  return (
    <PageSection
      className="overflow-x-clip bg-[var(--wiro-black)] pb-[121px] pt-[120px]"
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
              className="relative z-10 mt-0 flex flex-wrap items-center gap-5 overflow-visible md:gap-8"
              data-node-id="1:457"
            >
              <Reveal variants={scaleIn} className="relative z-40 overflow-visible">
                <FlowerImageCard
                  src={figmaAssets.heroGrowthInline}
                  sizes="300px"
                  priority
                  overlapText
                />
              </Reveal>
              <Reveal clip variants={clipUp} className="relative z-0 block">
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
              <Reveal
                variants={slideFromRight}
                className="hidden shrink-0 md:block"
                data-node-id="1:465"
              >
                <ShopifyPremierBadge variant="light" size="lg" />
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
              <FlowerImageFill
                src={figmaAssets.heroVideoPoster}
                alt="Showreel"
                sizes="(max-width: 1360px) 100vw, 1312px"
                priority
                wrapperClassName="absolute inset-0"
                overlayClassName="!text-[18px]"
              />
              <motion.div
                className="pointer-events-none absolute inset-0 bg-black/20"
                initial={{ opacity: 0.4 }}
                whileHover={{ opacity: 0.15 }}
                transition={{ duration: 0.4 }}
              />
            </motion.div>
          </Reveal>
        </RevealGroup>
      </PageContainer>
    </PageSection>
  );
}
