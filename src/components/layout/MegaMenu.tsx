"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  pillars,
  secondaryLinks,
  type NavPillar,
} from "@/content/navigation";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { Button } from "@/components/shared/Button";
import {
  fadeUp,
  menuOverlay,
  menuPanel,
  menuRootPanel,
  menuRootPanelReduced,
  menuSlide,
  menuSlideReduced,
  staggerContainer,
} from "@/lib/motion";

type MegaMenuProps = {
  open: boolean;
  onClose: () => void;
};

export function MegaMenu({ open, onClose }: MegaMenuProps) {
  const [activePillar, setActivePillar] = useState<NavPillar["id"] | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (activePillar) setActivePillar(null);
        else onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, activePillar]);

  useEffect(() => {
    if (open && panelRef.current) {
      panelRef.current.focus({ preventScroll: true });
    }
  }, [open, activePillar]);

  const subPanelVariants = reduceMotion ? menuSlideReduced : menuSlide;
  const rootPanelVariants = reduceMotion ? menuRootPanelReduced : menuRootPanel;

  return (
    <AnimatePresence onExitComplete={() => setActivePillar(null)}>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] bg-[var(--wiro-black)] touch-none"
          data-testid="mega-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Main navigation"
          variants={menuOverlay}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            className="flex h-full flex-col outline-none"
            variants={menuPanel}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-white/15 px-5 py-4 md:px-8">
              <AnimatePresence mode="wait" initial={false}>
                {activePillar ? (
                  <motion.button
                    key="back"
                    type="button"
                    data-testid="mega-menu-back"
                    className="text-sm text-[var(--wiro-romance)]/60 hover:text-[var(--wiro-mauve)]"
                    onClick={() => setActivePillar(null)}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={
                      reduceMotion
                        ? { duration: 0.15 }
                        : { type: "spring", stiffness: 400, damping: 30 }
                    }
                  >
                    ← Back
                  </motion.button>
                ) : (
                  <motion.span
                    key="menu-label"
                    className="text-sm text-[var(--wiro-romance)]/60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    Menu
                  </motion.span>
                )}
              </AnimatePresence>
              <motion.button
                type="button"
                className="text-sm uppercase tracking-widest text-[var(--wiro-romance)] hover:text-[var(--wiro-mauve)]"
                onClick={onClose}
                aria-label="Close menu"
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.15 }}
              >
                Close
              </motion.button>
            </div>

            <div className="relative min-h-0 flex-1 overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                {!activePillar ? (
                  <motion.div
                    key="root"
                    className="absolute inset-0 flex flex-col overflow-y-auto overscroll-contain px-5 py-8 md:px-8"
                    variants={rootPanelVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    style={{ willChange: "transform, opacity" }}
                  >
                    <motion.div
                      className="flex flex-1 flex-col gap-10 md:flex-row md:gap-16"
                      variants={staggerContainer(0.07, 0.04)}
                      initial="hidden"
                      animate="visible"
                    >
                      <nav className="flex flex-col gap-4 md:flex-1">
                        {pillars.map((pillar) => (
                          <motion.button
                            key={pillar.id}
                            type="button"
                            data-testid={`mega-panel-${pillar.id}`}
                            variants={fadeUp}
                            className="group text-left text-4xl font-semibold tracking-tight text-[var(--wiro-romance)] md:text-5xl"
                            onClick={() => setActivePillar(pillar.id)}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span className="inline-block transition-colors duration-300 group-hover:translate-x-1 group-hover:text-[var(--wiro-mauve)]">
                              {pillar.label}
                            </span>
                            <span className="ml-2 inline-block opacity-60 transition-transform duration-300 group-hover:translate-x-1">
                              →
                            </span>
                          </motion.button>
                        ))}
                      </nav>
                      <div className="flex flex-col justify-between md:w-80">
                        <motion.nav
                          className="flex flex-col gap-3 border-t border-white/15 pt-8 md:border-t-0 md:pt-0"
                          variants={staggerContainer(0.05, 0.15)}
                        >
                          {secondaryLinks.map((link) => (
                            <motion.div key={link.label} variants={fadeUp}>
                              <Link
                                href={link.href}
                                className="text-[var(--wiro-romance)]/60 hover:text-[var(--wiro-romance)]"
                                onClick={onClose}
                              >
                                {link.label}
                              </Link>
                            </motion.div>
                          ))}
                        </motion.nav>
                        <motion.div className="mt-10" variants={fadeUp}>
                          <Button href="/contact" onClick={onClose}>
                            Lets Talk{" "}
                            <Image
                              src="/LOGO HOAHWA/hoahwa_logo_board-08.png"
                              alt="Hoahwa"
                              width={120}
                              height={30}
                              className="inline-block h-[1em] w-auto align-middle"
                            />
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  </motion.div>
                ) : (
                  pillars
                    .filter((p) => p.id === activePillar)
                    .map((pillar) => (
                      <motion.div
                        key={pillar.id}
                        className="absolute inset-0 flex flex-col overflow-y-auto overscroll-contain px-5 py-8 md:px-8"
                        variants={subPanelVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        style={{ willChange: "transform, opacity" }}
                      >
                        <motion.div
                          className="flex flex-1 flex-col gap-10 md:flex-row"
                          variants={staggerContainer(0.06, 0.08)}
                          initial="hidden"
                          animate="visible"
                        >
                          <div className="md:flex-1">
                            <motion.div variants={fadeUp}>
                              <Link
                                href={pillar.href}
                                className="mb-8 block text-4xl font-semibold text-[var(--wiro-romance)] hover:text-[var(--wiro-mauve)] md:text-5xl"
                                onClick={onClose}
                              >
                                {pillar.label}
                              </Link>
                            </motion.div>
                            <ul className="flex flex-col gap-4">
                              {pillar.children.map((child) => (
                                <motion.li key={child.label} variants={fadeUp}>
                                  <Link
                                    href={child.href}
                                    className="text-xl text-[var(--wiro-romance)]/60 hover:text-[var(--wiro-romance)] md:text-2xl"
                                    onClick={onClose}
                                  >
                                    {child.label}
                                  </Link>
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex flex-col justify-between md:w-80">
                            <nav className="flex flex-col gap-3">
                              {secondaryLinks.map((link) => (
                                <Link
                                  key={link.label}
                                  href={link.href}
                                  className="text-[var(--wiro-romance)]/60 hover:text-[var(--wiro-romance)]"
                                  onClick={onClose}
                                >
                                  {link.label}
                                </Link>
                              ))}
                            </nav>
                            <Button href="/contact" className="mt-10" onClick={onClose}>
                              Lets Talk{" "}
                              <Image
                                src="/LOGO HOAHWA/hoahwa_logo_board-08.png"
                                alt="Hoahwa"
                                width={120}
                                height={30}
                                className="inline-block h-[1em] w-auto align-middle"
                              />
                            </Button>
                          </div>
                        </motion.div>
                      </motion.div>
                    ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
