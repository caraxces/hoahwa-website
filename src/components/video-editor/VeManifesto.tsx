"use client";

import { useEffect, useMemo, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { veManifesto } from "@/content/video-editor";
import { PageSection } from "@/components/shared/PageContainer";

/**
 * Statement block where each word lights as the section scrolls: light grey
 * ahead of the read position, accent on the leading two words, ink behind.
 *
 * Driven by scroll offset rather than IntersectionObserver so the highlight
 * tracks continuously instead of snapping at threshold boundaries. The per-word
 * state is written straight to `data-state` rather than held in React state —
 * this runs every scroll frame, and re-rendering every span that often would
 * be wasted work.
 */
export function VeManifesto() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduceMotion = useReducedMotion();

  const words = useMemo(() => veManifesto.trim().split(/\s+/), []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const spans = Array.from(
      el.querySelectorAll<HTMLElement>("[data-state]"),
    );

    if (reduceMotion) {
      for (const span of spans) span.dataset.state = "done";
      return;
    }

    let queued = false;
    const paint = () => {
      queued = false;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the block reaches 80% of the viewport, 1 once it clears 35%
      const progress = Math.max(
        0,
        Math.min(1, (vh * 0.8 - r.top) / (r.height + vh * 0.3)),
      );
      const head = progress * spans.length;
      spans.forEach((span, i) => {
        span.dataset.state =
          i < head - 2 ? "done" : i < head ? "hot" : "ahead";
      });
    };

    const schedule = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(paint);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [reduceMotion]);

  return (
    <PageSection className="pb-[180px] pt-[120px] max-lg:pb-24 max-lg:pt-20">
      <p
        ref={ref}
        className="ml-auto max-w-[868px] text-[48px] font-medium leading-[52.8px] tracking-[-2.88px] max-lg:text-[40px] max-lg:leading-11 max-lg:tracking-[-2.2px] max-md:text-[30px] max-md:leading-[34px] max-md:tracking-[-1.4px] max-sm:text-2xl max-sm:leading-7 max-sm:tracking-[-1px]"
      >
        {words.map((word, i) => (
          <span key={`${word}-${i}`} className="ve-word" data-state="ahead">
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </p>
    </PageSection>
  );
}
