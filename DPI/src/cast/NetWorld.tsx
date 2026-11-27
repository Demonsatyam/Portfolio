import React from 'react';
import {C} from '../theme';
import {rand} from './Kit';

// Isometric network: laptops → routers → servers, with packets streaming along the links.
type Kind = 'laptop' | 'router' | 'server';
const NODES: {g: [number, number]; k: Kind}[] = [
  {g: [-5, -1], k: 'laptop'}, {g: [-5, 2], k: 'laptop'}, {g: [-2, -5], k: 'laptop'}, {g: [1, -5.5], k: 'laptop'}, {g: [-4.5, 5], k: 'laptop'}, {g: [-1, 6], k: 'laptop'},
  {g: [-2, 1], k: 'router'}, {g: [1, -2], k: 'router'}, {g: [1, 3], k: 'router'}, {g: [3.5, 0.5], k: 'router'},
  {g: [6, -1.5], k: 'server'}, {g: [6, 0.5], k: 'server'}, {g: [6, 2.5], k: 'server'}, {g: [7.5, -3.5], k: 'server'}, {g: [3, -5], k: 'server'},
];
const EDGES: [number, number][] = [[0, 6], [1, 6], [2, 7], [3, 7], [4, 8], [5, 8], [6, 7], [6, 8], [7, 9], [8, 9], [9, 10], [9, 11], [9, 12], [9, 13], [7, 14]];
const COLORS = [C.blue, C.cyan, C.cyan, C.blue, C.purple];

export const NetWorld: React.FC<{t: number; S?: number; cx?: number; cy?: number; density?: number; packets?: number; highlightUser?: number}> = ({t, S = 78, cx = 960, cy = 520, density = 1, packets = 1, highlightUser = 0}) => {
  const pr = (gx: number, gy: number, z = 0): [number, number] => [cx + (gx - gy) * S * 0.866, cy + (gx + gy) * S * 0.5 - z * S];
  const box = (gx: number, gy: number, w: number, d: number, h: number, col: string, key: string) => {
    const p = (x: number, y: number, z: number) => pr(gx + x, gy + y, z).join(',');
    return (
      <g key={key}>
        <polygon points={[p(-w / 2, d / 2, 0), p(w / 2, d / 2, 0), p(w / 2, d / 2, h), p(-w / 2, d / 2, h)].join(' ')} fill={col} opacity={0.75} />
        <polygon points={[p(w / 2, -d / 2, 0), p(w / 2, d / 2, 0), p(w / 2, d / 2, h), p(w / 2, -d / 2, h)].join(' ')} fill={col} opacity={0.5} />
        <polygon points={[p(-w / 2, -d / 2, h), p(w / 2, -d / 2, h), p(w / 2, d / 2, h), p(-w / 2, d / 2, h)].join(' ')} fill={col} />
      </g>
    );
  };
  const node = (n: (typeof NODES)[number], i: number) => {
    const [gx, gy] = n.g;
    if (n.k === 'server') {
      return (
        <g key={i}>
          {box(gx, gy, 1.1, 1.1, 2.2, '#1A2A4C', 's' + i)}
          {[0.4, 0.8, 1.2, 1.6].map((z, j) => {
            const [x1, y1] = pr(gx + 0.55, gy - 0.4, z), [x2, y2] = pr(gx + 0.55, gy + 0.4, z);
            const on = rand(i * 9 + j + Math.floor(t * 4)) > 0.4;
            return <line key={j} x1={x1} y1={y1} x2={x2} y2={y2} stroke={on ? C.cyan : '#27406E'} strokeWidth={3} />;
          })}
        </g>
      );
    }
    if (n.k === 'router') {
      const [ax, ay] = pr(gx - 0.2, gy - 0.2, 0.45), [bx, by] = pr(gx + 0.2, gy - 0.3, 0.45);
      return (
        <g key={i}>
          {box(gx, gy, 1, 0.8, 0.45, '#1D3563', 'r' + i)}
          <line x1={ax} y1={ay} x2={ax} y2={ay - 30} stroke="#4C6AA8" strokeWidth={4} />
          <line x1={bx} y1={by} x2={bx} y2={by - 30} stroke="#4C6AA8" strokeWidth={4} />
          <circle cx={pr(gx, gy + 0.4, 0.22)[0]} cy={pr(gx, gy + 0.4, 0.22)[1]} r={4} fill={(t * 3 + i) % 1 > 0.5 ? C.green : '#1F6B4C'} />
        </g>
      );
    }
    const hl = i === 0 ? highlightUser : 0;
    return (
      <g key={i}>
        {box(gx, gy, 0.9, 0.6, 0.08, '#2A3A5E', 'l' + i)}
        <polygon points={[pr(gx - 0.45, gy - 0.3, 0.08), pr(gx + 0.45, gy - 0.3, 0.08), pr(gx + 0.45, gy - 0.3, 0.68), pr(gx - 0.45, gy - 0.3, 0.68)].map((q) => q.join(',')).join(' ')} fill={hl ? C.cyan : '#123'} stroke="#3B5486" strokeWidth={2} opacity={0.9} />
        {hl ? <circle cx={pr(gx, gy, 0.4)[0]} cy={pr(gx, gy, 0.4)[1]} r={40 + 10 * Math.sin(t * 4)} fill={C.cyan} opacity={0.18 * hl} /> : null}
      </g>
    );
  };
  const order = NODES.map((n, i) => [n.g[0] + n.g[1], i]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
  return (
    <svg viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible'}}>
      {/* floor grid */}
      {Array.from({length: 17}, (_, k) => k - 8).map((k) => {
        const a = pr(k, -8), b = pr(k, 8), c = pr(-8, k), d = pr(8, k);
        return <g key={k} stroke={C.blue} strokeOpacity={0.12} strokeWidth={1.5}><line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} /><line x1={c[0]} y1={c[1]} x2={d[0]} y2={d[1]} /></g>;
      })}
      {/* links */}
      {EDGES.map(([a, b], i) => {
        const p = pr(...NODES[a].g, 0.1), q = pr(...NODES[b].g, 0.1);
        return <line key={i} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={C.blue} strokeOpacity={0.35} strokeWidth={3} />;
      })}
      {order.map((i) => node(NODES[i], i))}
      {/* packets */}
      <g style={{filter: `drop-shadow(0 0 6px ${C.cyan})`}}>
      {packets > 0 && EDGES.flatMap(([a, b], i) => Array.from({length: Math.round(6 * density)}, (_, k) => {
        const dir = k % 2 ? 1 : -1, sp = 0.18 + rand(i * 13 + k) * 0.25;
        let u = (t * sp + rand(i * 7 + k * 3)) % 1;
        if (dir < 0) u = 1 - u;
        const p = pr(...NODES[a].g, 0.1), q = pr(...NODES[b].g, 0.1);
        const x = p[0] + (q[0] - p[0]) * u, y = p[1] + (q[1] - p[1]) * u;
        const col = COLORS[(i + k) % COLORS.length];
        return <circle key={`${i}-${k}`} cx={x} cy={y - 6} r={5} fill={col} opacity={packets * (0.6 + 0.4 * Math.sin(u * Math.PI))} />;
      }))}
      </g>
    </svg>
  );
};
