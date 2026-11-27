import React from 'react';
import {ramp, Reveal} from '../anim';
import {C, DISPLAY, Line, UI} from '../theme';

// Three recurring characters, always drawn from the same parts so they stay consistent.
export type Who = 'user' | 'engineer' | 'admin';
export const CAST: Record<Who, {skin: string; hair: string; top: string; role: string; color: string}> = {
  user: {skin: '#C98E6E', hair: '#2A1C16', top: '#3C6E8F', role: 'THE USER', color: C.cyan},
  engineer: {skin: '#8A5A40', hair: '#141014', top: '#1E3A6B', role: 'NETWORK ENGINEER', color: C.blue},
  admin: {skin: '#E2B496', hair: '#3B2418', top: '#262B38', role: 'SECURITY ADMINISTRATOR', color: C.purple},
};
export const WHO: Record<string, Who> = {U: 'user', E: 'engineer', A: 'admin'};

// waist-up figure, viewBox 400×520. `talk` 0..1 opens the mouth, `gesture` 0..1 raises a hand, `look` -1..1 turns the head slightly.
export const Person: React.FC<{who: Who; t: number; talk?: number; gesture?: number; look?: number; style?: React.CSSProperties}> = ({who, t, talk = 0, gesture = 0, look = 0, style}) => {
  const c = CAST[who];
  const blink = (t % 3.7) < 0.12 ? 0.15 : 1;
  const mouth = talk * (0.35 + 0.65 * Math.abs(Math.sin(t * 11) * Math.sin(t * 4.3 + 1)));
  const breathe = Math.sin(t * 1.6) * 2;
  const hx = look * 8;
  const g = gesture;
  return (
    <svg viewBox="0 0 400 520" style={{overflow: 'visible', ...style}}>
      <defs>
        <linearGradient id={`top-${who}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c.top} /><stop offset="1" stopColor="#0A0F1C" /></linearGradient>
        <radialGradient id={`rim-${who}`} cx="0.5" cy="0.3" r="0.7"><stop offset="0.75" stopColor="transparent" /><stop offset="1" stopColor={c.color} stopOpacity={0.35} /></radialGradient>
      </defs>
      <g transform={`translate(0 ${breathe})`}>
        {/* torso */}
        <path d="M24 540 C24 430 66 376 142 356 L258 356 C334 376 376 430 376 540 Z" fill={`url(#top-${who})`} />
        <path d="M24 540 C24 430 66 376 142 356" stroke={c.color} strokeOpacity={0.55} strokeWidth={3} fill="none" />
        {/* neck */}
        <path d="M170 290 L170 362 C185 376 215 376 230 362 L230 290 Z" fill={c.skin} />
        <path d="M170 330 C190 346 212 346 230 330 L230 300 L170 300 Z" fill="#000" opacity={0.18} />
        {who === 'user' ? (
          <>
            <path d="M150 356 C170 392 230 392 250 356" stroke="#2C5370" strokeWidth={14} fill="none" strokeLinecap="round" />
            <path d="M178 360 L200 392 L222 360" stroke="#E8EEF6" strokeWidth={6} fill="none" />
          </>
        ) : null}
        {who === 'engineer' ? (
          <>
            <path d="M150 352 L182 400 L200 368 L218 400 L250 352" fill="#29497E" stroke="#3E63A3" strokeWidth={3} strokeLinejoin="round" />
            <path d="M160 360 C175 430 182 470 190 520" stroke={C.cyan} strokeWidth={5} fill="none" />
            <rect x={176} y={500} width={34} height={44} rx={5} fill="#E8EEF6" />
            <rect x={182} y={508} width={22} height={6} rx={2} fill={C.blue} />
          </>
        ) : null}
        {who === 'admin' ? (
          <>
            <path d="M168 356 L200 440 L232 356 Z" fill="#E9EDF4" />
            <path d="M142 358 L198 452 L176 520 L120 520 Z" fill="#323848" />
            <path d="M258 358 L202 452 L224 520 L280 520 Z" fill="#323848" />
            <path d="M142 358 L198 452 M258 358 L202 452" stroke="#4A5266" strokeWidth={3} />
            <circle cx={244} cy={410} r={7} fill={C.purple} />
          </>
        ) : null}
        {/* raised hand (explaining) */}
        {g > 0.01 ? (
          <g opacity={Math.min(1, g * 2)}>
            <path d={`M330 540 C ${336 + 10 * g} ${500 - 30 * g} ${350 + 12 * g} ${470 - 60 * g} ${352 + 16 * g} ${470 - 96 * g}`} stroke={c.top} strokeWidth={46} fill="none" strokeLinecap="round" />
            <ellipse cx={354 + 16 * g} cy={446 - 96 * g} rx={22} ry={27} fill={c.skin} />
            <path d={`M${340 + 16 * g} ${426 - 96 * g} L${338 + 16 * g} ${400 - 96 * g}`} stroke={c.skin} strokeWidth={11} strokeLinecap="round" />
          </g>
        ) : null}
        {/* head */}
        <g transform={`translate(${hx} 0) rotate(${look * 3} 200 300)`}>
          {who === 'admin' ? <circle cx={200} cy={118} r={40} fill={c.hair} /> : null}
          <ellipse cx={122 + hx * 0.2} cy={236} rx={14} ry={22} fill={c.skin} />
          <ellipse cx={278 + hx * 0.2} cy={236} rx={14} ry={22} fill={c.skin} />
          <ellipse cx={200} cy={226} rx={78} ry={94} fill={c.skin} />
          <ellipse cx={200} cy={226} rx={78} ry={94} fill={`url(#rim-${who})`} />
          {/* hair */}
          {who === 'user' ? <path d="M120 222 C112 150 150 120 204 120 C258 120 290 150 282 214 C272 186 250 168 230 166 C210 180 170 178 148 170 C132 182 124 200 120 222 Z" fill={c.hair} /> : null}
          {who === 'engineer' ? <path d="M124 206 C120 152 156 128 200 128 C246 128 282 150 276 206 C268 180 246 160 200 158 C156 160 132 180 124 206 Z" fill={c.hair} /> : null}
          {who === 'admin' ? <path d="M118 244 C108 160 150 128 202 128 C256 128 294 162 282 244 C276 200 260 172 234 160 C200 180 160 176 136 186 C124 204 120 222 118 244 Z" fill={c.hair} /> : null}
          {/* headset */}
          {who === 'engineer' ? (
            <>
              <path d="M112 236 C104 130 296 130 288 236" stroke="#1B2232" strokeWidth={10} fill="none" />
              <rect x={100} y={214} width={24} height={46} rx={10} fill="#1B2232" />
              <path d="M112 258 C116 296 150 310 178 304" stroke="#1B2232" strokeWidth={6} fill="none" strokeLinecap="round" />
              <circle cx={180} cy={304} r={7} fill={C.blue} />
            </>
          ) : null}
          {/* face */}
          <path d="M156 196 C166 190 180 190 188 194 M212 194 C220 190 234 190 244 196" stroke={c.hair} strokeWidth={6} strokeLinecap="round" fill="none" />
          <ellipse cx={172} cy={222} rx={7.5} ry={8.5 * blink} fill="#15121A" />
          <ellipse cx={228} cy={222} rx={7.5} ry={8.5 * blink} fill="#15121A" />
          {who === 'admin' ? (
            <g stroke="#1A1D28" strokeWidth={4} fill="none">
              <rect x={148} y={204} width={46} height={36} rx={10} />
              <rect x={206} y={204} width={46} height={36} rx={10} />
              <path d="M194 220 L206 220" />
            </g>
          ) : null}
          <path d="M200 232 C195 252 194 260 206 262" stroke="#000" strokeOpacity={0.25} strokeWidth={4} fill="none" strokeLinecap="round" />
          {mouth > 0.04 ? (
            <ellipse cx={200} cy={284} rx={17} ry={2 + 10 * mouth} fill="#4A1E22" />
          ) : (
            <path d="M184 282 C194 290 208 290 218 282" stroke="#6B3030" strokeWidth={4.5} fill="none" strokeLinecap="round" />
          )}
        </g>
      </g>
    </svg>
  );
};

// lower-third that shows who is speaking and what they say
export const Speaker: React.FC<{s: number; line: Line; style?: React.CSSProperties}> = ({s, line, style}) => {
  const who = WHO[line.who];
  if (!who) return null;
  const o = Math.min(ramp(s, line.at - 0.3, line.at + 0.1), 1 - ramp(s, line.end + 0.4, line.end + 0.8));
  if (o <= 0) return null;
  const c = CAST[who];
  return (
    <div style={{position: 'absolute', left: 96, bottom: 70, maxWidth: 1100, opacity: o, translate: `0 ${(1 - o) * 20}px`, ...style}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 12, fontFamily: DISPLAY, fontWeight: 700, fontSize: 20, letterSpacing: 5, color: c.color}}>
        <span style={{width: 12, height: 12, borderRadius: 6, background: c.color, boxShadow: `0 0 12px ${c.color}`}} />{c.role}
      </div>
      <div style={{marginTop: 10, padding: '18px 26px', background: 'rgba(7,11,22,0.86)', borderLeft: `4px solid ${c.color}`, borderRadius: 8, fontFamily: UI, fontSize: 34, fontWeight: 500, color: C.white, lineHeight: 1.3}}>“{line.text}”</div>
    </div>
  );
};

export const isTalking = (s: number, l: Line) => (s >= l.at && s <= l.end ? 1 : 0);

// network operations centre backdrop: wall of screens with live-looking traces
export const NOC: React.FC<{t: number; tint?: string; style?: React.CSSProperties}> = ({t, tint = C.blue, style}) => (
  <svg viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, width: '100%', height: '100%', ...style}} preserveAspectRatio="xMidYMid slice">
    <rect width={1920} height={1080} fill="#060A14" />
    {Array.from({length: 4}, (_, r) => Array.from({length: 6}, (_, k) => {
      const x = 80 + k * 300, y = 60 + r * 200, seed = r * 6 + k;
      const pts = Array.from({length: 24}, (_, i) => `${x + 20 + i * 10},${y + 120 - 50 * Math.abs(Math.sin(i * 0.7 + seed + t * (0.8 + (seed % 3) * 0.3)))}`).join(' ');
      return (
        <g key={seed} opacity={0.55 - r * 0.08}>
          <rect x={x} y={y} width={280} height={180} rx={10} fill="#0B1428" stroke="#1C2B4D" strokeWidth={3} />
          {seed % 3 === 0 ? <polyline points={pts} stroke={tint} strokeWidth={3} fill="none" /> : null}
          {seed % 3 === 1 ? Array.from({length: 5}, (_, i) => <rect key={i} x={x + 24} y={y + 24 + i * 28} width={60 + 160 * Math.abs(Math.sin(seed * 3 + i + t * 0.5))} height={14} rx={4} fill={i === 2 ? C.cyan : '#25406E'} />) : null}
          {seed % 3 === 2 ? <><circle cx={x + 140} cy={y + 90} r={56} stroke="#25406E" strokeWidth={14} fill="none" /><circle cx={x + 140} cy={y + 90} r={56} stroke={C.green} strokeWidth={14} fill="none" strokeDasharray={`${200 + 80 * Math.sin(t + seed)} 400`} transform={`rotate(-90 ${x + 140} ${y + 90})`} /></> : null}
        </g>
      );
    }))}
    <rect y={860} width={1920} height={220} fill="#0A1020" />
    <rect y={860} width={1920} height={4} fill={tint} opacity={0.4} />
  </svg>
);

