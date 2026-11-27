"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { D, LAYERS, PARSED } from "../data";
import { Chapter, Panel } from "../ui";

const FILE: { t: string; b: string; tip: string; c: string }[] = [
  { t: "Global header", b: "24 B", tip: "magic 0xa1b2c3d4 · version 2.4 · snaplen 65535 · link type 1 (Ethernet)", c: D.amber },
  { t: "Record #1", b: "16 B", tip: "timestamp, captured length, original length", c: D.blue },
  { t: "Bytes #1", b: "74 B", tip: "raw packet bytes", c: "#33476B" },
  { t: "…", b: "", tip: "", c: "#22335A" },
  { t: "Record #4", b: "16 B", tip: "timestamp +0.013117 s · captured 583 B · original 583 B", c: D.cyan },
  { t: "Bytes #4", b: "583 B", tip: "the packet we follow: Ethernet → IPv4 → TCP → TLS Client Hello", c: D.cyan },
];

export function Parse() {
  const [hot, setHot] = useState<number | null>(4);
  const [file, setFile] = useState(5);
  const f = hot === null ? null : PARSED[hot];
  return (
    <Chapter id="parse" title="Read the file. Split the bytes." intro="The PCAP Reader walks the capture: one global header, then a record header with a timestamp and lengths before every packet's raw bytes. The Packet Parser then splits those bytes into headers and reads the fields. Point at a field to see where it lives.">
      {/* the file */}
      <div className="mb-10 flex flex-wrap gap-2">
        {FILE.map((x, i) => (
          <button key={i} type="button" disabled={!x.b} onMouseEnter={() => x.b && setFile(i)} onFocus={() => setFile(i)} onClick={() => setFile(i)} className="rounded-xl border px-3 py-2 text-left font-mono text-xs transition-colors" style={{ borderColor: i === file ? x.c : "#22335A", background: i === file ? `${x.c}26` : "#0C1426" }}>
            <span className="block text-white">{x.t}</span>
            <span className="text-[#8E9DBB]">{x.b}</span>
          </button>
        ))}
      </div>
      <motion.p key={file} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="-mt-6 mb-10 font-mono text-sm" style={{ color: FILE[file].c }}>
        {FILE[file].tip}
      </motion.p>

      <div className="grid gap-8 lg:grid-cols-12">
        <Panel className="overflow-x-auto p-6 sm:p-8 lg:col-span-7">
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-[#8E9DBB]">Packet #4 · first 54 bytes</p>
          {LAYERS.slice(0, 3).map((l) => (
            <div key={l.id} className="mb-4 flex items-start gap-4">
              <span className="w-20 shrink-0 pt-1 font-display text-sm font-semibold" style={{ color: l.color }}>{l.name.split(" ")[0]}</span>
              <div className="flex flex-wrap gap-1">
                {l.bytes.map((b, i) => {
                  const owner = PARSED.findIndex((p) => p.layer === l.id && i >= p.from && i < p.to);
                  const lit = owner !== -1 && owner === hot;
                  return (
                    <motion.span
                      key={i}
                      onMouseEnter={() => owner !== -1 && setHot(owner)}
                      animate={{ backgroundColor: lit ? l.color : `${l.color}22`, color: lit ? D.bg : "#ffffff" }}
                      transition={{ duration: 0.15 }}
                      className="w-8 rounded-md py-1 text-center font-mono text-xs"
                    >
                      {b}
                    </motion.span>
                  );
                })}
              </div>
            </div>
          ))}
          <p className="mt-6 text-sm text-[#8E9DBB]">UDP is parsed the same way, with an 8-byte header carrying the ports.</p>
        </Panel>
        <Panel className="p-6 sm:p-8 lg:col-span-5">
          <p className="mb-3 font-display text-lg font-semibold">Extracted fields</p>
          <ul onMouseLeave={() => setHot(null)}>
            {PARSED.map((p, i) => {
              const col = LAYERS.find((l) => l.id === p.layer)!.color;
              const on = i === hot;
              return (
                <li key={p.k}>
                  <button type="button" onMouseEnter={() => setHot(i)} onFocus={() => setHot(i)} className="flex w-full items-baseline justify-between gap-4 border-b border-[#1a2747] py-2.5 text-left focus-visible:outline-2 focus-visible:outline-[#00D4FF]">
                    <span className={`text-sm ${on ? "text-white" : "text-[#8E9DBB]"}`}>{p.k}</span>
                    <span className="font-mono text-sm" style={{ color: on ? col : "#b4c2db" }}>{p.v}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-xs text-[#5f6f8d]">{f ? `${f.layer.toUpperCase()} bytes ${f.from}–${f.to - 1}` : "Hover a field"}</p>
        </Panel>
      </div>
    </Chapter>
  );
}
