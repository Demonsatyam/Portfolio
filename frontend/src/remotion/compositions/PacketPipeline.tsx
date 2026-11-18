import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Box, Dot } from "../primitives";
import { C, clamp, font, mono } from "../theme";

/* ───────────── DPI: packets classified into protocol lanes ───────────── */

const PROTOCOLS = [
  { name: "HTTPS", color: C.accent },
  { name: "DNS", color: C.green },
  { name: "SSH", color: "#f59e0b" },
  { name: "QUIC", color: C.accent2 },
  { name: "SMTP", color: "#ec4899" },
];

export function PacketPipeline() {
  const frame = useCurrentFrame();
  const count = 28;
  return (
    <AbsoluteFill style={{ ...font, background: C.bg }}>
      <div style={{ position: "absolute", left: 40, top: 356, width: 1200, height: 8, background: C.line, borderRadius: 4 }} />
      <Box x={560} y={360} w={200} h={130} glow={C.accent} style={{ flexDirection: "column", gap: 4 }}>
        <span>Classifier</span>
        <span style={{ ...mono, fontSize: 14, color: C.muted }}>15+ signatures</span>
      </Box>
      {PROTOCOLS.map((p, i) => (
        <div key={p.name} style={{
          position: "absolute", left: 1000, top: 110 + i * 120, width: 230, height: 60, borderRadius: 14,
          border: `1px solid ${p.color}66`, background: `${p.color}14`, display: "flex", alignItems: "center",
          padding: "0 18px", gap: 10, fontSize: 20, fontWeight: 600,
        }}>
          <Dot color={p.color} />{p.name}
        </div>
      ))}
      {Array.from({ length: count }).map((_, i) => {
        const t = ((frame + i * 9) % 120) / 120;
        const lane = (i * 7) % PROTOCOLS.length;
        const ty = 140 + lane * 120;
        const x = interpolate(t, [0, 0.45, 1], [-40, 560, 990]);
        const y = t < 0.45 ? 360 : interpolate(t, [0.45, 0.8], [360, ty], { ...clamp, easing: Easing.inOut(Easing.cubic) });
        const colored = t > 0.45;
        return (
          <div key={i} style={{
            position: "absolute", left: x - 14, top: y - 9, width: 28, height: 18, borderRadius: 5,
            background: colored ? PROTOCOLS[lane].color : C.muted,
            opacity: t > 0.38 && t < 0.5 ? 0 : 1,
            boxShadow: colored ? `0 0 14px ${PROTOCOLS[lane].color}` : undefined,
          }} />
        );
      })}
      <div style={{ ...mono, position: "absolute", left: 40, top: 40, fontSize: 20, color: C.muted }}>
        throughput <span style={{ color: C.green }}>{(1000 + Math.round(40 * Math.sin(frame / 7)) + 30).toLocaleString()} pkt/s</span>
        {"  ·  "}precision <span style={{ color: C.green }}>94%</span>
      </div>
    </AbsoluteFill>
  );
}
