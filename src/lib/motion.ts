import type { Variants, Transition } from "framer-motion";

export const easeOutExpo: Transition = {
  duration: 0.85,
  ease: [0.16, 1, 0.3, 1],
};

export const easeInOut: Transition = {
  duration: 0.6,
  ease: [0.65, 0, 0.35, 1],
};

/** Enter + exit when scrolling in/out of viewport */
export const revealViewport = {
  once: true,
  amount: 0.25,
  margin: "0px 0px -8% 0px",
} as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: easeOutExpo,
  },
  exit: {
    opacity: 0,
    y: -32,
    transition: { duration: 0.45, ease: [0.4, 0, 1, 1] },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, transition: { duration: 0.4 } },
};

export const clipUp: Variants = {
  hidden: { opacity: 0, y: "110%" },
  visible: {
    opacity: 1,
    y: 0,
    transition: easeOutExpo,
  },
  exit: {
    opacity: 0,
    y: "-60%",
    transition: { duration: 0.5, ease: [0.4, 0, 1, 1] },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 1.04,
    transition: { duration: 0.5 },
  },
};

export const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: easeOutExpo,
  },
  exit: {
    opacity: 0,
    x: 24,
    transition: { duration: 0.35 },
  },
};

export const staggerContainer = (stagger = 0.1, delay = 0.05): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
});

export const menuOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35 } },
  exit: { opacity: 0, transition: { duration: 0.3, delay: 0.1 } },
};

export const menuPanel: Variants = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.25 },
  },
};

export const menuSlide: Variants = {
  hidden: { opacity: 0, x: "100%" },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 320, damping: 32, mass: 0.85 },
  },
  exit: {
    opacity: 0,
    x: "100%",
    transition: { duration: 0.32, ease: [0.4, 0, 0.2, 1] },
  },
};

export const menuSlideReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const menuRootPanel: Variants = {
  hidden: { opacity: 0, x: "-6%" },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 360, damping: 36 },
  },
  exit: {
    opacity: 0,
    x: "-4%",
    transition: { duration: 0.28, ease: [0.4, 0, 1, 1] },
  },
};

export const menuRootPanelReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};
