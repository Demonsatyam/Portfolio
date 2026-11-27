"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { ISO, mixView, road, TOP, type P } from "../art/city";
import { C } from "../art/theme";
import { CityMap, Jam, Pin, Route, You } from "../CityMap";
import { DESTS, INCIDENT, INCIDENTS, NOW, type Dest, type IncidentKind } from "../data";
import { Chapter, Demo, Panel } from "../ui";

const VIEW = mixView(ISO, TOP, 0.55);
const CAM = { x: 11.5, y: 10.5, zoom: 1.05 };
// predicted spread along connected roads, in world space
const SPREAD: [P, P][] = [
  [INCIDENT, [road(4), road(7) - 1]],
  [INCIDENT, [road(4), road(2)]],
  [[road(4), road(4)], [road(1), road(4)]],
  [[road(4), road(4)], [road(6), road(4)]],
  [[road(4), road(5)], [road(1), road(5)]],
  [[road(4), road(5)], [road(6), road(5)]],
];

export function Reroute({ dest, kind }: { dest: Dest; kind: IncidentKind }) {
  const [alt, setAlt] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "-120px" });
  const d = DESTS[dest];
  const rest: P[] = [NOW, ...d.usual.slice(1)];
  return (
    <Chapter id="reroute" title="Predict the spread, then reroute." intro="Once an incident is verified, the predictive agent estimates how far the queue will spread and which routes it will reach. Commuters on those routes get a personal alert before they arrive, with an alternative.">
      <div ref={ref} className="grid gap-8 lg:grid-cols-12">
        <Panel className="relative overflow-hidden lg:col-span-8">
          <CityMap view={VIEW} cam={CAM} sun={0.3} net={0.25} className="aspect-[4/3] w-full">
            {(p) =>
              seen ? (
                <>
                  <motion.polygon
                    points={Array.from({ length: 48 }, (_, i) => p.at([INCIDENT[0] + Math.cos((i / 48) * Math.PI * 2) * 4.6, INCIDENT[1] + Math.sin((i / 48) * Math.PI * 2) * 4.6]).join(",")).join(" ")}
                    fill={C.amber} fillOpacity={0.12} stroke={C.amber} strokeWidth={3} strokeDasharray="12 10"
                    initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.4, delay: 0.4 }}
                    style={{ transformOrigin: `${p.at(INCIDENT)[0]}px ${p.at(INCIDENT)[1]}px` }}
                  />
                  {SPREAD.map(([a, b], i) => <Jam key={i} from={p.at(a)} to={p.at(b)} grow={1} color={i < 2 ? C.red : C.amber} />)}
                  <Route d={p.d(rest)} color={alt ? "#7a3a3a" : C.blue} width={8} />
                  {alt ? <Route key={dest} d={p.d(d.alt)} color={C.green} width={10} duration={1.6} /> : null}
                  <Pin at={p.at(INCIDENT)} color={C.red} />
                  <You at={p.at(NOW)} color={alt ? C.green : C.blue} />
                </>
              ) : null
            }
          </CityMap>
          <ul className="absolute left-4 top-4 space-y-1.5 rounded-2xl border border-[#22314F] bg-[#070D1A]/85 p-3 text-xs backdrop-blur">
            {[
              [alt ? "#7a3a3a" : C.blue, "Original route"],
              [C.red, "Verified incident"],
              [C.amber, "Predicted congestion"],
              [C.green, "Alternative route"],
            ].map(([c, l]) => (
              <li key={l} className="flex items-center gap-2"><span className="h-1.5 w-5 rounded-full" style={{ background: c }} />{l}</li>
            ))}
          </ul>
        </Panel>

        <div className="flex flex-col gap-4 lg:col-span-4">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={seen ? { opacity: 1, y: 0 } : {}} transition={{ type: "spring", bounce: 0.2, visualDuration: 0.5, delay: 1.2 }} className="rounded-3xl bg-[#F7F8FB] p-5 text-[#141B2B] shadow-2xl">
            <p className="flex items-center gap-2 text-[11px] font-extrabold tracking-[0.15em] text-[#B26B00]">
              <span className="grid size-5 place-items-center rounded-md bg-[#F5A524] text-[#1A1206]">!</span> TRAFFIC ALERT · CITY PULSE
            </p>
            <p className="mt-2 font-display text-lg font-semibold leading-snug">Potential disruption ahead on your daily route</p>
            <p className="mt-1 text-sm text-[#3B4660]">{INCIDENTS[kind].title}.</p>
            <p className="mt-0.5 text-xs text-[#6A7590]">Est. delay {INCIDENTS[kind].delay} · simulated</p>
            <button
              type="button"
              onClick={() => setAlt((a) => !a)}
              aria-pressed={alt}
              className="mt-4 w-full rounded-xl bg-[#13203A] py-3 text-sm font-semibold text-white transition hover:bg-[#1c2d50] active:scale-[0.98]"
            >
              {alt ? "Back to original route" : "Show alternative route"}
            </button>
          </motion.div>

          <AnimatePresence>
            {alt ? (
              <motion.div key="cmp" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="space-y-2 rounded-3xl border border-[#22314F] bg-[#0B1426] p-4">
                  {[
                    ["Original route", `+${INCIDENTS[kind].delay.replace("~", "")}`, C.red, false],
                    ["Alternative", "+3 min", C.green, true],
                  ].map(([n, t, c, rec]) => (
                    <div key={n as string} className="flex items-center gap-3 rounded-2xl border px-4 py-3" style={{ borderColor: rec ? `${C.green}88` : "#26365A", background: rec ? "#10291f" : undefined }}>
                      <span className="size-2.5 rounded-full" style={{ background: c as string }} />
                      <span className="flex-1 text-sm font-medium">
                        {n}
                        {rec ? <span className="ml-2 text-[10px] font-bold tracking-wider text-[#2FCB6F]">RECOMMENDED</span> : null}
                      </span>
                      <span className="font-display font-semibold" style={{ color: c as string }}>{t}</span>
                    </div>
                  ))}
                  <div className="pt-1"><Demo /></div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
          <p className="text-sm leading-relaxed text-[#8D9BB5]">Only commuters subscribed to an affected route are alerted, so the notification is about <em>their</em> journey, not the whole city.</p>
        </div>
      </div>
    </Chapter>
  );
}
