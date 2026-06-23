"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";
import {
  VIBE_TOAST_MESSAGES,
  VIBE_WELCOME_SESSION_KEY,
  VIBE_WELCOME_TOAST,
  type VibeId,
} from "@/lib/vibe";

const TOAST_DURATION_MS = 3000;

export function useVibeToast() {
  const [message, setMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const welcomeShownRef = useRef(false);

  const dismiss = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setVisible(false);
  }, []);

  const show = useCallback(
    (text: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setMessage(text);
      setVisible(true);
      timerRef.current = setTimeout(() => {
        setVisible(false);
        timerRef.current = null;
      }, TOAST_DURATION_MS);
    },
    [],
  );

  const showForVibe = useCallback(
    (vibe: VibeId) => {
      show(VIBE_TOAST_MESSAGES[vibe]);
    },
    [show],
  );

  useEffect(() => {
    if (welcomeShownRef.current) return;
    welcomeShownRef.current = true;

    try {
      if (sessionStorage.getItem(VIBE_WELCOME_SESSION_KEY)) return;
      sessionStorage.setItem(VIBE_WELCOME_SESSION_KEY, "1");
    } catch {
      /* private browsing */
    }

    const t = window.setTimeout(() => show(VIBE_WELCOME_TOAST), 400);
    return () => window.clearTimeout(t);
  }, [show]);

  useEffect(() => {
    if (!visible) return;

    const onScroll = () => dismiss();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [visible, dismiss]);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return { message, visible, showForVibe, dismiss };
}

type VibeToastBubbleProps = {
  message: string | null;
  visible: boolean;
  placement?: "below" | "above";
  className?: string;
};

export function VibeToastBubble({
  message,
  visible,
  placement = "below",
  className,
}: VibeToastBubbleProps) {
  return (
    <AnimatePresence>
      {visible && message ? (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: placement === "below" ? -6 : 6, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: placement === "below" ? -4 : 4, scale: 0.98 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "pointer-events-none absolute right-0 z-[70] w-max max-w-[min(240px,calc(100vw-2rem))]",
            placement === "below" ? "top-full mt-2" : "bottom-full mb-2",
            className,
          )}
        >
          <p className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-dark)] px-3 py-1.5 text-center text-xs font-medium tracking-[-0.02em] text-[var(--text-on-dark)] shadow-[var(--shadow-header)] backdrop-blur-sm sm:text-sm sm:px-4 sm:py-2">
            {message}
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
