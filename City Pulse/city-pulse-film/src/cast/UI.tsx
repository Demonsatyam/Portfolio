import React from 'react';
import {interpolateColors} from 'remotion';
import {buildings, P, project, road, TOP} from '../city/city';
import {C, DISPLAY, UI} from '../theme';

// ---------- Phone ----------
export const Phone: React.FC<{children: React.ReactNode; style?: React.CSSProperties; time?: string}> = ({children, style, time = '7:42'}) => (
  <div style={{position: 'absolute', width: 420, height: 860, borderRadius: 64, background: '#05080F', padding: 14, boxShadow: '0 40px 90px rgba(0,0,0,0.55), inset 0 0 0 2px #2A3346', ...style}}>
    <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 52, overflow: 'hidden', background: '#0C1322', fontFamily: UI}}>
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 56, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 34px', color: C.white, fontSize: 19, fontWeight: 600, zIndex: 5}}>
        <span>{time}</span>
        <div style={{width: 110, height: 30, borderRadius: 20, background: '#000', position: 'absolute', left: 141, top: 12}} />
        <span style={{letterSpacing: 2}}>● ● ▮</span>
      </div>
      {children}
    </div>
  </div>
);

// ---------- Top-down map in the same orientation as the city (so the phone map can match-cut into the city) ----------
export type MapRoute = {pts: P[]; color: string; progress?: number; width?: number; opacity?: number};
export const MiniMap: React.FC<{
  w: number; h: number; S?: number; cx?: number; cy?: number;
  routes?: MapRoute[]; incident?: {at: P; color: string; r: number} | null; zone?: {at: P; r: number; color: string; opacity: number} | null;
  you?: P | null; pins?: boolean;
}> = ({w, h, S = 20, cx = 10, cy = 10, routes = [], incident, zone, you, pins = true}) => {
  const v = {...TOP, S};
  const [ox, oy] = project(cx, cy, 0, v);
  const pr = (p: P): P => { const [x, y] = project(p[0], p[1], 0, v); return [x - ox + w / 2, y - oy + h / 2]; };
  const poly = (a: P[]) => a.map((p) => pr(p).map((n) => n.toFixed(1)).join(',')).join(' ');
  const ks = Array.from({length: 17}, (_, i) => i - 4);
  return (
    <svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0}}>
      <rect width={w} height={h} fill="#101A2C" />
      {buildings.map((b, i) => (
        <polygon key={i} points={poly([[b.x, b.y], [b.x + b.w, b.y], [b.x + b.w, b.y + b.d], [b.x, b.y + b.d]])} fill={b.kind === 'park' ? '#173B3A' : '#1A2742'} />
      ))}
      {ks.map((k) => (
        <g key={k} stroke="#33466A" strokeWidth={S * 0.32}>
          <line x1={pr([road(k), -12])[0]} y1={pr([road(k), -12])[1]} x2={pr([road(k), 32])[0]} y2={pr([road(k), 32])[1]} />
          <line x1={pr([-12, road(k)])[0]} y1={pr([-12, road(k)])[1]} x2={pr([32, road(k)])[0]} y2={pr([32, road(k)])[1]} />
        </g>
      ))}
      {zone ? <circle cx={pr(zone.at)[0]} cy={pr(zone.at)[1]} r={zone.r * S} fill={zone.color} opacity={zone.opacity} /> : null}
      {routes.map((r, i) => {
        const s = r.pts.map(pr);
        let len = 0;
        for (let j = 1; j < s.length; j++) len += Math.hypot(s[j][0] - s[j - 1][0], s[j][1] - s[j - 1][1]);
        const d = 'M' + s.map((p) => p.join(' ')).join(' L');
        return (
          <g key={i} opacity={r.opacity ?? 1}>
            <path d={d} stroke="#05080F" strokeWidth={(r.width ?? 9) + 6} fill="none" strokeLinejoin="round" strokeLinecap="round" strokeDasharray={`${len * (r.progress ?? 1)} ${len}`} opacity={0.6} />
            <path d={d} stroke={r.color} strokeWidth={r.width ?? 9} fill="none" strokeLinejoin="round" strokeLinecap="round" strokeDasharray={`${len * (r.progress ?? 1)} ${len}`} />
          </g>
        );
      })}
      {pins ? (
        <>
          <circle cx={pr([road(1), road(7)])[0]} cy={pr([road(1), road(7)])[1]} r={10} fill={C.white} />
          <circle cx={pr([road(1), road(7)])[0]} cy={pr([road(1), road(7)])[1]} r={5} fill={C.navy} />
          <rect x={pr([road(7), road(1)])[0] - 9} y={pr([road(7), road(1)])[1] - 9} width={18} height={18} rx={4} fill={C.white} />
        </>
      ) : null}
      {incident ? (
        <g transform={`translate(${pr(incident.at)[0]} ${pr(incident.at)[1]})`}>
          <circle r={incident.r * 2.2} fill={incident.color} opacity={0.25} />
          <circle r={incident.r} fill={incident.color} />
          <path d={`M0 ${-incident.r * 0.5} L0 ${incident.r * 0.15}`} stroke="#fff" strokeWidth={3} strokeLinecap="round" />
          <circle cy={incident.r * 0.45} r={1.8} fill="#fff" />
        </g>
      ) : null}
      {you ? (
        <g transform={`translate(${pr(you)[0]} ${pr(you)[1]})`}>
          <circle r={18} fill={C.blue} opacity={0.25} />
          <circle r={10} fill={C.white} />
          <circle r={6.5} fill={C.blue} />
        </g>
      ) : null}
    </svg>
  );
};

