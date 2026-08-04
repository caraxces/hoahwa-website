"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { veCases, veWork } from "@/content/video-editor";
import { Reveal } from "@/components/motion/Reveal";
import { PageSection } from "@/components/shared/PageContainer";
import { clipUp, fadeUp } from "@/lib/motion";

/**
 * Projects: a sticky index column beside a scrolling stack of cases. Each case
 * shows three vertical 9:16 reels (Remotion social output) plus its figures.
 *
 * Design frame — index column x136 w320, gap 32, cases column w888. Three
 * reels of 278px + two 27px gaps fill that 888 exactly.
 */
export function VeWork() {
  const caseRefs = useRef<Array<HTMLElement | null>>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let queued = false;
    const pick = () => {
      queued = false;
      const mid = window.innerHeight * 0.45;
      let best = 0;
      let bestDistance = Infinity;
      caseRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestDistance) {
          bestDistance = d;
          best = i;
        }
      });
      setActive(best);
    };
    const schedule = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(pick);
    };

    // deferred, not called inline — a synchronous setState here would cascade
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const jumpTo = useCallback((i: number) => {
    const el = caseRefs.current[i];
    if (!el) return;
    window.scrollTo({
      top: window.scrollY + el.getBoundingClientRect().top - 120,
      behavior: "smooth",
    });
  }, []);

  return (
    <PageSection
      padX={false}
      className="grid grid-cols-[320px_minmax(0,1fr)] items-start gap-8 px-[136px] pb-[160px] max-lg:grid-cols-1 max-lg:gap-0 max-lg:px-[var(--wiro-page-pad)] max-lg:pb-24"
    >
      <div className="sticky top-[140px] max-lg:static">
        <p className="text-[20px] font-semibold uppercase leading-6 tracking-[-1.2px] text-[var(--ve-accent-2)]">
          {veWork.kicker}
        </p>
        <Reveal clip variants={clipUp}>
          <h2 className="mt-5 max-w-[320px] text-[32px] font-semibold leading-8 tracking-[-1.28px]">
            {veWork.headline}
          </h2>
        </Reveal>

        <ul className="mt-[46px] grid gap-3 max-lg:hidden">
          {veCases.map((item, i) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => jumpTo(i)}
                aria-current={i === active}
                className={`text-left text-[48px] font-medium leading-[60px] tracking-[-1.92px] transition-colors duration-500 ${
                  i === active
                    ? "text-[var(--ve-ink)]"
                    : "text-[var(--ve-ghost)]"
                }`}
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-[140px] max-lg:mt-10 max-lg:gap-[70px]">
        {veCases.map((item, i) => (
          <article
            key={item.id}
            ref={(el) => {
              caseRefs.current[i] = el;
            }}
          >
            <Reveal variants={fadeUp}>
              <div className="ve-reels">
                {item.reels.map((slot) => (
                  <div key={slot} className="ve-ph ve-ph--reel">
                    <span className="ve-ph__label">9:16 — {slot}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* index column already names the case on desktop */}
            <h3 className="border-b border-[var(--ve-line)] pb-[22px] pt-[26px] text-[34px] font-medium leading-none tracking-[-1.2px] lg:hidden">
              {item.name}
            </h3>

            <dl
              className={`grid gap-[34px] border-b border-t border-[var(--ve-line)] py-[34px] max-md:gap-[22px] max-sm:grid-cols-1 ${
                item.stats.length === 3
                  ? "grid-cols-3 max-md:grid-cols-2"
                  : "grid-cols-2"
              }`}
            >
              {item.stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-[40px] leading-[52px] tracking-[-1.6px] text-[var(--ve-accent-2)] max-md:text-3xl max-md:leading-[38px]">
                    {stat.value}
                  </dt>
                  <dd className="mt-1.5 text-[18px] uppercase leading-[19.8px] tracking-[0.18px] text-[var(--ve-ink-2)]/65 max-md:text-sm max-md:leading-[17px]">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>
    </PageSection>
  );
}
