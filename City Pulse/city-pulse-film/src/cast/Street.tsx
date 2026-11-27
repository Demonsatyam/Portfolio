import React from 'react';
import {interpolateColors, random} from 'remotion';
import {C} from '../theme';

// Street-level set: sky, two parallax skyline layers, trees, road. `x` is how far the camera has travelled (px).
type Props = {x: number; sun?: number; signal?: 'red' | 'green' | null; jam?: number; slice?: boolean};

const Skyline: React.FC<{seed: string; x: number; y: number; h: number; color: string; win?: string; speed: number}> = ({seed, x, y, h, color, win, speed}) => {
  const items = Array.from({length: 26}, (_, i) => {
    const w = 70 + random(seed + 'w' + i) * 110, hh = h * (0.4 + random(seed + 'h' + i) * 0.6);
    return {w, hh, i, bx: 0};
  });
  let acc = 0;
  for (const b of items) { b.bx = acc; acc += b.w + 8; }
  const total = acc;
  const off = -((x * speed) % total);
  return (
    <g transform={`translate(${off} 0)`}>
      {[0, total].map((rep) => (
        <g key={rep} transform={`translate(${rep} 0)`}>
          {items.map((b) => {
            const bx = b.bx;
            return (
              <g key={b.i}>
                <rect x={bx} y={y - b.hh} width={b.w} height={b.hh} fill={color} />
                {win
                  ? Array.from({length: Math.floor(b.hh / 46)}, (_, r) =>
                      Array.from({length: Math.floor(b.w / 34)}, (_, c) =>
                        random(seed + b.i + r + c) < 0.35 ? <rect key={`${r}${c}`} x={bx + 12 + c * 34} y={y - b.hh + 18 + r * 46} width={14} height={18} fill={win} opacity={0.5} /> : null,
                      ),
                    )
                  : null}
              </g>
            );
          })}
        </g>
      ))}
    </g>
  );
};

export const Street: React.FC<Props> = ({x, sun = 0.7, signal = null, jam = 0, slice = false}) => {
  const skyTop = interpolateColors(sun, [0, 1], ['#0E1A33', '#2C4C7E']);
  const skyBot = interpolateColors(sun, [0, 1], ['#22365C', '#F2B27A']);
  return (
    <svg viewBox="0 0 1920 1080" preserveAspectRatio={slice ? 'xMidYMid slice' : 'xMidYMid meet'} style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={skyTop} />
          <stop offset="0.75" stopColor={skyBot} />
        </linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#sky)" />
      <circle cx={1480} cy={640 - sun * 120} r={70} fill="#FFE2B0" opacity={0.85 * sun} />
      <Skyline seed="far" x={x} y={760} h={420} color={interpolateColors(sun, [0, 1], ['#18264A', '#5E6F98'])} speed={0.15} />
      <Skyline seed="mid" x={x} y={800} h={330} color={interpolateColors(sun, [0, 1], ['#121D38', '#3B4C74'])} win="#FFD9A0" speed={0.4} />
      {/* pavement + trees */}
      <rect x={0} y={790} width={1920} height={40} fill="#2B344A" />
      {Array.from({length: 8}, (_, i) => {
        const tx = ((i * 300 - x * 0.9) % 2400 + 2400) % 2400 - 200;
        return (
          <g key={i} transform={`translate(${tx} 0)`}>
            <rect x={-6} y={700} width={12} height={100} fill="#3A2E28" />
            <circle cx={0} cy={690} r={46} fill="#1F5A4E" />
            <circle cx={-24} cy={706} r={30} fill="#1A4D43" />
          </g>
        );
      })}
      {/* road */}
      <rect x={0} y={830} width={1920} height={250} fill="#1D2638" />
      {Array.from({length: 12}, (_, i) => {
        const lx = ((i * 220 - x) % 2640 + 2640) % 2640 - 220;
        return <rect key={i} x={lx} y={948} width={110} height={8} rx={4} fill="#5B6782" />;
      })}
      {/* queue of stopped vehicles ahead (problem scene) */}
      {jam > 0
        ? Array.from({length: 5}, (_, i) => (
            <g key={i} opacity={jam} transform={`translate(${1300 + i * 170} 880)`}>
              <rect x={0} y={0} width={150} height={56} rx={16} fill={['#5C6B86', '#7A5A4A', '#4E6A8C', '#6C7280', '#836A52'][i]} />
              <rect x={20} y={-26} width={100} height={34} rx={12} fill="#2E3850" />
              <circle cx={130} cy={30} r={7} fill={C.red} />
            </g>
          ))
        : null}
      {signal ? (
        <g transform="translate(1290 520)">
          <rect x={-6} y={60} width={12} height={290} fill="#2C3447" />
          <rect x={-30} y={-60} width={60} height={130} rx={12} fill="#141B2A" />
          <circle cx={0} cy={-30} r={18} fill={signal === 'red' ? C.red : '#3A1E22'} />
          <circle cx={0} cy={30} r={18} fill={signal === 'green' ? C.green : '#173322'} />
        </g>
      ) : null}
    </svg>
  );
};
