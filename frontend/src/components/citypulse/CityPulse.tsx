"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { CHAPTERS, type Dest, type IncidentKind } from "./data";
import { Agents } from "./sections/Agents";
import { Architecture, Closing } from "./sections/Architecture";
import { Authorities } from "./sections/Authorities";
import { Commute } from "./sections/Commute";
import { Film, Header, Hero } from "./sections/Intro";
import { Reroute } from "./sections/Reroute";
import { Simulate } from "./sections/Simulate";
import { Sources } from "./sections/Sources";
import { Verify } from "./sections/Verify";

export function CityPulse() {
  // choices made early in the walkthrough carry through the later chapters
  const [dest, setDest] = useState<Dest>("office");
  const [kind, setKind] = useState<IncidentKind>("accident");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });

  return (
    <div className="min-h-screen bg-(--cs-bg) text-(--cs-fg)">
      <motion.div aria-hidden className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-(--cs-accent)" style={{ scaleX: progress }} />
      <Header />
      <Rail />
      <main>
        <Hero />
        <Film />
        <Commute dest={dest} setDest={setDest} />
        <Sources />
        <Agents />
        <Simulate kind={kind} setKind={setKind} />
        <Verify />
        <Reroute dest={dest} kind={kind} />
        <Authorities kind={kind} />
        <Architecture />
      </main>
      <Closing />
    </div>
  );
}

/** Chapter list down the left edge on wide screens; highlights the chapter in view. */
function Rail() {
  const [active, setActive] = useState<string>("");
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const c of CHAPTERS) {
      const el = document.getElementById(c.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);
  return (
    <nav aria-label="Chapters" className="fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 2xl:block">
      <ol className="space-y-1">
        {CHAPTERS.map((c, i) => {
          const on = c.id === active;
          return (
            <li key={c.id}>
              <a href={`#${c.id}`} aria-current={on ? "true" : undefined} className={`group flex items-center gap-3 rounded-lg px-2 py-1 text-xs transition-colors ${on ? "text-(--cs-fg)" : "text-(--cs-dim) hover:text-(--cs-soft)"}`}>
                <span className={`h-px transition-all duration-300 ${on ? "w-8 bg-(--cs-accent)" : "w-4 bg-current"}`} />
                <span className="font-mono">{String(i).padStart(2, "0")}</span>
                <span className={on ? "" : "opacity-0 transition-opacity group-hover:opacity-100"}>{c.label}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
