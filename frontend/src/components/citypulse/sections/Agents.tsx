"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { AGENTS, Glyph, type AgentId } from "../art/Agents";
import { C } from "../art/theme";
import { IncidentPhoto } from "../art/UI";
import { AGENT_INFO } from "../data";
import { Chapter, Demo, Panel } from "../ui";

// five agents evenly spaced on a circle around the router (percent of the square panel)
const RING: AgentId[] = ["report", "sentiment", "predict", "notify", "social"];
const SPOT = Object.fromEntries([
  ["router", [50, 47]],
  ...RING.map((id, i) => {
    const a = ((-90 + i * 72) * Math.PI) / 180;
    return [id, [Math.round(50 + Math.cos(a) * 34), Math.round(47 + Math.sin(a) * 34)]];
  }),
]) as Record<AgentId, [number, number]>;
const ORDER: AgentId[] = ["router", ...RING];
// connector from the router's edge to the agent's edge, so lines never run under a tile or label
const link = (id: AgentId) => {
  const [x, y] = SPOT[id], [cx, cy] = SPOT.router;
  const len = Math.hypot(x - cx, y - cy), ux = (x - cx) / len, uy = (y - cy) / len;
  const r2 = (n: number) => Math.round(n * 100) / 100;
  return { x1: r2(cx + ux * 9), y1: r2(cy + uy * 9), x2: r2(x - ux * 8), y2: r2(y - uy * 8) };
};
const spring = { type: "spring", bounce: 0.15, visualDuration: 0.45 } as const;

export function Agents() {
  const [sel, setSel] = useState<AgentId>("social");
  const info = AGENT_INFO[sel];
  return (
    <Chapter id="agents" title="Six specialised agents, one shared picture." intro="No single source can be trusted on its own, so the work is split. Each agent is good at one thing, and the router hands every task to the right one. Select an agent to see its job.">
      <div className="grid gap-8 lg:grid-cols-12">
        <Panel className="relative aspect-square w-full overflow-hidden lg:col-span-6">
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
            {RING.map((id, i) => {
              const l = link(id);
              const on = id === sel;
              return (
                <g key={id}>
                  <line {...l} stroke={on ? AGENTS[id].color : "var(--cs-line-strong)"} strokeWidth={on ? 0.5 : 0.3} strokeLinecap="round" />
                  <circle r={0.8} fill={AGENTS[id].color} opacity={on ? 1 : 0.6} className="motion-reduce:hidden">
                    <animateMotion dur="2.2s" begin={`${i * 0.44}s`} repeatCount="indefinite" path={`M${l.x2} ${l.y2} L${l.x1} ${l.y1}`} />
                  </circle>
                </g>
              );
            })}
          </svg>
          {ORDER.map((id) => {
            const on = id === sel;
            const hub = id === "router";
            const size = hub ? 72 : 60;
            const col = AGENTS[id].color;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={on}
                onClick={() => setSel(id)}
                className="group absolute flex w-32 -translate-x-1/2 flex-col items-center rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--cs-accent)"
                style={{ left: `${SPOT[id][0]}%`, top: `calc(${SPOT[id][1]}% - ${size / 2}px)` }}
              >
                <motion.span
                  className="grid place-items-center rounded-[22px] border-2 bg-(--cs-panel)"
                  style={{ width: size, height: size, borderColor: col }}
                  animate={{ scale: on ? 1.1 : 1, boxShadow: on ? `0 0 0 6px ${col}26` : `0 0 0 0px ${col}00` }}
                  whileHover={{ scale: on ? 1.1 : 1.05 }}
                  transition={spring}
                >
                  <svg viewBox="-40 -40 80 80" width={size * 0.62} height={size * 0.62} aria-hidden>
                    <Glyph id={id} color={col} />
                  </svg>
                </motion.span>
                <span className={`relative mt-2.5 rounded-md bg-(--cs-panel) px-1.5 py-0.5 text-center text-xs font-semibold leading-tight sm:text-sm ${on ? "text-(--cs-fg)" : "text-(--cs-muted) group-hover:text-(--cs-fg)"}`}>{AGENTS[id].name}</span>
              </button>
            );
          })}
        </Panel>

        <Panel className="p-6 sm:p-8 lg:col-span-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={sel} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
              <p className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: AGENTS[sel].color }}>{sel === "router" ? "Host agent · Google ADK" : "Sub-agent"}</p>
              <h3 className="mt-2 font-display text-3xl font-semibold tracking-tight">{AGENTS[sel].name}</h3>
              <p className="mt-3 text-(--cs-soft)">{info.role}</p>
              <ul className="mt-5 space-y-2">
                {info.does.map((d) => (
                  <li key={d} className="flex gap-3 text-sm text-(--cs-soft)">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full" style={{ background: AGENTS[sel].color }} />
                    {d}
                  </li>
                ))}
              </ul>
              {info.tools ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {info.tools.map((t) => (
                    <code key={t} className="rounded-lg border border-(--cs-line-strong) bg-(--cs-bg) px-2 py-1 font-mono text-xs text-(--cs-accent)">{t}()</code>
                  ))}
                </div>
              ) : null}
              <div className="mt-7 rounded-2xl border border-(--cs-line-soft) bg-(--cs-bg) p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-(--cs-muted)">In action</span>
                  <Demo>Demo</Demo>
                </div>
                <AgentDemo id={sel} />
              </div>
            </motion.div>
          </AnimatePresence>
        </Panel>
      </div>
    </Chapter>
  );
}

