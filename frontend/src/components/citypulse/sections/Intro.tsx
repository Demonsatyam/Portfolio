"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { motion } from "motion/react";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { ease } from "@/components/motion/ease";
import { ISO } from "../art/city";
import { Mark } from "../art/Logo";
import { C } from "../art/theme";
import { CityMap, Route } from "../CityMap";
import { DESTS } from "../data";
import { Chapter } from "../ui";

const HERO_CAM = { x: 10.5, y: 9.5, zoom: 1.12 };

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3">
      <nav aria-label="City Pulse" className="mx-auto flex h-14 max-w-6xl items-center justify-between rounded-2xl border border-(--cs-line-soft) bg-(--cs-bg)/75 px-3 backdrop-blur-xl">
        <Link href="/#work" className="rounded-lg px-2 py-2 text-sm text-(--cs-sub) transition-colors hover:text-(--cs-fg)">
          ← Portfolio
        </Link>
        <a href="#top" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
          <Mark size={28} />
          City <span className="-ml-1 text-(--cs-accent)">Pulse</span>
        </a>
        <div className="flex items-center gap-1">
          <ThemeToggle className="text-(--cs-sub) hover:text-(--cs-fg)" />
          <a href="#film" className="rounded-full bg-(--cs-fg) px-4 py-2 text-sm font-medium text-(--cs-bg) transition-transform hover:scale-[1.03] active:scale-95">
            Watch the film
          </a>
        </div>
      </nav>
    </header>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100svh] items-end overflow-hidden px-4 pb-20 pt-32">
      <motion.div className="absolute inset-0" initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.6, ease }}>
        <CityMap view={ISO} cam={HERO_CAM} sun={0.45} density={0.9} className="h-full w-full">
          {(p) => <Route d={p.d(DESTS.office.usual)} color={C.blue} width={9} delay={0.9} duration={2.2} />}
        </CityMap>
      </motion.div>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-(--cs-bg) via-(--cs-bg)/70 to-(--cs-bg)/10" />
      <div className="relative mx-auto w-full max-w-6xl">
        <motion.p className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-(--cs-accent)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          Case study · Agentic AI · 2nd Runner-Up, Google Agentic AI Day 2025
        </motion.p>
        <h1 className="font-display text-[clamp(3rem,9vw,7.5rem)] font-semibold leading-[0.92] tracking-[-0.045em]">
          <SplitText text="Know before" />
          <br />
          <SplitText text="you go." delay={0.15} className="text-(--cs-accent)" />
        </h1>
        <motion.p className="mt-8 max-w-2xl text-lg leading-relaxed text-(--cs-soft) md:text-xl" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.6 }}>
          City Pulse is a multi-agent AI system that reads what the city is saying (posts, photos, reports, traffic and weather), checks what is really happening, and warns commuters and the nearest traffic station before a disruption reaches them.
        </motion.p>
        <motion.dl className="mt-12 grid max-w-3xl grid-cols-2 gap-6 border-t border-(--cs-line-soft) pt-6 md:grid-cols-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.8 }}>
          {[
            ["24/7", "monitoring"],
            ["5", "data sources"],
            ["6", "cooperating agents"],
            ["0", "alerts before verification"],
          ].map(([v, l]) => (
            <div key={l}>
              <dt className="sr-only">{l}</dt>
              <dd className="font-display text-3xl font-semibold tracking-tight">{v}</dd>
              <dd className="mt-1 text-sm text-(--cs-muted)">{l}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}

export function Film() {
  return (
    <Chapter id="film" title="The two-minute version." intro="One commuter, one morning, one incident: the whole system in a narrated film. Every frame is code, built with Remotion. The walkthrough below lets you try each step yourself.">
      <Reveal>
        <div className="overflow-hidden rounded-3xl border border-(--cs-line) bg-black shadow-[0_40px_120px_-40px_rgba(56,211,240,0.35)]">
          <video className="aspect-video w-full" controls preload="metadata" playsInline poster="/city-pulse/poster.jpg">
            <source src="/city-pulse/city-pulse-film.mp4" type="video/mp4" />
            <track kind="captions" src="/city-pulse/captions.vtt" srcLang="en" label="English" default />
          </video>
        </div>
        <p className="mt-4 text-sm text-(--cs-muted)">2:05 · narrated · captions on · demo data throughout</p>
      </Reveal>
    </Chapter>
  );
}
