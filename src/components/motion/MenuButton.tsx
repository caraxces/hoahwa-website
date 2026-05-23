"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

export function MenuButton({
  open,
  onClick,
  className,
}: {
  open: boolean;
  onClick: () => void;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const transition = reduceMotion
    ? { duration: 0.15 }
    : { type: "spring" as const, stiffness: 380, damping: 28 };

  return (
    <button
      type="button"
      data-testid="menu-toggle"
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-[var(--wiro-romance)] transition-colors hover:border-[var(--wiro-mauve)] lg:hidden",
        open && "border-[var(--wiro-mauve)]",
        className,
      )}
      onClick={onClick}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
    >
      <span className="sr-only">{open ? "Close" : "Menu"}</span>
      <span className="relative block h-3.5 w-5">
        <motion.span
          className="absolute left-0 top-0 block h-0.5 w-5 origin-center bg-current"
          animate={
            open
              ? { rotate: 45, y: 6, width: 20 }
              : { rotate: 0, y: 0, width: 20 }
          }
          transition={transition}
        />
        <motion.span
          className="absolute left-0 top-[6px] block h-0.5 bg-current"
          animate={
            open
              ? { opacity: 0, width: 0 }
              : { opacity: 1, width: 12 }
          }
          transition={transition}
        />
        <motion.span
          className="absolute left-0 top-3 block h-0.5 w-5 origin-center bg-current"
          animate={
            open
              ? { rotate: -45, y: -6, width: 20 }
              : { rotate: 0, y: 0, width: 20 }
          }
          transition={transition}
        />
      </span>
    </button>
  );
}
