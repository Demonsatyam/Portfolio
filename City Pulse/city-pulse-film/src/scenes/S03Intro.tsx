import React from 'react';
import {AbsoluteFill, Interactive} from 'remotion';
import {Cue, keys, ramp, Reveal, useSec} from '../anim';
import {AgentId, AgentNode, Flow} from '../cast/Agents';
import {Mark} from '../cast/Logo';
import {INCIDENT, ISO, mixView, TOP} from '../city/city';
import {IsoCity} from '../city/IsoCity';
import {C, DISPLAY} from '../theme';
import {jamFor} from './S02Problem';

export const RING: {id: AgentId; a: number}[] = [
  {id: 'social', a: -150},
  {id: 'report', a: -90},
  {id: 'sentiment', a: -30},
  {id: 'predict', a: 30},
  {id: 'notify', a: 150},
];

// The city freezes, the camera rises to top-down, roads become a network, the name lands, then the agents assemble.
export const S03Intro: React.FC = () => {
  const s = useSec();
  const rise = ramp(s, 0.2, 3.2);
  const net = ramp(s, 1.2, 3.4);
  const hub = ramp(s, 3.8, 4.8);
  const titleOut = ramp(s, 3.6, 4.2);
  const cx = 960, cy = 560, R = 300;
  return (
    <AbsoluteFill style={{background: C.night}}>
      <IsoCity
        view={mixView(ISO, TOP, rise)}
        cam={{x: keys(s, [0, 3.2], [9, 10]), y: keys(s, [0, 3.2], [14, 10]), zoom: keys(s, [0, 3.2], [1.55, 0.62])}}
        t={24.3 + Math.max(0, s - 1.2)} // frozen until the network takes over
        sun={0.45 * (1 - net)}
        night={net * 0.6}
        density={0.9}
        net={net}
        jams={jamFor(0.7, 1)}
        buildingOpacity={1 - hub * 0.4}
        overlay={(pr) => {
          const [x, y] = pr(INCIDENT);
          return <circle cx={x} cy={y} r={14} fill={C.red} opacity={1 - hub} />;
        }}
      />
      {/* dim the city a touch so type and agents read */}
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 52%, rgba(7,13,26,${0.25 + hub * 0.35}) 0%, rgba(7,13,26,${0.55 + hub * 0.3}) 70%)`}} />

      {/* title */}
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: 1 - titleOut, scale: String(1 - titleOut * 0.08)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 34}}>
          <div style={{scale: String(ramp(s, 0.35, 0.9))}}>
            <Mark size={150} draw={ramp(s, 0.5, 1.4)} />
          </div>
          <Reveal s={s} at={0.45} dist={120}>
            <Interactive.Div name="Title" style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 150, letterSpacing: -5, color: C.white, lineHeight: 1}}>
              City<span style={{color: C.cyan}}> Pulse</span>
            </Interactive.Div>
          </Reveal>
        </div>
        <Reveal s={s} at={1.5} style={{marginTop: 26}}>
          <Interactive.Div name="Subtitle" style={{fontFamily: DISPLAY, fontWeight: 500, fontSize: 46, color: '#C6D3EA'}}>
            Intelligent Traffic. Proactive Response.
          </Interactive.Div>
        </Reveal>
      </AbsoluteFill>

      {/* the agent network assembles */}
      {hub > 0 ? (
        <AbsoluteFill style={{opacity: hub}}>
          <svg width={1920} height={1080} style={{position: 'absolute'}}>
            {RING.map((r, i) => {
              const x = cx + Math.cos((r.a * Math.PI) / 180) * R, y = cy + Math.sin((r.a * Math.PI) / 180) * R;
              return <Flow key={r.id} from={[x, y]} to={[cx, cy]} t={s + i * 0.3} color={C.cyan} n={4} />;
            })}
            {/* data arriving from every edge */}
            {Array.from({length: 10}, (_, i) => {
              const a = (i / 10) * Math.PI * 2 + 0.3;
              return <Flow key={'e' + i} from={[cx + Math.cos(a) * 1200, cy + Math.sin(a) * 700]} to={[cx + Math.cos(a) * (R + 40), cy + Math.sin(a) * (R + 40)]} t={s * 0.8 + i * 0.17} color={C.blue} n={3} opacity={0.6} curve={0.12} />;
            })}
          </svg>
          {RING.map((r, i) => (
            <AgentNode
              key={r.id}
              id={r.id}
              t={s}
              size={120}
              active={0.3}
              style={{left: cx + Math.cos((r.a * Math.PI) / 180) * R * ramp(s, 4 + i * 0.12, 4.9 + i * 0.12), top: cy + Math.sin((r.a * Math.PI) / 180) * R * ramp(s, 4 + i * 0.12, 4.9 + i * 0.12)}}
            />
          ))}
          <AgentNode id="router" t={s} size={170} active={0.8} label={false} style={{left: cx, top: cy}} />
          {/* detect · validate · anticipate, under the hub as the voice names them */}
          <div style={{position: 'absolute', left: 0, right: 0, top: 930, display: 'flex', justifyContent: 'center', gap: 60, fontFamily: DISPLAY, fontWeight: 700, fontSize: 44}}>
            {[
              ['Detect', 5.2, C.amber],
              ['Validate', 5.9, C.white],
              ['Anticipate', 6.6, C.cyan],
            ].map(([w, at, col]) => (
              <Reveal key={w as string} s={s} at={at as number}>
                <span style={{color: col as string}}>{w}</span>
              </Reveal>
            ))}
          </div>
        </AbsoluteFill>
      ) : null}

      <Cue at={0.35} name="impact" volume={0.4} />
      <Cue at={3.9} name="whoosh3" volume={0.3} />
      {[4.2, 4.35, 4.5, 4.65, 4.8].map((a) => <Cue key={a} at={a} name="blip" volume={0.22} />)}
    </AbsoluteFill>
  );
};
