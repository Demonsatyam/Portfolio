"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { LAYERS, type LayerId } from "../data";
import { Chapter, Panel, Segmented } from "../ui";

type View = "nested" | "wire";
const RECT: Record<View, Record<LayerId, [number, number, number, number]>> = {
  // left, top, width, height (%)
  nested: { eth: [0, 0, 100, 100], ip: [5, 15, 90, 79], tcp: [10, 30, 80, 58], payload: [15, 45, 70, 37] },
  wire: { eth: [0, 25, 21, 50], ip: [22, 25, 26, 50], tcp: [49, 25, 26, 50], payload: [76, 25, 24, 50] },
};
const spring = { type: "spring", bounce: 0.12, visualDuration: 0.55 } as const;
const ANALOGY: Record<LayerId, string> = { eth: "the local hop", ip: "from & to", tcp: "how to deliver", payload: "what's inside" };

export function Packet() {
  const [view, setView] = useState<View>("nested");
  const [sel, setSel] = useState<LayerId>("ip");
  const layer = LAYERS.find((l) => l.id === sel)!;
  return (
    <Chapter id="packet" title="A packet is a digital envelope." intro="It says where it came from, where it is going, how it should be delivered, and carries the data itself. Open it and you find layers wrapped inside layers. Click one.">
      <div className="mb-8">
        <Segmented label="Packet view" value={view} onChange={setView} options={[{ value: "nested", label: "Nested layers" }, { value: "wire", label: "On the wire" }]} />
      </div>
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="relative aspect-[16/11] lg:col-span-7">
          {LAYERS.map((l) => {
            const [x, y, w, h] = RECT[view][l.id];
            const on = l.id === sel;
            return (
              <motion.button
                key={l.id}
                type="button"
                layout
                transition={spring}
                onClick={() => setSel(l.id)}
                aria-pressed={on}
                className="absolute flex flex-col items-start justify-start rounded-2xl border-2 p-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:p-4"
                style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%`, borderColor: l.color, background: `${l.color}${on ? "33" : "14"}`, boxShadow: on ? `0 0 40px ${l.color}66` : "none" }}
              >
                <motion.span layout="position" className="block font-display text-sm font-semibold sm:text-lg">{l.name}</motion.span>
                <motion.span layout="position" className="block font-mono text-[10px] sm:text-xs" style={{ color: l.color }}>{l.size} · {ANALOGY[l.id]}</motion.span>
              </motion.button>
            );
          })}
        </div>
        <Panel className="p-6 sm:p-8 lg:col-span-5">
          <AnimatePresence mode="wait">
            <motion.div key={sel} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
              <p className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: layer.color }}>{layer.name} · {layer.size}</p>
              <p className="mt-3 font-display text-2xl font-semibold">{layer.q}</p>
              <dl className="mt-6 divide-y divide-[#1a2747]">
                {layer.fields.map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4 py-2.5">
                    <dt className="text-sm text-[#8E9DBB]">{k}</dt>
                    <dd className="font-mono text-sm" style={{ color: layer.color }}>{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 break-words font-mono text-xs leading-relaxed text-[#5f6f8d]">{layer.bytes.join(" ")}{layer.id === "payload" ? " …" : ""}</p>
            </motion.div>
          </AnimatePresence>
        </Panel>
      </div>
    </Chapter>
  );
}