// ---------- Illustrated "photos" used in posts and user reports (demo imagery, drawn) ----------
export const IncidentPhoto: React.FC<{w: number; h: number; old?: boolean}> = ({w, h, old}) => (
  <svg width={w} height={h} viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" style={{display: 'block', filter: old ? 'sepia(0.7) saturate(0.6) brightness(0.9)' : undefined}}>
    <rect width={400} height={240} fill={old ? '#8A8F86' : '#7FA3C8'} />
    <rect y={70} width={400} height={50} fill="#5B6E88" />
    <rect x={20} y={40} width={60} height={80} fill="#4D5D78" />
    <rect x={300} y={30} width={80} height={90} fill="#4D5D78" />
    {/* flyover */}
    <path d="M0 96 L400 70 L400 86 L0 112 Z" fill="#9AA6B8" />
    <rect x={130} y={88} width={14} height={60} fill="#8592A6" />
    <rect x={290} y={78} width={14} height={70} fill="#8592A6" />
    <path d="M0 240 L140 120 L270 120 L400 240 Z" fill="#3A4256" />
    <path d="M203 130 L200 150 M197 170 L192 200 M188 215 L185 240" stroke="#D8DEE8" strokeWidth={4} />
    {/* collision */}
    <g transform="translate(150 158) rotate(-14)">
      <rect width={90} height={38} rx={10} fill="#C84B3E" />
      <rect x={14} y={-16} width={54} height={22} rx={7} fill="#2E3850" />
    </g>
    <g transform="translate(226 150) rotate(20)">
      <rect width={86} height={36} rx={10} fill="#E6E9EF" />
      <rect x={14} y={-15} width={52} height={20} rx={7} fill="#2E3850" />
    </g>
    {[110, 320].map((x) => <path key={x} d={`M${x} 214 L${x + 12} 186 L${x + 24} 214 Z`} fill="#F08A24" />)}
  </svg>
);

