import {random} from 'remotion';

// World units: blocks are 2 x 2, roads 0.5 wide, pitch 2.5. The "story" city spans 0..20.
export const PITCH = 2.5;
export const road = (k: number) => PITCH * k - 0.25; // centre line of road k (both axes)
export type P = [number, number];

export type View = {k: number; h: number; S: number}; // k: vertical squash (0.5 iso → 1 top-down), h: height factor
export const ISO: View = {k: 0.5, h: 1, S: 48};
export const TOP: View = {k: 1, h: 0.08, S: 48};
export const mixView = (a: View, b: View, p: number): View => ({k: a.k + (b.k - a.k) * p, h: a.h + (b.h - a.h) * p, S: a.S + (b.S - a.S) * p});

const R = Math.SQRT1_2;
export const project = (x: number, y: number, z: number, v: View): P => {
  const u = (x - 10 - (y - 10)) * R, w = (x - 10 + (y - 10)) * R;
  return [u * v.S, w * v.S * v.k - z * v.S * v.h * 0.7];
};

export type Building = {x: number; y: number; w: number; d: number; h: number; kind: 'b' | 'park' | 'home' | 'office' | 'station'; tone: number};

export const ROAD_MIN = -4, ROAD_MAX = 12; // road indices
const BLOCK_MIN = -4, BLOCK_MAX = 11;

export const HOME: P = [road(1), road(7)];
export const OFFICE: P = [road(7), road(1)];
export const UNIVERSITY: P = [road(8), road(5)];
export const INCIDENT: P = [road(4), 11];
export const STATION: P = [13.5, 14.2];

export const ROUTE_NORMAL: P[] = [HOME, [road(4), road(7)], [road(4), road(1)], OFFICE];
// where the commuter is when the alert lands (on their usual road, before the turn onto the blocked one)
export const NOW: P = [8.2, road(7)];
export const ROUTE_REST: P[] = [NOW, [road(4), road(7)], [road(4), road(1)], OFFICE];
export const ROUTE_ALT: P[] = [NOW, [road(7), road(7)], OFFICE];
export const OTHER_ROUTES: {pts: P[]; affected: boolean}[] = [
  {pts: [[road(0), road(5)], [road(4), road(5)], [road(4), road(2)]], affected: true},
  {pts: [[road(3), road(0)], [road(3), road(4)], [road(4), road(4)], [road(4), road(8)]], affected: true},
  {pts: [[road(6), road(8)], [road(6), road(2)], [road(8), road(2)]], affected: false},
  {pts: [[road(0), road(2)], [road(5), road(2)]], affected: false},
  {pts: [[road(2), road(8)], [road(5), road(8)], [road(5), road(6)], [road(8), road(6)]], affected: false},
];

export const buildings: Building[] = (() => {
  const out: Building[] = [];
  for (let i = BLOCK_MIN; i <= BLOCK_MAX; i++)
    for (let j = BLOCK_MIN; j <= BLOCK_MAX; j++) {
      const bx = PITCH * i, by = PITCH * j;
      const r = random(`blk${i},${j}`);
      const centre = Math.hypot(i - 4, j - 4);
      const scale = Math.max(0.35, 1.25 - centre * 0.11); // taller downtown
      if (i === 0 && j === 6) {
        out.push({x: bx + 1.05, y: by + 1.05, w: 0.8, d: 0.8, h: 0.55, kind: 'home', tone: 0});
        out.push({x: bx + 0.15, y: by + 0.15, w: 0.8, d: 0.8, h: 0.9, kind: 'b', tone: 0.3});
        out.push({x: bx + 1.05, y: by + 0.15, w: 0.8, d: 0.8, h: 0.7, kind: 'b', tone: 0.6});
        out.push({x: bx + 0.15, y: by + 1.05, w: 0.8, d: 0.8, h: 0.6, kind: 'b', tone: 0.2});
        continue;
      }
      if (i === 7 && j === 0) { out.push({x: bx + 0.2, y: by + 0.2, w: 1.6, d: 1.6, h: 3.8, kind: 'office', tone: 0}); continue; }
      if (i === 5 && j === 5) { out.push({x: bx + 0.3, y: by + 0.4, w: 1.4, d: 1.2, h: 1.1, kind: 'station', tone: 0}); continue; }
      if (r < 0.1 || (i === 2 && j === 2)) { out.push({x: bx, y: by, w: 2, d: 2, h: 0.02, kind: 'park', tone: r * 10}); continue; }
      if (r < 0.32) {
        out.push({x: bx + 0.15, y: by + 0.15, w: 1.7, d: 1.7, h: (0.6 + random(`h${i},${j}`) * 2.0) * scale, kind: 'b', tone: random(`t${i},${j}`)});
        continue;
      }
      for (let a = 0; a < 2; a++)
        for (let b = 0; b < 2; b++)
          out.push({x: bx + 0.12 + a * 0.93, y: by + 0.12 + b * 0.93, w: 0.83, d: 0.83, h: (0.25 + random(`h${i},${j},${a},${b}`) ** 2 * 1.7) * scale, kind: 'b', tone: random(`t${i},${j},${a},${b}`)});
    }
  return out.sort((p, q) => p.x + p.y + p.w / 2 + p.d / 2 - (q.x + q.y + q.w / 2 + q.d / 2));
})();

export type Car = {axis: 'x' | 'y'; k: number; dir: 1 | -1; lane: number; speed: number; off: number; hue: number};
export const cars: Car[] = (() => {
  const out: Car[] = [];
  for (let k = ROAD_MIN; k <= ROAD_MAX; k++)
    for (const axis of ['x', 'y'] as const)
      for (let c = 0; c < 9; c++) {
        const r = random(`car${axis}${k}${c}`);
        const dir = c % 2 ? 1 : -1;
        out.push({axis, k, dir, lane: dir * 0.11, speed: 0.9 + r * 1.1, off: random(`off${axis}${k}${c}`) * 40, hue: random(`hue${axis}${k}${c}`)});
      }
  return out;
})();
export const ROAD_SPAN: [number, number] = [road(ROAD_MIN) - 0.25, road(ROAD_MAX) + 0.25];

export const carPos = (c: Car, t: number): P => {
  const len = ROAD_SPAN[1] - ROAD_SPAN[0];
  let s = (c.off + c.dir * c.speed * t) % len;
  if (s < 0) s += len;
  s += ROAD_SPAN[0];
  return c.axis === 'y' ? [road(c.k) + c.lane, s] : [s, road(c.k) + c.lane];
};

// polyline helpers (world space)
export const polyLen = (pts: P[]) => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);
export const alongPoly = (pts: P[], f: number): P => {
  let d = Math.max(0, Math.min(1, f)) * polyLen(pts);
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (d <= l) return [a[0] + ((b[0] - a[0]) * d) / l, a[1] + ((b[1] - a[1]) * d) / l];
    d -= l;
  }
  return pts[pts.length - 1];
};
export const subPoly = (pts: P[], f: number): P[] => {
  const total = polyLen(pts) * Math.max(0, Math.min(1, f));
  const out: P[] = [pts[0]];
  let d = 0;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (d + l >= total) { const r = (total - d) / l; out.push([a[0] + (b[0] - a[0]) * r, a[1] + (b[1] - a[1]) * r]); return out; }
    out.push(b); d += l;
  }
  return out;
};
