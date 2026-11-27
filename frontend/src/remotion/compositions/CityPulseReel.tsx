import { memo } from "react";
import { AbsoluteFill, interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { INCIDENT, ISO, mixView, NOW, road, TOP, type P } from "@/components/citypulse/art/city";
import { IsoCity, toScreen } from "@/components/citypulse/art/IsoCity";
import { Mark } from "@/components/citypulse/art/Logo";
import { C as CP } from "@/components/citypulse/art/theme";
import { DESTS } from "@/components/citypulse/data";
import { clamp, font, mono } from "../theme";

/* ───────────── City Pulse: the walkthrough in 9 seconds ─────────────
   signals converge on the flyover → agents analyse → verified → spread predicted → commuter alerted and rerouted.
   The last frame is the finished state (it is also the reduced-motion still). */

const VIEW = mixView(ISO, TOP, 0.55);
const CAM = { x: 11.2, y: 10.6, zoom: 1.18 };
const at = (p: P) => toScreen(p, VIEW, CAM); // 1920×1080 overlay space
const d = (pts: P[]) => "M" + pts.map((p) => at(p).map((n) => n.toFixed(1)).join(" ")).join(" L");
const USUAL: P[] = [NOW, ...DESTS.office.usual.slice(1)];
const ALT = DESTS.office.alt;
const SPREAD: [P, P][] = [
  [INCIDENT, [road(4), road(7) - 1]],
  [INCIDENT, [road(4), road(2)]],
  [[road(4), road(4)], [road(1), road(4)]],
  [[road(4), road(4)], [road(6), road(4)]],
  [[road(4), road(5)], [road(1), road(5)]],
  [[road(4), road(5)], [road(6), road(5)]],
];
const len = (a: P, b: P) => { const [x1, y1] = at(a), [x2, y2] = at(b); return Math.hypot(x2 - x1, y2 - y1); };

const STEPS = [
  { t: "Signals", s: "3 posts, 1 photo, same road", f: 0 },
  { t: "Agents analyse", s: "Social · Report · Sentiment", f: 55 },
  { t: "Verified", s: "Location + evidence confirmed", f: 100 },
  { t: "Impact predicted", s: "Queue spreads to 3 roads", f: 140 },
  { t: "Commuter alerted", s: "Alternative route sent", f: 190 },
];
const SIGNALS: { from: [number, number]; label: string }[] = [
  { from: [1560, 160], label: "Post · photo" },
  { from: [1700, 520], label: "Page · video" },
  { from: [1420, 900], label: "Upload form" },
];

// the city never changes during the loop, so draw it once
const City = memo(function City() {
  return <IsoCity view={VIEW} cam={CAM} t={30} sun={0.3} net={0.2} density={0.9} />;
});

export function CityPulseReel() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = (s: number, e: number) => interpolate(frame, [s, e], [0, 1], clamp);
  const pop = (s: number) => spring({ frame: frame - s, fps, config: { damping: 14 } });
  const inc = at(INCIDENT);
  const verified = a(100, 112);
  const pinCol = interpolateColors(verified, [0, 1], [CP.amber, CP.red]);
  const spread = a(140, 185);
  const alert = pop(190);
  const alt = a(205, 245);
  const altLen = ALT.slice(1).reduce((s, p, i) => s + len(ALT[i], p), 0);
  const usualLen = USUAL.slice(1).reduce((s, p, i) => s + len(USUAL[i], p), 0);
  const active = STEPS.findLastIndex((s) => frame >= s.f);

  return (
    <AbsoluteFill style={{ ...font, background: CP.navy2 }}>
      <City />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {/* commuter's usual route, dimmed once rerouted */}
        <path d={d(USUAL)} fill="none" stroke={interpolateColors(alt, [0, 1], [CP.blue, "#7a3a3a"])} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${usualLen} ${usualLen}`} strokeDashoffset={usualLen * (1 - a(0, 30))} />
        {/* predicted zone + spread */}
        <ellipse cx={inc[0]} cy={inc[1]} rx={260 * spread} ry={190 * spread} fill={CP.amber} fillOpacity={0.12} stroke={CP.amber} strokeWidth={3} strokeDasharray="12 10" opacity={spread} />
        {SPREAD.map(([p, q], i) => {
          const l = len(p, q), [x1, y1] = at(p), [x2, y2] = at(q);
          const g = interpolate(frame, [140 + i * 5, 180 + i * 5], [0, 1], clamp);
          const col = i < 2 ? CP.red : CP.amber;
          return (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={col} strokeOpacity={0.3} strokeWidth={28} strokeLinecap="round" strokeDasharray={`${l} ${l}`} strokeDashoffset={l * (1 - g)} />
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={col} strokeWidth={9} strokeLinecap="round" strokeDasharray={`${l} ${l}`} strokeDashoffset={l * (1 - g)} />
            </g>
          );
        })}
        {/* alternative route */}
        <path d={d(ALT)} fill="none" stroke={CP.green} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${altLen} ${altLen}`} strokeDashoffset={altLen * (1 - alt)} />
        {/* signals fly in and converge on the incident */}
        {SIGNALS.map((s, i) => {
          const p = interpolate(frame, [8 + i * 8, 48 + i * 6], [0, 1], { ...clamp, easing: (t) => 1 - (1 - t) ** 3 });
          const x = s.from[0] + (inc[0] - s.from[0]) * p, y = s.from[1] + (inc[1] - 60 - s.from[1]) * p;
          return (
            <g key={i} opacity={interpolate(frame, [8 + i * 8, 14 + i * 8, 52, 60], [0, 1, 1, 0], clamp)} transform={`translate(${x} ${y}) scale(${1 - 0.5 * p})`}>
              <rect x={-170} y={-46} width={340} height={92} rx={24} fill="#F6F8FC" />
              <circle cx={-118} cy={0} r={24} fill={i === 2 ? CP.teal : "#9DB3D6"} />
              <text x={-80} y={14} fontSize={40} fontWeight={700} fill="#121A2A" style={{ fontFamily: "var(--font-inter)" }}>{s.label}</text>
            </g>
          );
        })}
        {/* incident pin: amber while potential, red once verified */}
        <g transform={`translate(${inc[0]} ${inc[1]}) scale(${pop(50)})`}>
          <ellipse rx={30 + 30 * ((frame % 45) / 45)} ry={18 + 18 * ((frame % 45) / 45)} fill="none" stroke={pinCol} strokeWidth={3} opacity={1 - (frame % 45) / 45} />
          <path d="M0 -76 L28 -26 L-28 -26 Z" fill={pinCol} />
          <rect x={-3.5} y={-62} width={7} height={20} rx={3} fill="#1A1206" />
          <circle cy={-34} r={4} fill="#1A1206" />
          <line y1={-26} y2={0} stroke={pinCol} strokeWidth={4} />
        </g>
        {/* the commuter */}
        <g transform={`translate(${at(NOW)[0]} ${at(NOW)[1]})`}>
          <circle r={30} fill={alt > 0 ? CP.green : CP.blue} opacity={0.25} />
          <circle r={15} fill="#fff" />
          <circle r={9} fill={alt > 0 ? CP.green : CP.blue} />
        </g>
      </svg>

      {/* verified stamp next to the pin (1280-space = overlay × 2/3) */}
      <div style={{ position: "absolute", left: inc[0] * (2 / 3) + 26, top: inc[1] * (2 / 3) - 74, opacity: verified, transform: `scale(${interpolate(verified, [0, 1], [1.5, 1])})`, transformOrigin: "left center", background: CP.red, borderRadius: 10, padding: "6px 14px", fontSize: 22, fontWeight: 800, letterSpacing: 1.5 }}>
        ✓ VERIFIED
      </div>

      {/* step rail */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(7,13,26,0.96) 0%, rgba(7,13,26,0.82) 30%, rgba(7,13,26,0) 52%)" }} />
      <div style={{ position: "absolute", left: 56, top: 64, display: "flex", alignItems: "center", gap: 12 }}>
        <Mark size={48} />
        <span style={{ fontSize: 34, fontWeight: 700, letterSpacing: -0.5 }}>City <span style={{ color: CP.cyan }}>Pulse</span></span>
      </div>
      <div style={{ position: "absolute", left: 56, top: 150, display: "flex", flexDirection: "column", gap: 26 }}>
        {STEPS.map((s, i) => {
          const done = i < active, on = i === active;
          const col = on ? (i === 2 ? CP.red : i === 4 ? CP.green : CP.cyan) : done ? CP.cyan : "#3A4A69";
          return (
            <div key={s.t} style={{ display: "flex", alignItems: "flex-start", gap: 16, opacity: i <= active ? 1 : 0.45 }}>
              <div style={{ width: 36, height: 36, borderRadius: 18, marginTop: 2, display: "flex", alignItems: "center", justifyContent: "center", background: i <= active ? col : "transparent", border: `2px solid ${col}`, color: CP.night, fontSize: 15, fontWeight: 800 }}>
                {done ? "✓" : i + 1}
              </div>
              <div>
                <div style={{ fontSize: 30, fontWeight: 700, color: on ? "#fff" : "#C9D3E3" }}>{s.t}</div>
                <div style={{ ...mono, fontSize: 19, color: "#9fb0cc", marginTop: 4 }}>{s.s}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* the alert on the commuter's phone */}
      <div style={{ position: "absolute", right: 40, top: 40, width: 440, opacity: alert, transform: `translateY(${(1 - alert) * -40}px)`, background: "#F7F8FB", color: "#141B2B", borderRadius: 22, padding: "18px 20px", boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}>
        <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: 2, color: "#B26B00" }}>TRAFFIC ALERT · CITY PULSE</div>
        <div style={{ fontSize: 26, fontWeight: 700, marginTop: 6, lineHeight: 1.2 }}>Accident ahead on your daily route</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, fontSize: 20, fontWeight: 600, color: "#1d7a46", opacity: a(205, 215) }}>
          <span style={{ width: 10, height: 10, borderRadius: 5, background: CP.green }} /> Alternative route recommended
        </div>
        <div style={{ ...mono, fontSize: 14, color: "#6A7590", marginTop: 8 }}>simulated demo</div>
      </div>
    </AbsoluteFill>
  );
}
