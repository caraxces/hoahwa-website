"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { KeypointBurst } from "@/components/shared/KeypointBurst";
import { Reveal } from "@/components/motion/Reveal";
import type { TeamMember } from "@/content/team";
import type { KeypointBurstItem } from "@/lib/keypoint-burst";
import { toRectBox, type RectBox } from "@/lib/keypoint-burst";
import { fadeUp } from "@/lib/motion";

const CARD_BOUNDS_PAD = 72;

type TeamMemberCardProps = {
  member: TeamMember;
  delay: number;
};

export function TeamMemberCard({ member, delay }: TeamMemberCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const [peakProgress, setPeakProgress] = useState(0);
  const [burstActive, setBurstActive] = useState(false);
  const [anchorRect, setAnchorRect] = useState<RectBox | null>(null);
  const [boundsRect, setBoundsRect] = useState<RectBox | null>(null);

  const burstItems: KeypointBurstItem[] = member.keypoints.map((label) => ({
    category: member.category,
    label,
  }));

  useEffect(() => {
    let raf = 0;

    const update = () => {
      const card = cardRef.current;
      if (!card) return;

      const box = card.getBoundingClientRect();
      setAnchorRect(toRectBox(box));
      setBoundsRect({
        top: box.top - CARD_BOUNDS_PAD,
        left: box.left - CARD_BOUNDS_PAD,
        right: box.right + CARD_BOUNDS_PAD,
        bottom: box.bottom + CARD_BOUNDS_PAD,
        width: box.width + CARD_BOUNDS_PAD * 2,
        height: box.height + CARD_BOUNDS_PAD * 2,
      });

      const inView = box.bottom > 48 && box.top < window.innerHeight - 48;

      if (inView) {
        setBurstActive(true);
        const progress = Math.min(
          1,
          Math.max(
            0,
            (window.innerHeight * 0.55 - box.top) / (box.height + 140),
          ),
        );
        setPeakProgress((prev) => Math.max(prev, progress));
      }

      if (box.bottom < -80 || box.top > window.innerHeight + 80) {
        setBurstActive(false);
        setPeakProgress(0);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const showBurst =
    burstActive &&
    boundsRect !== null &&
    boundsRect.bottom > 0 &&
    boundsRect.top < window.innerHeight;

  return (
    <div className="relative isolate">
      <KeypointBurst
        items={burstItems}
        revealProgress={peakProgress}
        visible={showBurst}
        anchorRect={anchorRect}
        boundsRect={boundsRect}
        mode="card"
      />

      <Reveal variants={fadeUp} delay={delay}>
        <article
          ref={cardRef}
          className="relative z-10 overflow-hidden rounded-lg bg-[var(--wiro-spring-wood)]"
        >
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={member.image}
              alt={member.name}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="p-8">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="text-[length:var(--wiro-h4)] tracking-[-0.04em]">
                {member.name}
              </h3>
              {member.badge ? (
                <span className="text-sm tracking-[-0.02em] text-[var(--wiro-mauve)]">
                  {member.badge}
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-sm font-medium tracking-[-0.02em] text-[var(--wiro-cod-gray)]/60">
              {member.role}
            </p>
            <p className="mt-4 text-base leading-6 tracking-[-0.03em] text-[var(--wiro-cod-gray)]/75">
              {member.bio}
            </p>
          </div>
        </article>
      </Reveal>
    </div>
  );
}