const stagger = (i: number) => ({ initial: { opacity: 0, x: -12 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.15 + i * 0.18, duration: 0.3 } });

function Tag({ c, children }: { c: string; children: string }) {
  return <span className="rounded-md px-2 py-0.5 text-xs font-semibold" style={{ background: `${c}22`, color: c, border: `1px solid ${c}66` }}>{children}</span>;
}

function AgentDemo({ id }: { id: AgentId }) {
  switch (id) {
    case "router":
      return (
        <div className="space-y-2 font-mono text-xs">
          {[
            ["classify(report)", "→ incident_report"],
            ["get_coordinates(\"Ring Road flyover\")", "→ location pinned"],
            ["get_traffic(area)", "→ speeds falling"],
            ["route_to_another_agent(\"user_report\")", "→ delegated"],
          ].map(([a, b], i) => (
            <motion.p key={a} {...stagger(i)} className="text-(--cs-soft)">
              {a} <span className="text-[#2FCB6F]">{b}</span>
            </motion.p>
          ))}
        </div>
      );
    case "social":
      return (
        <div className="flex items-center gap-4">
          <div className="relative h-28 w-48">
            {["Accident under the flyover", "Traffic crawling near the flyover", "Road closed near flyover exit"].map((t, i) => (
              <motion.div key={t} className="absolute left-0 w-44 rounded-lg bg-(--cs-fg) px-3 py-2 text-[11px] font-medium text-(--cs-panel-2) shadow-lg" initial={{ y: i * 34, x: i * 8, rotate: (i - 1) * 4 }} animate={{ y: 18 + i * 10, x: 0, rotate: 0 }} transition={{ delay: 0.5, ...spring }}>
                {t}
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="space-y-2">
            <p className="font-display text-lg font-semibold leading-tight">3 reports,<br />same road</p>
            <Tag c={C.amber}>Potential incident</Tag>
          </motion.div>
        </div>
      );
    case "report":
      return (
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative w-full overflow-hidden rounded-xl sm:w-56">
            <IncidentPhoto w={224} h={126} />
            {[
              { l: "Collision", x: 34, y: 58, w: 34, h: 30, d: 0.3 },
              { l: "Flyover", x: 0, y: 26, w: 100, h: 20, d: 0.6 },
            ].map((b) => (
              <motion.div key={b.l} className="absolute rounded border-2 border-(--cs-accent)" style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%` }} initial={{ opacity: 0, scale: 1.2 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: b.d, duration: 0.25 }}>
                <span className="absolute -top-5 left-0 rounded bg-(--cs-accent) px-1 text-[10px] font-bold text-(--cs-bg)">{b.l}</span>
              </motion.div>
            ))}
          </div>
          <ul className="space-y-1.5 text-sm">
            {["Accident: 2 vehicles", "1 of 2 lanes blocked", "Vehicles queuing", "Landmark: flyover"].map((t, i) => (
              <motion.li key={t} {...stagger(i + 2)} className="flex items-center gap-2"><span className="text-(--cs-accent)">✓</span>{t}</motion.li>
            ))}
          </ul>
        </div>
      );
    case "sentiment":
      return (
        <div className="space-y-3">
          {[
            ["“Traffic is completely stopped.”", "Frustrated", "Ring Road"],
            ["“Accident near the flyover.”", "Concerned", "Flyover"],
            ["“Road blocked due to waterlogging.”", "Concerned", "Lake Road"],
          ].map(([q, m, p], i) => (
            <motion.div key={q} {...stagger(i)} className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-(--cs-fg)">{q}</span>
              <Tag c={C.amber}>{m}</Tag>
              <Tag c={C.blue}>{p}</Tag>
            </motion.div>
          ))}
        </div>
      );
    case "predict":
      return (
        <div className="space-y-2">
          {[
            ["Now", 0.25],
            ["+15 min", 0.6],
            ["+30 min", 0.9],
          ].map(([l, w], i) => (
            <div key={l as string} className="flex items-center gap-3 text-xs">
              <span className="w-14 text-(--cs-muted)">{l}</span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-(--cs-panel-3)">
                <motion.div className="h-full origin-left rounded-full" style={{ background: `linear-gradient(90deg, ${C.red}, ${C.amber})` }} initial={{ scaleX: 0 }} animate={{ scaleX: w as number }} transition={{ delay: 0.2 + i * 0.25, duration: 0.7 }} />
              </div>
            </div>
          ))}
          <p className="pt-1 text-xs text-(--cs-muted)">Queue spreading onto connected roads · 3 routes affected</p>
        </div>
      );
    case "notify":
      return (
        <div className="space-y-3">
          <motion.div initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, ...spring }} className="rounded-xl bg-(--cs-fg) p-3 text-(--cs-panel-2)">
            <p className="text-[10px] font-extrabold tracking-[0.15em] text-[#B26B00]">TRAFFIC ALERT · CITY PULSE</p>
            <p className="mt-1 text-sm font-semibold">Potential disruption on your daily route</p>
          </motion.div>
          <motion.p {...stagger(2)} className="flex items-center gap-2 text-sm"><span className="text-[#2FCB6F]">✓</span>Only subscribers on affected routes are alerted</motion.p>
          <motion.p {...stagger(3)} className="flex items-center gap-2 text-sm"><span className="text-[#2FCB6F]">✓</span>Nearest traffic station sent the incident report</motion.p>
        </div>
      );
  }
}
