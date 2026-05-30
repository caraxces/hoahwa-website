"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { motion } from "framer-motion";
import { pursuitGoals, pursuitSection } from "@/content/pursuits";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import { PageContainer, PageSection } from "@/components/shared/PageContainer";
import { clipUp, fadeUp, staggerContainer } from "@/lib/motion";

function PursuitCard({
  title,
  description,
  tags,
}: {
  title: string;
  description: string;
  tags: string[];
}) {
  return (
    <article className="flex h-[420px] w-[420px] max-w-full shrink-0 flex-col justify-between rounded-lg border border-[var(--wiro-romance)]/20 bg-[var(--wiro-cod-gray)] p-8">
      <div>
        <h3 className="text-[length:var(--wiro-h4)] tracking-[-0.04em] text-[var(--wiro-romance)]">
          {title}
        </h3>
        <p className="mt-4 text-base leading-6 tracking-[-0.03em] text-[var(--wiro-romance)]/70">
          {description}
        </p>
      </div>
      <ul className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full border border-[var(--wiro-romance)]/25 px-3 py-1 text-xs tracking-[-0.02em] text-[var(--wiro-mauve)]"
          >
            {tag}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function CaseCarousel() {
  return (
    <PageSection
      className="bg-[var(--wiro-black)] pb-[200px] pt-[87px]"
      data-node-id="1:628"
    >
      <PageContainer className="mb-[152px]">
        <RevealGroup variants={staggerContainer(0.12, 0)}>
          <Reveal clip variants={clipUp}>
            <h2 className="text-h1 text-[var(--wiro-romance)]" data-node-id="1:633">
              {pursuitSection.headline[0]}
            </h2>
          </Reveal>
          <Reveal clip variants={clipUp}>
            <h2
              className="text-h1 text-[var(--wiro-mauve)]"
              data-node-id="1:636"
            >
              {pursuitSection.headline[1]}
            </h2>
          </Reveal>
          <Reveal variants={fadeUp} className="mt-10 max-w-[720px]">
            <p className="text-[length:var(--wiro-body)] leading-[var(--wiro-body-lh)] tracking-[-0.03em] text-[var(--wiro-romance)]/75">
              {pursuitSection.lead}
            </p>
          </Reveal>
        </RevealGroup>
      </PageContainer>

      <Reveal variants={fadeUp}>
        <div data-testid="case-carousel" className="pl-[var(--wiro-page-pad)]">
          <Swiper
            modules={[Navigation]}
            spaceBetween={26}
            slidesPerView="auto"
            navigation
            className="!pb-4"
          >
            {pursuitGoals.map((item, i) => (
              <SwiperSlide key={item.slug} className="!w-auto">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{
                    duration: 0.7,
                    delay: i * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <PursuitCard
                    title={item.title}
                    description={item.description}
                    tags={item.tags}
                  />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Reveal>
    </PageSection>
  );
}
