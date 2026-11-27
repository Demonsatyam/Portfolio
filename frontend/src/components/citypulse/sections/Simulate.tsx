"use client";

import { motion } from "motion/react";
import { useState, type ReactNode } from "react";
import { C } from "../art/theme";
import { INCIDENTS, type IncidentKind } from "../data";
import { Chapter, Demo, Panel } from "../ui";

const ICON: Record<IncidentKind, ReactNode> = {
  accident: <path d="M4 15 L7 9 H17 L20 15 V19 H4 Z M7 19 V21 M17 19 V21 M8 15 H9 M15 15 H16" />,
  closure: <path d="M3 9 H21 V14 H3 Z M7 9 L5 14 M12 9 L10 14 M17 9 L15 14 M6 14 V21 M18 14 V21" />,
  rain: <path d="M7 14 A4 4 0 0 1 8 6 A5 5 0 0 1 17 7 A3.5 3.5 0 0 1 17 14 Z M8 17 L7 20 M12 17 L11 20 M16 17 L15 20" />,
  waterlogging: <path d="M3 16 Q6 13 9 16 T15 16 T21 16 M3 20 Q6 17 9 20 T15 20 T21 20 M8 12 V5 H16 V12" />,
};

export function Simulate({ kind, setKind }: { kind: IncidentKind; setKind: (k: IncidentKind) => void }) {
  const [run, setRun] = useState(0);
  const inc = INCIDENTS[kind];
  const pick = (k: IncidentKind) => {
    setKind(k);
    setRun((r) => r + 1);
  };
  const steps: { h: string; c: string; body: ReactNode }[] = [
    { h: "Signals arrive", c: C.blue, body: <List items={inc.signals} /> },
    { h: "Agents analyse", c: C.cyan, body: <p>Social Feed clusters the posts · User Report reads the media · Sentiment weighs the tone</p> },
    { h: "Cross-checked", c: C.cyan, body: <List items={inc.checks} tick /> },
    { h: "Verified incident", c: C.red, body: <p className="font-medium text-white">{inc.title}</p> },
    { h: "Impact predicted", c: C.amber, body: <p>{inc.impact}</p> },
    {
      h: "People alerted",
      c: C.green,
      body: (
        <p>
          Commuters on affected routes get an alert and an alternative (est. delay {inc.delay}). The nearest traffic station gets the report; suggested: {inc.response.toLowerCase()}. The officer decides.
        </p>
      ),
    },
  ];
  return (
    <Chapter id="simulate" title="Simulate an incident." intro="Pick what happens on the road and watch the same pipeline handle it, from the first post to the people who need to know.">
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div role="radiogroup" aria-label="Incident type" className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            {(Object.keys(INCIDENTS) as IncidentKind[]).map((k) => {
              const on = k === kind;
              return (
                <motion.button
                  key={k}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => pick(k)}
                  whileTap={{ scale: 0.97 }}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-[#38D3F0] ${on ? "border-[#F5A524] bg-[#2a1e08]" : "border-[#22314F] bg-[#0B1426] hover:border-[#33476B]"}`}
                >
                  <svg viewBox="0 0 24 24" className="size-7 shrink-0" fill="none" stroke={on ? C.amber : "#8D9BB5"} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    {ICON[k]}
                  </svg>
                  <span className="font-medium">{INCIDENTS[k].label}</span>
                </motion.button>
              );
            })}
          </div>
          <button type="button" onClick={() => setRun((r) => r + 1)} className="mt-4 text-sm text-[#38D3F0] hover:underline">
            ↻ Replay
          </button>
        </div>

        <Panel className="p-6 sm:p-8 lg:col-span-8">
          <div className="mb-6 flex items-center justify-between">
            <p className="font-display text-xl font-semibold">{inc.label}</p>
            <Demo />
          </div>
          <ol key={`${kind}-${run}`} className="relative space-y-6">
            <motion.span aria-hidden className="absolute bottom-3 left-[11px] top-3 w-0.5 origin-top bg-gradient-to-b from-[#4C8DFF] via-[#EF4B4B] to-[#2FCB6F]" initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: steps.length * 0.45, ease: "linear" }} />
            {steps.map((s, i) => (
              <motion.li key={s.h} className="relative pl-10" initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.45, duration: 0.35 }}>
                <span className="absolute left-0 top-0.5 grid size-6 place-items-center rounded-full text-[11px] font-bold text-[#070D1A]" style={{ background: s.c }}>{i + 1}</span>
                <p className="font-semibold" style={{ color: s.c }}>{s.h}</p>
                <div className="mt-1 text-sm leading-relaxed text-[#b4c2db]">{s.body}</div>
              </motion.li>
            ))}
          </ol>
        </Panel>
      </div>
    </Chapter>
  );
}

function List({ items, tick }: { items: string[]; tick?: boolean }) {
  return (
    <ul className="space-y-1">
      {items.map((t) => (
        <li key={t} className="flex gap-2">
          <span className={tick ? "text-[#38D3F0]" : "text-[#4C8DFF]"}>{tick ? "✓" : "•"}</span>
          {t}
        </li>
      ))}
    </ul>
  );
}
