"use client";

import { motion } from "motion/react";
import { ease } from "@/components/motion/ease";
import { AgentNode } from "../art/Agents";
import { C } from "../art/theme";
import { Post } from "../art/UI";
import { Chapter, Panel } from "../ui";

const SRC = [
  { name: "Public upload form", a: 200, c: C.cyan },
  { name: "Facebook page posts", a: 250, c: C.cyan },
  { name: "Twitter / X API", a: 300, c: C.cyan },
  { name: "Traffic APIs", a: 350, c: C.blue },
  { name: "Weather API", a: 30, c: C.blue },
  { name: "Community reports", a: 150, c: C.teal },
];
const CX = 480, CY = 300, RX = 300, RY = 235;
const pos = (a: number): [number, number] => [Math.round(CX + Math.cos((a * Math.PI) / 180) * RX), Math.round(CY + Math.sin((a * Math.PI) / 180) * RY)];

export function Sources() {
  return (
    <Chapter id="sources" title="Listening to the city, around the clock." intro="Every post, photo, video and report could be an early signal. City Pulse gathers them continuously, alongside live traffic and weather data, even while the city sleeps.">
      <div className="grid gap-8 lg:grid-cols-12">
        <Panel className="relative overflow-hidden lg:col-span-7">
          <div aria-hidden className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(var(--cs-line-soft) 1px, transparent 1px), linear-gradient(90deg, var(--cs-line-soft) 1px, transparent 1px)", backgroundSize: "48px 48px", maskImage: "radial-gradient(circle at 50% 50%, black, transparent 75%)" }} />
          <div className="relative aspect-[4/5] w-full sm:aspect-[16/10]">
            <svg viewBox="0 0 960 600" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
              {SRC.map((s, i) => {
                const [x, y] = pos(s.a);
                const d = `M${x} ${y} L${CX} ${CY}`;
                return (
                  <g key={s.name}>
                    <motion.path d={d} stroke={s.c} strokeOpacity={0.3} strokeWidth={2} initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 + i * 0.12, ease }} />
                    {[0, 1, 2].map((k) => (
                      <circle key={k} r={4.5} fill={s.c} className="motion-reduce:hidden">
                        <animateMotion dur={`${2 + (i % 3) * 0.4}s`} begin={`${k * 0.7 + i * 0.2}s`} repeatCount="indefinite" path={d} />
                      </circle>
                    ))}
                  </g>
                );
              })}
            </svg>
            {SRC.map((s, i) => {
              const [x, y] = pos(s.a);
              return (
                <motion.div
                  key={s.name}
                  className="absolute max-w-[42%] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-(--cs-line-strong) bg-(--cs-panel-2) px-2.5 py-1.5 text-center text-[11px] font-medium leading-tight sm:max-w-none sm:whitespace-nowrap sm:px-3 sm:py-2 sm:text-sm"
                  style={{ left: `${(x / 960) * 100}%`, top: `${(y / 600) * 100}%` }}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", bounce: 0.2, visualDuration: 0.4, delay: 0.2 + i * 0.12 }}
                >
                  <span className="mr-2 inline-block size-2 rounded-full" style={{ background: s.c }} />
                  {s.name}
                </motion.div>
              );
            })}
            <div className="absolute" style={{ left: "50%", top: "50%" }}>
              <AgentNode id="router" t={0.6} size={110} active={0.8} label={false} />
            </div>
            {/* the clock never stops */}
            <div className="absolute bottom-4 left-4 hidden items-center gap-3 rounded-2xl sm:flex border border-(--cs-line) bg-(--cs-bg)/80 px-3 py-2">
              <svg width={36} height={36} viewBox="-20 -20 40 40" aria-hidden>
                <circle r={17} fill="none" stroke="var(--cs-line-strong)" strokeWidth={3} />
                <g className="origin-center motion-safe:animate-[spin_6s_linear_infinite]">
                  <line y2={-13} stroke="var(--cs-fg)" strokeWidth={2.5} strokeLinecap="round" />
                </g>
                <circle r={2.5} fill="var(--cs-fg)" />
              </svg>
              <div>
                <p className="font-display text-lg font-semibold leading-none">24/7</p>
                <p className="text-xs text-(--cs-muted)">continuous monitoring</p>
              </div>
            </div>
          </div>
        </Panel>

        <div className="relative min-h-[460px] lg:col-span-5">
          {[
            { who: "Ravi Menon", handle: "@ravi_commutes", platform: "x" as const, text: "Accident under the Ring Road flyover, two cars, one lane blocked.", media: "photo" as const, r: -3, x: 0, y: 0 },
            { who: "Neighbourhood Watch", handle: "Page", platform: "fb" as const, text: "Traffic crawling near the flyover right now.", media: "video" as const, r: 2.5, x: 90, y: 165 },
            { who: "Citizen report", handle: "Upload form", platform: "form" as const, text: "Road closed near the flyover exit. Vehicles turning back.", media: null, r: -1.5, x: 30, y: 330 },
          ].map((p, i) => (
            <motion.div
              key={i}
              className="absolute w-[280px] sm:w-[320px]"
              style={{ left: p.x, top: p.y, zIndex: i }}
              initial={{ opacity: 0, y: 40, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: p.r }}
              whileHover={{ y: -10, rotate: 0, zIndex: 10 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ type: "spring", bounce: 0.2, visualDuration: 0.5, delay: i * 0.15 }}
            >
              <div className="origin-top-left" style={{ width: 460, scale: "0.69" }}>
                <Post who={p.who} handle={p.handle} ago={`${i + 1}m`} platform={p.platform} text={p.text} media={p.media} w={460} style={{ position: "relative" }} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <p className="mt-6 text-sm text-(--cs-muted)">Posts shown are illustrated demo content, not real accounts.</p>
    </Chapter>
  );
}
