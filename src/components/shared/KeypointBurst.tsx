"use client";

import { useEffect, useState } from "react";
import {
  BUBBLE_CYCLE_MS,
  BUBBLE_SPAWN_SPREAD_MS,
  keypointLayout,
  maxBubblesPerCycle,
  positionKeypointAroundAnchor,
  type KeypointBurstItem,
  type RectBox,
} from "@/lib/keypoint-burst";
import { cn } from "@/lib/cn";

const categoryTone: Record<KeypointBurstItem["category"], string> = {
  Dev: "text-[var(--wiro-cod-gray)]",
  MKT: "text-[var(--wiro-mauve)]",
  Design: "text-[var(--wiro-chenin)]",
};

type KeypointBurstProps = {
  items: KeypointBurstItem[];
  revealProgress: number;
  visible: boolean;
  anchorRect: RectBox | null;
  boundsRect: RectBox | null;
  mode?: "frame" | "card";
};

export function KeypointBurst({
  items,
  revealProgress,
  visible,
  anchorRect,
  boundsRect,
  mode = "frame",
}: KeypointBurstProps) {
  const [cycleKey, setCycleKey] = useState(0);

  useEffect(() => {
    if (!visible) {
      setCycleKey(0);
      return;
    }

    setCycleKey((k) => k + 1);
    const interval = window.setInterval(() => {
      setCycleKey((k) => k + 1);
    }, BUBBLE_CYCLE_MS);

    return () => window.clearInterval(interval);
  }, [visible]);

  if (!visible || !anchorRect || !boundsRect) return null;

  const total = items.length;
  const cap = maxBubblesPerCycle(mode);
  const eligible = items
    .map((item, index) => ({
      item,
      index,
      layout: keypointLayout(index, total),
    }))
    .filter(({ layout }) => revealProgress >= layout.appearAt);

  if (eligible.length === 0) return null;

  const waveSize = Math.min(cap, eligible.length);
  const wave = Array.from({ length: waveSize }, (_, waveIndex) => {
    const pick = eligible[(cycleKey * cap + waveIndex) % eligible.length];
    return { ...pick, waveIndex };
  });

  return (
    <div
      className="pointer-events-none fixed z-[28] overflow-hidden"
      style={{
        top: boundsRect.top,
        left: boundsRect.left,
        width: boundsRect.width,
        height: boundsRect.height,
      }}
      aria-hidden
      data-testid="keypoint-burst"
    >
      {wave.map(({ item, index, layout, waveIndex }) => {
        const spawnMs =
          (waveIndex / Math.max(waveSize - 1, 1)) * BUBBLE_SPAWN_SPREAD_MS +
          (layout.staggerMs % 180);
        const animDuration = Math.max(900, BUBBLE_CYCLE_MS - spawnMs);

        const { top, left } = positionKeypointAroundAnchor(
          anchorRect,
          layout,
          boundsRect,
          mode,
        );

        return (
          <div
            key={`${cycleKey}-${item.category}-${item.label}-${index}`}
            className="absolute max-w-[185px] whitespace-nowrap max-md:max-w-[120px] max-md:whitespace-normal"
            style={{
              top: top - boundsRect.top,
              left: left - boundsRect.left,
              transform: `rotate(${layout.rotateDeg}deg)`,
            }}
          >
            <p
              className={cn(
                "animate-keypoint-bubble text-[length:var(--wiro-body)] leading-[var(--wiro-body-lh)] tracking-[-0.03em] max-md:text-[11px] max-md:leading-[15px]",
              )}
              style={{
                animationDelay: `${spawnMs}ms`,
                animationDuration: `${animDuration}ms`,
              }}
            >
              <span className={cn("font-normal", categoryTone[item.category])}>
                {item.category}
              </span>
              <span className="text-[var(--wiro-cod-gray)]/35"> · </span>
              <span className="text-[var(--wiro-cod-gray)]">{item.label}</span>
            </p>
          </div>
        );
      })}
    </div>
  );
}
