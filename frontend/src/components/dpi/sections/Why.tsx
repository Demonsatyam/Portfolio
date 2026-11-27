"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { D } from "../data";
import { Chapter, Panel, Segmented } from "../ui";

type Sys = "firewall" | "dpi";
const ROWS: { k: string; v: string; who: Sys[]; color: string }[] = [
  { k: "Source IP", v: "192.168.1.100", who: ["firewall", "dpi"], color: D.cyan },
  { k: "Destination IP", v: "172.217.14.206", who: ["firewall", "dpi"], color: D.cyan },
  { k: "Destination port", v: "443", who: ["firewall", "dpi"], color: D.cyan },
  { k: "Protocol", v: "TCP", who: ["firewall", "dpi"], color: D.cyan },
  { k: "TLS handshake", v: "Client Hello", who: ["dpi"], color: D.purple },
  { k: "SNI hostname", v: "www.youtube.com", who: ["dpi"], color: D.purple },
  { k: "Application", v: "YouTube", who: ["dpi"], color: D.green },
  { k: "Encrypted payload", v: "unreadable to both", who: [], color: D.mute },
];

export function Why() {
  const [sys, setSys] = useState<Sys>("firewall");
  const dpi = sys === "dpi";
  return (
    <Chapter id="why" title="Why look deeper?" intro="A traditional firewall decides on packet headers and configured policies. It can see where a packet is going, but not always what it is. The DPI Engine also reads supported application-layer information to identify the traffic.">
      <div className="mb-8">
        <Segmented label="Inspecting system" value={sys} onChange={setSys} options={[{ value: "firewall", label: "Traditional firewall" }, { value: "dpi", label: "DPI Engine" }]} />
      </div>
      <div className="grid gap-8 lg:grid-cols-12">
        <Panel className="p-6 sm:p-8 lg:col-span-7">
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-[#8E9DBB]">Same packet · what each system can use</p>
          <ul className="space-y-2">
            {ROWS.map((r, i) => {
              const seen = r.who.includes(sys);
              return (
                <motion.li key={r.k} className="flex items-center gap-4 rounded-xl border px-4 py-3" animate={{ opacity: seen ? 1 : 0.35, borderColor: seen ? `${r.color}88` : "#1a2747" }} transition={{ delay: seen ? i * 0.05 : 0, duration: 0.3 }}>
                  <span className="grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold" style={{ background: seen ? r.color : "#1a2747", color: seen ? D.bg : "#8E9DBB" }}>{seen ? "✓" : r.who.length ? "–" : "🔒︎"}</span>
                  <span className="w-40 shrink-0 text-sm text-[#8E9DBB]">{r.k}</span>
                  <span className="font-mono text-sm" style={{ color: seen ? "#fff" : "#5f6f8d" }}>{seen || !r.who.length ? r.v : "not inspected"}</span>
                </motion.li>
              );
            })}
          </ul>
        </Panel>
        <div className="lg:col-span-5">
          <motion.div key={sys} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="rounded-3xl border p-6" style={{ borderColor: dpi ? `${D.green}66` : `${D.amber}66` }}>
            <p className="text-sm text-[#8E9DBB]">What it concludes</p>
            <p className="mt-2 font-display text-2xl font-semibold">{dpi ? "A YouTube connection." : "Secure web traffic on port 443."}</p>
            <p className="mt-2 font-display text-xl font-semibold" style={{ color: dpi ? D.green : D.amber }}>{dpi ? "Rules can target the application." : "Application: unknown."}</p>
          </motion.div>
          <p className="mt-6 text-sm leading-relaxed text-[#8E9DBB]">
            Neither system decrypts anything. The hostname comes from the TLS Client Hello, which is sent before encryption starts.
          </p>
        </div>
      </div>
    </Chapter>
  );
}
