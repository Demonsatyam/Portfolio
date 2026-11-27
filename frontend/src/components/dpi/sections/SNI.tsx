"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ease } from "@/components/motion/ease";
import { D } from "../data";
import { Chapter, Chip, Panel, Segmented } from "../ui";

type Case = "tls" | "ech" | "partial" | "http";
const HELLO: [string, string][] = [
  ["Content Type", "0x16 Handshake"],
  ["Handshake Type", "0x01 ClientHello"],
  ["Client Version", "0x0303"],
  ["Random", "32 bytes"],
  ["Session ID", "32 bytes"],
  ["Cipher Suites", "0x1301 0x1302 0xc02f …"],
  ["Extensions", "supported_versions, key_share …"],
];
const CASES: Record<Case, { label: string; result: string | null; why: string; tone: string }> = {
  tls: { label: "Conventional TLS", result: "www.youtube.com", why: "The SNI extension carries the hostname in clear text. The engine finds it and maps it to an application.", tone: D.purple },
  ech: { label: "Encrypted Client Hello", result: null, why: "With ECH the real server name is encrypted. There is no hostname to read, so the flow is not identified by SNI.", tone: D.red },
  partial: { label: "Incomplete Hello", result: null, why: "SNI extraction needs a complete, parsable Client Hello. If it is truncated or malformed, nothing is extracted.", tone: D.amber },
  http: { label: "Plain HTTP", result: "example.com", why: "Unencrypted web traffic names its host directly in the HTTP Host header, which the engine reads instead.", tone: D.green },
};

function Ladder() {
  const msgs = [
    { t: "Client Hello · readable", dir: 1, c: D.purple },
    { t: "Server Hello", dir: -1, c: D.blue },
    { t: "encrypted application data", dir: 1, c: "#3A4C74" },
    { t: "encrypted application data", dir: -1, c: "#3A4C74" },
  ];
  return (
    <div className="relative grid grid-cols-[80px_1fr_80px] gap-y-5 text-sm">
      <span className="font-display font-semibold text-[#00D4FF]">Browser</span><span /><span className="text-right font-display font-semibold text-[#2678FF]">Server</span>
      {msgs.map((m, i) => (
        <div key={i} className="col-span-3 grid grid-cols-[80px_1fr_80px] items-center">
          <span /><div className="relative">
            <p className={`mb-1 text-center font-mono text-xs ${i > 1 ? "text-[#5f6f8d]" : "text-white"}`}>{i > 1 ? "🔒︎ " : ""}{m.t}</p>
            <motion.div className="h-0.5" style={{ background: m.c, originX: m.dir > 0 ? 0 : 1 }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.5, duration: 0.6, ease }} />
            <span className={`absolute -bottom-[5px] text-xs ${m.dir > 0 ? "right-0" : "left-0"}`} style={{ color: m.c }}>{m.dir > 0 ? "▶" : "◀"}</span>
          </div><span />
        </div>
      ))}
    </div>
  );
}

export function SNI() {
  const [c, setC] = useState<Case>("tls");
  const k = CASES[c];
  return (
    <Chapter id="sni" title="The name on the envelope." intro="HTTPS encrypts application data, but before encryption starts the browser sends a TLS Client Hello. In a conventional handshake it names the site it wants through the Server Name Indication (SNI) extension. The engine reads that name. It never decrypts anything.">
      <div className="grid gap-8 lg:grid-cols-12">
        <Panel className="p-6 sm:p-8 lg:col-span-5"><p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-[#8E9DBB]">TLS handshake</p><Ladder /></Panel>
        <div className="lg:col-span-7">
          <div className="mb-6"><Segmented label="Scenario" value={c} onChange={setC} options={(Object.keys(CASES) as Case[]).map((v) => ({ value: v, label: CASES[v].label }))} /></div>
          <Panel className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div key={c} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                {c === "http" ? (
                  <pre className="font-mono text-sm leading-relaxed text-[#8E9DBB]">GET / HTTP/1.1{"\n"}<span className="rounded bg-[#24D18B]/20 px-1 text-white">Host: example.com</span>{"\n"}User-Agent: …{"\n"}Accept: text/html</pre>
                ) : (
                  <ul className="space-y-1 font-mono text-xs sm:text-sm">
                    {HELLO.slice(0, c === "partial" ? 4 : 7).map(([a, b]) => (
                      <li key={a} className="flex justify-between gap-4 border-b border-[#1a2747] py-1.5"><span className="text-[#8E9DBB]">{a}</span><span className="text-[#00D4FF]">{b}</span></li>
                    ))}
                    {c === "partial" ? <li className="py-2 text-[#FFB547]">… capture ends here (truncated)</li> : null}
                    {c !== "partial" ? (
                      <li className="mt-2 flex justify-between gap-4 rounded-lg border-2 px-3 py-2" style={{ borderColor: k.tone, background: `${k.tone}1F` }}>
                        <span className="text-white">SNI extension (0x0000)</span>
                        <span style={{ color: c === "ech" ? D.red : "#fff" }}>{c === "ech" ? "████████████ (encrypted)" : "www.youtube.com"}</span>
                      </li>
                    ) : null}
                  </ul>
                )}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <span className="text-sm text-[#8E9DBB]">Hostname extracted:</span>
                  {k.result ? <Chip color={k.tone} solid>{k.result}</Chip> : <Chip color={k.tone}>none</Chip>}
                  {c === "tls" ? <><span className="text-[#5f6f8d]">→</span><Chip color={D.purple} solid>AppType::YOUTUBE</Chip></> : null}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-[#b4c2db]">{k.why}</p>
              </motion.div>
            </AnimatePresence>
          </Panel>
        </div>
      </div>
    </Chapter>
  );
}
