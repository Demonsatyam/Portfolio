import React from 'react';
import {C} from '../theme';

// The commuter, drawn once and reused in every scene so clothing, helmet, scooter and phone stay identical.
// Side view, facing right. viewBox 0 0 420 380; ground line at y=360.
type Props = {
  pose: 'standing' | 'riding';
  helmet?: number; // 0 helmet in hand → 1 on head
  phone?: number; // 0 down → 1 raised to eye level (standing only)
  t?: number; // seconds, drives wheel spin + tiny bob when riding
  moving?: boolean;
  screenGlow?: string; // colour of the handlebar phone screen
  style?: React.CSSProperties;
};

const Helmet: React.FC<{x: number; y: number; r?: number}> = ({x, y, r = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${r})`}>
    <path d="M-30 6 C-32 -26 -8 -40 12 -36 C30 -32 38 -16 36 4 L-30 6 Z" fill={C.helmet} />
    <path d="M6 -20 C22 -20 34 -10 36 4 L8 4 Z" fill="#263247" opacity={0.92} />
    <rect x={-31} y={3} width={66} height={6} rx={3} fill="#C9D3E1" />
    <path d="M-18 -30 C-8 -36 4 -37 12 -35" stroke={C.cyan} strokeWidth={3} fill="none" strokeLinecap="round" />
  </g>
);

const Phone: React.FC<{x: number; y: number; r?: number; glow?: string}> = ({x, y, r = 0, glow = C.blue}) => (
  <g transform={`translate(${x} ${y}) rotate(${r})`}>
    <rect x={-9} y={-16} width={18} height={32} rx={4} fill="#0E1524" />
    <rect x={-7} y={-13} width={14} height={26} rx={2.5} fill={glow} opacity={0.9} />
  </g>
);

export const Scooter: React.FC<{t: number; moving: boolean; screenGlow?: string}> = ({t, moving, screenGlow = C.blue}) => {
  const spin = moving ? (t * 720) % 360 : 0;
  const wheel = (cx: number) => (
    <g transform={`translate(${cx} 326)`}>
      <circle r={34} fill="#121826" />
      <circle r={20} fill="#3A4660" />
      <g transform={`rotate(${spin})`} stroke="#8996AE" strokeWidth={3}>
        <line x1={-18} y1={0} x2={18} y2={0} />
        <line x1={0} y1={-18} x2={0} y2={18} />
      </g>
      <circle r={5} fill="#C9D3E1" />
    </g>
  );
  return (
    <g>
      {wheel(108)}
      {wheel(330)}
      {/* body */}
      <path d="M70 300 C80 262 130 250 190 254 L262 254 C282 254 290 270 300 300 L330 300 C336 290 336 280 330 270 L318 196 L332 196 L346 280 C352 300 340 320 320 322 L120 322 C92 322 66 318 70 300 Z" fill="#3E6FB0" />
      <path d="M150 254 L270 254 L262 240 L160 240 Z" fill="#1B2436" />
      <path d="M90 300 C96 280 120 270 150 270 L250 270" stroke="#6D9AD8" strokeWidth={5} fill="none" strokeLinecap="round" />
      {/* steering column + handlebar */}
      <line x1={322} y1={210} x2={306} y2={170} stroke="#2A3550" strokeWidth={10} strokeLinecap="round" />
      <line x1={290} y1={168} x2={318} y2={168} stroke="#1B2436" strokeWidth={9} strokeLinecap="round" />
      <circle cx={336} cy={216} r={9} fill="#FFE6A8" />
      {/* phone mount */}
      <line x1={312} y1={168} x2={322} y2={150} stroke="#1B2436" strokeWidth={4} />
      <Phone x={326} y={138} r={14} glow={screenGlow} />
    </g>
  );
};

export const Commuter: React.FC<Props> = ({pose, helmet = 1, phone = 0, t = 0, moving = false, screenGlow, style}) => {
  if (pose === 'riding') {
    const bob = moving ? Math.sin(t * 9) * 1.2 : 0;
    return (
      <svg viewBox="0 0 420 380" style={style}>
        <ellipse cx={220} cy={362} rx={170} ry={10} fill="#000" opacity={0.25} />
        <Scooter t={t} moving={moving} screenGlow={screenGlow} />
        <g transform={`translate(0 ${bob})`}>
          {/* backpack */}
          <rect x={150} y={150} width={44} height={70} rx={14} fill="#3B4A63" />
          {/* legs */}
          <path d="M196 232 L250 236 L262 296" stroke="#2B3243" strokeWidth={24} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <rect x={250} y={292} width={34} height={14} rx={6} fill="#151B28" />
          {/* torso */}
          <path d="M176 238 C170 200 178 160 200 148 C222 140 238 156 240 182 L236 240 Z" fill={C.jacket} />
          <path d="M226 160 L232 236" stroke="#22707E" strokeWidth={4} />
          {/* arm to handlebar */}
          <path d="M224 166 L256 200 L294 170" stroke={C.jacket} strokeWidth={20} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={294} cy={170} r={9} fill={C.skin} />
          {/* head */}
          <rect x={204} y={124} width={18} height={18} fill={C.skinShade} />
          <circle cx={214} cy={108} r={26} fill={C.skin} />
          <circle cx={230} cy={106} r={2.6} fill="#1A1A1A" />
          <Helmet x={210} y={102} />
        </g>
      </svg>
    );
  }
  // standing beside the scooter, helmet goes from hand to head, phone raises
  const hx = 300 - 60 * helmet, hy = 250 - 150 * helmet;
  const handY = 230 - 90 * phone;
  return (
    <svg viewBox="0 0 420 380" style={{overflow: 'visible', ...style}}>
      <ellipse cx={190} cy={362} rx={170} ry={10} fill="#000" opacity={0.25} />
      <g transform="translate(-150 0)">
        <Scooter t={0} moving={false} screenGlow={screenGlow} />
      </g>
      <g transform="translate(70 0)">
        {/* legs */}
        <path d="M200 236 L196 352" stroke="#2B3243" strokeWidth={24} strokeLinecap="round" />
        <path d="M222 236 L228 352" stroke="#262D3D" strokeWidth={24} strokeLinecap="round" />
        <rect x={180} y={346} width={34} height={14} rx={6} fill="#151B28" />
        <rect x={214} y={346} width={34} height={14} rx={6} fill="#151B28" />
        {/* backpack */}
        <rect x={168} y={140} width={30} height={76} rx={12} fill="#3B4A63" />
        {/* torso */}
        <path d="M188 244 C184 200 186 156 210 142 C232 134 246 150 244 180 L240 246 Z" fill={C.jacket} />
        {/* back arm (holds helmet before it goes on) */}
        <path d={`M206 160 L${hx - 30} ${Math.max(hy + 10, 120)}`} stroke="#22707E" strokeWidth={18} strokeLinecap="round" opacity={helmet < 0.95 ? 1 : 0} />
        <path d="M206 160 L198 236" stroke="#22707E" strokeWidth={18} strokeLinecap="round" opacity={helmet >= 0.95 ? 1 : 0} />
        {/* front arm holding phone */}
        <path d={`M228 162 L252 ${200 - 40 * phone} L${236 + 20 * phone} ${handY}`} stroke={C.jacket} strokeWidth={18} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <Phone x={240 + 20 * phone} y={handY - 10} r={-10 + 10 * phone} glow={C.blue} />
        {/* head */}
        <rect x={208} y={118} width={18} height={20} fill={C.skinShade} />
        <circle cx={218} cy={102} r={26} fill={C.skin} />
        <path d="M192 96 C192 74 214 66 232 74 C244 80 244 90 242 94 C228 86 206 88 192 96 Z" fill="#1E1A1A" opacity={1 - helmet} />
        <circle cx={234} cy={100 + 4 * phone} r={2.6} fill="#1A1A1A" />
        <Helmet x={hx} y={hy} r={-20 * (1 - helmet)} />
      </g>
    </svg>
  );
};
