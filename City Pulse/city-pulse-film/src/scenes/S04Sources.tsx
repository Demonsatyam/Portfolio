import React from 'react';
import {AbsoluteFill, interpolateColors} from 'remotion';
import {Cue, INOUT, lerp, ramp, Reveal, useSec} from '../anim';
import {AgentNode, Flow} from '../cast/Agents';
import {Kicker, Post} from '../cast/UI';
import {TOP} from '../city/city';
import {IsoCity} from '../city/IsoCity';
import {C, DISPLAY, UI} from '../theme';

type Src = {name: string; icon: 'form' | 'fb' | 'x' | 'traffic' | 'weather' | 'people'; at: number; a: number};
const SOURCES: Src[] = [
  {name: 'Public upload form', icon: 'form', at: 2.6, a: 200},
  {name: 'Facebook page posts', icon: 'fb', at: 4.6, a: 240},
  {name: 'X / Twitter API', icon: 'x', at: 5.0, a: 285},
  {name: 'Traffic APIs', icon: 'traffic', at: 5.8, a: 330},
  {name: 'Weather API', icon: 'weather', at: 6.8, a: 20},
  {name: 'Community reports', icon: 'people', at: 7.8, a: 145},
];

const Icon: React.FC<{k: Src['icon']}> = ({k}) => {
  const s = {stroke: C.white, strokeWidth: 3.5, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  return (
    <svg width={44} height={44} viewBox="-22 -22 44 44">
      {k === 'form' ? <g {...s}><rect x={-12} y={-16} width={24} height={32} rx={4} /><line x1={-6} y1={-6} x2={6} y2={-6} /><line x1={-6} y1={2} x2={6} y2={2} /><line x1={-6} y1={10} x2={2} y2={10} /></g> : null}
      {k === 'fb' ? <text x={0} y={12} textAnchor="middle" fontFamily={DISPLAY} fontWeight={800} fontSize={32} fill={C.white}>f</text> : null}
      {k === 'x' ? <g {...s}><line x1={-12} y1={-12} x2={12} y2={12} /><line x1={12} y1={-12} x2={-12} y2={12} /></g> : null}
      {k === 'traffic' ? <g><rect x={-9} y={-19} width={18} height={38} rx={6} fill="none" stroke={C.white} strokeWidth={3.5} /><circle cy={-9} r={4} fill={C.red} /><circle cy={0} r={4} fill={C.amber} /><circle cy={9} r={4} fill={C.green} /></g> : null}
      {k === 'weather' ? <g {...s}><path d="M-14 8 C-20 8 -20 -2 -13 -2 C-12 -12 2 -14 5 -5 C14 -7 18 8 9 8 Z" /><line x1={-8} y1={13} x2={-10} y2={18} /><line x1={2} y1={13} x2={0} y2={18} /></g> : null}
      {k === 'people' ? <g {...s}><circle cx={-7} cy={-8} r={6} /><circle cx={9} cy={-6} r={5} /><path d="M-18 16 C-16 2 2 2 4 16" /><path d="M4 8 C8 2 18 4 18 14" /></g> : null}
    </svg>
  );
};

const HUB: [number, number] = [1210, 540];
const R = 390;
const srcPos = (a: number): [number, number] => [HUB[0] + Math.cos((a * Math.PI) / 180) * R * 1.15, HUB[1] + Math.sin((a * Math.PI) / 180) * R];

export const S04Sources: React.FC = () => {
  const s = useSec();
  const turn = ramp(s, 0.2, 9.2, INOUT) * 2; // two full days
  const night = (1 - Math.cos(turn * Math.PI * 2)) / 2;
  const postsIn = ramp(s, 9.2, 9.8);
  const srcDim = 1 - 0.65 * postsIn;
  const suck = (at: number) => ramp(s, at, at + 0.9, INOUT);
  const posts = [
    {at: 9.7, gone: 13.0, x: 690, y: 80, rot: -3, el: <Post who="Ravi Menon" handle="@ravi_commutes" ago="2m" platform="x" text="Accident under the Ring Road flyover, two cars, one lane blocked." media="photo" w={440} />},
    {at: 10.7, gone: 13.3, x: 1200, y: 150, rot: 2.5, el: <Post who="Neighbourhood Watch" handle="Page" ago="4m" platform="fb" text="Traffic crawling near the flyover right now." media="video" w={440} />},
    {at: 11.7, gone: 13.6, x: 930, y: 640, rot: -1.5, el: <Post who="Citizen report" handle="Upload form" ago="1m" platform="form" text="Road closed near the flyover exit. Vehicles turning back." w={470} />},
  ];
  return (
    <AbsoluteFill style={{background: C.night}}>
      <IsoCity view={TOP} cam={{x: 10, y: 10, zoom: 0.55}} t={s + 30} net={1} night={0.6 + night * 0.4} density={0.6 + 0.4 * (1 - night)} buildingOpacity={0.9} />
      <AbsoluteFill style={{background: `linear-gradient(90deg, rgba(7,13,26,0.97) 0%, rgba(7,13,26,0.9) 30%, rgba(7,13,26,${0.55 + night * 0.25}) 60%)`}} />

      {/* left: the 24h clock */}
      <div style={{position: 'absolute', left: 130, top: 150, opacity: 1 - postsIn * 0.6}}>
        <svg width={300} height={300} viewBox="-150 -150 300 300">
          <circle r={130} fill="none" stroke="#23324F" strokeWidth={14} />
          <circle r={130} fill="none" stroke={interpolateColors(night, [0, 1], [C.amber, C.blue])} strokeWidth={14} strokeDasharray={`${(turn % 1) * 817} 817`} transform="rotate(-90)" strokeLinecap="round" />
          {Array.from({length: 24}, (_, i) => (
            <line key={i} x1={0} y1={-108} x2={0} y2={i % 6 ? -100 : -92} stroke="#5B6C8E" strokeWidth={i % 6 ? 2 : 4} transform={`rotate(${i * 15})`} />
          ))}
          <line x1={0} y1={0} x2={0} y2={-96} stroke={C.white} strokeWidth={6} strokeLinecap="round" transform={`rotate(${turn * 360})`} />
          <circle r={9} fill={C.white} />
          {/* sun / moon */}
          <g transform="translate(0 46)">
            <circle r={18} fill={C.amber} opacity={1 - night} />
            <path d="M6 -18 A18 18 0 1 0 6 18 A13 13 0 1 1 6 -18 Z" fill="#CFE0FF" opacity={night} />
          </g>
        </svg>
        <Reveal s={s} at={0.5} style={{marginTop: 30}}>
          <div style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 120, color: C.white, lineHeight: 1, letterSpacing: -3}}>24/7</div>
        </Reveal>
        <Reveal s={s} at={0.9}>
          <Kicker>CONTINUOUS MONITORING</Kicker>
        </Reveal>
        <Reveal s={s} at={3.4} style={{marginTop: 20}}>
          <Kicker color={C.mute}>MULTIPLE INFORMATION SOURCES</Kicker>
        </Reveal>
      </div>

      {/* sources feeding the hub */}
      <svg width={1920} height={1080} style={{position: 'absolute', opacity: srcDim}}>
        {SOURCES.map((src, i) => (
          <Flow key={src.name} from={srcPos(src.a)} to={HUB} t={s * 1.1 + i * 0.2} color={src.icon === 'weather' || src.icon === 'traffic' ? C.blue : C.cyan} n={5} opacity={ramp(s, src.at + 0.3, src.at + 0.8)} curve={0.08} />
        ))}
      </svg>
      {SOURCES.map((src) => {
        const [x, y] = srcPos(src.a);
        const p = ramp(s, src.at, src.at + 0.5);
        return (
          <div key={src.name} style={{position: 'absolute', left: x, top: y, translate: '-50% -50%', scale: String(0.8 + 0.2 * p), opacity: p * srcDim, display: 'flex', alignItems: 'center', gap: 14, padding: '14px 24px 14px 16px', borderRadius: 22, background: '#13203A', border: `2px solid #2E4470`, fontFamily: UI, fontWeight: 600, fontSize: 26, color: C.white, whiteSpace: 'nowrap'}}>
            <div style={{width: 52, height: 52, borderRadius: 16, background: src.icon === 'fb' ? '#3C64C8' : src.icon === 'x' ? '#000' : '#22345A', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Icon k={src.icon} />
            </div>
            {src.name}
          </div>
        );
      })}
      <AgentNode id="router" t={s} size={170} active={0.6 + 0.4 * Math.sin(s * 3) ** 2} label={false} style={{left: HUB[0], top: HUB[1]}} />

      {/* posts: each could be an early signal, then each collapses into a data point that flies into the hub */}
      {posts.map((p, i) => {
        const inP = ramp(s, p.at, p.at + 0.6);
        const g = suck(p.gone);
        const x = lerp(p.x, HUB[0] - 220, g), y = lerp(p.y, HUB[1] - 200, g);
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y + (1 - inP) * 80, opacity: inP * (1 - ramp(s, p.gone + 0.6, p.gone + 0.9)), rotate: `${p.rot * (1 - g)}deg`, scale: String(1 - g * 0.95), transformOrigin: '50% 50%'}}>
            {p.el}
          </div>
        );
      })}
      {posts.map((p, i) => {
        const f = ramp(s, p.gone + 0.6, p.gone + 1.2);
        return f > 0 && f < 1 ? <div key={'d' + i} style={{position: 'absolute', left: lerp(HUB[0] - 10, HUB[0], f), top: lerp(HUB[1] - 40, HUB[1], f), width: 18, height: 18, marginLeft: -9, marginTop: -9, borderRadius: 9, background: C.cyan, opacity: 1 - f}} /> : null;
      })}

      {SOURCES.map((src) => <Cue key={src.name} at={src.at} name="pop" volume={0.3} />)}
      {posts.map((p, i) => <Cue key={'p' + i} at={p.at} name="whoosh3" volume={0.22} />)}
      {posts.map((p, i) => <Cue key={'g' + i} at={p.gone + 0.6} name="blip" volume={0.3} />)}
    </AbsoluteFill>
  );
};
