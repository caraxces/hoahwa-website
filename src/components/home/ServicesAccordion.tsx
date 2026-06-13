"use client";

import { useState } from "react";
import { servicesAccordion } from "@/content/home";
import { AccordionPlusIcon } from "@/components/shared/AccordionPlusIcon";
import { Reveal } from "@/components/motion/Reveal";
import { PageContainer, PageSection } from "@/components/shared/PageContainer";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/cn";

export function ServicesAccordion() {
  const [openId, setOpenId] = useState(servicesAccordion[0]?.id ?? "");

  return (
    <PageSection
      padX={false}
      className="bg-[var(--wiro-cod-gray)] px-[var(--wiro-page-pad)] pb-[121px] pt-20 text-[var(--wiro-romance)]"
      data-node-id="1:933"
    >
      <PageContainer>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)] lg:gap-12">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal variants={fadeUp}>
              <h2 className="text-[length:var(--wiro-h2)] leading-[var(--wiro-h2)] tracking-[-0.04em]">
                <span className="text-[var(--wiro-romance)]">Our </span>
                <span className="text-[var(--wiro-mauve)]">service</span>
                <span className="text-[var(--wiro-romance)]"> </span>
                <span className="block text-[var(--wiro-romance)]">offering</span>
              </h2>
            </Reveal>
          </div>

          <div className="border-t border-[var(--wiro-romance)]">
            {servicesAccordion.map((item) => {
              const open = openId === item.id;
              return (
                <div
                  key={item.id}
                  className="border-b border-[var(--wiro-romance)]"
                >
                  <button
                    type="button"
                    className="flex w-full items-center gap-8 py-10 pl-5 pr-10 text-left"
                    onClick={() => setOpenId(open ? "" : item.id)}
                    aria-expanded={open}
                  >
                    <AccordionPlusIcon
                      open={open}
                      className="text-[var(--wiro-romance)]"
                    />
                    <span className="text-[length:40px] leading-[44px] tracking-[-0.04em]">
                      {item.title}
                    </span>
                  </button>
                  <div
                    className={cn(
                      "grid transition-[grid-template-rows] duration-300 ease-out",
                      open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-[684px] pb-8 pl-[60px] pr-10 text-[length:var(--wiro-body)] leading-[var(--wiro-body-lh)] tracking-[-0.03em] text-[var(--wiro-romance)]">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </PageContainer>
    </PageSection>
  );
}
