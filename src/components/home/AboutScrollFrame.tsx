"use client";

import { useEffect, useRef, useState } from "react";
import { KeypointBurst } from "@/components/shared/KeypointBurst";
import {
  frameIndexFromProgress,
  HERO_FRAME_COUNT,
  heroFrameSrc,
  MIN_TRACK_HEIGHT_PX,
  naturalJourneySpanPx,
  trackHeightFromJourney,
  trackScrollProgress,
} from "@/content/frame-sequence";
import { serviceKeypoints } from "@/content/service-keypoints";
import { toRectBox, type RectBox } from "@/lib/keypoint-burst";

const START_ID = "frame-sequence-start";
const END_ID = "frame-sequence-end";

const frameShellClass =
  "overflow-hidden rounded-lg shadow-[0_12px_40px_rgba(0,0,0,0.22)] ring-1 ring-white/10";

const frameImgClass =
  "h-[min(28vw,180px)] w-full max-w-[960px] object-contain object-center";

const preloadedFrames = new Set<number>();

function preloadFrame(index: number) {
  if (index < 0 || index >= HERO_FRAME_COUNT || preloadedFrames.has(index)) {
    return;
  }
  preloadedFrames.add(index);
  const img = new window.Image();
  img.decoding = "async";
  img.src = heroFrameSrc(index + 1);
}

export function AboutScrollFrame() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const journeySpanRef = useRef<number | null>(null);
  const [frameIndex, setFrameIndex] = useState(0);
  const [trackHeight, setTrackHeight] = useState(0);
  const [peakBurstProgress, setPeakBurstProgress] = useState(0);
  const [burstVisible, setBurstVisible] = useState(false);
  const [anchorRect, setAnchorRect] = useState<RectBox | null>(null);
  const [boundsRect, setBoundsRect] = useState<RectBox | null>(null);

  useEffect(() => {
    let next = 0;
    let timer = 0;
    const pump = () => {
      for (let n = 0; n < 8 && next < HERO_FRAME_COUNT; n += 1) {
        preloadFrame(next);
        next += 1;
      }
      if (next < HERO_FRAME_COUNT) {
        timer = window.setTimeout(pump, 100);
      }
    };
    pump();
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    for (let d = 1; d <= 6; d += 1) {
      preloadFrame(frameIndex + d);
      preloadFrame(frameIndex - d);
    }
  }, [frameIndex]);

  useEffect(() => {
    let raf = 0;

    /**
     * Measure once from #start → #end while track is collapsed.
     * Never use marquee getBoundingClientRect (feedback loop → 100k+ px height).
     */
    const measureTrack = (force = false) => {
      if (!force && journeySpanRef.current !== null) {
        setTrackHeight(trackHeightFromJourney(journeySpanRef.current));
        return;
      }

      const start = document.getElementById(START_ID);
      const end = document.getElementById(END_ID);
      const track = trackRef.current;
      if (!start || !end || !track) return;

      const savedHeight = track.style.height;
      track.style.height = `${MIN_TRACK_HEIGHT_PX}px`;
      const fullSpan = naturalJourneySpanPx(start, end);
      track.style.height = savedHeight;

      journeySpanRef.current = fullSpan;
      setTrackHeight(trackHeightFromJourney(fullSpan));
    };

    const update = () => {
      const track = trackRef.current;
      const sticky = stickyRef.current;
      if (!track) return;

      const viewport = window.innerHeight;
      const trackProgress = trackScrollProgress(track, viewport);

      setFrameIndex(frameIndexFromProgress(trackProgress));

      const frameImg = sticky?.querySelector("img");
      const frameRect = frameImg?.getBoundingClientRect();
      const frameOnScreen =
        !!frameRect &&
        frameRect.height > 0 &&
        frameRect.bottom > viewport * 0.12 &&
        frameRect.top < viewport * 0.92;

      if (frameOnScreen) {
        setBurstVisible(true);
        setPeakBurstProgress((prev) => Math.max(prev, trackProgress));
      } else {
        const trackDocTop = track.getBoundingClientRect().top + window.scrollY;
        if (window.scrollY < trackDocTop - 48) {
          setBurstVisible(false);
          setPeakBurstProgress(0);
        }
      }

      const romanceSection = track.closest("section");
      if (romanceSection) {
        setBoundsRect(toRectBox(romanceSection.getBoundingClientRect()));
      }
      if (frameRect) {
        setAnchorRect(toRectBox(frameRect));
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    const onResize = () => {
      journeySpanRef.current = null;
      measureTrack(true);
      onScroll();
    };

    requestAnimationFrame(() => {
      measureTrack(true);
      update();
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const showBurst =
    burstVisible &&
    boundsRect !== null &&
    boundsRect.bottom > 0 &&
    boundsRect.top < window.innerHeight;

  return (
    <>
      <KeypointBurst
        items={serviceKeypoints}
        revealProgress={peakBurstProgress}
        visible={showBurst}
        anchorRect={anchorRect}
        boundsRect={boundsRect}
      />

      <div id={START_ID} className="h-px w-full" aria-hidden />

      <div
        ref={trackRef}
        className="relative w-full"
        style={{
          height: trackHeight > 0 ? trackHeight : MIN_TRACK_HEIGHT_PX,
        }}
        data-testid="hero-frame-sequence"
      >
        <div
          ref={stickyRef}
          className="sticky top-1/2 z-30 flex w-full -translate-y-1/2 justify-center px-[var(--wiro-gutter)]"
          data-frame-sticky
        >
          <div className={frameShellClass}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroFrameSrc(frameIndex + 1)}
              alt=""
              className={frameImgClass}
              draggable={false}
            />
          </div>
        </div>
      </div>
    </>
  );
}
