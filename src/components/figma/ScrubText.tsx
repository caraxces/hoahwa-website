"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const copyParts = [
  { type: "brand" as const },
  { type: "text" as const, text: " are a young, dynamic agency specializing in high-performance web design and development. By collaborating directly as dedicated individuals, we ensure unmatched personal accountability and high responsibility. With cost efficiency as our key strength, our mission is to win prestigious awards at leading global design organizations like Awwwards and CSS Design Awards, showcasing premium aesthetic taste alongside world-class technical compatibility." },
];

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
        <Image
          src="/LOGO HOAHWA/hoahwa_logo_board-08.png"
          alt="Hoahwa"
          width={280}
          height={70}
          className="inline-block h-[0.72em] w-auto align-baseline"
        />
        {" are a young, dynamic agency specializing in high-performance web design and development. By collaborating directly as dedicated individuals, we ensure unmatched personal accountability and high responsibility. With cost efficiency as our key strength, our mission is to win prestigious awards at leading global design organizations like Awwwards and CSS Design Awards, showcasing premium aesthetic taste alongside world-class technical compatibility."}
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
