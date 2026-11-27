"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { D, FLOWS, HELLO_AT, SEQ } from "../data";
import { Chapter, Demo, Panel } from "../ui";

type Rules = { ip: boolean; app: boolean; domain: boolean };
const RULES: { k: keyof Rules; name: string; value: string }[] = [
  { k: "ip", name: "IP rule", value: "192.168.1.50" },
  { k: "app", name: "Application rule", value: "YouTube" },
  { k: "domain", name: "Domain rule", value: "tiktok" },
];

export function Block() {
  const [rules, setRules] = useState<Rules>({ ip: true, app: true, domain: true });
  const [fid, setFid] = useState("yt");
  const [run, setRun] = useState(0);
  const f = FLOWS.find((x) => x.id === fid)!;
  const gates = [
    { q: "Source IP blocked?", hit: rules.ip && f.src === "192.168.1.50" },
    { q: "Application blocked?", hit: rules.app && f.app === "YOUTUBE" },
    { q: "Domain matches a rule?", hit: rules.domain && f.host.includes("tiktok") },
  ];
  const fromStart = gates[0].hit; // the source IP is known from the first packet
  const afterHello = !fromStart && (gates[1].hit || gates[2].hit); // app/domain only known at the Client Hello
  const verdict = (i: number) => (fromStart ? "drop" : afterHello && i > HELLO_AT ? "drop" : afterHello && i === HELLO_AT ? "id" : "fwd");
  const blocked = fromStart || afterHello;

  return (
    <Chapter id="block" title="Rules, flows, and timing." intro="The security administrator configures IP, application and domain rules. When a flow is identified as blocked, the engine marks the connection and drops the packets that follow. Toggle the rules, pick a connection, and watch when the blocking starts.">
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-4">
          <Panel className="p-5">
            <p className="mb-3 font-display text-lg font-semibold">Blocking rules</p>
            {RULES.map((r) => (
              <label key={r.k} className="flex cursor-pointer items-center gap-3 border-t border-(--cs-line-soft) py-3">
                <span className="min-w-0 flex-1">
                  <span className="block text-sm">{r.name}</span>
                  <span className="font-mono text-xs text-(--cs-muted)">{r.value}</span>
                </span>
                <input type="checkbox" className="peer sr-only" checked={rules[r.k]} onChange={() => { setRules((x) => ({ ...x, [r.k]: !x[r.k] })); setRun((n) => n + 1); }} />
                <span aria-hidden className={`relative h-6 w-11 rounded-full transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-(--cs-accent) ${rules[r.k] ? "bg-[#FF4545]" : "bg-(--cs-line)"}`}>
                  <motion.span className="absolute top-1 size-4 rounded-full bg-white" animate={{ left: rules[r.k] ? 24 : 4 }} transition={{ type: "spring", bounce: 0.3, visualDuration: 0.25 }} />
                </span>
              </label>
            ))}
          </Panel>
          <div role="radiogroup" aria-label="Connection" className="grid grid-cols-2 gap-2">
            {FLOWS.map((x) => (
              <button key={x.id} type="button" role="radio" aria-checked={x.id === fid} onClick={() => { setFid(x.id); setRun((n) => n + 1); }} className={`rounded-2xl border px-3 py-3 text-left transition-colors ${x.id === fid ? "border-(--cs-accent) bg-(--cs-accent)/10" : "border-(--cs-line) hover:border-(--cs-line-strong)"}`}>
                <span className="block text-sm font-medium">{x.label}</span>
                <span className="block truncate font-mono text-[11px] text-(--cs-muted)">{x.host}</span>
                <span className="block font-mono text-[11px] text-(--cs-dim)">from {x.src}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-8">
          <Panel className="p-6 sm:p-8">
            <div className="mb-6 grid gap-2 sm:grid-cols-3">
              {gates.map((g, i) => (
                <div key={g.q} className="rounded-xl border px-3 py-2.5" style={{ borderColor: g.hit ? D.red : "var(--cs-line-soft)", background: g.hit ? `${D.red}1A` : "transparent" }}>
                  <p className="text-xs text-(--cs-muted)">{i + 1}. {g.q}</p>
                  <p className="mt-1 font-mono text-sm" style={{ color: g.hit ? D.red : D.green }}>{g.hit ? "yes → block flow" : "no"}</p>
                </div>
              ))}
            </div>
            <div className="mb-4 flex items-center justify-between">
              <p className="font-mono text-xs text-(--cs-muted)">flow · {f.src} → {f.host}:443</p>
              <motion.span key={`${fid}-${run}-b`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: blocked ? (fromStart ? 0.2 : HELLO_AT * 0.35 + 0.4) : SEQ.length * 0.35 }} className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: blocked ? D.red : D.green, color: "var(--cs-bg)" }}>
                {blocked ? "FLOW BLOCKED" : "FLOW ALLOWED"}
              </motion.span>
            </div>
            <ol key={`${fid}-${run}`} className="grid grid-cols-4 gap-2 sm:grid-cols-7">
              {SEQ.map((p, i) => {
                const v = verdict(i);
                const c = v === "fwd" ? D.green : v === "drop" ? D.red : D.purple;
                return (
                  <motion.li key={i} initial={{ opacity: 0, y: -12 }} animate={{ opacity: v === "drop" ? 0.6 : 1, y: v === "drop" ? 8 : 0 }} transition={{ delay: i * 0.35, duration: 0.3 }} className="rounded-xl border-2 px-2 py-3 text-center" style={{ borderColor: c, background: `${c}1F` }}>
                    <p className="text-xs font-semibold sm:text-sm">{p}</p>
                    <p className="mt-1 font-mono text-[10px] font-bold" style={{ color: c }}>{v === "fwd" ? "FORWARD" : v === "drop" ? "DROP" : "IDENTIFIED"}</p>
                  </motion.li>
                );
              })}
            </ol>
            <p className="mt-6 text-sm leading-relaxed text-(--cs-soft)">
              {fromStart
                ? "The source IP is in the first packet, so this flow is blocked from its very first packet."
                : afterHello
                  ? "The handshake packets were forwarded because the application wasn't known yet. Blocking starts once the Client Hello identifies the flow."
                  : "No rule matches this connection, so every packet is forwarded."}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <button type="button" onClick={() => setRun((n) => n + 1)} className="text-sm text-(--cs-accent) hover:underline">↻ Replay</button>
              <Demo>Illustrative flow</Demo>
            </div>
          </Panel>
        </div>
      </div>
    </Chapter>
  );
}
