"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { C } from "../art/theme";
import { IncidentPhoto } from "../art/UI";
import { Chapter, Demo, Panel, Segmented } from "../ui";

type State = "unverified" | "verified";
const ROWS: Record<State, { t: string; s: "ok" | "wait" | "no" }[]> = {
  unverified: [
    { t: "1 report so far", s: "wait" },
    { t: "Location not yet confirmed", s: "wait" },
    { t: "No photo or video evidence yet", s: "wait" },
    { t: "Traffic data looks normal", s: "no" },
  ],
  verified: [
    { t: "4 reports agree", s: "ok" },
    { t: "Location confirmed", s: "ok" },
    { t: "Photo and video evidence", s: "ok" },
    { t: "Traffic data shows slowing", s: "ok" },
  ],
};
const MARK = { ok: ["✓", C.cyan, "#070D1A"], wait: ["…", "#33476B", "#fff"], no: ["✕", "#4A5570", "#fff"] } as const;
const spring = { type: "spring", bounce: 0.1, visualDuration: 0.4 } as const;

export function Verify() {
  const [st, setSt] = useState<State>("unverified");
  const v = st === "verified";
  return (
    <Chapter id="verify" title="Nothing is announced until it's verified." intro="Not every report is reliable. City Pulse cross-checks every potential incident against other reports, the media, the location and live traffic. Unverified reports stay under analysis; only verified ones move on to prediction and alerts.">
      <div className="mb-8">
        <Segmented label="Verification state" value={st} onChange={setSt} options={[{ value: "unverified", label: "Unverified" }, { value: "verified", label: "Verified" }]} />
      </div>
      <div className="grid gap-8 lg:grid-cols-12">
        <motion.div layout className="lg:col-span-7" transition={spring}>
          <Panel className="overflow-hidden" >
            <motion.div className="px-6 py-3 font-mono text-xs font-bold tracking-[0.2em]" animate={{ backgroundColor: v ? "#3E1414" : "#3A2A0C", color: v ? "#FF8A8A" : C.amber }} transition={{ duration: 0.3 }}>
              {v ? "VERIFIED INCIDENT" : "POTENTIAL INCIDENT · UNDER ANALYSIS"}
            </motion.div>
            <div className="p-6">
              <div className="flex items-center gap-5">
                <div className="shrink-0 overflow-hidden rounded-xl">
                  <IncidentPhoto w={150} h={90} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-2xl font-semibold">Accident</p>
                  <p className="text-[#8D9BB5]">Ring Road flyover</p>
                </div>
                <AnimatePresence>
                  {v ? (
                    <motion.span key="b" initial={{ scale: 1.6, opacity: 0, rotate: -8 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} exit={{ scale: 0.8, opacity: 0 }} transition={spring} className="rounded-xl bg-[#EF4B4B] px-3 py-1.5 font-display text-sm font-bold tracking-wider">
                      ✓ VERIFIED
                    </motion.span>
                  ) : null}
                </AnimatePresence>
              </div>
              <ul className="mt-6 space-y-3">
                {ROWS[st].map((r, i) => {
                  const [m, bg, fg] = MARK[r.s];
                  return (
                    <motion.li key={st + r.t} className="flex items-center gap-3" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08, duration: 0.25 }}>
                      <span className="grid size-7 place-items-center rounded-full text-sm font-bold" style={{ background: bg, color: fg }}>{m}</span>
                      <span className={r.s === "ok" ? "text-white" : "text-[#9fb0cc]"}>{r.t}</span>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          </Panel>
        </motion.div>

        <div className="lg:col-span-5">
          <p className="mb-4 text-sm font-medium text-[#8D9BB5]">What happens next</p>
          <ol className="space-y-3">
            {["Predict impact", "Alert affected commuters", "Inform the nearest traffic station"].map((t, i) => (
              <motion.li key={t} className="flex items-center gap-3 rounded-2xl border px-4 py-3" animate={{ opacity: v ? 1 : 0.4, borderColor: v ? "#2FCB6F66" : "#22314F" }} transition={{ delay: v ? i * 0.12 : 0, duration: 0.3 }}>
                <span className="grid size-7 place-items-center rounded-full bg-[#13203A] text-xs font-bold">{i + 1}</span>
                {t}
                <span className="ml-auto text-xs" style={{ color: v ? C.green : "#8D9BB5" }}>{v ? "Proceeds" : "On hold"}</span>
              </motion.li>
            ))}
          </ol>
          <p className="mt-6 text-sm leading-relaxed text-[#8D9BB5]">
            In the film, a post claiming an accident on Lake Road is stopped here: its photo was two years old, the location didn&apos;t match and traffic was normal. No alert went out. <Demo>Demo</Demo>
          </p>
        </div>
      </div>
    </Chapter>
  );
}
