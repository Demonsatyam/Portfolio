import { AbsoluteFill, Easing, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { CSSProperties, ReactNode } from "react";
import { C, clamp, font as baseFont, mono } from "../theme";
import { SCENES } from "../timeline";

const font: CSSProperties = { ...baseFont, fontFamily: "var(--font-inter-tight), var(--font-inter), system-ui, sans-serif" };
const easeOut = Easing.out(Easing.cubic);
const easeInOut = Easing.inOut(Easing.cubic);

const FADE = 12;

function useSpring(delay = 0, damping = 16) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping } });
}

function Fade({ dur, children }: { dur: number; children: ReactNode }) {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, FADE, dur - FADE, dur], [0, 1, 1, 0], clamp);
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
}

/* ───────── persistent backdrop: drifting grid + roaming glow ───────── */
function Backdrop() {
  const f = useCurrentFrame();
  const gx = 640 + 260 * Math.sin(f / 70);
  const gy = 360 + 120 * Math.cos(f / 55);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.line}55 1px, transparent 1px), linear-gradient(90deg, ${C.line}55 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          backgroundPosition: `${-f * 0.6}px ${-f * 0.3}px`,
          maskImage: "radial-gradient(70% 70% at 50% 50%, black, transparent)",
        }}
      />
      <AbsoluteFill style={{ background: `radial-gradient(420px 320px at ${gx}px ${gy}px, ${C.accent}30, transparent 70%)` }} />
    </AbsoluteFill>
  );
}

/* ───────── scene 1: kinetic title ───────── */
function Word({ children, delay, color = C.fg }: { children: string; delay: number; color?: string }) {
  const p = useSpring(delay, 14);
  return (
    <span style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: 8 }}>
      <span
        style={{
          display: "inline-block", color,
          transform: `translateY(${(1 - p) * 110}%) rotate(${(1 - p) * 6}deg)`,
          filter: `blur(${(1 - p) * 8}px)`,
        }}
      >
        {children}&nbsp;
      </span>
    </span>
  );
}

function Intro() {
  const f = useCurrentFrame();
  const zoom = interpolate(f, [55, 90], [1, 1.35], { ...clamp, easing: Easing.in(Easing.cubic) });
  const tag = useSpring(0, 200);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: `scale(${zoom})` }}>
      <div style={{ ...mono, fontSize: 18, letterSpacing: 4, color: C.muted, opacity: tag, marginBottom: 28 }}>
        SATYAM KUMAR THAKUR · SDE
      </div>
      <div style={{ fontSize: 112, fontWeight: 700, letterSpacing: -5, lineHeight: 1, textAlign: "center" }}>
        <Word delay={6}>Every</Word>
        <Word delay={12}>tap</Word>
        <br />
        <Word delay={22} color={C.muted}>becomes a</Word>
        <Word delay={30} color={C.accent}>request.</Word>
      </div>
    </AbsoluteFill>
  );
}

/* ───────── scene 2: phone → HTTP request ───────── */
const REQUEST = ["POST /v1/orders", "Authorization: Bearer ••••••", "", '{ "sku": "A-102", "qty": 1 }'];

