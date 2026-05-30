"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { testimonials } from "@/content/home";
import { figmaAssets } from "@/content/figma-assets";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import { FlowersOverlay } from "@/components/motion/FlowersOverlay";
import { PageContainer, PageSection } from "@/components/shared/PageContainer";
import { clipUp, fadeUp, staggerContainer } from "@/lib/motion";

export function Testimonials() {
  return (
    <PageSection
      padX={false}
      className="overflow-hidden bg-[var(--wiro-spring-wood)] px-[var(--wiro-page-pad)] pb-[241px] pt-[200px] text-[var(--wiro-cod-gray)]"
      data-node-id="1:986"
    >
      <PageContainer className="mb-20">
        <RevealGroup variants={staggerContainer(0.1, 0)}>
          <Reveal clip variants={clipUp}>
            <p className="text-h1 text-[var(--wiro-cod-gray)]">Take it from</p>
          </Reveal>
          <Reveal variants={fadeUp} className="mt-0 flex flex-wrap items-center gap-5">
            <div className="group-hover-flowers relative h-[88px] w-[300px] shrink-0 overflow-visible">
              <div className="h-full w-full overflow-hidden rounded-lg">
                <Image
                  src={figmaAssets.testimonialSneaker}
                  alt=""
                  fill
                  className="object-cover object-[center_30%]"
                  sizes="300px"
                />
              </div>
              <FlowersOverlay className="!text-[12px]" />
            </div>
            <p className="text-h1 text-[var(--wiro-mauve)]">Our Clients</p>
          </Reveal>
        </RevealGroup>
      </PageContainer>

      <Reveal variants={fadeUp}>
        <div data-testid="testimonials-carousel" className="pl-0">
          <Swiper spaceBetween={32} slidesPerView="auto" className="!overflow-visible">
            {testimonials.map((item) => (
              <SwiperSlide key={item.name} className="!w-[min(714px,85vw)]">
                <article className="flex min-h-[480px] flex-col justify-between rounded-lg bg-[var(--wiro-romance)] p-12 md:p-20">
                  <blockquote className="text-[length:40px] leading-[44px] tracking-[-0.04em]">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                  <p className="mt-16 text-[length:var(--wiro-body)] leading-[var(--wiro-body-lh)] tracking-[-0.03em] text-[var(--wiro-cod-gray)]/50">
                    {item.name}
                  </p>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Reveal>
    </PageSection>
  );
}
