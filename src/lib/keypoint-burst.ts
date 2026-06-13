import type { ServiceKeypoint } from "@/content/service-keypoints";

export type KeypointLayout = {
  angleDeg: number;
  spread: number;
  appearAt: number;
  rotateDeg: number;
  staggerMs: number;
};

export type RectBox = {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};

export type LabelSize = {
  width: number;
  height: number;
};

/** Must mirror the Tailwind classes on the label in KeypointBurst.tsx. */
export const LABEL_SIZE_DESKTOP: LabelSize = { width: 185, height: 26 };
export const LABEL_SIZE_MOBILE: LabelSize = { width: 120, height: 45 };

const BOUND_PAD = 10;

/** Deterministic “random” layout — stable across re-renders. */
export function keypointLayout(index: number, total: number): KeypointLayout {
  const seed = (index * 7919 + 104729) % 9973;
  const angleDeg = (index * 137.508 + seed * 0.41) % 360;
  const layer = index % 3;
  const spreadBase = 0.42 + layer * 0.17;
  const spread = Math.min(1, spreadBase + ((seed * 17) % 22) / 100);
  const appearAt =
    index < 14
      ? 0
      : index < 30
        ? ((index - 14) / 16) * 0.22
        : Math.min(0.92, 0.22 + ((index - 30) / (total - 30)) * 0.68);
  const rotateDeg = ((seed % 11) - 5) * 0.55;
  const staggerMs = (index % 12) * 28 + (seed % 70);

  return { angleDeg, spread, appearAt, rotateDeg, staggerMs };
}

function rayMaxRadius(
  cx: number,
  cy: number,
  cos: number,
  sin: number,
  bounds: RectBox,
  label: LabelSize,
): number {
  let t = Infinity;

  if (cos > 0.001) {
    t = Math.min(t, (bounds.right - BOUND_PAD - label.width - cx) / cos);
  } else if (cos < -0.001) {
    t = Math.min(t, (bounds.left + BOUND_PAD - cx) / cos);
  }

  if (sin > 0.001) {
    t = Math.min(t, (bounds.bottom - BOUND_PAD - label.height - cy) / sin);
  } else if (sin < -0.001) {
    t = Math.min(t, (bounds.top + BOUND_PAD - cy) / sin);
  }

  return Math.max(0, Number.isFinite(t) ? t : 0);
}

export function positionKeypointAroundAnchor(
  anchor: RectBox,
  layout: KeypointLayout,
  bounds: RectBox,
  mode: "frame" | "card" = "frame",
  label: LabelSize = LABEL_SIZE_DESKTOP,
): { top: number; left: number } {
  const cx = anchor.left + anchor.width / 2;
  const cy = anchor.top + anchor.height / 2;
  const angleRad = (layout.angleDeg * Math.PI) / 180;
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);

  const maxR = rayMaxRadius(cx, cy, cos, sin, bounds, label);
  const minR =
    mode === "card"
      ? Math.max(anchor.width, anchor.height) * 0.56 + 44
      : Math.max(anchor.width, anchor.height) * 0.48 + 28;
  // On cramped bounds maxR can fall below minR; stop at the bounds edge
  // instead of overshooting and piling every label onto the clamp line.
  const r = maxR > minR ? minR + (maxR - minR) * layout.spread : maxR;

  const x = cx + cos * r;
  const y = cy + sin * r;

  const minX = bounds.left + BOUND_PAD;
  const maxX = bounds.right - BOUND_PAD - label.width;
  const minY = bounds.top + BOUND_PAD;
  const maxY = bounds.bottom - BOUND_PAD - label.height;

  return {
    left: Math.min(maxX, Math.max(minX, x - label.width * 0.12)),
    top: Math.min(maxY, Math.max(minY, y - label.height * 0.45)),
  };
}

/** Intersection of two boxes; width/height <= 0 means they don't overlap. */
export function intersectRectBox(a: RectBox, b: RectBox): RectBox {
  const top = Math.max(a.top, b.top);
  const left = Math.max(a.left, b.left);
  const right = Math.min(a.right, b.right);
  const bottom = Math.min(a.bottom, b.bottom);
  return { top, left, right, bottom, width: right - left, height: bottom - top };
}

export function toRectBox(rect: DOMRect): RectBox {
  return {
    top: rect.top,
    left: rect.left,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.width,
    height: rect.height,
  };
}

export type KeypointBurstItem = ServiceKeypoint;

export const BUBBLE_CYCLE_MS = 7000;
export const BUBBLE_SPAWN_SPREAD_MS = 2600;

export function maxBubblesPerCycle(mode: "frame" | "card"): number {
  return mode === "card" ? 7 : 12;
}