function Device() {
  const f = useCurrentFrame();
  const enter = useSpring(0, 18);
  const tapDown = interpolate(f, [26, 30, 36], [1, 0.94, 1], clamp);
  const ripple = interpolate(f, [30, 52], [0, 1], { ...clamp, easing: easeOut });
  const card = useSpring(40, 16);
  const chars = Math.floor(interpolate(f, [44, 78], [0, REQUEST.join("\n").length], clamp));
  const push = interpolate(f, [82, 108], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const platform = Math.floor(f / 24) % 2;

  return (
    <AbsoluteFill style={{ transform: `translateX(${-push * 160}px) scale(${1 + push * 0.12})` }}>
      {/* phone */}
      <div
        style={{
          position: "absolute", left: 230, top: 90, width: 270, height: 540, borderRadius: 44,
          background: C.card, border: `2px solid ${C.line}`, padding: 22,
          transform: `translateY(${(1 - enter) * 120}px) rotate(${(1 - enter) * -8}deg)`, opacity: enter,
          boxShadow: `0 40px 100px -30px ${C.accent}66`,
        }}
      >
        <div style={{ width: 70, height: 6, borderRadius: 9, background: C.line, margin: "0 auto 22px" }} />
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          {["Android", "iOS"].map((p, i) => (
            <span key={p} style={{
              ...mono, fontSize: 13, padding: "4px 10px", borderRadius: 99,
              background: platform === i ? `${C.accent}33` : "transparent",
              border: `1px solid ${platform === i ? C.accent : C.line}`, color: platform === i ? C.fg : C.muted,
            }}>{p}</span>
          ))}
        </div>
        <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 18 }}>Checkout</div>
        {[0.9, 0.7].map((w, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: i ? `${C.accent2}55` : `${C.accent}55` }} />
            <div style={{ flex: 1 }}>
              <div style={{ height: 10, width: `${w * 100}%`, borderRadius: 9, background: C.line }} />
              <div style={{ height: 10, width: "40%", borderRadius: 9, background: C.line, marginTop: 8 }} />
            </div>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 26, color: C.muted, fontSize: 17 }}>
          <span>Total</span><span style={{ color: C.fg, fontWeight: 600 }}>₹2,499</span>
        </div>
        <div style={{ position: "absolute", left: 22, right: 22, bottom: 30 }}>
          <div style={{
            height: 58, borderRadius: 16, background: C.accent, display: "grid", placeItems: "center",
            fontSize: 19, fontWeight: 600, transform: `scale(${tapDown})`,
          }}>Place order</div>
          {/* finger + ripple */}
          <div style={{
            position: "absolute", left: "50%", top: 29, width: 260, height: 260, marginLeft: -130, marginTop: -130,
            borderRadius: 999, border: `2px solid ${C.accent}`, transform: `scale(${ripple})`, opacity: 1 - ripple,
          }} />
          <div style={{
            position: "absolute", left: "50%", top: 29, width: 46, height: 46, marginLeft: -23, marginTop: -23,
            borderRadius: 99, background: "rgba(255,255,255,0.35)",
            opacity: interpolate(f, [18, 24, 38, 46], [0, 1, 1, 0], clamp),
            transform: `scale(${interpolate(f, [24, 30], [1.3, 0.85], clamp)})`,
          }} />
        </div>
      </div>

      {/* connector beam */}
      <svg width={1280} height={720} style={{ position: "absolute" }}>
        <line x1={500} y1={480} x2={620} y2={330} stroke={C.accent} strokeWidth={2}
          strokeDasharray={200} strokeDashoffset={200 * (1 - card)} />
      </svg>

      {/* request card */}
      <div
        style={{
          ...mono, position: "absolute", left: 620, top: 230, width: 500, padding: 28, borderRadius: 22,
          background: C.card, border: `1px solid ${C.accent}88`, fontSize: 21, lineHeight: 1.7,
          opacity: card, transform: `translateX(${(1 - card) * 60}px)`, boxShadow: `0 0 60px ${C.accent}33`,
        }}
      >
        {REQUEST.join("\n").slice(0, chars).split("\n").map((shown, i) => (
          <div key={i} style={{ minHeight: 34, color: i === 0 ? C.accent : i === 3 ? C.fg : C.muted }}>
            {shown}
          </div>
        ))}
      </div>
      {/* outgoing pulse to next scene */}
      <div style={{
        position: "absolute", top: 410, height: 4, width: 220, borderRadius: 9,
        left: interpolate(f, [86, 108], [900, 1500], clamp), opacity: f > 86 ? 1 : 0,
        background: `linear-gradient(90deg, transparent, ${C.accent})`, boxShadow: `0 0 24px ${C.accent}`,
      }} />
    </AbsoluteFill>
  );
}

/* ───────── scene 3: architecture draws itself, request travels ───────── */
const N = {
  app: { x: 150, y: 360, label: "Mobile app" },
  gw: { x: 450, y: 360, label: "API Gateway" },
  auth: { x: 760, y: 190, label: "Auth" },
  orders: { x: 760, y: 360, label: "Orders" },
  notify: { x: 760, y: 530, label: "Notify" },
  pg: { x: 1100, y: 280, label: "Postgres" },
  redis: { x: 1100, y: 450, label: "Redis" },
} as const;
type NK = keyof typeof N;
const EDGES: [NK, NK][] = [["app", "gw"], ["gw", "auth"], ["gw", "orders"], ["gw", "notify"], ["orders", "pg"], ["orders", "redis"], ["auth", "pg"]];
/** request hops: from, to, start frame, length, colour */
const HOPS: [NK, NK, number, number, string][] = [
  ["app", "gw", 42, 14, C.accent],
  ["gw", "auth", 56, 12, C.accent],
  ["auth", "pg", 68, 10, C.accent2],
  ["gw", "orders", 70, 12, C.accent],
  ["orders", "pg", 82, 10, C.accent2],
  ["orders", "redis", 82, 10, C.accent2],
  ["gw", "notify", 88, 12, C.accent],
  ["gw", "app", 98, 14, C.green],
];

