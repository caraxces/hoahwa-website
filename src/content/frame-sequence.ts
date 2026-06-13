export const HERO_FRAME_COUNT = 58;

/** Track height = this fraction of the natural start→end journey (no feedback loop). */
export const JOURNEY_HEIGHT_FRACTION = 0.2;

export const MIN_TRACK_HEIGHT_PX = 640;

export function heroFrameSrc(index: number): string {
  const n = Math.min(Math.max(1, index), HERO_FRAME_COUNT);
  return `/img/frames/frame_${String(n).padStart(3, "0")}.webp`;
}

export const heroFrameSources = Array.from({ length: HERO_FRAME_COUNT }, (_, i) =>
  heroFrameSrc(i + 1),
);

/** Stable journey length: #frame-sequence-start → #frame-sequence-end (measured once). */
export function naturalJourneySpanPx(
  startEl: HTMLElement,
  endEl: HTMLElement,
): number {
  return Math.max(0, endEl.offsetTop - startEl.offsetTop);
}

export function trackHeightFromJourney(fullSpanPx: number): number {
  return Math.max(
    MIN_TRACK_HEIGHT_PX,
    Math.round(fullSpanPx * JOURNEY_HEIGHT_FRACTION),
  );
}

/**
 * Linear progress while the track crosses the viewport.
 * 0 = track top at viewport bottom · 1 = track bottom at viewport top.
 * Maps evenly so all 58 frames appear across the full journey (not bunched at the end).
 */
export function trackScrollProgress(
  track: HTMLElement,
  viewportHeight: number,
): number {
  const rect = track.getBoundingClientRect();
  const trackHeight = track.offsetHeight;
  const travel = trackHeight + viewportHeight;
  if (travel <= 0) return 0;
  return Math.min(1, Math.max(0, (viewportHeight - rect.top) / travel));
}

/** Equal-width bins: frame 0 at progress≈0, frame 57 at progress=1. */
export function frameIndexFromProgress(progress: number): number {
  if (HERO_FRAME_COUNT <= 1) return 0;
  const clamped = Math.min(1, Math.max(0, progress));
  if (clamped >= 1) return HERO_FRAME_COUNT - 1;
  return Math.floor(clamped * HERO_FRAME_COUNT);
}
