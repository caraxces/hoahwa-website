"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type GradientScrollAreaProps = {
  children: ReactNode;
  className?: string;
  /** Fade color at scroll edges — matches parent surface */
  fadeFrom?: string;
};

export function GradientScrollArea({
  children,
  className,
  fadeFrom = "var(--wiro-spring-wood)",
}: GradientScrollAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const updateScrollHints = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    setCanScrollUp(scrollTop > 6);
    setCanScrollDown(scrollTop + clientHeight < scrollHeight - 6);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollHints();
    el.addEventListener("scroll", updateScrollHints, { passive: true });

    const observer = new ResizeObserver(updateScrollHints);
    observer.observe(el);
    for (const child of el.children) {
      observer.observe(child);
    }

    return () => {
      el.removeEventListener("scroll", updateScrollHints);
      observer.disconnect();
    };
  }, [updateScrollHints, children]);

  return (
    <div className="relative min-h-0 flex-1">
      <div
        ref={scrollRef}
        className={cn(
          "scrollbar-gradient-hide h-full min-h-0 overflow-y-auto overscroll-contain",
          className,
        )}
      >
        {children}
      </div>

      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 z-10 h-12 transition-opacity duration-300",
          canScrollUp ? "opacity-100" : "opacity-0",
        )}
        style={{
          background: `linear-gradient(to bottom, ${fadeFrom} 0%, ${fadeFrom} 20%, transparent 100%)`,
        }}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 transition-opacity duration-300",
          canScrollDown ? "opacity-100" : "opacity-0",
        )}
        style={{
          background: `linear-gradient(to top, ${fadeFrom} 0%, ${fadeFrom} 20%, transparent 100%)`,
        }}
      />
    </div>
  );
}