// a character standing in the NOC, talking
export const Presenter: React.FC<{s: number; who: Who; line?: Line; x?: number; gesture?: number; kicker?: string}> = ({s, who, line, x = 1180, gesture = 0, kicker}) => (
  <>
    <NOC t={s} tint={CAST[who].color} />
    <Person who={who} t={s} talk={line ? isTalking(s, line) : 0} gesture={gesture} look={-0.4} style={{position: 'absolute', left: x, top: 300, width: 620, height: 806}} />
    {kicker ? <Reveal s={s} at={0.3} style={{position: 'absolute', left: 96, top: 90}}><div style={{fontFamily: DISPLAY, fontWeight: 700, fontSize: 26, letterSpacing: 7, color: CAST[who].color}}>{kicker}</div></Reveal> : null}
    {line ? <Speaker s={s} line={line} /> : null}
  </>
);

// picture-in-picture "call" tile with a character, for when they comment over a diagram
export const Pip: React.FC<{s: number; who: Who; line: Line; on: number; style?: React.CSSProperties}> = ({s, who, line, on, style}) => (
  <div style={{position: 'absolute', right: 70, bottom: 70, width: 440, height: 330, borderRadius: 22, overflow: 'hidden', border: `2px solid ${CAST[who].color}`, boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 30px ${CAST[who].color}44`, opacity: on, scale: String(0.9 + 0.1 * on), ...style}}>
    <NOC t={s} tint={CAST[who].color} />
    <Person who={who} t={s} talk={isTalking(s, line)} look={-0.2} style={{position: 'absolute', left: 60, top: 20, width: 320, height: 416}} />
    <div style={{position: 'absolute', left: 16, bottom: 14, fontFamily: DISPLAY, fontWeight: 700, fontSize: 17, letterSpacing: 3, color: C.white, background: 'rgba(7,11,22,0.8)', padding: '6px 12px', borderRadius: 8}}>{CAST[who].role}</div>
  </div>
);
