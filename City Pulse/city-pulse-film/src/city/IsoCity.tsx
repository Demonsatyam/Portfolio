import React from 'react';
import {interpolateColors, random} from 'remotion';
import {C} from '../theme';
import {buildings, carPos, cars, P, project, road, ROAD_MAX, ROAD_MIN, ROAD_SPAN, View} from './city';

export type Cam = {x: number; y: number; zoom: number; rot?: number};
export type Jam = {from: P; to: P; grow: number; level: number}; // stripe from `from` toward `to`; level 0 amber → 1 red
export type RouteDraw = {pts: P[]; color: string; width?: number; progress?: number; opacity?: number; dash?: boolean};

export type CityProps = {
  view: View;
  cam: Cam;
  t: number; // traffic clock (s)
  density?: number;
  net?: number; // 0 city → 1 data network
  night?: number;
  sun?: number;
  jams?: Jam[];
  routes?: RouteDraw[];
  buildingOpacity?: number;
  overlay?: (pr: (p: P, z?: number) => P) => React.ReactNode;
};

const W = 1920, H = 1080;
const pts = (a: P[]) => a.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

// world → frame pixel position (for HTML overlays)
export const toScreen = (p: P, view: View, cam: Cam, z = 0): P => {
  const [sx, sy] = project(p[0], p[1], z, view);
  const [fx, fy] = project(cam.x, cam.y, 0, view);
  return [W / 2 + (sx - fx) * cam.zoom, H / 2 + (sy - fy) * cam.zoom];
};

