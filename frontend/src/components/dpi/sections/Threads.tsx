"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { CAPTURE, D, FP_OF, tupleKey } from "../data";
import { Chapter, Panel, Segmented } from "../ui";

const N = { R: [80, 230], LB0: [300, 140], LB1: [300, 320], FP0: [560, 50], FP1: [560, 170], FP2: [560, 290], FP3: [560, 410], Q: [790, 230], W: [940, 230] } as const;
type Node = keyof typeof N;
const route = (fp: number): Node[] => ["R", fp < 2 ? "LB0" : "LB1", `FP${fp}` as Node, "Q", "W"];
const FLOWS = [...new Set(CAPTURE.map(tupleKey))];
const FLOW_LABEL = ["YouTube · TCP 443", "DNS · UDP 53", "GitHub · TCP 443"];
const BOX: Record<Node, [string, string]> = { R: ["Reader", "reads PCAP"], LB0: ["LB0", "load balancer"], LB1: ["LB1", "load balancer"], FP0: ["FP0", "fast path"], FP1: ["FP1", "fast path"], FP2: ["FP2", "fast path"], FP3: ["FP3", "fast path"], Q: ["Output Queue", "thread-safe"], W: ["Writer", "output.pcap"] };

function Diagram({ fp }: { fp: number }) {
  const r = route(fp);
  const edges: [Node, Node][] = [["R", "LB0"], ["R", "LB1"], ["LB0", "FP0"], ["LB0", "FP1"], ["LB1", "FP2"], ["LB1", "FP3"], ["FP0", "Q"], ["FP1", "Q"], ["FP2", "Q"], ["FP3", "Q"], ["Q", "W"]];
  const onRoute = (a: Node, b: Node) => r.includes(a) && r.includes(b) && r.indexOf(b) === r.indexOf(a) + 1;
  return (
    <svg viewBox="0 0 1020 460" className="w-full" role="img" aria-label={`Packets of the selected flow travel Reader, ${r.slice(1, 3).join(", ")}, Output Queue, Writer`}>
      {edges.map(([a, b]) => (
        <line key={a + b} x1={N[a][0]} y1={N[a][1]} x2={N[b][0]} y2={N[b][1]} stroke={onRoute(a, b) ? D.purple : "#22335A"} strokeWidth={onRoute(a, b) ? 3 : 2} style={{ transition: "stroke 0.4s" }} />
      ))}
      {[0, 1, 2, 3].map((k) => (
        <motion.circle key={`${fp}-${k}`} r={9} fill={D.purple} style={{ filter: `drop-shadow(0 0 6px ${D.purple})` }}
          initial={{ cx: N.R[0], cy: N.R[1], opacity: 0 }}
          animate={{ cx: r.map((n) => N[n][0]), cy: r.map((n) => N[n][1]), opacity: [0, 1, 1, 1, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, delay: k * 0.8, ease: "linear" }} />
      ))}
      {(Object.keys(N) as Node[]).map((n) => {
        const on = r.includes(n);
        const w = n === "Q" ? 150 : n.startsWith("FP") || n.startsWith("LB") ? 110 : 120;
        return (
          <g key={n} transform={`translate(${N[n][0] - w / 2} ${N[n][1] - 30})`}>
            <rect width={w} height={60} rx={12} fill="#0C1426" stroke={on ? (n === "W" ? D.green : D.purple) : "#2A3D66"} strokeWidth={2} style={{ transition: "stroke 0.4s" }} />
            <text x={w / 2} y={27} textAnchor="middle" fill="#fff" fontSize={17} fontWeight={600}>{BOX[n][0]}</text>
            <text x={w / 2} y={45} textAnchor="middle" fill="#8E9DBB" fontSize={11} fontFamily="var(--font-mono)">{BOX[n][1]}</text>
          </g>
        );
      })}
    </svg>
  );
}

/** A live producer/consumer queue: you produce, the consumer thread drains it. */
function Queue() {
  const [items, setItems] = useState<number[]>([1, 2]);
  const [next, setNext] = useState(3);
  const [lock, setLock] = useState<"free" | "producer" | "consumer">("free");
  const [log, setLog] = useState<string>("consumer waiting on condition variable");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  useEffect(() => {
    if (!inView || items.length === 0) return;
    const t = setTimeout(() => {
      setLock("consumer");
      setItems((q) => q.slice(1));
      setLog(`consumer: lock · pop packet #${items[0]} · unlock · process`);
      setTimeout(() => setLock("free"), 350);
    }, 1400);
    return () => clearTimeout(t);
  }, [items, inView]);
  const produce = () => {
    if (items.length >= 6) return;
    setLock("producer");
    setItems((q) => [...q, next]);
    setNext((n) => n + 1);
    setLog(`producer: lock · push packet #${next} · unlock · notify consumer`);
    setTimeout(() => setLock("free"), 350);
  };
  return (
    <div ref={ref}>
      <div className="flex flex-wrap items-center gap-4">
        <button type="button" onClick={produce} className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-[#070B16] transition-transform active:scale-95">Produce a packet</button>
        <span className="rounded-full border px-3 py-1 font-mono text-xs" style={{ borderColor: lock === "free" ? "#22335A" : D.amber, color: lock === "free" ? D.mute : D.amber }}>mutex · {lock === "free" ? "free" : `held by ${lock}`}</span>
      </div>
      <div className="mt-5 flex h-16 items-center gap-2 rounded-2xl border-2 px-3" style={{ borderColor: lock === "free" ? "#22335A" : D.amber, transition: "border-color 0.2s" }}>
        <AnimatePresence initial={false} mode="popLayout">
          {items.map((n) => (
            <motion.span key={n} layout initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} transition={{ type: "spring", bounce: 0.15, visualDuration: 0.3 }} className="grid h-10 w-14 place-items-center rounded-lg border border-[#00D4FF] bg-[#00D4FF]/15 font-mono text-xs">
              #{n}
            </motion.span>
          ))}
        </AnimatePresence>
        {items.length === 0 ? <span className="text-sm text-[#5f6f8d]">empty</span> : null}
      </div>
      <p className="mt-3 font-mono text-xs text-[#8E9DBB]" aria-live="polite">{items.length === 0 ? "consumer waiting on condition variable" : log}</p>
    </div>
  );
}

export function Threads() {
  const [flow, setFlow] = useState(FLOWS[0]);
  const fp = FP_OF(flow);
  return (
    <Chapter id="threads" title="Parallel, without losing the plot." intro="For larger captures, the multithreaded version splits the work. A Reader thread pulls packets from the file, Load Balancers spread them over Fast Path threads, and an Output Writer collects the results. Consistent hashing on the Five-Tuple keeps every packet of a connection on the same Fast Path thread, so its flow state lives in one place.">
      <div className="mb-6">
        <Segmented label="Flow" value={flow} onChange={setFlow} options={FLOWS.map((k, i) => ({ value: k, label: FLOW_LABEL[i] }))} />
      </div>
      <Panel className="overflow-x-auto p-4 sm:p-8">
        <div className="min-w-[640px]"><Diagram fp={fp} /></div>
        <p className="mt-4 font-mono text-sm text-[#b4c2db]">
          hash(<span className="text-[#795CFF]">{flow}</span>) % 4 = <span className="font-bold text-[#795CFF]">{fp}</span> → every packet of this flow goes to FP{fp}
        </p>
      </Panel>
      <div className="mt-10 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="font-display text-2xl font-semibold">Thread-safe queues between stages</p>
          <p className="mt-3 leading-relaxed text-[#9fb0cc]">A producer pushes packets in, a consumer takes them out. A mutex guards the queue so only one thread touches it at a time, and a condition variable wakes the consumer when work arrives instead of letting it spin.</p>
        </div>
        <Panel className="p-6 lg:col-span-7"><Queue /></Panel>
      </div>
    </Chapter>
  );
}
