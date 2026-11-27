import React from 'react';
import {AbsoluteFill, interpolateColors} from 'remotion';
import {Cue, keys, ramp, useSec} from '../anim';
import {AgentNode} from '../cast/Agents';
import {Tag} from '../cast/UI';
import {INCIDENT, NOW, ISO, mixView, OTHER_ROUTES, P, road, ROUTE_NORMAL, TOP} from '../city/city';
import {IsoCity, Jam, toScreen} from '../city/IsoCity';
import {C, DISPLAY, UI} from '../theme';
import {IncidentMark} from './S02Problem';

export const VIEW7 = mixView(ISO, TOP, 0.55);
// predicted spread along connected roads (grow is driven by the prediction clock)
export const spreadJams = (g: number): Jam[] => [
  {from: INCIDENT, to: [road(4), road(7)], grow: 0.5 + 0.35 * g, level: 1},
  {from: INCIDENT, to: [road(4), road(2)], grow: 0.15 + 0.35 * g, level: 0.6 + 0.4 * g},
  {from: [road(4), road(4)], to: [road(1), road(4)], grow: g * 0.8, level: g},
  {from: [road(4), road(4)], to: [road(6), road(4)], grow: g * 0.6, level: g * 0.7},
  {from: [road(4), road(5)], to: [road(1), road(5)], grow: g * 0.7, level: g * 0.9},
  {from: [road(4), road(5)], to: [road(6), road(5)], grow: g * 0.9, level: g},
];

export const Zone: React.FC<{pr: (p: P, z?: number) => P; r: number; opacity: number}> = ({pr, r, opacity}) => {
  const ring = (rr: number) => Array.from({length: 48}, (_, i) => pr([INCIDENT[0] + Math.cos((i / 48) * Math.PI * 2) * rr, INCIDENT[1] + Math.sin((i / 48) * Math.PI * 2) * rr])).map((p) => p.join(',')).join(' ');
  return (
    <g opacity={opacity}>
      <polygon points={ring(r)} fill={C.amber} opacity={0.14} stroke={C.amber} strokeWidth={3} strokeDasharray="10 10" />
      <polygon points={ring(r * 0.55)} fill={C.red} opacity={0.18} />
    </g>
  );
};

const STAGES: [string, number][] = [['PREDICT', 0.4], ['ASSESS IMPACT', 5.6], ['IDENTIFY AFFECTED ROUTES', 7.6]];

export const S07Predict: React.FC = () => {
  const s = useSec();
  const g = ramp(s, 5.6, 7.6);
  const mins = Math.round(g * 30);
  const routesOn = ramp(s, 7.6, 8.2);
  const flagged = ramp(s, 8.4, 8.9);
  const mine = ramp(s, 9.6, 10.1);
  const cam = {x: keys(s, [0, 11.6], [INCIDENT[0] - 1.8, INCIDENT[0] - 3]), y: keys(s, [0, 11.6], [INCIDENT[1] - 0.5, INCIDENT[1] - 1.5]), zoom: keys(s, [0, 7.6, 11.6], [1.55, 1.25, 1.12])};
  const homeScr = toScreen(NOW, VIEW7, cam);
  return (
    <AbsoluteFill style={{background: C.navy2}}>
      <IsoCity
        view={VIEW7}
        cam={cam}
        t={s + 40}
        sun={0.3}
        density={1}
        net={0.25}
        jams={spreadJams(g)}
        routes={[
          ...OTHER_ROUTES.map((r) => ({pts: r.pts, color: r.affected ? interpolateColors(flagged, [0, 1], [C.teal, C.amber]) : C.teal, width: 5, progress: routesOn, opacity: r.affected ? 0.95 : 0.55})),
          {pts: ROUTE_NORMAL, color: interpolateColors(mine, [0, 1], [C.teal, C.amber]), width: 5 + 4 * mine, progress: routesOn, opacity: 0.6 + 0.4 * mine},
        ]}
        overlay={(pr) => (
          <>
            <Zone pr={pr} r={1.2 + g * 3.6} opacity={ramp(s, 5.6, 6.0)} />
            {OTHER_ROUTES.filter((r) => r.affected).map((r, i) => {
              const [x, y] = pr(r.pts[0]);
              return (
                <g key={i} transform={`translate(${x} ${y})`} opacity={flagged}>
                  <circle r={16} fill={C.amber} />
                  <circle cy={-4} r={5} fill={C.navy} />
                  <path d="M-8 9 C-6 2 6 2 8 9" fill={C.navy} />
                </g>
              );
            })}
            <IncidentMark p={pr(INCIDENT, 0.2)} s={s} color={C.red} />
            <g transform={`translate(${pr(NOW)[0]} ${pr(NOW)[1]})`} opacity={mine}>
              <circle r={26} fill={C.blue} opacity={0.25} />
              <circle r={13} fill={C.white} />
              <circle r={8} fill={C.blue} />
            </g>
          </>
        )}
      />
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(7,13,26,0.95) 0%, rgba(7,13,26,0.75) 30%, rgba(7,13,26,0) 50%)'}} />

      {/* stage type, stacked: the current one is white, the done ones dim */}
      <div style={{position: 'absolute', left: 120, top: 110, width: 700}}>
        {STAGES.map(([w, at], i) => {
          const on = ramp(s, at, at + 0.5);
          const next = i < 2 ? ramp(s, STAGES[i + 1][1], STAGES[i + 1][1] + 0.5) : 0;
          return (
            <div key={w} style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 62, lineHeight: 1.08, marginBottom: 12, color: interpolateColors(next, [0, 1], [C.white, '#4A5C80']), opacity: on, translate: `${(1 - on) * -40}px 0`}}>{w}</div>
          );
        })}
      </div>

      {/* what the predictive agent weighs */}
      <div style={{position: 'absolute', left: 120, top: 560, display: 'flex', flexDirection: 'column', gap: 18}}>
        {[['Traffic flow', 2.2, C.blue], ['Weather', 2.9, C.blue], ['Incident reports', 3.6, C.red], ['Road network', 4.3, C.cyan]].map(([w, at, col]) => (
          <div key={w as string} style={{opacity: ramp(s, at as number, (at as number) + 0.4), translate: `${(1 - ramp(s, at as number, (at as number) + 0.4)) * -30}px 0`}}>
            <Tag color={col as string} size={26}>{w}</Tag>
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 120, top: 920, opacity: ramp(s, 5.6, 6.0), fontFamily: UI, color: C.white}}>
        <span style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 52, color: interpolateColors(g, [0, 1], [C.amber, C.red])}}>+{mins} min</span>
        <span style={{fontSize: 24, color: C.mute, marginLeft: 16}}>predicted spread · simulated</span>
      </div>

      <div style={{position: 'absolute', right: 120, top: 120}}>
        <AgentNode id="predict" t={s} size={130} active={0.9} style={{left: -60, top: 60}} />
      </div>

      {/* the commuter's own route is one of them */}
      <div style={{position: 'absolute', left: homeScr[0], top: homeScr[1] + 30, translate: '-50% 0', opacity: mine, scale: String(0.9 + 0.1 * mine)}}>
        <Tag color={C.amber} size={26}>Your daily route</Tag>
      </div>

      <Cue at={0.3} name="whoosh2" volume={0.25} />
      {[2.2, 2.9, 3.6, 4.3].map((a) => <Cue key={a} at={a} name="pop" volume={0.25} />)}
      <Cue at={5.6} name="scan" volume={0.4} />
      <Cue at={8.4} name="blip" volume={0.35} />
      <Cue at={9.6} name="pop" volume={0.4} />
    </AbsoluteFill>
  );
};
