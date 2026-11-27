"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { STAGES } from "../data";
import { Chapter, Envelope, Panel } from "../ui";

const spring = { type: "spring", bounce: 0.15, visualDuration: 0.4 } as const;

export function Pipeline() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-20%" });
  useEffect(() => {
    if (!playing || !inView) return;
    const t = setInterval(() => setStep((s) => (s + 1) % STAGES.length), 2400);
    return () => clearInterval(t);
  }, [playing, inView]);
  const go = (i: number) => {
    setPlaying(false);
    setStep((i + STAGES.length) % STAGES.length);
  };
  const st = STAGES[step];
  return (
    <Chapter id="pipeline" title="One packet, nine stages." intro="The engine takes a recorded capture in, and puts a filtered capture and a report out. Every packet goes through the same stages. Step through them, or let it play.">
      <div ref={ref} className="grid gap-8 lg:grid-cols-12">
        <ol className="relative space-y-1.5 lg:col-span-5">
          <span aria-hidden className="absolute bottom-4 left-[27px] top-4 w-px bg-[#22335A]" />
          {STAGES.map((s, i) => {
            const on = i === step;
            const done = i < step;
            return (
              <li key={s.t}>
                <button type="button" onClick={() => go(i)} aria-current={on ? "step" : undefined} className={`relative flex w-full items-center gap-4 rounded-2xl px-3 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-[#00D4FF] ${on ? "bg-[#0C1426]" : "hover:bg-[#0C1426]/60"}`}>
                  <span className="relative grid size-8 shrink-0 place-items-center">
                    <span className="size-2.5 rounded-full" style={{ background: on || done ? s.tone : "#22335A" }} />
                    {on ? (
                      <motion.span layoutId="dpi-pipe-pkt" transition={spring} className="absolute inset-0 grid place-items-center">
                        <Envelope color={s.tone} className="h-5 w-8" />
                      </motion.span>
                    ) : null}
                  </span>
                  <span className="min-w-0">
                    <span className={`block font-medium ${on ? "text-white" : done ? "text-[#b4c2db]" : "text-[#8E9DBB]"}`}>{s.t}</span>
                    <span className="block font-mono text-xs text-[#5f6f8d]">{s.sub}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        <div className="lg:col-span-7">
          <Panel className="relative min-h-[320px] overflow-hidden p-8">
            <div aria-hidden className="absolute -right-24 -top-24 size-72 rounded-full blur-[90px] transition-colors duration-500" style={{ background: `${st.tone}33` }} />
            <AnimatePresence mode="wait">
              <motion.div key={step} className="relative" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <p className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: st.tone }}>Stage {step + 1} / {STAGES.length}</p>
                <p className="mt-3 font-display text-4xl font-semibold tracking-tight">{st.t}</p>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-[#b4c2db]">{st.what}</p>
                {step === 6 ? (
                  <div className="mt-6 flex gap-3">
                    <span className="rounded-full bg-[#24D18B] px-4 py-1.5 text-sm font-semibold text-[#070B16]">✓ Forward</span>
                    <span className="rounded-full bg-[#FF4545] px-4 py-1.5 text-sm font-semibold text-[#070B16]">✕ Drop</span>
                  </div>
                ) : null}
              </motion.div>
            </AnimatePresence>
          </Panel>
          <div className="mt-4 flex items-center gap-2">
            <button type="button" onClick={() => go(step - 1)} className="rounded-full border border-[#22335A] px-4 py-2 text-sm hover:border-[#8E9DBB]" aria-label="Previous stage">←</button>
            <button type="button" onClick={() => go(step + 1)} className="rounded-full border border-[#22335A] px-4 py-2 text-sm hover:border-[#8E9DBB]" aria-label="Next stage">→</button>
            <button type="button" onClick={() => setPlaying((p) => !p)} className="ml-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-[#070B16]">{playing ? "Pause" : "Play"}</button>
            <span className="ml-auto text-sm text-[#8E9DBB]">Input is a recorded file, not a live link.</span>
          </div>
        </div>
      </div>
    </Chapter>
  );
}
