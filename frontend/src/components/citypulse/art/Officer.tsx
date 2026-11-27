import React from 'react';
import {interpolateColors} from 'remotion';
import {C} from './theme';

// Traffic control room: wall display, desk, and the officer (white shirt, khaki trousers, peaked cap).
// viewBox 0 0 960 1080. `reach` 0..1 moves the officer's hand to the console; `alert` 0..1 turns the wall red-pulsed.
export const ControlRoom: React.FC<{t: number; alert: number; reach: number; look: number}> = ({t, alert, reach, look}) => {
  const pulse = 0.5 + 0.5 * Math.sin(t * 6);
  return (
    <svg viewBox="0 0 960 1080" style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}} preserveAspectRatio="xMidYMid slice">
      <rect width={960} height={1080} fill="#0E1626" />
      <rect y={760} width={960} height={320} fill="#121B2D" />
      {/* wall display: city grid with the incident */}
      <g transform="translate(90 120)">
        <rect width={780} height={430} rx={18} fill="#0A111F" stroke="#2A3A5A" strokeWidth={4} />
        {Array.from({length: 9}, (_, i) => <line key={'v' + i} x1={60 + i * 85} y1={30} x2={60 + i * 85} y2={400} stroke="#24365A" strokeWidth={6} />)}
        {Array.from({length: 5}, (_, i) => <line key={'h' + i} x1={30} y1={50 + i * 85} x2={750} y2={50 + i * 85} stroke="#24365A" strokeWidth={6} />)}
        <line x1={315} y1={135} x2={315} y2={320} stroke={C.red} strokeWidth={10} opacity={alert} strokeLinecap="round" />
        <circle cx={315} cy={220} r={16 + pulse * 10 * alert} fill={C.red} opacity={alert * (0.35 + 0.3 * pulse)} />
        <circle cx={315} cy={220} r={11} fill={interpolateColors(alert, [0, 1], ['#3A4D72', C.red])} />
        <path d="M60 390 L60 220 L230 220 L230 50 L740 50" stroke={C.green} strokeWidth={6} fill="none" opacity={alert * 0.9} strokeLinejoin="round" />
      </g>
      {/* desk */}
      <rect x={60} y={760} width={840} height={36} rx={8} fill="#2A3348" />
      <rect x={100} y={796} width={30} height={284} fill="#1E2638" />
      <rect x={830} y={796} width={30} height={284} fill="#1E2638" />
      {/* desk monitors */}
      <g transform="translate(330 600)">
        <rect width={300} height={170} rx={12} fill="#0A111F" stroke="#33466A" strokeWidth={4} />
        <rect x={20} y={20} width={150} height={16} rx={6} fill={C.red} opacity={alert} />
        <rect x={20} y={50} width={240} height={10} rx={5} fill="#3A4D72" />
        <rect x={20} y={72} width={200} height={10} rx={5} fill="#3A4D72" />
        <rect x={20} y={94} width={220} height={10} rx={5} fill="#3A4D72" />
        <rect x={20} y={124} width={110} height={28} rx={8} fill={C.teal} opacity={0.4 + 0.6 * reach} />
      </g>
      {/* officer, seated, three-quarter back view facing the monitor */}
      <g transform="translate(20 520)">
        {/* chair */}
        <rect x={40} y={170} width={150} height={190} rx={30} fill="#1B2232" />
        <rect x={60} y={360} width={110} height={24} rx={10} fill="#1B2232" />
        <rect x={108} y={384} width={14} height={150} fill="#151B28" />
        {/* legs (khaki) */}
        <path d="M130 330 L300 340 L310 520" stroke="#8C7A55" strokeWidth={46} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <rect x={290} y={510} width={70} height={26} rx={10} fill="#141414" />
        {/* torso (white shirt) */}
        <path d="M70 340 C60 260 70 170 120 140 C170 120 210 150 214 210 L206 340 Z" fill="#E9EDF3" />
        <path d="M120 150 C140 160 170 160 190 150" stroke="#C7CEDA" strokeWidth={4} fill="none" />
        {/* shoulder badge */}
        <rect x={168} y={170} width={30} height={14} rx={4} fill="#1F3F7A" />
        {/* belt */}
        <rect x={74} y={322} width={134} height={14} fill="#3B2F22" />
        {/* arm reaching to console */}
        <path d={`M180 190 L${250 + 60 * reach} ${250 - 10 * reach} L${330 + 50 * reach} ${235 - 25 * reach}`} stroke="#E9EDF3" strokeWidth={34} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={330 + 50 * reach} cy={235 - 25 * reach} r={16} fill={C.skin} />
        {/* head + cap */}
        <g transform={`rotate(${-6 + 10 * look} 150 100)`}>
          <rect x={136} y={110} width={30} height={34} fill={C.skinShade} />
          <circle cx={152} cy={86} r={42} fill={C.skin} />
          <path d="M112 82 C112 60 130 44 152 44 C176 44 192 60 194 80 L194 88 L112 88 Z" fill="#1E1A1A" />
          <path d="M104 64 C108 36 136 22 160 24 C186 26 204 44 204 62 L104 66 Z" fill="#F2F4F8" />
          <rect x={102} y={60} width={104} height={12} rx={4} fill="#1F3F7A" />
          <path d="M196 66 L232 74 L200 76 Z" fill="#141A28" />
          <circle cx={186} cy={90} r={3.5} fill="#1A1A1A" />
        </g>
      </g>
    </svg>
  );
};

// small field personnel marker (top-down map use)
export const Personnel: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r={14} fill={C.white} />
    <circle cy={-3} r={5} fill="#1F3F7A" />
    <path d="M-7 8 C-6 2 6 2 7 8" fill="#1F3F7A" />
  </g>
);
