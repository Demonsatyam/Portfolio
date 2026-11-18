import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, clamp, font, mono } from "../theme";

/* ───────────── City Pulse: agent reasoning trace ───────────── */

const STEPS = [
  { k: "plan", t: "Break the question into: traffic, events, weather" },
  { k: "tool", t: "traffic_api.get(area=\"Andheri\") → heavy, 38 min delay" },
  { k: "rag", t: "vector_db.search(\"Andheri events today\") → 4 docs" },
  { k: "tool", t: "weather_api.now(\"Mumbai\") → light rain" },
  { k: "answer", t: "Heavy traffic near Andheri: a concert at 7pm plus rain. Take the metro." },
];
const STEP_COLOR: Record<string, string> = { plan: C.muted, tool: C.accent, rag: C.accent2, answer: C.green };

export function AgentTrace() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const q = "Why is traffic heavy near Andheri right now?";
  const typed = q.slice(0, Math.floor(interpolate(frame, [0, 40], [0, q.length], clamp)));
  return (
    <AbsoluteFill style={{ ...font, background: C.bg, padding: 70 }}>
      <div style={{ alignSelf: "flex-end", maxWidth: 700, padding: "18px 24px", borderRadius: 20, background: C.accent, fontSize: 26, fontWeight: 500 }}>
        {typed}<span style={{ opacity: frame % 20 < 10 && frame < 50 ? 1 : 0 }}>▍</span>
      </div>
      <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 18 }}>
        {STEPS.map((s, i) => {
          const start = 55 + i * 28;
          const p = spring({ frame: frame - start, fps, config: { damping: 18 } });
          const last = s.k === "answer";
          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 18, opacity: p, transform: `translateY(${(1 - p) * 20}px)`,
              padding: last ? "18px 22px" : "6px 0", borderRadius: 16,
              background: last ? C.card : undefined, border: last ? `1px solid ${C.green}66` : undefined,
            }}>
              <span style={{
                ...mono, fontSize: 15, padding: "4px 10px", borderRadius: 8, minWidth: 84, textAlign: "center",
                color: STEP_COLOR[s.k], border: `1px solid ${STEP_COLOR[s.k]}66`,
              }}>{s.k}</span>
              <span style={{ ...(last ? {} : mono), fontSize: last ? 24 : 19, color: last ? C.fg : "#c9c9cf" }}>{s.t}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}
