import React from 'react';
import {C, DISPLAY, UI} from '../theme';

// Agents are abstract modules, never robots: a rounded core with its own glyph and an orbit of activity.
export type AgentId = 'router' | 'social' | 'report' | 'sentiment' | 'predict' | 'notify';
export const AGENTS: Record<AgentId, {name: string; line: string; color: string}> = {
  router: {name: 'Agent Router', line: 'Classifies requests and routes them', color: C.white},
  social: {name: 'Social Feed Agent', line: 'Clusters posts about the same road', color: C.cyan},
  report: {name: 'User Report Agent', line: 'Reads photos, videos and text', color: C.blue},
  sentiment: {name: 'Sentiment Agent', line: 'Weighs tone and place signals', color: C.teal},
  predict: {name: 'Predictive Agent', line: 'Estimates the likely impact', color: '#8FB6FF'},
  notify: {name: 'Notification Agent', line: 'Alerts subscribers and stations', color: '#7FE3D2'},
};

const Glyph: React.FC<{id: AgentId; color: string}> = ({id, color}) => {
  const s = {stroke: color, strokeWidth: 5, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  switch (id) {
    case 'router':
      return (
        <g {...s}>
          <circle r={9} fill={color} />
          {[0, 72, 144, 216, 288].map((a) => <line key={a} x1={0} y1={0} x2={26 * Math.cos((a * Math.PI) / 180)} y2={26 * Math.sin((a * Math.PI) / 180)} />)}
          {[0, 72, 144, 216, 288].map((a) => <circle key={'c' + a} cx={28 * Math.cos((a * Math.PI) / 180)} cy={28 * Math.sin((a * Math.PI) / 180)} r={5} fill={color} />)}
        </g>
      );
    case 'social':
      return (
        <g {...s}>
          <rect x={-24} y={-22} width={36} height={28} rx={6} />
          <rect x={-12} y={-8} width={36} height={28} rx={6} fill={C.navy} />
          <line x1={-4} y1={2} x2={16} y2={2} />
          <line x1={-4} y1={11} x2={10} y2={11} />
        </g>
      );
    case 'report':
      return (
        <g {...s}>
          <rect x={-26} y={-18} width={52} height={38} rx={8} />
          <circle cx={0} cy={1} r={11} />
          <line x1={-10} y1={-18} x2={-4} y2={-26} />
          <line x1={-4} y1={-26} x2={8} y2={-26} />
        </g>
      );
    case 'sentiment':
      return (
        <g {...s}>
          <path d="M-28 4 C-20 -18 -12 -18 -6 0 C0 18 8 18 14 0 C18 -12 24 -14 28 -6" />
          <circle cx={-6} cy={0} r={3} fill={color} />
        </g>
      );
    case 'predict':
      return (
        <g {...s}>
          <path d="M-26 18 L-10 2 L2 10 L24 -16" />
          <path d="M10 -16 L24 -16 L24 -2" />
        </g>
      );
    case 'notify':
      return (
        <g {...s}>
          <path d="M-18 12 L-18 -2 C-18 -16 -8 -24 0 -24 C8 -24 18 -16 18 -2 L18 12 L22 16 L-22 16 Z" />
          <path d="M-6 22 C-4 27 4 27 6 22" />
        </g>
      );
  }
};

export const AgentNode: React.FC<{id: AgentId; t: number; active?: number; size?: number; label?: boolean; style?: React.CSSProperties}> = ({id, t, active = 0, size = 150, label = true, style}) => {
  const a = AGENTS[id];
  const ring = size * 0.62;
  return (
    <div style={{position: 'absolute', width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2, ...style}}>
      <svg width={size * 2} height={size * 2} viewBox={`${-size} ${-size} ${size * 2} ${size * 2}`} style={{position: 'absolute', left: -size / 2, top: -size / 2, overflow: 'visible'}}>
        <circle r={ring * (1.15 + 0.25 * active)} fill="none" stroke={a.color} strokeOpacity={0.15 + 0.35 * active} strokeWidth={2} />
        {[0, 1, 2].map((i) => {
          const ang = t * (1.2 + i * 0.35) + (i * Math.PI * 2) / 3;
          return <circle key={i} cx={Math.cos(ang) * ring * 1.15} cy={Math.sin(ang) * ring * 1.15} r={4 + 2 * active} fill={a.color} opacity={0.5 + 0.5 * active} />;
        })}
        <rect x={-size * 0.42} y={-size * 0.42} width={size * 0.84} height={size * 0.84} rx={size * 0.26} fill={C.navy} stroke={a.color} strokeWidth={2.5 + 2 * active} />
        <g transform={`scale(${size / 150})`}>
          <Glyph id={id} color={a.color} />
        </g>
      </svg>
      {label ? (
        <div style={{position: 'absolute', top: size * 0.98, left: '50%', translate: '-50% 0', textAlign: 'center', width: 360, fontFamily: UI}}>
          <div style={{fontFamily: DISPLAY, fontWeight: 700, fontSize: 28, color: C.white}}>{a.name}</div>
        </div>
      ) : null}
    </div>
  );
};

// travelling dots along a straight link between two points (HTML-space SVG)
export const Flow: React.FC<{from: [number, number]; to: [number, number]; t: number; color?: string; n?: number; opacity?: number; curve?: number; speed?: number}> = ({from, to, t, color = C.cyan, n = 5, opacity = 1, curve = 0, speed = 0.6}) => {
  const mx = (from[0] + to[0]) / 2 - (to[1] - from[1]) * curve, my = (from[1] + to[1]) / 2 + (to[0] - from[0]) * curve;
  const at = (f: number) => [(1 - f) ** 2 * from[0] + 2 * (1 - f) * f * mx + f * f * to[0], (1 - f) ** 2 * from[1] + 2 * (1 - f) * f * my + f * f * to[1]];
  return (
    <g opacity={opacity}>
      <path d={`M${from[0]} ${from[1]} Q${mx} ${my} ${to[0]} ${to[1]}`} stroke={color} strokeOpacity={0.28} strokeWidth={2} fill="none" />
      {Array.from({length: n}, (_, i) => {
        const f = (t * speed + i / n) % 1;
        const [x, y] = at(f);
        return <circle key={i} cx={x} cy={y} r={4.5} fill={color} opacity={Math.sin(f * Math.PI)} />;
      })}
    </g>
  );
};
