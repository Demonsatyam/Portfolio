"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { SplitText } from "@/components/motion/SplitText";
import { HeroShowreel } from "@/components/reel/HeroShowreel";
import { profile } from "@/data/portfolio";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Showreel tilts flat and grows as it scrolls into place.
  const rotateX = useTransform(scrollYProgress, [0, 0.45], [22, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.45], [0.88, 1]);

  return (
    <section id="top" className="relative overflow-hidden px-4 pt-36 pb-24 md:pt-44">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-accent/20 blur-[140px]"
      />
      <div className="relative mx-auto max-w-6xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs text-muted"
        >
          <span className="size-1.5 rounded-full bg-green-500" /> {profile.role} · open to new roles
        </motion.p>
        <h1 className="font-display text-[clamp(2.6rem,8vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
          <SplitText text="I build the backends" />
          <br />
          <SplitText text="your apps run on." delay={0.25} className="text-muted" />
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mx-auto mt-8 max-w-xl text-lg text-muted"
        >
          {profile.name}, an engineer focused on APIs, microservices, cloud infrastructure and the Android &amp; iOS apps
          built on top of them.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          className="mt-10 flex flex-wrap justify-center gap-3"
        >
          <a href="#work" className="rounded-full bg-accent px-6 py-3 font-medium text-white transition hover:brightness-110 active:scale-95">
            See my work
          </a>
          <a href={`mailto:${profile.email}`} className="rounded-full border border-line bg-surface px-6 py-3 font-medium transition hover:border-muted active:scale-95">
            Get in touch
          </a>
        </motion.div>
      </div>
      <div ref={ref} className="relative mx-auto mt-20 max-w-5xl [perspective:1200px]">
        <HeroShowreel rotateX={rotateX} scale={scale} />
      </div>
    </section>
  );
}
