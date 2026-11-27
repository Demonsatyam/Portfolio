import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Cue, keys, ramp, Reveal, useSec} from '../anim';
import {Kicker} from '../cast/UI';
import {INCIDENT, ISO, ROUTE_ALT} from '../city/city';
import {IsoCity} from '../city/IsoCity';
import {C, DISPLAY, UI} from '../theme';

const NODES: [string, string][] = [
  ['Citizens', C.white],
  ['Social media', C.cyan],
  ['Public reports', C.cyan],
  ['AI agents', C.blue],
  ['Validation', C.white],
  ['Prediction', C.amber],
  ['Alerts', C.green],
  ['Authorities', '#FF8A8A'],
];
const CX = 960, CY = 600, RX = 720, RY = 330;
const at = (i: number): [number, number] => {
  const a = -Math.PI / 2 + (i / NODES.length) * Math.PI * 2;
  return [CX + Math.cos(a) * RX, CY + Math.sin(a) * RY];
};

// "from X → to Y": the old phrase is struck through and the new one printed over it
const Turn: React.FC<{s: number; t0: number; from: string; to: string; top: number}> = ({s, t0, from, to, top}) => {
  const strike = ramp(s, t0 + 1.0, t0 + 1.4);
  const swap = ramp(s, t0 + 1.3, t0 + 1.8);
  return (
    <div style={{position: 'absolute', left: 120, top, height: 90, opacity: ramp(s, t0, t0 + 0.4) * (1 - ramp(s, 6.5, 6.9))}}>
      <div style={{position: 'absolute', whiteSpace: 'nowrap', fontFamily: DISPLAY, fontWeight: 700, fontSize: 72, color: '#7D8BA8', opacity: 1 - swap}}>
        {from}
        <div style={{position: 'absolute', left: 0, top: '52%', height: 6, width: `${strike * 100}%`, background: C.amber, borderRadius: 3}} />
      </div>
      <div style={{position: 'absolute', whiteSpace: 'nowrap', fontFamily: DISPLAY, fontWeight: 800, fontSize: 72, color: C.white, opacity: swap, translate: `0 ${(1 - swap) * 30}px`}}>
        {to.split(' ')[0]} <span style={{color: C.cyan}}>{to.split(' ').slice(1).join(' ')}</span>
      </div>
    </div>
  );
};

export const S10Ecosystem: React.FC = () => {
  const s = useSec();
  const ring = ramp(s, 6.9, 7.6);
  const pulse = (s * 0.18) % 1;
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, #1D2E52 0%, #4D5F88 30%, ${C.navy2} 31%)`}}>
      <IsoCity
        view={ISO}
        cam={{x: 10, y: keys(s, [0, 11.5], [12, 10]), zoom: keys(s, [0, 11.5], [1.35, 0.7])}}
        t={s + 70}
        sun={0.35}
        net={0.3 + 0.3 * ring}
        density={0.9}
        routes={[{pts: ROUTE_ALT, color: C.green, width: 7, opacity: 0.8}]}
        overlay={(pr) => {
          const [x, y] = pr(INCIDENT, 0.1);
          return (
            <g transform={`translate(${x} ${y})`}>
              <circle r={22} fill={C.teal} opacity={0.3} />
              <circle r={11} fill={C.teal} />
            </g>
          );
        }}
      />
      <AbsoluteFill style={{background: `rgba(7,13,26,${0.35 + 0.25 * ring})`}} />

      <Turn s={s} t0={0.4} from="Scattered information" to="Verified intelligence" top={110} />
      <Turn s={s} t0={3.6} from="Reactive updates" to="Proactive awareness" top={220} />

      {/* the whole system as one loop */}
      <svg width={1920} height={1080} style={{position: 'absolute', opacity: ring}}>
        <ellipse cx={CX} cy={CY} rx={RX} ry={RY} fill="none" stroke={C.cyan} strokeOpacity={0.35} strokeWidth={3} />
        <ellipse cx={CX} cy={CY} rx={RX} ry={RY} fill="none" stroke={C.cyan} strokeWidth={6} pathLength={1} strokeDasharray="0.08 0.92" strokeDashoffset={-pulse} strokeLinecap="round" />
        {NODES.map((_, i) => <line key={i} x1={at(i)[0]} y1={at(i)[1]} x2={CX} y2={CY} stroke={C.blue} strokeOpacity={0.18} strokeWidth={2} />)}
      </svg>
      {NODES.map(([name, col], i) => {
        const [x, y] = at(i);
        const p = ramp(s, 6.9 + i * 0.15, 7.3 + i * 0.15);
        return (
          <div key={name} style={{position: 'absolute', left: x, top: y, translate: '-50% -50%', scale: String(0.85 + 0.15 * p), opacity: p, padding: '12px 24px', borderRadius: 18, background: '#0E1830', border: `2px solid ${col}`, fontFamily: UI, fontWeight: 700, fontSize: 26, color: C.white, whiteSpace: 'nowrap'}}>
            {name}
          </div>
        );
      })}
      <Reveal s={s} at={8.6} style={{position: 'absolute', left: 0, right: 0, top: CY - 30, textAlign: 'center'}}>
        <Kicker style={{fontSize: 40}}>SMARTER MOBILITY</Kicker>
      </Reveal>

      <Cue at={1.4} name="tap" volume={0.3} />
      <Cue at={4.6} name="tap" volume={0.3} />
      <Cue at={6.9} name="whoosh3" volume={0.3} />
      {NODES.map((_, i) => <Cue key={i} at={6.9 + i * 0.15} name="blip" volume={0.12} />)}
    </AbsoluteFill>
  );
};
