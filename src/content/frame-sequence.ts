export const HERO_FRAME_COUNT = 58;

export function heroFrameSrc(index: number): string {
  const n = Math.min(Math.max(1, index), HERO_FRAME_COUNT);
  return `/img/frames/frame_${String(n).padStart(3, "0")}.webp`;
}

export const heroFrameSources = Array.from({ length: HERO_FRAME_COUNT }, (_, i) =>
  heroFrameSrc(i + 1),
);
