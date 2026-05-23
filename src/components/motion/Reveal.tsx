"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { revealViewport, fadeUp, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/cn";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  as?: "div" | "section" | "span" | "li";
  delay?: number;
  /** Clip overflow for line reveals */
  clip?: boolean;
};

export function Reveal({
  children,
  className,
  variants,
  as = "div",
  delay = 0,
  clip = false,
}: RevealProps) {
  const Component = motion[as];
  const reduceMotion = useReducedMotion();
  const v = reduceMotion ? fadeUp : variants ?? fadeUp;

  return (
    <Component
      className={cn(clip && !reduceMotion && "overflow-hidden", className)}
      initial={reduceMotion ? false : "hidden"}
      whileInView={reduceMotion ? undefined : "visible"}
      exit={reduceMotion ? undefined : "exit"}
      viewport={revealViewport}
      variants={v}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </Component>
  );
}

/** Stagger parent — children use fadeUp / clipUp variants */
export function RevealGroup({
  children,
  className,
  variants,
}: {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
}) {
  const reduceMotion = useReducedMotion();
  const v = reduceMotion ? fadeUp : variants ?? staggerContainer();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : "hidden"}
      whileInView={reduceMotion ? undefined : "visible"}
      exit={reduceMotion ? undefined : "exit"}
      viewport={revealViewport}
      variants={v}
    >
      {children}
    </motion.div>
  );
}
