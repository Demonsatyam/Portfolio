"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { motion } from "motion/react";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { ease } from "@/components/motion/ease";
import { D } from "../data";
import { Chapter, Envelope } from "../ui";

export const Mark = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
    <rect x={2} y={7} width={22} height={15} rx={3} fill={`${D.blue}33`} stroke={D.blue} strokeWidth={2} />
    <path d="M3 9 L13 16 L23 9" stroke={D.blue} strokeWidth={2} fill="none" />
    <circle cx={22} cy={20} r={6} fill={"var(--cs-bg)"} stroke={D.cyan} strokeWidth={2.2} />
    <path d="M26.5 24.5 L30 28" stroke={D.cyan} strokeWidth={2.4} strokeLinecap="round" />
  </svg>
);

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3">
      <nav aria-label="DPI Engine" className="mx-auto flex h-14 max-w-6xl items-center justify-between rounded-2xl border border-(--cs-line-soft) bg-(--cs-bg)/75 px-3 backdrop-blur-xl">
        <Link href="/#work" className="rounded-lg px-2 py-2 text-sm text-(--cs-sub) transition-colors hover:text-(--cs-fg)">
          ← Portfolio
        </Link>
        <a href="#top" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
          <Mark />
          DPI <span className="-ml-1 text-(--cs-accent)">Engine</span>
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

const LANES = [0.18, 0.34, 0.5, 0.66, 0.82];
const COLS = [D.blue, D.cyan, D.blue, D.purple, D.cyan];

/** Packets streaming through a scanning gate: a quiet, looping backdrop. */
function Stream() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-5%,#2678FF2A,transparent_70%)]" />
      {LANES.map((y, l) => (
        <div key={l} className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[#2678FF]/40 to-transparent" style={{ top: `${y * 100}%` }}>
          {[0, 1, 2, 3].map((k) => (
            <motion.div
              key={k}
              className="absolute -top-3"
              initial={{ x: "-10vw" }}
              animate={{ x: "110vw" }}
              transition={{ duration: 9 + l * 1.3, repeat: Infinity, ease: "linear", delay: -k * (9 + l * 1.3) / 4 - l }}
            >
              <Envelope color={COLS[(l + k) % 5]} className="h-6 w-9" />
            </motion.div>
          ))}
        </div>
      ))}
      {/* the inspection gate */}
      <div className="absolute inset-y-[10%] left-[62%] w-px bg-(--cs-accent) shadow-[0_0_30px_#00D4FF]" />
      <motion.div className="absolute inset-y-[10%] left-[62%] w-24 -translate-x-1/2 bg-gradient-to-r from-transparent via-(--cs-accent)/15 to-transparent" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2.4, repeat: Infinity }} />
    </div>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100svh] items-end overflow-hidden px-4 pb-20 pt-32">
      <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.6, ease }}>
        <Stream />
      </motion.div>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-(--cs-bg) via-(--cs-bg)/75 to-(--cs-bg)/20" />
      <div className="relative mx-auto w-full max-w-6xl">
        <motion.p className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-(--cs-accent)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          Case study · Networking · Deep Packet Inspection
        </motion.p>
        <h1 className="font-display text-[clamp(3rem,9vw,7.5rem)] font-semibold leading-[0.92] tracking-[-0.045em]">
          <SplitText text="Not just packets." />
          <br />
          <SplitText text="The traffic." delay={0.15} className="text-(--cs-accent)" />
        </h1>
        <motion.p className="mt-8 max-w-2xl text-lg leading-relaxed text-(--cs-soft) md:text-xl" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.6 }}>
          The DPI Engine reads captured network traffic, takes every packet apart, works out which application a connection belongs to, applies blocking rules, and writes a filtered capture with a report of what it saw.
        </motion.p>
        <motion.dl className="mt-12 grid max-w-3xl grid-cols-2 gap-6 border-t border-(--cs-line-soft) pt-6 md:grid-cols-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.8 }}>
          {[
            ["4", "header layers parsed"],
            ["5", "values name a flow"],
            ["3", "kinds of blocking rule"],
            ["0", "bytes decrypted"],
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
    <Chapter id="film" title="The six-minute version." intro="One user opens one website, and we follow a single packet all the way through the engine. Every frame is code, built with Remotion. The walkthrough below lets you try each step yourself.">
      <Reveal>
        <div className="overflow-hidden rounded-3xl border border-(--cs-line) bg-black shadow-[0_40px_120px_-40px_rgba(0,212,255,0.35)]">
          <video className="aspect-video w-full" controls preload="metadata" playsInline poster="/dpi/poster.jpg">
            <source src="/dpi/dpi-engine-film.mp4" type="video/mp4" />
            <track kind="captions" src="/dpi/captions.vtt" srcLang="en" label="English" default />
          </video>
        </div>
        <p className="mt-4 text-sm text-(--cs-muted)">5:54 · narrated · captions on · sample values throughout</p>
      </Reveal>
    </Chapter>
  );
}
