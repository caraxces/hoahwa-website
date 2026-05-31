"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { appMenu } from "@/content/navigation";
import { cn } from "@/lib/cn";

export function HeaderAppMenu() {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        clearCloseTimer();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        className={cn(
          "group relative flex items-center gap-1 py-1 text-base tracking-[-0.02em] text-[var(--wiro-romance)]",
          open && "text-[var(--wiro-mauve)]",
        )}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="relative z-10">{appMenu.label}</span>
        <span
          className={cn(
            "text-xs transition-transform",
            open && "rotate-180",
          )}
          aria-hidden
        >
          ▾
        </span>
        <motion.span
          className="absolute bottom-0 left-0 h-px w-full origin-left bg-[var(--hoahwa-accent)]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: open ? 1 : 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full z-50 mt-3 min-w-[240px] rounded-lg border border-white/10 bg-[rgba(21,21,21,0.98)] py-2 shadow-[0_16px_48px_rgba(0,0,0,0.45)]"
            onMouseEnter={clearCloseTimer}
            onMouseLeave={scheduleClose}
          >
            {appMenu.children.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2.5 text-sm tracking-[-0.02em] text-[var(--wiro-romance)] transition-colors hover:bg-white/5 hover:text-[var(--hoahwa-accent)]"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
