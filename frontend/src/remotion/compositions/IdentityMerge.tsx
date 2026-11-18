import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Box } from "../primitives";
import { C, clamp, font, mono } from "../theme";

/* ───────────── Identity resolution: records merge into one ───────────── */

const SOURCES = ["CRM", "Orders", "Support", "Mobile app", "Newsletter"];
const RECORDS = ["a.sharma@mail.com", "+91 98•••• 4410", "Aarti S.", "a.sharma@mail.com", "+91 98•••• 4410"];

export function IdentityMerge() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const merged = spring({ frame: frame - 75, fps, config: { damping: 14 } });
  const latency = interpolate(frame, [100, 150], [450, 120], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ ...font, background: C.bg }}>
      {SOURCES.map((s, i) => {
        const y = 110 + i * 125;
        const p = interpolate(frame, [20 + i * 6, 75 + i * 4], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
        return (
          <div key={s}>
            <Box x={150} y={y} w={200} h={70} style={{ fontSize: 20 }}>{s}</Box>
            <div style={{
              ...mono, position: "absolute", fontSize: 17, padding: "8px 14px", borderRadius: 10,
              background: `${C.accent}22`, border: `1px solid ${C.accent}66`, color: "#cfe0ff",
              left: interpolate(p, [0, 1], [270, 560]), top: interpolate(p, [0, 1], [y - 20, 340]),
              opacity: interpolate(p, [0.85, 1], [1, 0], clamp),
            }}>{RECORDS[i]}</div>
          </div>
        );
      })}
      <div style={{
        position: "absolute", left: 640, top: 210, width: 380, padding: 28, borderRadius: 24,
        background: C.card, border: `1px solid ${merged > 0.5 ? C.accent : C.line}`,
        transform: `scale(${0.9 + 0.1 * merged})`, boxShadow: `0 0 ${60 * merged}px ${C.accent}44`,
      }}>
        <div style={{ ...mono, fontSize: 16, color: C.muted }}>POST /identify</div>
        <div style={{ fontSize: 32, fontWeight: 700, marginTop: 12, opacity: merged }}>Aarti Sharma</div>
        <div style={{ ...mono, fontSize: 17, marginTop: 10, color: C.muted, opacity: merged, lineHeight: 1.6 }}>
          a.sharma@mail.com<br />+91 98•••• 4410<br />linked sources: 5
        </div>
      </div>
      <div style={{ position: "absolute", left: 640, top: 520, width: 380 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, color: C.muted }}>
          <span>query time</span><span style={{ ...mono, color: C.green }}>{latency.toFixed(0)}ms</span>
        </div>
        <div style={{ height: 10, borderRadius: 99, background: C.line, marginTop: 10 }}>
          <div style={{ height: 10, borderRadius: 99, width: `${(latency / 450) * 100}%`, background: C.accent }} />
        </div>
        <div style={{ fontSize: 18, color: C.muted, marginTop: 18 }}>
          duplicates removed <b style={{ color: C.fg }}>{Math.round(interpolate(frame, [80, 150], [0, 85], clamp))}%</b>
        </div>
      </div>
    </AbsoluteFill>
  );
}