function System() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = interpolate(f, [0, 120], [1.12, 1], { ...clamp, easing: easeOut });
  const keys = Object.keys(N) as NK[];
  const arrived = (k: NK) => HOPS.some(([, to, s, d]) => to === k && f >= s + d && f < s + d + 12);
  const response = interpolate(f, [110, 118], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ transform: `scale(${cam})` }}>
      <svg width={1280} height={720} style={{ position: "absolute" }}>
        {EDGES.map(([a, b], i) => {
          const len = Math.hypot(N[b].x - N[a].x, N[b].y - N[a].y);
          const p = interpolate(f, [8 + i * 4, 30 + i * 4], [0, 1], { ...clamp, easing: easeInOut });
          return <line key={a + b} x1={N[a].x} y1={N[a].y} x2={N[b].x} y2={N[b].y} stroke={C.line} strokeWidth={2}
            strokeDasharray={len} strokeDashoffset={len * (1 - p)} />;
        })}
        {HOPS.map(([a, b, s, d, color]) =>
          [0, 1, 2, 3].map((k) => {
            const t = (f - s) / d - k * 0.08;
            if (t < 0 || t > 1) return null;
            const e = easeInOut(t);
            return <circle key={a + b + s + k} r={7 - k * 1.4} fill={color} opacity={1 - k * 0.25}
              cx={N[a].x + (N[b].x - N[a].x) * e} cy={N[a].y + (N[b].y - N[a].y) * e}
              style={{ filter: k === 0 ? `drop-shadow(0 0 10px ${color})` : undefined }} />;
          }),
        )}
      </svg>
      {keys.map((k, i) => {
        const p = spring({ frame: f - i * 4, fps, config: { damping: 13 } });
        const hit = arrived(k);
        const db = k === "pg" || k === "redis";
        return (
          <div key={k} style={{
            position: "absolute", left: N[k].x - (k === "gw" ? 115 : 90), top: N[k].y - 34,
            width: k === "gw" ? 230 : 180, height: 68, borderRadius: 18, background: C.card,
            border: `1px solid ${hit ? (db ? C.accent2 : C.accent) : C.line}`,
            boxShadow: hit ? `0 0 50px ${db ? C.accent2 : C.accent}88` : "none",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontSize: 22, fontWeight: 600,
            transform: `scale(${p * (hit ? 1.06 : 1)})`, opacity: p,
          }}>
            <span style={{ width: 10, height: 10, borderRadius: 9, background: db ? C.accent2 : hit ? C.accent : C.muted }} />
            {N[k].label}
          </div>
        );
      })}
      <div style={{
        ...mono, position: "absolute", left: 60, top: 470, padding: "10px 16px", borderRadius: 12, fontSize: 18,
        background: `${C.green}1f`, border: `1px solid ${C.green}88`, color: C.green,
        opacity: response, transform: `translateY(${(1 - response) * 14}px)`,
      }}>201 Created · 118 ms</div>
      <div style={{ ...mono, position: "absolute", left: 60, top: 50, fontSize: 16, letterSpacing: 3, color: C.muted }}>
        GATEWAY → SERVICES → DATA
      </div>
    </AbsoluteFill>
  );
}

/* ───────── scene 4: impact metrics + end card ───────── */
const METRICS = [
  { to: 40, prefix: "−", suffix: "%", label: "p95 latency" },
  { to: 99.9, prefix: "", suffix: "%", label: "uptime", dec: 1 },
  { to: 50, prefix: "−", suffix: "%", label: "deploy time" },
];
const CHART = "M0,20 L60,26 L120,18 L180,30 L240,60 L300,92 L360,118 L420,128 L480,124 L540,132 L600,130";

function Metrics() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const out = interpolate(f, [46, 58], [1, 0], clamp);
  const end = spring({ frame: f - 52, fps, config: { damping: 15 } });
  const chart = interpolate(f, [6, 40], [0, 1], { ...clamp, easing: easeOut });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: out, padding: "110px 110px", transform: `scale(${0.96 + out * 0.04})` }}>
        <div style={{ display: "flex", gap: 70 }}>
          {METRICS.map((m, i) => {
            const v = interpolate(f, [4 + i * 6, 34 + i * 6], [0, m.to], { ...clamp, easing: easeOut });
            const p = spring({ frame: f - i * 6, fps, config: { damping: 16 } });
            return (
              <div key={m.label} style={{ opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
                <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -4 }}>
                  {m.prefix}{v.toFixed(m.dec ?? 0)}<span style={{ color: C.accent }}>{m.suffix}</span>
                </div>
                <div style={{ fontSize: 22, color: C.muted }}>{m.label}</div>
              </div>
            );
          })}
        </div>
        <svg width={1060} height={200} viewBox="0 0 600 150" preserveAspectRatio="none" style={{ marginTop: 60 }}>
          <path d={CHART} fill="none" stroke={C.accent} strokeWidth={3} pathLength={1}
            strokeDasharray={1} strokeDashoffset={1 - chart} vectorEffect="non-scaling-stroke"
            style={{ filter: `drop-shadow(0 0 8px ${C.accent})` }} />
        </svg>
        <div style={{ ...mono, fontSize: 16, color: C.muted, letterSpacing: 2 }}>LATENCY AFTER INDEXING + REDIS CACHING</div>
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: end }}>
        <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -4, transform: `scale(${0.9 + 0.1 * end})` }}>
          Backend<span style={{ color: C.accent }}>.</span> Mobile<span style={{ color: C.accent }}>.</span> Cloud
          <span style={{ color: C.accent }}>.</span>
        </div>
        <div style={{ height: 4, width: 420 * end, background: C.accent, borderRadius: 9, marginTop: 18, boxShadow: `0 0 20px ${C.accent}` }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

const SCENE_COMPONENTS = [Intro, Device, System, Metrics];

export function HeroReel() {
  return (
    <AbsoluteFill style={font}>
      <Backdrop />
      {SCENES.map((s, i) => {
        const Scene = SCENE_COMPONENTS[i];
        return (
          <Sequence key={s.label} from={s.from} durationInFrames={s.dur} layout="none">
            <Fade dur={s.dur}>
              <Scene />
            </Fade>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
}
