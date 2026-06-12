"use client";

import { useEffect, useRef, useState } from "react";
import { KeypointBurst } from "@/components/shared/KeypointBurst";
import { HERO_FRAME_COUNT, heroFrameSrc } from "@/content/frame-sequence";
import { serviceKeypoints } from "@/content/service-keypoints";
import { toRectBox, type RectBox } from "@/lib/keypoint-burst";

const START_ID = "frame-sequence-start";
const END_ID = "frame-sequence-end";
const MARQUEE_TEST_ID = "client-logos-marquee";
const INTRO_SELECTOR = "[data-about-intro]";

const frameShellClass =
  "overflow-hidden rounded-lg shadow-[0_12px_40px_rgba(0,0,0,0.22)] ring-1 ring-white/10";

const frameImgClass =
  "h-[min(28vw,180px)] w-full max-w-[960px] object-contain object-center";

export function AboutScrollFrame() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [frameIndex, setFrameIndex] = useState(0);
  const [trackHeight, setTrackHeight] = useState(0);
  const [peakBurstProgress, setPeakBurstProgress] = useState(0);
  const [burstVisible, setBurstVisible] = useState(false);
  const [anchorRect, setAnchorRect] = useState<RectBox | null>(null);
  const [boundsRect, setBoundsRect] = useState<RectBox | null>(null);

  useEffect(() => {
    let raf = 0;

    const measureTrack = () => {
      const start = document.getElementById(START_ID);
      const marquee = document.querySelector(
        `[data-testid="${MARQUEE_TEST_ID}"]`,
      );
      if (!start || !marquee) return;

      const startY = start.offsetTop;
      const marqueeY =
        marquee.getBoundingClientRect().top + window.scrollY;
      setTrackHeight(Math.max(320, marqueeY - startY));
    };

    const update = () => {
      const start = document.getElementById(START_ID);
      const end = document.getElementById(END_ID);
      const track = trackRef.current;
      const sticky = stickyRef.current;
      const intro = document.querySelector(INTRO_SELECTOR);
      if (!start || !end || !track) return;

      const sequenceRange = end.offsetTop - start.offsetTop;
      if (sequenceRange <= 0) return;

      const scrollY = window.scrollY;
      const sequenceProgress = Math.min(
        1,
        Math.max(0, (scrollY - start.offsetTop) / sequenceRange),
      );

      setFrameIndex(
        Math.min(
          HERO_FRAME_COUNT - 1,
          Math.floor(sequenceProgress * HERO_FRAME_COUNT),
        ),
      );

      const trackTop = track.offsetTop;
      const burstEnd =
        document.querySelector(`[data-testid="${MARQUEE_TEST_ID}"]`)
          ?.getBoundingClientRect().top ?? track.getBoundingClientRect().bottom;
      const burstEndY = burstEnd + scrollY;
      const burstRange = Math.max(1, burstEndY - trackTop);
      const nextBurstProgress = Math.min(
        1,
        Math.max(0, (scrollY - trackTop) / burstRange),
      );
      setPeakBurstProgress((prev) => Math.max(prev, nextBurstProgress));

      let separated = scrollY > trackTop + 6;
      if (intro && sticky) {
        const gap =
          sticky.getBoundingClientRect().top -
          intro.getBoundingClientRect().bottom;
        separated = gap > 2 || scrollY > trackTop + 6;
      }

      if (separated) {
        setBurstVisible(true);
      }

      if (!separated && scrollY < trackTop - 24) {
        setBurstVisible(false);
        setPeakBurstProgress(0);
      }

      const romanceSection = track.closest("section");
      const frameImg = sticky?.querySelector("img");
      if (romanceSection) {
        setBoundsRect(toRectBox(romanceSection.getBoundingClientRect()));
      }
      if (frameImg) {
        setAnchorRect(toRectBox(frameImg.getBoundingClientRect()));
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        update();
      });
    };

    const onResize = () => {
      measureTrack();
      onScroll();
    };

    measureTrack();
    update();
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
        style={{ height: trackHeight > 0 ? trackHeight : "min(80vh, 640px)" }}
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
