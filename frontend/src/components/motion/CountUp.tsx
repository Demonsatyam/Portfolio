"use client";

import { animate, motion, useInView, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { ease } from "./ease";

/** Number that counts up once visible. */
export function CountUp({ to, decimals = 0, suffix = "" }: { to: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const v = useMotionValue(0);
  const text = useTransform(v, (n) => n.toLocaleString("en-US", { maximumFractionDigits: decimals, minimumFractionDigits: decimals }) + suffix);
  useEffect(() => {
    if (inView) animate(v, to, { duration: 1.6, ease });
  }, [inView, to, v]);
  return <motion.span ref={ref}>{text}</motion.span>;
}
