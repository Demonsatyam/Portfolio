"use client";

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { useCallback, useState } from "react";
import { HERO_DURATION, SCENES } from "@/remotion/timeline";
import { Reel } from "./Reel";

/** Remotion showreel wrapped in Motion: cursor tilt, live scene label, progress bar and play/pause. */
export function HeroShowreel({ rotateX, scale }: { rotateX: MotionValue<number>; scale: MotionValue<number> }) {
  const [paused, setPaused] = useState(false);
  const [scene, setScene] = useState(0);
  const frame = useMotionValue(0);
  const progress = useTransform(frame, [0, HERO_DURATION - 1], [0, 1]);

  // Cursor tilt, springy; added on top of the scroll-driven tilt.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const tiltX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 120, damping: 18 });
  const tiltY = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), { stiffness: 120, damping: 18 });
  const rx = useTransform(() => rotateX.get() + tiltX.get());

  const onFrame = useCallback(
    (f: number) => {
      frame.set(f);
      // ponytail: linear scan of 4 scenes per frame — fine.
      let i = 0;
      SCENES.forEach((s, k) => f >= s.from + 6 && (i = k));
      setScene(i);
    },
    [frame],
  );

  return (
    <motion.div
      style={{ rotateX: rx, rotateY: tiltY, scale }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => (mx.set(0), my.set(0))}
      className="group relative overflow-hidden rounded-3xl border border-line shadow-[0_40px_120px_-20px_rgba(61,123,255,0.35)]"
    >
      <Reel
        id="hero"
        paused={paused}
        onFrame={onFrame}
        threshold={0.6}
        label="Motion-graphics showreel: a tap on a phone becomes an API request, travels through a gateway, services and databases, then latency and uptime metrics count up."
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black/70 to-transparent p-3 pt-10 md:p-5 md:pt-14">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={scene}
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
            transition={{ duration: 0.35 }}
            className="rounded-full border border-white/10 bg-black/50 px-3 py-1 font-mono text-[11px] text-white/80 backdrop-blur md:text-xs"
          >
            0{scene + 1} — {SCENES[scene].label}
          </motion.span>
        </AnimatePresence>
        <button
          type="button"
          onClick={() => setPaused(!paused)}
          aria-label={paused ? "Play showreel" : "Pause showreel"}
          className="pointer-events-auto grid size-9 place-items-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur transition hover:scale-110 active:scale-95"
        >
          {paused ? (
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden><path d="M2 1l9 5-9 5z" fill="currentColor" /></svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden><path d="M2 1h3v10H2zM7 1h3v10H7z" fill="currentColor" /></svg>
          )}
        </button>
      </div>
      <motion.div style={{ scaleX: progress }} className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-accent" />
    </motion.div>
  );
}