export const JamPhoto: React.FC<{w: number; h: number}> = ({w, h}) => (
  <svg width={w} height={h} viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" style={{display: 'block'}}>
    <rect width={400} height={240} fill="#6F8FB4" />
    <path d="M0 240 L170 100 L230 100 L400 240 Z" fill="#3A4256" />
    {Array.from({length: 9}, (_, i) => {
      const r = 1 - i / 9; const y = 110 + r * 110; const s = 0.35 + r * 0.8;
      return [-1, 1].map((side) => (
        <g key={`${i}${side}`} transform={`translate(${200 + side * 44 * s - 30 * s} ${y}) scale(${s})`}>
          <rect width={60} height={30} rx={8} fill={['#C9CED8', '#5C6B86', '#A8573F', '#2F3B52'][(i + side + 4) % 4]} />
          <circle cx={8} cy={24} r={5} fill="#FF5A4A" />
          <circle cx={52} cy={24} r={5} fill="#FF5A4A" />
        </g>
      ));
    })}
  </svg>
);

// ---------- Social post ----------
export const Post: React.FC<{who: string; handle: string; text: string; media?: 'photo' | 'video' | null; platform: 'fb' | 'x' | 'form'; ago: string; style?: React.CSSProperties; w?: number}> = ({who, handle, text, media, platform, ago, style, w = 460}) => (
  <div style={{position: 'absolute', width: w, background: '#F6F8FC', borderRadius: 26, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.45)', fontFamily: UI, color: '#121A2A', ...style}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '20px 22px 10px'}}>
      <div style={{width: 46, height: 46, borderRadius: 23, background: platform === 'form' ? C.teal : '#9DB3D6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 20}}>{who[0]}</div>
      <div style={{flex: 1}}>
        <div style={{fontWeight: 700, fontSize: 21}}>{who}</div>
        <div style={{fontSize: 17, color: '#5D6A82'}}>{handle} · {ago}</div>
      </div>
      <div style={{fontSize: 15, fontWeight: 700, color: '#fff', background: platform === 'fb' ? '#3C64C8' : platform === 'x' ? '#111' : C.teal, borderRadius: 10, padding: '6px 10px'}}>
        {platform === 'fb' ? 'Page post' : platform === 'x' ? 'Post' : 'Report'}
      </div>
    </div>
    <div style={{padding: '4px 22px 18px', fontSize: 24, lineHeight: 1.3, fontWeight: 500}}>{text}</div>
    {media === 'photo' ? <IncidentPhoto w={w} h={w * 0.56} /> : null}
    {media === 'video' ? (
      <div style={{position: 'relative'}}>
        <JamPhoto w={w} h={w * 0.56} />
        <div style={{position: 'absolute', left: '50%', top: '50%', width: 70, height: 70, marginLeft: -35, marginTop: -35, borderRadius: 35, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{width: 0, height: 0, borderLeft: '24px solid #fff', borderTop: '15px solid transparent', borderBottom: '15px solid transparent', marginLeft: 6}} />
        </div>
        <div style={{position: 'absolute', left: 16, right: 16, bottom: 14, height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.35)'}}>
          <div style={{width: '38%', height: '100%', background: '#fff', borderRadius: 3}} />
        </div>
      </div>
    ) : null}
  </div>
);

// ---------- Small pieces ----------
export const Tag: React.FC<{color: string; children: React.ReactNode; style?: React.CSSProperties; size?: number}> = ({color, children, style, size = 22}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 10, padding: `${size * 0.4}px ${size * 0.75}px`, borderRadius: 12, background: interpolateColors(0.82, [0, 1], [color, '#0B1426']), border: `2px solid ${color}`, color: C.white, fontFamily: UI, fontWeight: 600, fontSize: size, whiteSpace: 'nowrap', ...style}}>
    <span style={{width: size * 0.45, height: size * 0.45, borderRadius: size, background: color}} />
    {children}
  </div>
);

export const Kicker: React.FC<{children: React.ReactNode; color?: string; style?: React.CSSProperties}> = ({children, color = C.cyan, style}) => (
  <div style={{fontFamily: DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 6, color, ...style}}>{children}</div>
);
