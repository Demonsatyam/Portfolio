"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { CAPTURE, D, tupleKey } from "../data";
import { Chapter, Demo, Panel } from "../ui";

const FLOW_COLORS = [D.purple, D.cyan, D.amber];
const keys = [...new Set(CAPTURE.map(tupleKey))];
const colorOf = (k: string) => FLOW_COLORS[keys.indexOf(k) % FLOW_COLORS.length];

export function Flows() {
  const [pick, setPick] = useState(4);
  const p = CAPTURE.find((x) => x.n === pick)!;
  const key = tupleKey(p);
  const col = colorOf(key);
  const tuple: [string, string | number][] = [["Source IP", p.src], ["Destination IP", p.dst], ["Source port", p.sport], ["Destination port", p.dport], ["Protocol", p.proto]];
  return (
    <Chapter id="flows" title="Five values name a connection." intro="Source IP, destination IP, source port, destination port and protocol: the Five-Tuple. Every packet with the same five values belongs to the same flow, so what the engine learns about one packet applies to the whole connection. Pick a packet.">
      <div className="grid gap-8 lg:grid-cols-12">
        <Panel className="overflow-x-auto p-4 sm:p-6 lg:col-span-7">
          <div className="mb-3 flex items-center justify-between px-2"><p className="font-mono text-xs uppercase tracking-[0.2em] text-[#8E9DBB]">capture.pcap</p><Demo>Sample capture</Demo></div>
          <table className="w-full min-w-[520px] font-mono text-xs sm:text-sm">
            <thead className="text-left text-[#5f6f8d]">
              <tr><th className="px-2 py-2 font-normal">#</th><th className="px-2 font-normal">Source</th><th className="px-2 font-normal">Destination</th><th className="px-2 font-normal">Proto</th><th className="px-2 font-normal">Info</th></tr>
            </thead>
            <tbody>
              {CAPTURE.map((x) => {
                const same = tupleKey(x) === key;
                return (
                  <motion.tr key={x.n} onClick={() => setPick(x.n)} className="cursor-pointer" animate={{ backgroundColor: same ? `${col}22` : "rgba(0,0,0,0)", opacity: same ? 1 : 0.55 }} transition={{ duration: 0.25 }}>
                    <td className="px-2 py-2.5"><button type="button" onClick={() => setPick(x.n)} aria-pressed={x.n === pick} className="rounded px-1 focus-visible:outline-2 focus-visible:outline-[#00D4FF]" style={{ color: x.n === pick ? col : undefined }}>{x.n}</button></td>
                    <td className="px-2">{x.src}:{x.sport}</td>
                    <td className="px-2">{x.dst}:{x.dport}</td>
                    <td className="px-2">{x.proto}</td>
                    <td className="px-2 text-[#8E9DBB]">{x.info}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </Panel>
        <div className="lg:col-span-5">
          <div className="flex flex-wrap gap-2">
            {tuple.map(([k, v], i) => (
              <motion.div key={k + v} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-xl border px-3 py-2" style={{ borderColor: `${col}88`, background: `${col}14` }}>
                <p className="text-[11px] text-[#8E9DBB]">{k}</p>
                <p className="font-mono text-sm">{v}</p>
              </motion.div>
            ))}
          </div>
          <p className="mt-6 text-sm text-[#8E9DBB]">Connection identifier</p>
          <AnimatePresence mode="wait">
            <motion.p key={key} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="mt-2 break-all rounded-2xl border-2 px-4 py-3 font-mono text-sm" style={{ borderColor: col, boxShadow: `0 0 30px ${col}44` }}>
              {key}
            </motion.p>
          </AnimatePresence>
          <ul className="mt-6 space-y-2">
            {keys.map((k) => {
              const n = CAPTURE.filter((x) => tupleKey(x) === k).length;
              return (
                <li key={k} className="flex items-center gap-3 text-sm" style={{ opacity: k === key ? 1 : 0.5 }}>
                  <span className="size-2.5 rounded-full" style={{ background: colorOf(k) }} />
                  <span className="truncate font-mono text-xs">{k}</span>
                  <span className="ml-auto font-mono text-[#24D18B]">{n} pkts</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Chapter>
  );
}
