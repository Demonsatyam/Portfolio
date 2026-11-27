"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { alongPoly, ISO } from "../art/city";
import { Commuter } from "../art/Commuter";
import { C } from "../art/theme";
import { CityMap, Jam, Pin, Route } from "../CityMap";
import { DESTS, INCIDENT, type Dest } from "../data";
import { Chapter, Panel, Segmented } from "../ui";

const CAM = { x: 10.5, y: 10.5, zoom: 1.28 };

const STEPS = [
  { h: "Same road, every morning.", p: "Our commuter leaves home at 7:42 and takes the route they always take. Pick where they're going; the map and the rest of the walkthrough follow your choice." },
  { h: "A few kilometres ahead, something happens.", p: "A two-vehicle collision on the Ring Road flyover blocks a lane. A queue starts to build behind it, and it grows every minute." },
  { h: "Their navigation still says the road is clear.", p: "Conventional navigation reacts to slow traffic once enough cars are already stuck. By then, the commuter may be stuck too." },
];

export function Commute({ dest, setDest }: { dest: Dest; setDest: (d: Dest) => void }) {
  const steps = useRef<HTMLDivElement>(null);
  const { scrollYProgress: s } = useScroll({ target: steps, offset: ["start 60%", "end 60%"] });
  const incident = useTransform(s, [0.3, 0.4], [0, 1]);
  const grow = useTransform(s, [0.35, 0.95], [0, 0.8]);
  const route = DESTS[dest].usual;
  const status = useTransform(s, [0.62, 0.7], [0, 1]);

  return (
    <Chapter id="commute" title="It starts with an ordinary commute." intro="Before any AI, there's a person on their usual road who doesn't yet know what's waiting for them.">
      <div className="grid gap-10 md:grid-cols-12">
        <div ref={steps} className="md:col-span-5">
          {STEPS.map((st, i) => (
            <div key={i} className="flex min-h-[55vh] flex-col justify-center py-6 md:min-h-[70vh]">
              <p className="font-mono text-xs text-(--cs-muted)">Step {i + 1} / 3</p>
              <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight md:text-3xl">{st.h}</h3>
              <p className="mt-3 leading-relaxed text-(--cs-sub)">{st.p}</p>
              {i === 0 ? (
                <div className="mt-6">
                  <Segmented
                    label="Choose the commute"
                    value={dest}
                    onChange={setDest}
                    options={[
                      { value: "office", label: "Home → Office" },
                      { value: "university", label: "Home → University" },
                    ]}
                  />
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="md:col-span-7">
          <div className="sticky top-24">
            <Panel className="relative overflow-hidden">
              <CityMap view={ISO} cam={CAM} sun={0.5} density={0.9} className="aspect-[4/3] w-full">
                {(p) => {
                  const scr = route.map(p.at);
                  return (
                    <>
                      <Route key={dest} d={p.d(route)} color={C.blue} width={9} />
                      <Jam from={p.at(INCIDENT)} to={p.at([INCIDENT[0], 17.25])} grow={grow} />
                      <motion.g style={{ opacity: incident }}>
                        <Pin at={p.at(INCIDENT)} color={C.red} />
                      </motion.g>
                      <YouOnRoute s={s} pts={scr} />
                    </>
                  );
                }}
              </CityMap>
              {/* commuter + their navigation status */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                <div className="flex items-center gap-3 rounded-2xl border border-(--cs-line) bg-(--cs-bg)/90 p-3 pr-5 backdrop-blur">
                  <div className="size-16 shrink-0 overflow-hidden rounded-xl bg-gradient-to-b from-(--cs-line-strong) to-[#d99a6a]">
                    <Commuter pose="riding" style={{ width: 90, height: 82, marginLeft: -12, marginTop: -4 }} />
                  </div>
                  <div>
                    <p className="text-xs text-(--cs-muted)">Navigating · {DESTS[dest].label}</p>
                    <p className="font-display text-lg font-semibold">Usual route</p>
                    <motion.p className="text-sm text-(--cs-muted)" style={{ opacity: status }}>
                      No disruption reported yet
                    </motion.p>
                  </div>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </Chapter>
  );
}

/** The commuter's dot, moved along their route by scroll. `pts` are already in screen space. */
function YouOnRoute({ s, pts }: { s: ReturnType<typeof useScroll>["scrollYProgress"]; pts: [number, number][] }) {
  const f = useTransform(s, [0, 1], [0, 0.2]);
  const x = useTransform(() => alongPoly(pts, f.get())[0]);
  const y = useTransform(() => alongPoly(pts, f.get())[1]);
  return (
    <motion.g style={{ x, y }}>
      <circle r={30} fill={C.blue} opacity={0.25} />
      <circle r={15} fill="#fff" />
      <circle r={9} fill={C.blue} />
    </motion.g>
  );
}
