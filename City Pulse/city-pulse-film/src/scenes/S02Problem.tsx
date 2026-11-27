import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {Cue, keys, ramp, useSec} from '../anim';
import {Commuter} from '../cast/Commuter';
import {Street} from '../cast/Street';
import {MiniMap, Phone} from '../cast/UI';
import {alongPoly, INCIDENT, ISO, P, road, ROUTE_NORMAL} from '../city/city';
import {IsoCity, Jam} from '../city/IsoCity';
import {C, DISPLAY, UI} from '../theme';

export const jamFor = (grow: number, level: number): Jam[] => [{from: INCIDENT, to: [road(4), road(7)], grow, level}];

export const IncidentMark: React.FC<{p: P; s: number; color: string; scale?: number}> = ({p, s, color, scale = 1}) => {
  const pulse = (s * 1.4) % 1;
  return (
    <g transform={`translate(${p[0]} ${p[1]}) scale(${scale})`}>
      <ellipse rx={20 + pulse * 70} ry={(20 + pulse * 70) * 0.55} fill="none" stroke={color} strokeWidth={3} opacity={1 - pulse} />
      <ellipse rx={22} ry={12} fill={color} opacity={0.35} />
      <path d="M0 -62 L22 -22 L-22 -22 Z" fill={color} />
      <rect x={-2.5} y={-52} width={5} height={16} rx={2} fill="#1A1206" />
      <circle cx={0} cy={-29} r={3} fill="#1A1206" />
      <line x1={0} y1={-22} x2={0} y2={0} stroke={color} strokeWidth={3} />
    </g>
  );
};

// 0–2.6 aerial: incident + queue starts · 2.6–4.0 close on the queue, rain · 4.0–6.6 commuter rides on, unaware
// 6.6–8.6 their navigation still shows a clear route · 8.6– aerial: they approach the jam
export const S02Problem: React.FC = () => {
  const s = useSec();
  const grow = keys(s, [0.6, 4, 11.3], [0, 0.4, 0.7]);
  const level = keys(s, [0.6, 4, 9], [0, 0.7, 1]);
  const youAt = (f: number) => alongPoly(ROUTE_NORMAL, f);
  return (
    <AbsoluteFill style={{background: C.navy2}}>
      {s < 4.0 ? (
        <>
          <IsoCity
            view={ISO}
            cam={{x: keys(s, [0, 2.6], [8.5, INCIDENT[0]]), y: keys(s, [0, 2.6, 4], [12.5, INCIDENT[1] + 1, INCIDENT[1] + 1.4]), zoom: keys(s, [0, 2.5, 2.6, 4], [1.25, 1.45, 2.3, 2.45], (v) => v)}}
            t={s + 13}
            sun={0.45}
            density={0.9}
            jams={jamFor(grow, level)}
            routes={[{pts: ROUTE_NORMAL, color: C.blue, width: 6, opacity: 0.55}]}
            overlay={(pr) => (s > 0.5 ? <IncidentMark p={pr(INCIDENT, 0.2)} s={s} color={level > 0.6 ? C.red : C.amber} scale={ramp(s, 0.5, 0.9)} /> : null)}
          />
          {s > 2.6 ? (
            <AbsoluteFill style={{opacity: ramp(s, 2.6, 3.0)}}>
              <svg width={1920} height={1080}>
                {Array.from({length: 90}, (_, i) => {
                  const x = random('rx' + i) * 2100, y = ((random('ry' + i) * 1200 + s * 1400) % 1200) - 100;
                  return <line key={i} x1={x} y1={y} x2={x - 14} y2={y + 46} stroke="#BFD3F5" strokeWidth={2} opacity={0.35} />;
                })}
              </svg>
            </AbsoluteFill>
          ) : null}
        </>
      ) : null}

      {s >= 4.0 && s < 6.6 ? (
        <>
          <Street x={(s - 4) * 520} sun={0.6} />
          <Commuter pose="riding" t={s} moving style={{position: 'absolute', left: 560, top: 420, width: 700, height: 633}} />
        </>
      ) : null}

      {s >= 6.6 && s < 8.6 ? (
        <AbsoluteFill style={{background: `radial-gradient(circle at 50% 45%, #1A2A4A, ${C.night})`}}>
          <Phone style={{left: 750, top: 110, scale: keys(s, [6.6, 8.6], [1.05, 1.12])}} time="7:49">
            <MiniMap w={392} h={832} S={17} cx={9.75} cy={9.75} routes={[{pts: ROUTE_NORMAL, color: C.blue}]} you={youAt(keys(s, [6.6, 8.6], [0.1, 0.14]))} />
            <div style={{position: 'absolute', left: 18, right: 18, bottom: 24, background: 'rgba(12,19,34,0.94)', borderRadius: 22, padding: '20px 22px', color: C.white, fontFamily: UI}}>
              <div style={{fontFamily: DISPLAY, fontSize: 30, fontWeight: 700}}>Usual route</div>
              <div style={{fontSize: 20, color: C.mute, marginTop: 6}}>No disruption reported yet</div>
            </div>
          </Phone>
        </AbsoluteFill>
      ) : null}

      {s >= 8.6 ? (
        <IsoCity
          view={ISO}
          cam={{x: keys(s, [8.6, 11.3], [8.2, 9]), y: keys(s, [8.6, 11.3], [15, 14]), zoom: keys(s, [8.6, 11.3], [1.7, 1.55])}}
          t={s + 13}
          sun={0.45}
          density={0.9}
          jams={jamFor(grow, level)}
          routes={[{pts: ROUTE_NORMAL, color: C.blue, width: 7}]}
          overlay={(pr) => {
            const [x, y] = pr(youAt(keys(s, [8.6, 11.3], [0.14, 0.198], (v) => v)));
            return (
              <>
                <IncidentMark p={pr(INCIDENT, 0.2)} s={s} color={C.red} />
                <g transform={`translate(${x} ${y})`}>
                  <circle r={26} fill={C.blue} opacity={0.25} />
                  <circle r={13} fill={C.white} />
                  <circle r={8} fill={C.blue} />
                </g>
              </>
            );
          }}
        />
      ) : null}

      <Cue at={0.5} name="alert" volume={0.45} />
      <Cue at={2.6} name="whoosh2" volume={0.3} />
      <Cue at={4.0} name="whoosh1" volume={0.3} />
      <Cue at={6.6} name="whoosh3" volume={0.25} />
      <Cue at={8.6} name="whoosh2" volume={0.3} />
    </AbsoluteFill>
  );
};
