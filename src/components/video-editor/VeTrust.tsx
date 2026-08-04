"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { veQuotes } from "@/content/video-editor";
import { Reveal } from "@/components/motion/Reveal";
import { PageSection } from "@/components/shared/PageContainer";
import { clipUp, fadeUp } from "@/lib/motion";

/**
 * Testimonials: 694×398 cards, active one centred with its neighbours peeking.
 * `centeredSlides` reproduces that without hand-rolling the transform maths.
 */
export function VeTrust() {
  return (
    <PageSection padX={false} className="pb-[140px] max-lg:pb-24">
      <Reveal clip variants={clipUp}>
        <h2 className="pb-[76px] text-center text-[60px] font-semibold uppercase leading-[60px] tracking-[-2.4px] text-[var(--ve-ink-2)] max-lg:pb-10 max-lg:text-[34px] max-lg:leading-[34px] max-lg:tracking-[-1.4px]">
          Trusted by top companies
        </h2>
      </Reveal>

      <Reveal variants={fadeUp}>
        <Swiper
          modules={[Navigation]}
          spaceBetween={66}
          slidesPerView="auto"
          centeredSlides
          navigation
          className="!px-4 !pb-8 !pt-3.5"
        >
          {veQuotes.map((item) => (
            <SwiperSlide key={item.id} className="!w-auto">
              <figure className="ve-quote flex gap-8 p-8 max-lg:flex-col max-lg:gap-5 max-lg:p-5">
                <div className="ve-ph ve-ph--reel !aspect-[9/16] w-[194px] shrink-0 max-lg:w-full">
                  <span className="ve-ph__label">9:16</span>
                </div>

                <div className="flex min-w-0 flex-col">
                  <blockquote className="max-w-[305px] text-base leading-[19.2px] text-[var(--ve-ink-2)]">
                    {item.quote}
                  </blockquote>
                  <figcaption className="mt-auto flex items-center gap-2.5 max-lg:mt-6">
                    <span
                      className="size-10 shrink-0 rounded-full border border-[var(--ve-line)] bg-[#f4f4f4]"
                      aria-hidden
                    />
                    <span>
                      <b className="block text-xs font-medium leading-[14.4px]">
                        {item.name}
                      </b>
                      <i className="block text-xs not-italic leading-[14.4px] text-[var(--ve-ink-2)]/55">
                        {item.role}
                      </i>
                    </span>
                  </figcaption>
                </div>
              </figure>
            </SwiperSlide>
          ))}
        </Swiper>
      </Reveal>
    </PageSection>
  );
}