export const IsoCity: React.FC<CityProps> = ({view, cam, t, density = 1, net = 0, night = 0, sun = 0, jams = [], routes = [], buildingOpacity = 1, overlay}) => {
  const pr = (p: P, z = 0) => project(p[0], p[1], z, view);
  const [fx, fy] = project(cam.x, cam.y, 0, view);
  const lo = ROAD_SPAN[0], hi = ROAD_SPAN[1];
  const roadKs = Array.from({length: ROAD_MAX - ROAD_MIN + 1}, (_, i) => ROAD_MIN + i);

  const ground = interpolateColors(night, [0, 1], [C.navy2, '#0A1222']);
  const roadCol = interpolateColors(net, [0, 1], [interpolateColors(night, [0, 1], ['#27365A', '#18233B']), '#0D1729']);

  // jam membership test for hiding free-flowing cars inside a queue
  const inJam = (p: P) =>
    jams.some((j) => {
      const L = Math.hypot(j.to[0] - j.from[0], j.to[1] - j.from[1]) * j.grow;
      const ux = (j.to[0] - j.from[0]) / Math.hypot(j.to[0] - j.from[0], j.to[1] - j.from[1]);
      const uy = (j.to[1] - j.from[1]) / Math.hypot(j.to[0] - j.from[0], j.to[1] - j.from[1]);
      const dx = p[0] - j.from[0], dy = p[1] - j.from[1];
      const a = dx * ux + dy * uy, perp = Math.abs(dx * -uy + dy * ux);
      return a > -0.2 && a < L && perp < 0.3;
    });

  const routePath = (r: RouteDraw) => {
    const s = r.pts.map((p) => pr(p));
    let len = 0;
    for (let i = 1; i < s.length; i++) len += Math.hypot(s[i][0] - s[i - 1][0], s[i][1] - s[i - 1][1]);
    return {d: 'M' + s.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' L'), len};
  };

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
      <defs>
        <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      <g transform={`translate(${W / 2} ${H / 2}) rotate(${cam.rot ?? 0}) scale(${cam.zoom}) translate(${-fx} ${-fy})`}>
        {/* ground */}
        <polygon points={pts([pr([lo - 12, lo - 12]), pr([hi + 12, lo - 12]), pr([hi + 12, hi + 12]), pr([lo - 12, hi + 12])])} fill={ground} />
        {/* roads */}
        {roadKs.map((k) => (
          <g key={k}>
            <polygon points={pts([pr([road(k) - 0.25, lo]), pr([road(k) + 0.25, lo]), pr([road(k) + 0.25, hi]), pr([road(k) - 0.25, hi])])} fill={roadCol} />
            <polygon points={pts([pr([lo, road(k) - 0.25]), pr([hi, road(k) - 0.25]), pr([hi, road(k) + 0.25]), pr([lo, road(k) + 0.25])])} fill={roadCol} />
          </g>
        ))}
        {/* lane markings fade out as the network takes over */}
        <g opacity={(1 - net) * 0.35} stroke="#5A6C8E" strokeWidth={1.2} strokeDasharray="6 9">
          {roadKs.map((k) => (
            <g key={k}>
              <line x1={pr([road(k), lo])[0]} y1={pr([road(k), lo])[1]} x2={pr([road(k), hi])[0]} y2={pr([road(k), hi])[1]} />
              <line x1={pr([lo, road(k)])[0]} y1={pr([lo, road(k)])[1]} x2={pr([hi, road(k)])[0]} y2={pr([hi, road(k)])[1]} />
            </g>
          ))}
        </g>
        {/* parks */}
        {buildings.filter((b) => b.kind === 'park').map((b, i) => (
          <polygon key={'p' + i} opacity={buildingOpacity * (1 - net * 0.8)} points={pts([pr([b.x, b.y]), pr([b.x + b.w, b.y]), pr([b.x + b.w, b.y + b.d]), pr([b.x, b.y + b.d])])} fill={interpolateColors(night, [0, 1], ['#1C4A45', '#11302F'])} />
        ))}
        {/* data network */}
        {net > 0 ? (
          <g opacity={net}>
            {roadKs.map((k) => (
              <g key={k} stroke={C.cyan} strokeOpacity={0.45} strokeWidth={1.6}>
                <line x1={pr([road(k), lo])[0]} y1={pr([road(k), lo])[1]} x2={pr([road(k), hi])[0]} y2={pr([road(k), hi])[1]} />
                <line x1={pr([lo, road(k)])[0]} y1={pr([lo, road(k)])[1]} x2={pr([hi, road(k)])[0]} y2={pr([hi, road(k)])[1]} />
              </g>
            ))}
            {roadKs.flatMap((a) =>
              roadKs.map((b) => {
                const [x, y] = pr([road(a), road(b)]);
                const pulse = 0.5 + 0.5 * Math.sin(t * 2 + random(`n${a}${b}`) * 6.28);
                return <circle key={`${a}_${b}`} cx={x} cy={y} r={2.5 + pulse * 2.5} fill={C.cyan} opacity={0.35 + pulse * 0.5} />;
              }),
            )}
          </g>
        ) : null}
        {/* cars (drawn as short light streaks) */}
        <g strokeLinecap="round">
          {cars.map((c, i) => {
            if (random(`vis${i}`) > density) return null;
            const p = carPos(c, t);
            if (inJam(p)) return null;
            const ahead: P = c.axis === 'y' ? [p[0], p[1] + 0.14 * c.dir] : [p[0] + 0.14 * c.dir, p[1]];
            const a = pr(p), b = pr(ahead);
            const col = net > 0.5 ? C.cyan : c.hue < 0.15 ? C.amber : c.hue < 0.3 ? '#9FC2FF' : '#E8EEF7';
            return <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={col} strokeWidth={net > 0.5 ? 3 : 4.2} opacity={0.9} />;
          })}
        </g>
        {/* buildings */}
        <g opacity={buildingOpacity * (1 - net * 0.72)}>
          {buildings.map((b, i) => {
            if (b.kind === 'park') return null;
            const {x, y, w, d, h} = b;
            const top = [pr([x, y], h), pr([x + w, y], h), pr([x + w, y + d], h), pr([x, y + d], h)];
            const east = [pr([x + w, y], 0), pr([x + w, y + d], 0), pr([x + w, y + d], h), pr([x + w, y], h)];
            const south = [pr([x, y + d], 0), pr([x + w, y + d], 0), pr([x + w, y + d], h), pr([x, y + d], h)];
            let tc = interpolateColors(b.tone, [0, 1], ['#2F4369', '#3F5885']);
            let ec = interpolateColors(b.tone, [0, 1], ['#1F2E4E', '#27395F']);
            let sc = interpolateColors(b.tone, [0, 1], ['#17223D', '#1C2A49']);
            if (b.kind === 'office') { tc = '#5D8BD6'; ec = '#2F5EA8'; sc = '#244B8C'; }
            if (b.kind === 'home') { tc = '#D49A6A'; ec = '#A8714A'; sc = '#8A5B3B'; }
            if (b.kind === 'station') { tc = '#3B5178'; ec = '#2B3E60'; sc = '#22334F'; }
            if (sun > 0) { tc = interpolateColors(sun * 0.22, [0, 1], [tc, '#FFC08A']); ec = interpolateColors(sun * 0.16, [0, 1], [ec, '#FFA866']); }
            if (night > 0) { tc = interpolateColors(night * 0.6, [0, 1], [tc, '#0C1424']); ec = interpolateColors(night * 0.6, [0, 1], [ec, '#09101E']); sc = interpolateColors(night * 0.6, [0, 1], [sc, '#070C17']); }
            const lit = night > 0.2 && h > 0.6;
            return (
              <g key={i}>
                <polygon points={pts(south)} fill={sc} />
                <polygon points={pts(east)} fill={ec} />
                <polygon points={pts(top)} fill={tc} />
                {lit
                  ? [0.3, 0.55, 0.8].map((f, j) =>
                      random(`w${i}${j}`) < 0.55 ? (
                        <circle key={j} cx={pr([x + w * (0.25 + 0.5 * random(`wx${i}${j}`)), y + d], h * f)[0]} cy={pr([x + w * 0.5, y + d], h * f)[1]} r={1.6} fill="#FFD9A0" opacity={night * 0.85} />
                      ) : null,
                    )
                  : null}
                {b.kind === 'station' ? (
                  <>
                    <line x1={pr([x + w / 2, y + d / 2], h)[0]} y1={pr([x + w / 2, y + d / 2], h)[1]} x2={pr([x + w / 2, y + d / 2], h + 1.2)[0]} y2={pr([x + w / 2, y + d / 2], h + 1.2)[1]} stroke="#A9B8D4" strokeWidth={2} />
                    <circle cx={pr([x + w / 2, y + d / 2], h + 1.2)[0]} cy={pr([x + w / 2, y + d / 2], h + 1.2)[1]} r={4} fill={C.cyan} />
                  </>
                ) : null}
              </g>
            );
          })}
        </g>
        {/* jams: queue stripe + stopped cars */}
        {jams.map((j, i) => {
          if (j.grow <= 0) return null;
          const end: P = [j.from[0] + (j.to[0] - j.from[0]) * j.grow, j.from[1] + (j.to[1] - j.from[1]) * j.grow];
          const a = pr(j.from), b = pr(end);
          const col = interpolateColors(j.level, [0, 1], [C.amber, C.red]);
          const L = Math.hypot(end[0] - j.from[0], end[1] - j.from[1]);
          const n = Math.floor(L / 0.32);
          return (
            <g key={'j' + i}>
              <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={col} strokeWidth={22} strokeLinecap="round" opacity={0.28} />
              <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={col} strokeWidth={6} strokeLinecap="round" opacity={0.85} />
              {Array.from({length: n}, (_, q) => {
                const f = (q + 0.5) / Math.max(1, L / 0.32);
                const c0: P = [j.from[0] + (end[0] - j.from[0]) * f, j.from[1] + (end[1] - j.from[1]) * f];
                const ux = (j.to[0] - j.from[0]) / Math.hypot(j.to[0] - j.from[0], j.to[1] - j.from[1]);
                const uy = (j.to[1] - j.from[1]) / Math.hypot(j.to[0] - j.from[0], j.to[1] - j.from[1]);
                const lane = q % 2 ? 0.11 : -0.11;
                const p0 = pr([c0[0] - uy * lane, c0[1] + ux * lane]);
                const p1 = pr([c0[0] - uy * lane + ux * 0.13, c0[1] + ux * lane + uy * 0.13]);
                return <line key={q} x1={p0[0]} y1={p0[1]} x2={p1[0]} y2={p1[1]} stroke="#FFE3D6" strokeWidth={4.2} strokeLinecap="round" />;
              })}
            </g>
          );
        })}
        {/* routes */}
        {routes.map((r, i) => {
          const {d, len} = routePath(r);
          const prog = r.progress ?? 1;
          return (
            <g key={'r' + i} opacity={r.opacity ?? 1}>
              <path d={d} fill="none" stroke={r.color} strokeWidth={(r.width ?? 7) * 3} strokeOpacity={0.18} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${len * prog} ${len}`} />
              <path d={d} fill="none" stroke={r.color} strokeWidth={r.width ?? 7} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={r.dash ? '2 14' : `${len * prog} ${len}`} />
            </g>
          );
        })}
        {overlay ? overlay(pr) : null}
      </g>
    </svg>
  );
};
