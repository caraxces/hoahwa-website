"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  BUBBLE_CYCLE_MS,
  BUBBLE_SPAWN_SPREAD_MS,
  intersectRectBox,
  keypointLayout,
  LABEL_SIZE_DESKTOP,
  LABEL_SIZE_MOBILE,
  maxBubblesPerCycle,
  positionKeypointAroundAnchor,
  type KeypointBurstItem,
  type RectBox,
} from "@/lib/keypoint-burst";
import { cn } from "@/lib/cn";

const COMPACT_QUERY = "(max-width: 767px)";

function subscribeCompact(onChange: () => void) {
  const mq = window.matchMedia(COMPACT_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getCompactSnapshot() {
  return window.matchMedia(COMPACT_QUERY).matches;
}

function getCompactServerSnapshot() {
  return false;
}

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
  const isCompact = useSyncExternalStore(
    subscribeCompact,
    getCompactSnapshot,
    getCompactServerSnapshot,
  );

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

  // Labels must land on the visible part of the section — the section itself
  // is usually taller than the screen.
  const viewportBounds = intersectRectBox(boundsRect, {
    top: 0,
    left: 0,
    right: window.innerWidth,
    bottom: window.innerHeight,
    width: window.innerWidth,
    height: window.innerHeight,
  });
  if (viewportBounds.width <= 0 || viewportBounds.height <= 0) return null;

  const labelSize = isCompact ? LABEL_SIZE_MOBILE : LABEL_SIZE_DESKTOP;
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
      className="pointer-events-none fixed inset-0 z-[35] overflow-hidden"
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
          viewportBounds,
          mode,
          labelSize,
        );

        return (
          <div
            key={`${cycleKey}-${item.category}-${item.label}-${index}`}
            className="absolute max-w-[185px] whitespace-nowrap max-md:max-w-[120px] max-md:whitespace-normal"
            style={{
              top,
              left,
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
