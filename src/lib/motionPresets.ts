import type { Transition, Variants } from "framer-motion";

/** Consistent spring for microinteractions — snappy but not jittery. */
export const springSnappy: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 30,
  mass: 0.8,
};

/** Gentle spring for larger layout moves. */
export const springSoft: Transition = {
  type: "spring",
  stiffness: 220,
  damping: 26,
};

/** Tween used for opacity-only fades and long distances. */
export const easeOut: Transition = {
  duration: 0.28,
  ease: [0.16, 1, 0.3, 1],
};

/** Grid container — staggers children on mount. */
export const gridContainer: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
};

/** Grid child — lifts + fades in. */
export const gridItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springSoft,
  },
};

/** Fade up used for hero stats + scroll-triggered blocks. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: easeOut,
  },
};

/** Sequential fade-up used with staggerChildren. */
export const fadeUpStagger: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

/** Shortlist row entry/exit for AnimatePresence. */
export const listRow: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: springSoft },
  exit: {
    opacity: 0,
    y: -4,
    scale: 0.97,
    transition: { duration: 0.18, ease: [0.4, 0, 1, 1] },
  },
};

/** Badge pop for count changes. */
export const badgePop: Variants = {
  initial: { scale: 1 },
  pop: {
    scale: [1, 1.25, 1],
    transition: { duration: 0.4, times: [0, 0.5, 1], ease: "easeOut" },
  },
};

/** Toggle bookmark spring. */
export const bookmarkToggle: Variants = {
  off: { scale: 1, rotate: 0 },
  on: { scale: [1, 1.2, 1], rotate: [0, -8, 0], transition: springSnappy },
};
