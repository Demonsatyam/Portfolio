"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import { ease } from "@/components/motion/ease";
import { D, REPORT } from "../data";
import { Chapter, Demo } from "../ui";
import { Mark } from "./Intro";

export function Report() {
  const max = REPORT.apps[0][1];
  return (
    <Chapter id="report" title="What comes out." intro="Forwarded packets are written into a new, filtered PCAP file; dropped packets are not. Alongside it, the engine produces a report: packet statistics, an application breakdown, the domains it detected, and per-thread processing information.">
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="grid grid-cols-2 gap-4 lg:col-span-4 lg:grid-cols-1">
          <div className="rounded-3xl border border-[#24D18B]/50 bg-[#24D18B]/10 p-6">
            <p className="font-mono text-xs text-(--cs-muted)">output.pcap</p>
            <p className="mt-2 font-display text-5xl font-semibold text-[#24D18B]"><CountUp to={REPORT.verdict.forwarded} /></p>
            <p className="text-sm text-(--cs-soft)">packets forwarded</p>
          </div>
          <div className="rounded-3xl border border-[#FF4545]/50 bg-[#FF4545]/10 p-6">
            <p className="font-mono text-xs text-(--cs-muted)">drop path</p>
            <p className="mt-2 font-display text-5xl font-semibold text-[#FF4545]"><CountUp to={REPORT.verdict.dropped} /></p>
            <p className="text-sm text-(--cs-soft)">packets dropped</p>
          </div>
        </div>
        <Reveal className="lg:col-span-8">
          <div className="overflow-hidden rounded-3xl border border-(--cs-line) bg-(--cs-bg)">
            <div className="flex items-center gap-2 bg-(--cs-panel) px-5 py-3">
              {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <span key={c} className="size-3 rounded-full" style={{ background: c }} />)}
              <span className="ml-3 font-mono text-xs text-(--cs-muted)">dpi-engine · report</span>
              <span className="ml-auto"><Demo>Illustrative sample</Demo></span>
            </div>
            <div className="grid gap-8 p-6 font-mono text-sm sm:grid-cols-2 sm:p-8">
              <div>
                <p className="mb-2 text-xs tracking-widest text-(--cs-accent)">PROCESSING REPORT</p>
                {REPORT.totals.map(([k, v]) => (
                  <p key={k} className="flex justify-between py-0.5"><span className="text-(--cs-muted)">{k}</span><span>{v}</span></p>
                ))}
                <p className="mb-2 mt-6 text-xs tracking-widest text-(--cs-accent)">APPLICATIONS (TOP 5)</p>
                {REPORT.apps.map(([k, v], i) => (
                  <div key={k} className="flex items-center gap-3 py-0.5">
                    <span className="w-20 text-(--cs-muted)">{k}</span>
                    <span className="w-8 text-right">{v}</span>
                    <motion.span className="h-2 rounded bg-[#2678FF]" initial={{ width: 0 }} whileInView={{ width: `${(v / max) * 45}%` }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.08, duration: 0.8, ease }} />
                  </div>
                ))}
              </div>
              <div>
                <p className="mb-2 text-xs tracking-widest text-(--cs-accent)">DETECTED DOMAINS</p>
                {REPORT.domains.map((d) => <p key={d} className="py-0.5">{d}</p>)}
                <p className="mb-2 mt-6 text-xs tracking-widest text-(--cs-accent)">THREAD STATISTICS</p>
                <p className="py-0.5 text-(--cs-soft)">Reader → LB0, LB1</p>
                <p className="py-0.5 text-(--cs-soft)">LB → FP0, FP1, FP2, FP3</p>
                <p className="py-0.5 text-(--cs-soft)">per-thread packet counts</p>
                <p className="py-0.5 text-(--cs-soft)">Output Writer → output.pcap</p>
              </div>
            </div>
          </div>
          <p className="mt-3 text-sm text-(--cs-muted)">Sample values from a small capture, shown to explain the report. Not a performance benchmark.</p>
        </Reveal>
      </div>
    </Chapter>
  );
}

export function Closing() {
  return (
    <section className="relative overflow-hidden border-t border-(--cs-line-soft) px-4 pb-16 pt-24 md:pt-32">
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-1/2 h-[380px] w-[760px] -translate-x-1/2 translate-y-1/2 rounded-full bg-(--cs-accent)/15 blur-[140px]" />
      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-2">
          <Reveal>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-(--cs-accent)">Designed with limits</p>
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">What the DPI Engine doesn&apos;t claim.</h2>
            <ul className="mt-6 space-y-3 text-(--cs-soft)">
              {[
                "It never decrypts HTTPS; it reads only what the handshake exposes.",
                "It can't name every application: hidden SNI (ECH) or unknown domains stay Unknown.",
                "It processes recorded PCAP captures, not live interception.",
                "Values on this page and in the film are illustrative samples, not benchmarks.",
              ].map((t) => (
                <li key={t} className="flex gap-3"><span className="text-(--cs-muted)">—</span>{t}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-(--cs-accent)">In five capabilities</p>
            <ol className="space-y-3">
              {[
                ["Network protocol parsing", "Ethernet · IPv4 · TCP · UDP", D.blue],
                ["Deep packet inspection", "TLS SNI · HTTP Host", D.purple],
                ["Flow tracking", "Five-Tuple connections", D.cyan],
                ["Multithreaded processing", "Reader · LB · FP · Writer", D.blue],
                ["Traffic filtering", "IP · app · domain rules", D.green],
              ].map(([t, d, c], i) => (
                <li key={t} className="flex items-baseline gap-4 border-b border-(--cs-line-soft) pb-3">
                  <span className="font-mono text-sm" style={{ color: c }}>0{i + 1}</span>
                  <span className="font-medium">{t}</span>
                  <span className="ml-auto hidden text-sm text-(--cs-muted) sm:block">{d}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>

        <Reveal className="mt-24 flex flex-col items-start justify-between gap-8 border-t border-(--cs-line-soft) pt-10 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <Mark size={56} />
            <div>
              <p className="font-display text-2xl font-semibold">DPI <span className="text-(--cs-accent)">Engine</span></p>
              <p className="text-(--cs-muted)">Understand traffic. Classify connections. Control network flow.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="#film" className="rounded-full border border-(--cs-line-strong) px-5 py-3 text-sm transition hover:border-(--cs-muted)">↑ Watch the film</a>
            <Link href="/#work" className="rounded-full bg-(--cs-fg) px-5 py-3 text-sm font-medium text-(--cs-bg) transition hover:scale-[1.03] active:scale-95">Back to all work</Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
