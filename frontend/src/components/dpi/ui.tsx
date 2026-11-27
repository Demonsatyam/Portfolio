"use client";

import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { CHAPTERS, type ChapterId } from "./data";

// Segmented, Demo and Panel are shared with the City Pulse walkthrough.
export { Demo, Panel, Segmented } from "../citypulse/ui";

export function Chapter({ id, title, intro, children, className = "" }: { id: ChapterId; title: ReactNode; intro?: ReactNode; children: ReactNode; className?: string }) {
  const n = CHAPTERS.findIndex((c) => c.id === id);
  return (
    <section id={id} className={`scroll-mt-24 px-4 py-24 md:py-32 ${className}`}>
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-12 max-w-3xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-(--cs-accent)">
            {String(n).padStart(2, "0")} · {CHAPTERS[n].label}
          </p>
          <h2 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-[1.02] tracking-[-0.035em]">{title}</h2>
          {intro ? <p className="mt-5 text-lg leading-relaxed text-(--cs-sub)">{intro}</p> : null}
        </Reveal>
        {children}
      </div>
    </section>
  );
}

/** Small mono chip. */
export const Chip = ({ color, children, solid }: { color: string; children: ReactNode; solid?: boolean }) => (
  <span className="inline-flex items-center whitespace-nowrap rounded-lg border px-2.5 py-1 font-mono text-xs" style={{ borderColor: color, background: solid ? color : `color-mix(in srgb, ${color} 12%, transparent)`, color: solid ? "var(--cs-bg)" : "var(--cs-fg)" }}>
    {children}
  </span>
);

/** Envelope glyph used for packets everywhere on the page. */
export const Envelope = ({ color, className = "size-8" }: { color: string; className?: string }) => (
  <svg viewBox="0 0 52 34" className={className} aria-hidden style={{ filter: `drop-shadow(0 0 6px ${color})` }}>
    <rect x={1} y={1} width={50} height={32} rx={6} fill={`${color}33`} stroke={color} strokeWidth={2.5} />
    <path d="M3 4 L26 20 L49 4" stroke={color} strokeWidth={2.5} fill="none" strokeLinejoin="round" />
  </svg>
);
