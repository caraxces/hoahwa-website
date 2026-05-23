"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { motion } from "framer-motion";
import { caseStudies } from "@/content/case-studies";
import { ProjectCard } from "@/components/figma/ProjectCard";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import { PageContainer, PageSection } from "@/components/shared/PageContainer";
import { clipUp, fadeUp, staggerContainer } from "@/lib/motion";

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
              Our finest
            </h2>
          </Reveal>
          <Reveal clip variants={clipUp}>
            <h2
              className="text-h1 text-[var(--wiro-mauve)]"
              data-node-id="1:636"
            >
              Case Studies
            </h2>
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
            {caseStudies.map((item, i) => (
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
                  <ProjectCard project={item} />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Reveal>
    </PageSection>
  );
}
