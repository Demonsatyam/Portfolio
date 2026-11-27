"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ControlRoom } from "../art/Officer";
import { C } from "../art/theme";
import { INCIDENTS, type IncidentKind } from "../data";
import { Chapter, Demo, Panel } from "../ui";

const spring = { type: "spring", bounce: 0.12, visualDuration: 0.45 } as const;

export function Authorities({ kind }: { kind: IncidentKind }) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const inc = INCIDENTS[kind];
  const rows: [string, string, string?][] = [
    ["Incident type", inc.label],
    ["Location", inc.place],
    ["Verification", "Verified", C.red],
    ["Sources", "4 reports · 2 photos · 1 video"],
    ["Impact prediction", inc.impact, C.amber],
    ["Suggested response", inc.response],
  ];
  return (
    <Chapter id="authorities" title="The nearest traffic station hears it too." intro="The same verified incident goes to the closest traffic control station, so officers can respond earlier with the evidence in front of them. City Pulse informs; people decide. It never dispatches anyone or controls signals on its own.">
      <div className="grid gap-8 lg:grid-cols-12">
        <Panel className="relative overflow-hidden lg:col-span-6">
          <div className="relative aspect-[8/9] w-full">
            <ControlRoom t={0} alert={open ? 1 : 0.35} reach={done ? 1 : 0} look={open ? 1 : 0} />
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="station-report"
              className="absolute left-1/2 top-[31%] -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline-2 focus-visible:outline-[#38D3F0]"
            >
              <span className="relative flex items-center gap-2 rounded-full border border-[#EF4B4B] bg-[#3E1414]/90 px-4 py-2 text-sm font-semibold text-[#FFB3B3] backdrop-blur">
                {!open ? <span aria-hidden className="absolute -inset-1 rounded-full border-2 border-[#EF4B4B] motion-safe:animate-ping" /> : null}
                <span className="size-2 rounded-full bg-[#EF4B4B]" />
                {open ? "Incident report open" : "Open incident report"}
              </span>
            </button>
          </div>
        </Panel>

        <div className="lg:col-span-6">
          <AnimatePresence mode="wait" initial={false}>
            {!open ? (
              <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full min-h-[300px] items-center rounded-3xl border border-dashed border-[#26365A] p-8 text-[#8D9BB5]">
                A verified incident has just arrived at the station. Open the report on the wall display to see what the officer sees.
              </motion.div>
            ) : (
              <motion.div key="report" id="station-report" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={spring}>
                <Panel className="p-6 sm:p-8">
                  <div className="flex items-center justify-between">
                    <p className="font-display text-2xl font-semibold">Incident report</p>
                    <Demo>Demo · CP-0412</Demo>
                  </div>
                  <dl className="mt-5 divide-y divide-[#1c2a47]">
                    {rows.map(([k, v, c], i) => (
                      <motion.div key={k} className="flex justify-between gap-6 py-3" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}>
                        <dt className="text-sm text-[#8D9BB5]">{k}</dt>
                        <dd className="text-right text-sm font-medium" style={{ color: c ?? "#fff" }}>{v}</dd>
                      </motion.div>
                    ))}
                  </dl>
                  <motion.button
                    type="button"
                    onClick={() => setDone(true)}
                    disabled={done}
                    whileTap={{ scale: 0.97 }}
                    className={`mt-6 w-full rounded-xl border py-3 text-sm font-semibold transition-colors ${done ? "border-[#2FCB6F] bg-[#10291f] text-[#2FCB6F]" : "border-[#2CC7A8] bg-[#2CC7A8] text-[#070D1A] hover:bg-[#3ad8b8]"}`}
                  >
                    {done ? "✓ Response coordinated by the officer" : "Coordinate response (as the officer)"}
                  </motion.button>
                  <p className="mt-3 text-xs text-[#8D9BB5]">The decision stays with the officer. City Pulse supplies the evidence and the prediction.</p>
                </Panel>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Chapter>
  );
}
