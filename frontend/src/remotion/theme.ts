import type { CSSProperties } from "react";

/** Canvas size and frame rate shared by every composition. */
export const W = 1280;
export const H = 720;
export const FPS = 30;

export const C = {
  bg: "#0a0a0b",
  card: "#141416",
  line: "#2a2a2e",
  fg: "#fafafa",
  muted: "#8b8b92",
  accent: "#3d7bff",
  accent2: "#a855f7",
  green: "#22c55e",
};

export const font: CSSProperties = { fontFamily: "var(--font-inter), system-ui, sans-serif", color: C.fg };
export const mono: CSSProperties = { fontFamily: "var(--font-mono), ui-monospace, monospace" };
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
