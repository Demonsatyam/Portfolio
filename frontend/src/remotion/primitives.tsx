import type { CSSProperties, ReactNode } from "react";
import { C } from "./theme";

export function Box({ x, y, w = 180, h = 64, children, glow, style }: {
  x: number; y: number; w?: number; h?: number; children: ReactNode; glow?: string; style?: CSSProperties;
}) {
  return (
    <div
      style={{
        position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h,
        background: C.card, border: `1px solid ${glow ?? C.line}`, borderRadius: 16,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        fontSize: 22, fontWeight: 600, boxShadow: glow ? `0 0 40px ${glow}55` : undefined, ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Dot({ color }: { color: string }) {
  return <span style={{ width: 10, height: 10, borderRadius: 99, background: color, display: "inline-block" }} />;
}
