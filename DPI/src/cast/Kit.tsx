import React from 'react';
import {AbsoluteFill} from 'remotion';
import {ramp} from '../anim';
import {C, DISPLAY, MONO, UI} from '../theme';

export type P = [number, number];

// ---------- backdrop: midnight, soft top light, optional perspective floor grid that scrolls ----------
export const Stage: React.FC<{children?: React.ReactNode; grid?: number; scroll?: number; light?: string}> = ({children, grid = 0, scroll = 0, light = C.blue}) => (
  <AbsoluteFill style={{background: C.bg, overflow: 'hidden'}}>
    <AbsoluteFill style={{background: `radial-gradient(ellipse 70% 55% at 50% -5%, ${light}2A, transparent 70%)`}} />
    {grid > 0 ? (
      <div style={{position: 'absolute', left: -1200, right: -1200, top: 560, height: 1400, transformOrigin: '50% 0%', transform: 'perspective(700px) rotateX(70deg)', opacity: grid,
        backgroundImage: `linear-gradient(${C.blue}55 2px, transparent 2px), linear-gradient(90deg, ${C.blue}55 2px, transparent 2px)`, backgroundSize: '120px 120px', backgroundPosition: `0 ${scroll}px`,
        maskImage: 'linear-gradient(to bottom, transparent, black 25%, black 60%, transparent)'}} />
    ) : null}
    {children}
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 60%, rgba(0,0,0,0.55))', pointerEvents: 'none'}} />
  </AbsoluteFill>
);

// ---------- glass panel ----------
export const Panel: React.FC<{children?: React.ReactNode; style?: React.CSSProperties; glow?: string; on?: number}> = ({children, style, glow, on = 1}) => (
  <div style={{position: 'absolute', background: 'rgba(15,26,48,0.82)', border: `2px solid ${glow ? glow + 'AA' : C.line}`, borderRadius: 22, boxShadow: `0 30px 70px rgba(0,0,0,0.45)${glow ? `, 0 0 ${40 * on}px ${glow}44` : ''}`, color: C.white, fontFamily: UI, opacity: on, ...style}}>{children}</div>
);

export const Kicker: React.FC<{children: React.ReactNode; color?: string; style?: React.CSSProperties}> = ({children, color = C.cyan, style}) => (
  <div style={{fontFamily: DISPLAY, fontWeight: 700, fontSize: 26, letterSpacing: 7, color, ...style}}>{children}</div>
);

export const H: React.FC<{children: React.ReactNode; size?: number; style?: React.CSSProperties}> = ({children, size = 64, style}) => (
  <div style={{fontFamily: DISPLAY, fontWeight: 700, fontSize: size, color: C.white, lineHeight: 1.08, letterSpacing: -1, ...style}}>{children}</div>
);

// small mono label chip
export const Chip: React.FC<{color?: string; children: React.ReactNode; style?: React.CSSProperties; size?: number; solid?: boolean}> = ({color = C.cyan, children, style, size = 24, solid}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: size * 0.4, padding: `${size * 0.32}px ${size * 0.6}px`, borderRadius: 10, background: solid ? color : color + '1F', border: `2px solid ${color}`, color: solid ? C.bg : C.white, fontFamily: MONO, fontWeight: 500, fontSize: size, whiteSpace: 'nowrap', ...style}}>{children}</div>
);

// "this is a demo" honesty tag
export const Note: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{position: 'absolute', fontFamily: UI, fontSize: 20, color: C.mute, letterSpacing: 1, ...style}}>{children}</div>
);

// ---------- packet: a small glowing envelope ----------
export const Packet: React.FC<{x: number; y: number; color?: string; size?: number; label?: string; opacity?: number; rot?: number}> = ({x, y, color = C.blue, size = 1, label, opacity = 1, rot = 0}) => (
  <div style={{position: 'absolute', left: x - 26 * size, top: y - 17 * size, width: 52 * size, height: 34 * size, opacity, rotate: `${rot}deg`}}>
    <svg width={52 * size} height={34 * size} viewBox="0 0 52 34" style={{overflow: 'visible', filter: `drop-shadow(0 0 ${8 * size}px ${color})`}}>
      <rect x={1} y={1} width={50} height={32} rx={6} fill={color + '33'} stroke={color} strokeWidth={2.5} />
      <path d="M3 4 L26 20 L49 4" stroke={color} strokeWidth={2.5} fill="none" strokeLinejoin="round" />
    </svg>
    {label ? <div style={{position: 'absolute', left: '50%', top: 34 * size + 6, translate: '-50% 0', fontFamily: MONO, fontSize: 16 * Math.max(1, size * 0.8), color, whiteSpace: 'nowrap'}}>{label}</div> : null}
  </div>
);

// dot used for dense traffic
export const Dot: React.FC<{x: number; y: number; color: string; r?: number; opacity?: number}> = ({x, y, color, r = 5, opacity = 1}) => (
  <div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: r, background: color, boxShadow: `0 0 ${r * 3}px ${color}`, opacity}} />
);

// ---------- polyline helpers ----------
export const polyLen = (pts: P[]) => pts.slice(1).reduce((a, p, i) => a + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);
export const along = (pts: P[], p: number): P => {
  const total = polyLen(pts);
  let d = Math.max(0, Math.min(1, p)) * total;
  for (let i = 1; i < pts.length; i++) {
    const seg = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (d <= seg || i === pts.length - 1) { const k = seg ? Math.min(1, d / seg) : 0; return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k]; }
    d -= seg;
  }
  return pts[pts.length - 1];
};

