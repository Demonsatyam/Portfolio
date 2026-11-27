"use client";

import { memo, type ReactNode } from "react";
import { motion, type MotionValue } from "motion/react";
import { IsoCity, toScreen, type Cam, type CityProps } from "./art/IsoCity";
import type { P, View } from "./art/city";
import { C } from "./art/theme";

/** The city itself never animates: it is drawn once and the overlay above it does the moving. */
const Base = memo(function Base(props: CityProps) {
  return <IsoCity {...props} />;
});

export type Proj = { at: (p: P) => P; d: (pts: P[]) => string };
export const proj = (view: View, cam: Cam): Proj => ({
  at: (p) => toScreen(p, view, cam),
  d: (pts) => "M" + pts.map((p) => toScreen(p, view, cam).map((n) => n.toFixed(1)).join(" ")).join(" L"),
});

type Props = Omit<CityProps, "overlay" | "routes" | "jams" | "t"> & {
  t?: number;
  className?: string;
  children?: (p: Proj) => ReactNode;
};

export function CityMap({ children, className, t = 30, ...city }: Props) {
  const p = proj(city.view, city.cam);
  return (
    <div className={`relative overflow-hidden ${className ?? ""}`} style={{ background: C.navy2 }}>
      <Base {...city} t={t} />
      <svg viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
        {children?.(p)}
      </svg>
    </div>
  );
}

/* ── overlay pieces ── */

export function Route({ d, color, width = 8, delay = 0, duration = 1.4, dashed }: { d: string; color: string; width?: number; delay?: number; duration?: number; dashed?: boolean }) {
  return (
    <g>
      <motion.path d={d} fill="none" stroke={color} strokeOpacity={0.2} strokeWidth={width * 3} strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration, delay, ease: [0.65, 0, 0.35, 1] }} />
      <motion.path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dashed ? "2 16" : undefined}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration, delay, ease: [0.65, 0, 0.35, 1] }} />
    </g>
  );
}

/** Queue stripe from `from` toward `to`; `grow` 0..1 (a number or a scroll-driven MotionValue). */
export function Jam({ from, to, grow, color = C.red }: { from: P; to: P; grow: number | MotionValue<number>; color?: string }) {
  const d = `M${from[0]} ${from[1]} L${to[0]} ${to[1]}`;
  // a number animates in once; a MotionValue (scroll) drives it directly
  const drive = typeof grow === "number" ? { initial: { pathLength: 0 }, animate: { pathLength: grow }, transition: { duration: 1.6, ease: "easeOut" as const } } : { style: { pathLength: grow }, initial: false as const };
  return (
    <g>
      <motion.path d={d} stroke={color} strokeOpacity={0.3} strokeWidth={30} strokeLinecap="round" {...drive} />
      <motion.path d={d} stroke={color} strokeWidth={9} strokeLinecap="round" {...drive} />
    </g>
  );
}

export function Pin({ at, color, label }: { at: P; color: string; label?: string }) {
  return (
    <g transform={`translate(${at[0]} ${at[1]})`}>
      <circle r={34} fill={color} opacity={0.2}>
        <animate attributeName="r" values="22;48;22" dur="2.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.35;0;0.35" dur="2.4s" repeatCount="indefinite" />
      </circle>
      <path d="M0 -70 L26 -24 L-26 -24 Z" fill={color} />
      <rect x={-3} y={-58} width={6} height={18} rx={3} fill="#1A1206" />
      <circle cy={-32} r={3.5} fill="#1A1206" />
      <line y1={-24} y2={0} stroke={color} strokeWidth={4} />
      {label ? (
        <text y={-86} textAnchor="middle" fill="#fff" fontSize={30} fontWeight={700} style={{ fontFamily: "var(--font-inter)" }}>{label}</text>
      ) : null}
    </g>
  );
}

export function You({ at, color = C.blue }: { at: P; color?: string }) {
  return (
    <g transform={`translate(${at[0]} ${at[1]})`}>
      <circle r={30} fill={color} opacity={0.25} />
      <circle r={15} fill="#fff" />
      <circle r={9} fill={color} />
    </g>
  );
}
