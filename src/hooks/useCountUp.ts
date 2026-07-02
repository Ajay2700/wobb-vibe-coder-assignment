import { useEffect, useState } from "react";
import {
  animate,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";

/** Animate a numeric value from 0 → target using framer-motion's tween engine.
 *  Respects prefers-reduced-motion via useReducedMotion. */
export function useCountUp(
  target: number,
  { duration = 1.1, delay = 0 }: { duration?: number; delay?: number } = {}
): number {
  const prefersReduced = useReducedMotion();
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    return rounded.on("change", (v) => setDisplay(v));
  }, [rounded]);

  useEffect(() => {
    const controls = animate(mv, target, {
      duration: prefersReduced ? 0 : duration,
      delay: prefersReduced ? 0 : delay,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [mv, target, duration, delay, prefersReduced]);

  return display;
}