// glowing connection drawn in by `p`, with optional arrow head
export const Wire: React.FC<{pts: P[]; color?: string; p?: number; width?: number; arrow?: boolean; dash?: boolean; opacity?: number}> = ({pts, color = C.blue, p = 1, width = 3, arrow, dash, opacity = 1}) => {
  if (p <= 0.001) return null;
  const len = polyLen(pts);
  const d = 'M' + pts.map((q) => q.join(' ')).join(' L');
  const [ex, ey] = along(pts, p);
  const [bx, by] = along(pts, Math.max(0, p - 12 / len));
  const ang = Math.atan2(ey - by, ex - bx);
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'visible', opacity}}>
      <path d={d} stroke={color} strokeOpacity={0.18} strokeWidth={width * 4} fill="none" strokeDasharray={`${len * p} ${len}`} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} stroke={color} strokeWidth={width} fill="none" strokeDasharray={dash ? '10 10' : `${len * p} ${len}`} strokeLinecap="round" strokeLinejoin="round" opacity={dash ? Math.min(1, p * 3) : 1} />
      {arrow && p > 0.02 ? <path d="M-14 -9 L0 0 L-14 9" transform={`translate(${ex} ${ey}) rotate(${(ang * 180) / Math.PI})`} stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
    </svg>
  );
};

// ---------- stage block: rounded box with title + subtitle (pipeline stages, threads) ----------
export const Block: React.FC<{x: number; y: number; w: number; h: number; title: string; sub?: string; color?: string; on?: number; active?: number; icon?: React.ReactNode; size?: number}> = ({x, y, w, h, title, sub, color = C.blue, on = 1, active = 0, icon, size = 28}) => (
  <div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, borderRadius: 18, opacity: on, scale: String(0.9 + 0.1 * on),
    background: `linear-gradient(180deg, ${color}${active > 0.5 ? '40' : '22'}, rgba(12,20,38,0.92))`, border: `2px solid ${color}${active > 0.5 ? 'FF' : '88'}`,
    boxShadow: `0 0 ${10 + 40 * active}px ${color}${active > 0.5 ? '77' : '33'}, 0 20px 50px rgba(0,0,0,0.4)`, display: 'flex', alignItems: 'center', gap: 16, padding: '0 22px', boxSizing: 'border-box', color: C.white}}>
    {icon}
    <div style={{flex: 1, textAlign: icon ? 'left' : 'center'}}>
      <div style={{fontFamily: DISPLAY, fontWeight: 700, fontSize: size, lineHeight: 1.1}}>{title}</div>
      {sub ? <div style={{fontFamily: MONO, fontSize: size * 0.62, color: C.mute, marginTop: 4}}>{sub}</div> : null}
    </div>
  </div>
);

// ---------- icons (simple line glyphs, 1em box) ----------
export const Icon: React.FC<{name: 'file' | 'cpu' | 'shield' | 'filter' | 'report' | 'search' | 'lock' | 'wave' | 'tag' | 'split' | 'eye'; color?: string; size?: number}> = ({name, color = C.cyan, size = 44}) => {
  const st = {stroke: color, strokeWidth: 2.4, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  const g: Record<string, React.ReactNode> = {
    file: <><path d="M10 4 H28 L38 14 V44 H10 Z" {...st} /><path d="M28 4 V14 H38 M16 24 H32 M16 31 H32 M16 38 H26" {...st} /></>,
    cpu: <><rect x={12} y={12} width={24} height={24} rx={3} {...st} /><rect x={19} y={19} width={10} height={10} {...st} /><path d="M18 6 V12 M24 6 V12 M30 6 V12 M18 36 V42 M24 36 V42 M30 36 V42 M6 18 H12 M6 24 H12 M6 30 H12 M36 18 H42 M36 24 H42 M36 30 H42" {...st} /></>,
    shield: <><path d="M24 4 L40 10 V22 C40 33 33 40 24 44 C15 40 8 33 8 22 V10 Z" {...st} /><path d="M17 24 L22 29 L31 19" {...st} /></>,
    filter: <path d="M6 8 H42 L28 26 V40 L20 44 V26 Z" {...st} />,
    report: <><rect x={8} y={6} width={32} height={38} rx={3} {...st} /><path d="M15 34 V26 M22 34 V18 M29 34 V22 M34 34 V14" {...st} /></>,
    search: <><circle cx={21} cy={21} r={13} {...st} /><path d="M31 31 L42 42" {...st} /></>,
    lock: <><rect x={10} y={21} width={28} height={22} rx={4} {...st} /><path d="M16 21 V15 A8 8 0 0 1 32 15 V21" {...st} /><circle cx={24} cy={32} r={2.5} fill={color} /></>,
    wave: <path d="M4 24 H12 L16 12 L22 36 L28 8 L34 32 L38 24 H44" {...st} />,
    tag: <><path d="M6 8 V22 L26 42 L42 26 L22 6 H8 Z" {...st} /><circle cx={15} cy={15} r={3} {...st} /></>,
    split: <path d="M6 24 H20 M20 24 L40 10 M20 24 L40 38 M34 8 L40 10 L38 16 M34 40 L40 38 L38 32" {...st} />,
    eye: <><path d="M4 24 C12 12 36 12 44 24 C36 36 12 36 4 24 Z" {...st} /><circle cx={24} cy={24} r={6} {...st} /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 48 48" style={{flexShrink: 0}}>{g[name]}</svg>;
};

// ---------- fade helper for sub-shots inside a scene ----------
export const Shot: React.FC<{s: number; from: number; to: number; children: React.ReactNode; fade?: number}> = ({s, from, to, children, fade = 0.5}) => {
  if (s < from - 0.01 || s > to + 0.01) return null;
  const o = Math.min(ramp(s, from, from + fade), 1 - ramp(s, to - fade, to));
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

// seeded random for stable layouts
export const rand = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
