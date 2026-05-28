"use client";

import { motion, type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const flowerVariants: Variants = {
  hidden: { scale: 0, rotate: -45, opacity: 0 },
  visible: {
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

export function FlowersOverlay({ className }: { className?: string }) {
  const flowers = [
    { className: "flower1" },
    { className: "flower2" },
    { className: "flower3" },
    { className: "flower4" },
    { className: "flower5" },
    { className: "flower6" },
  ];

  return (
    <motion.div
      className={`flower-container ${className || ""}`}
      variants={containerVariants}
    >
      {flowers.map((f, i) => (
        <motion.div
          key={i}
          className={`flower ${f.className}`}
          variants={flowerVariants}
        >
          <div className="petal one" />
          <div className="petal two" />
          <div className="petal three" />
          <div className="petal four" />
        </motion.div>
      ))}
    </motion.div>
  );
}
