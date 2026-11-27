"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { classify, D, SIGNATURES } from "../data";
import { Chapter, Chip, Panel } from "../ui";

const PRESETS = ["www.youtube.com", "m.facebook.com", "www.google.com", "github.com", "example.org"];
const STEPS = ["Domain", "Signature matching", "AppType", "Flow classification"];

export function Classify() {
  const [host, setHost] = useState("www.youtube.com");
  const app = classify(host);
  const match = SIGNATURES.find(([k]) => host.toLowerCase().includes(k))?.[0];
  const unknown = app === "UNKNOWN";
  const tone = !app ? "var(--cs-muted)" : unknown ? "var(--cs-muted)" : D.purple;
  return (
    <Chapter id="classify" title="From a name to an application." intro="Once a hostname is extracted, the engine compares it against known application signatures. Recognized traffic gets an application type; anything else is labelled Unknown. The result is stored on the flow, so every later packet of that connection carries it. Try a hostname.">
      <ol className="mb-10 flex flex-wrap items-center gap-2">
        {STEPS.map((s, i) => (
          <li key={s} className="flex items-center gap-2">
            <span className="rounded-full border border-[#795CFF]/60 bg-[#795CFF]/10 px-4 py-2 text-sm font-medium">{s}</span>
            {i < STEPS.length - 1 ? <span aria-hidden className="text-[#795CFF]">→</span> : null}
          </li>
        ))}
      </ol>
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <label htmlFor="dpi-host" className="text-sm text-(--cs-muted)">Hostname (from SNI or the HTTP Host header)</label>
          <input id="dpi-host" value={host} onChange={(e) => setHost(e.target.value)} spellCheck={false} autoComplete="off" className="mt-2 w-full rounded-2xl border border-(--cs-line) bg-(--cs-panel) px-5 py-4 font-mono text-lg outline-none transition-colors focus:border-(--cs-accent)" />
          <div className="mt-3 flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button key={p} type="button" onClick={() => setHost(p)} className={`rounded-full border px-3 py-1 font-mono text-xs transition-colors ${p === host ? "border-(--cs-accent) text-(--cs-fg)" : "border-(--cs-line) text-(--cs-muted) hover:text-(--cs-fg)"}`}>{p}</button>
            ))}
          </div>
          <div className="mt-8 flex min-h-14 items-center gap-3">
            <span className="text-sm text-(--cs-muted)">Result</span>
            <AnimatePresence mode="popLayout">
              {app ? (
                <motion.span key={app} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ type: "spring", bounce: 0.3, visualDuration: 0.3 }}>
                  <Chip color={tone} solid={!unknown}>{unknown ? "UNKNOWN" : `AppType::${app}`}</Chip>
                </motion.span>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
        <Panel className="p-6 sm:p-8 lg:col-span-6">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-(--cs-muted)">Signatures in this demo</p>
          <ul className="space-y-2">
            {SIGNATURES.map(([k, v]) => {
              const on = k === match;
              return (
                <li key={k} className="flex items-center justify-between rounded-xl border px-4 py-3 font-mono text-sm transition-colors duration-300" style={{ borderColor: on ? D.purple : "var(--cs-line-soft)", backgroundColor: on ? "rgba(121,92,255,0.15)" : "transparent" }}>
                  <span>contains “{k}”</span>
                  <span style={{ color: on ? "var(--cs-fg)" : "var(--cs-muted)" }}>→ {v}</span>
                </li>
              );
            })}
          </ul>
          <p className="mt-5 text-sm leading-relaxed text-(--cs-muted)">Only domains with a known signature are recognized. The engine does not claim to detect every application.</p>
        </Panel>
      </div>
    </Chapter>
  );
}
