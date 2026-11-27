"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { CHAPTERS } from "./data";
import { Block } from "./sections/Block";
import { Classify } from "./sections/Classify";
import { Flows } from "./sections/Flows";
import { Film, Header, Hero } from "./sections/Intro";
import { Packet } from "./sections/Packet";
import { Parse } from "./sections/Parse";
import { Pipeline } from "./sections/Pipeline";
import { Closing, Report } from "./sections/Report";
import { SNI } from "./sections/SNI";
import { Threads } from "./sections/Threads";
import { Why } from "./sections/Why";

export function DPI() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });
  return (
    <div className="min-h-screen bg-[#070B16] text-white">
      <motion.div aria-hidden className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-[#00D4FF]" style={{ scaleX: progress }} />
      <Header />
      <Rail />
      <main>
        <Hero />
        <Film />
        <Packet />
        <Why />
        <Pipeline />
        <Parse />
        <Flows />
        <SNI />
        <Classify />
        <Block />
        <Threads />
        <Report />
      </main>
      <Closing />
    </div>
  );
}

/** Chapter list down the left edge on wide screens; highlights the chapter in view. */
function Rail() {
  const [active, setActive] = useState("");
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
              <a href={`#${c.id}`} aria-current={on ? "true" : undefined} className={`group flex items-center gap-3 rounded-lg px-2 py-1 text-xs transition-colors ${on ? "text-white" : "text-[#5f6f8d] hover:text-[#b4c2db]"}`}>
                <span className={`h-px transition-all duration-300 ${on ? "w-8 bg-[#00D4FF]" : "w-4 bg-current"}`} />
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
