"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Reveal } from "@/components/motion/Reveal";
import { ease } from "@/components/motion/ease";
import { Mark } from "../art/Logo";
import { C } from "../art/theme";
import { FLOW, LAYERS } from "../data";
import { Chapter, Panel } from "../ui";

const TONE = { blue: C.blue, cyan: C.cyan, teal: C.teal, white: "#C9D3E1" };

export function Architecture() {
  return (
    <Chapter id="architecture" title="Under the hood." intro="A Google ADK host agent classifies every request and routes it to five specialised sub-agents powered by Gemini. Postgres with PGVector holds the shared memory, Firebase runs the app, and Firebase Cloud Messaging delivers the alerts.">
      {/* the simple version */}
      <ol className="mb-14 flex flex-wrap items-center gap-2">
        {FLOW.map((f, i) => (
          <motion.li key={f} className="flex items-center gap-2" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5, ease }}>
            <span className="rounded-full border border-[#2E4470] bg-[#0B1426] px-4 py-2 text-sm font-medium">{f}</span>
            {i < FLOW.length - 1 ? <span aria-hidden className="text-[#38D3F0]">→</span> : null}
          </motion.li>
        ))}
      </ol>

      {/* the layers */}
      <Panel className="p-4 sm:p-8">
        <ol className="relative space-y-3">
          <motion.span aria-hidden className="absolute bottom-6 left-[18px] top-6 hidden w-px origin-top bg-[#26365A] sm:block" initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease }} />
          {LAYERS.map((l, i) => (
            <motion.li key={l.name} className="relative grid gap-3 rounded-2xl border border-[#1c2a47] bg-[#070D1A] p-4 sm:grid-cols-[220px_1fr] sm:pl-12" initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ delay: 0.15 + i * 0.12, duration: 0.5, ease }}>
              <span aria-hidden className="absolute left-[13px] top-1/2 hidden size-2.5 -translate-y-1/2 rounded-full sm:block" style={{ background: TONE[l.tone] }} />
              <p className="font-display font-semibold" style={{ color: TONE[l.tone] }}>{l.name}</p>
              <div className="flex flex-wrap gap-2">
                {l.items.map((it) => (
                  <span key={it} className="rounded-lg border border-[#22314F] bg-[#0B1426] px-2.5 py-1 text-sm text-[#d3dcec]">{it}</span>
                ))}
              </div>
            </motion.li>
          ))}
        </ol>
      </Panel>
    </Chapter>
  );
}

export function Closing() {
  return (
    <section className="relative overflow-hidden border-t border-[#1c2a47] px-4 pb-16 pt-24 md:pt-32">
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-1/2 h-[380px] w-[760px] -translate-x-1/2 translate-y-1/2 rounded-full bg-[#38D3F0]/15 blur-[140px]" />
      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-2">
          <Reveal>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[#38D3F0]">Designed with limits</p>
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">What City Pulse doesn&apos;t claim.</h2>
            <ul className="mt-6 space-y-3 text-[#b4c2db]">
              {[
                "It improves awareness; it doesn't guarantee fewer accidents or less traffic.",
                "It never dispatches police or emergency services, or controls traffic signals.",
                "Nothing is alerted before it is verified, and no AI is perfectly accurate.",
                "Delays and figures in this walkthrough are simulated demo data.",
              ].map((t) => (
                <li key={t} className="flex gap-3"><span className="text-[#8D9BB5]">—</span>{t}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[#38D3F0]">Outcome</p>
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">2nd Runner-Up, Google Agentic AI Day 2025.</h2>
            <p className="mt-6 text-[#b4c2db]">Built and pitched as a working multi-agent system, from social signals to a verified, personalised alert.</p>
          </Reveal>
        </div>

        <Reveal className="mt-24 flex flex-col items-start justify-between gap-8 border-t border-[#1c2a47] pt-10 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <Mark size={56} />
            <div>
              <p className="font-display text-2xl font-semibold">City <span className="text-[#38D3F0]">Pulse</span></p>
              <p className="text-[#8D9BB5]">Know before you go.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="#film" className="rounded-full border border-[#2E4470] px-5 py-3 text-sm transition hover:border-[#8D9BB5]">↑ Watch the film</a>
            <Link href="/#work" className="rounded-full bg-white px-5 py-3 text-sm font-medium text-[#070D1A] transition hover:scale-[1.03] active:scale-95">
              Back to all work
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
