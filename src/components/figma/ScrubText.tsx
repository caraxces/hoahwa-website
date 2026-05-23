"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const copy = [
  "Hoahwa are a multi-award-winning",
  "eCommerce Growth Agency specialising",
  "in Shopify Plus for ambitious home and",
  "lifestyle brands. With a over decade of",
  "experience and a track record of",
  "empowering 500+ DTC brands, we know",
  "what it takes to drive growth and scale.",
].join(" ");

export function ScrubText() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const overlayWidth = useTransform(scrollYProgress, [0, 0.55, 1], ["100%", "52%", "0%"]);

  return (
    <div ref={ref} className="relative max-w-[867px]" data-node-id="1:536">
      <p
        className="text-h3 text-[var(--wiro-cod-gray)]"
        data-node-id="1:540"
      >
        {copy}
      </p>
      <motion.div
        className="pointer-events-none absolute inset-y-0 right-0 bg-[rgba(255,253,250,0.85)]"
        style={{ width: overlayWidth }}
        data-node-id="1:543"
        aria-hidden
      />
    </div>
  );
}
