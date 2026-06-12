"use client";

import { motion } from "framer-motion";
import { ScrubText } from "@/components/figma/ScrubText";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import { PageContainer } from "@/components/shared/PageContainer";
import { fadeUp, staggerContainer } from "@/lib/motion";

export function AboutIntro() {
  return (
    <PageContainer>
      <RevealGroup
        className="flex flex-col gap-10 lg:flex-row lg:justify-between"
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
    </PageContainer>
  );
}
