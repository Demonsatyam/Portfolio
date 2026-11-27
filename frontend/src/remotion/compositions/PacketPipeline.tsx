import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { clamp, font, mono } from "../theme";

/* ───────────── DPI Engine: the same story as the /dpi walkthrough, as a loop ─────────────
   capture.pcap → parse → SNI → signature match → AppType lanes → rules (YouTube blocked) → output.pcap */

const D = { bg: "#070B16", card: "#0C1426", line: "#22335A", mute: "#8E9DBB", blue: "#2678FF", cyan: "#00D4FF", purple: "#795CFF", green: "#24D18B", red: "#FF4545" };

const LANES = [
  { app: "YOUTUBE", host: "www.youtube.com", y: 150, blocked: true },
  { app: "FACEBOOK", host: "www.facebook.com", y: 255 },
  { app: "GOOGLE", host: "www.google.com", y: 360 },
  { app: "GITHUB", host: "github.com", y: 465 },
  { app: "UNKNOWN", host: "no hostname", y: 570 },
];
const ORDER = [0, 2, 3, 1, 4, 2, 0, 3, 1, 2, 4, 3, 0, 1, 2, 3]; // which lane each packet ends up in
const PERIOD = 240;
const GAP = PERIOD / ORDER.length; // 15 frames: seamless loop

function Env({ x, y, color, opacity = 1 }: { x: number; y: number; color: string; opacity?: number }) {
  return (
    <svg width={34} height={22} viewBox="0 0 52 34" style={{ position: "absolute", left: x - 17, top: y - 11, opacity, overflow: "visible", filter: `drop-shadow(0 0 6px ${color})` }}>
      <rect x={1} y={1} width={50} height={32} rx={6} fill={`${color}33`} stroke={color} strokeWidth={3} />
      <path d="M3 4 L26 20 L49 4" stroke={color} strokeWidth={3} fill="none" strokeLinejoin="round" />
    </svg>
  );
}

function Stage({ x, title, sub, color, active }: { x: number; title: string; sub: string; color: string; active: number }) {
  return (
    <div style={{ position: "absolute", left: x - 95, top: 360 - 52, width: 190, height: 104, borderRadius: 18, background: D.card, border: `2px solid ${color}`, boxShadow: `0 0 ${20 + 30 * active}px ${color}${active > 0.5 ? "66" : "33"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
      <span style={{ fontSize: 22, fontWeight: 700 }}>{title}</span>
      <span style={{ ...mono, fontSize: 13, color: D.mute }}>{sub}</span>
    </div>
  );
}

export function PacketPipeline() {
  const frame = useCurrentFrame();
  // the packet currently inside the classifier drives its label
  let ci = 0;
  for (let i = 1; i < ORDER.length; i++) if (Math.abs(((frame + i * GAP) % PERIOD) - 120) < Math.abs(((frame + ci * GAP) % PERIOD) - 120)) ci = i;
  const cur = ORDER[ci];
  const pulse = (frame % GAP) / GAP;
  return (
    <AbsoluteFill style={{ ...font, background: D.bg }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 55% at 50% -5%, ${D.blue}2A, transparent 70%)` }} />
      {/* wires */}
      <div style={{ position: "absolute", left: 40, width: 560, top: 359, height: 2, background: `linear-gradient(90deg, transparent, ${D.blue}88)` }} />
      {LANES.map((l) => (
        <svg key={l.app} style={{ position: "absolute", inset: 0, overflow: "visible" }} width={1280} height={720}>
          <path d={`M 640 360 C 740 360, 760 ${l.y}, 860 ${l.y}`} stroke={l.blocked ? `${D.red}88` : `${D.purple}66`} strokeWidth={2} fill="none" />
        </svg>
      ))}

      {/* packets */}
      {ORDER.map((lane, i) => {
        const t = ((frame + i * GAP) % PERIOD) / PERIOD;
        const L = LANES[lane];
        const x = interpolate(t, [0, 0.5, 0.78], [20, 640, 860], clamp);
        const bend = interpolate(t, [0.5, 0.78], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
        const y = 360 + (L.y - 360) * bend;
        const known = t > 0.5;
        const color = !known ? D.cyan : L.blocked ? D.red : L.app === "UNKNOWN" ? D.mute : D.green;
        const fade = L.blocked ? 1 - interpolate(t, [0.7, 0.78], [0, 1], clamp) : 1 - interpolate(t, [0.8, 0.86], [0, 1], clamp);
        const inStage = (t > 0.2 && t < 0.3) || (t > 0.45 && t < 0.55);
        return <Env key={i} x={x} y={y} color={color} opacity={fade * (inStage ? 0 : 1)} />;
      })}

      <Stage x={250} title="Parse" sub="Eth · IP · TCP/UDP" color={D.cyan} active={pulse < 0.3 ? 1 : 0} />
      <Stage x={560} title="SNI → AppType" sub={LANES[cur].host} color={D.purple} active={1} />

      {/* lanes */}
      {LANES.map((l, i) => {
        const hot = i === cur ? 1 : 0;
        const col = l.blocked ? D.red : l.app === "UNKNOWN" ? D.mute : D.purple;
        return (
          <div key={l.app} style={{ position: "absolute", left: 880, top: l.y - 30, width: 360, height: 60, borderRadius: 14, border: `2px solid ${col}${hot ? "FF" : "88"}`, background: `${col}${hot ? "26" : "12"}`, display: "flex", alignItems: "center", gap: 12, padding: "0 16px", boxSizing: "border-box" }}>
            <span style={{ ...mono, fontSize: 18, fontWeight: 700 }}>{l.app === "UNKNOWN" ? "UNKNOWN" : `AppType::${l.app}`}</span>
            <span style={{ marginLeft: "auto", ...mono, fontSize: 13, fontWeight: 700, padding: "4px 8px", borderRadius: 6, color: D.bg, background: l.blocked ? D.red : D.green }}>{l.blocked ? "✕ DROP" : "FORWARD"}</span>
          </div>
        );
      })}

      {/* header / footer */}
      <div style={{ ...mono, position: "absolute", left: 40, top: 40, fontSize: 18, color: D.mute }}>
        <span style={{ color: D.cyan }}>capture.pcap</span> → parse → SNI → signature match → rules → <span style={{ color: D.green }}>output.pcap</span>
      </div>
      <div style={{ ...mono, position: "absolute", left: 40, bottom: 36, fontSize: 15, color: D.mute }}>
        rule: block <span style={{ color: D.red }}>YouTube</span> · no decryption · sample traffic
      </div>
    </AbsoluteFill>
  );
}
