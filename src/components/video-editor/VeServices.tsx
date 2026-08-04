"use client";

import { useState } from "react";
import { veServices } from "@/content/video-editor";
import { Reveal } from "@/components/motion/Reveal";
import { PageSection } from "@/components/shared/PageContainer";
import { clipUp, fadeUp } from "@/lib/motion";

/**
 * Services: an accordion column beside a wide media slot.
 * Design frame — accordion 413px, gap 32px, media 963×400.
 */
export function VeServices() {
  const [openId, setOpenId] = useState<string>(veServices[0]?.id ?? "");

  return (
    <PageSection
      padX={false}
      className="px-[68px] pb-[160px] max-lg:px-[var(--wiro-page-pad)] max-lg:pb-24"
    >
      <Reveal clip variants={clipUp}>
        <h2 className="pb-[58px] text-center text-[60px] font-semibold uppercase leading-[49.2px] tracking-[-3px] max-lg:pb-9 max-lg:text-[40px] max-lg:leading-9 max-lg:tracking-[-1.8px]">
          What we do
        </h2>
      </Reveal>

      <div className="grid grid-cols-[413px_minmax(0,1fr)] items-start gap-8 max-lg:grid-cols-1 max-lg:gap-5">
        <div className="grid gap-4">
          {veServices.map((service) => {
            const open = service.id === openId;
            return (
              <article
                key={service.id}
                className="ve-acc border border-[var(--ve-line)] bg-[var(--ve-paper)] transition-colors data-[open=true]:border-[var(--ve-ink)]"
                data-open={open}
              >
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenId(open ? "" : service.id)}
                  className="flex w-full items-center justify-between gap-3 px-[25px] py-6 text-left text-[18px] font-semibold uppercase tracking-[-0.2px]"
                >
                  {service.title}
                  <span className="ve-acc__chevron" aria-hidden />
                </button>
                <div className="ve-acc__body">
                  <div>
                    <p className="px-[25px] pb-[25px] text-sm leading-[22.4px] text-[var(--ve-muted)]">
                      {service.body}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <Reveal variants={fadeUp}>
          {/* 963×400 (~2.4:1) — swap for <video>/<img> */}
          <div className="ve-ph aspect-[963/400] w-full rounded-none">
            <span className="ve-ph__label">Video — 963 × 400</span>
          </div>
        </Reveal>
      </div>
    </PageSection>
  );
}
