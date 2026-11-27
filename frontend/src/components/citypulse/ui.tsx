"use client";

import { motion } from "motion/react";
import { useId, type ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { CHAPTERS } from "./data";

export function Chapter({ id, title, intro, children, className = "" }: { id: (typeof CHAPTERS)[number]["id"]; title: ReactNode; intro?: ReactNode; children: ReactNode; className?: string }) {
  const n = CHAPTERS.findIndex((c) => c.id === id);
  return (
    <section id={id} className={`scroll-mt-24 px-4 py-24 md:py-32 ${className}`}>
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-12 max-w-3xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[#38D3F0]">
            {String(n).padStart(2, "0")} · {CHAPTERS[n].label}
          </p>
          <h2 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-[1.02] tracking-[-0.035em]">{title}</h2>
          {intro ? <p className="mt-5 text-lg leading-relaxed text-[#9fb0cc]">{intro}</p> : null}
        </Reveal>
        {children}
      </div>
    </section>
  );
}

/** Pill toggle; the highlight slides between options. */
export function Segmented<T extends string>({ value, options, onChange, label }: { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void; label: string }) {
  const id = useId();
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex flex-wrap gap-1 rounded-2xl border border-[#26365A] bg-[#0B1426] p-1">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={`relative rounded-xl px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38D3F0] ${on ? "text-[#070D1A]" : "text-[#9fb0cc] hover:text-white"}`}
          >
            {on ? <motion.span layoutId={`seg-${id}`} className="absolute inset-0 rounded-xl bg-[#38D3F0]" transition={{ type: "spring", bounce: 0.15, visualDuration: 0.35 }} /> : null}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export const Demo = ({ children = "Simulated demo data" }: { children?: ReactNode }) => (
  <span className="rounded-md border border-[#33476B] px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-[#8D9BB5]">{children}</span>
);

/** A panel framed like the film's UI surfaces. */
export const Panel = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`rounded-3xl border border-[#22314F] bg-[#0B1426]/90 ${className}`}>{children}</div>
);
