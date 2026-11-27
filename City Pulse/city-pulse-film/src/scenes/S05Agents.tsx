import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Cue, INOUT, keys, ramp, Reveal, useSec, win} from '../anim';
import {AgentId, AgentNode, Flow} from '../cast/Agents';
import {IncidentPhoto, Kicker, Tag} from '../cast/UI';
import {C, DISPLAY, UI} from '../theme';

const POS: Record<AgentId, [number, number]> = {
  router: [960, 540],
  social: [500, 330],
  report: [960, 210],
  sentiment: [1420, 330],
  predict: [1420, 790],
  notify: [500, 790],
};
const LINKS: [AgentId, AgentId][] = [['router', 'social'], ['router', 'report'], ['router', 'sentiment'], ['router', 'predict'], ['router', 'notify'], ['social', 'report'], ['report', 'sentiment']];

// camera keyframes: [time, focusX, focusY, screenX, screenY, zoom]
const CAM: [number, number, number, number, number, number][] = [
  [0, 960, 540, 960, 560, 0.92],
  [4.4, 960, 540, 960, 560, 1.0],
  [5.0, ...POS.social, 380, 560, 1.5],
  [6.7, ...POS.social, 380, 560, 1.5],
  [7.2, ...POS.report, 380, 560, 1.5],
  [9.1, ...POS.report, 380, 560, 1.5],
  [9.6, ...POS.sentiment, 380, 560, 1.5],
  [12.1, ...POS.sentiment, 380, 560, 1.5],
  [12.9, 960, 540, 960, 540, 0.95],
];

const MiniPost: React.FC<{text: string; kind: string}> = ({text, kind}) => (
  <div style={{width: 470, background: '#F6F8FC', borderRadius: 18, padding: '16px 20px', fontFamily: UI, color: '#121A2A', boxShadow: '0 14px 40px rgba(0,0,0,0.4)'}}>
    <div style={{fontSize: 16, fontWeight: 700, color: '#5D6A82'}}>{kind}</div>
    <div style={{fontSize: 24, fontWeight: 600, marginTop: 4, lineHeight: 1.25}}>{text}</div>
  </div>
);

const Check: React.FC<{children: React.ReactNode; on: number; color?: string}> = ({children, on, color = C.cyan}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 14, opacity: on, translate: `${(1 - on) * 30}px 0`, fontFamily: UI, fontSize: 28, fontWeight: 600, color: C.white}}>
    <div style={{width: 34, height: 34, borderRadius: 10, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.navy, fontWeight: 800, fontSize: 22}}>✓</div>
    {children}
  </div>
);

export const S05Agents: React.FC = () => {
  const s = useSec();
  const k = (i: number) => keys(s, CAM.map((c) => c[0]), CAM.map((c) => c[i]));
  const [fx, fy, sx, sy, z] = [k(1), k(2), k(3), k(4), k(5)];
  const merge = ramp(s, 12.8, 14.2);
  const focus = (id: AgentId, a: number, b: number) => win(s, a, b, 0.5);
  const act: Partial<Record<AgentId, number>> = {social: focus('social', 4.8, 7.0), report: focus('report', 7.0, 9.4), sentiment: focus('sentiment', 9.4, 12.4)};

  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 50%, #0F1C36 0%, ${C.night} 75%)`}}>
      {/* the agent stage, moved by the camera */}
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', translate: `${sx - z * fx}px ${sy - z * fy}px`, scale: String(z)}}>
        <svg width={1920} height={1080} style={{position: 'absolute', overflow: 'visible'}}>
          {LINKS.map(([a, b], i) => (
            <Flow key={i} from={POS[a]} to={POS[b]} t={s + i * 0.21} color={i < 5 ? C.cyan : C.blue} n={4} opacity={ramp(s, 0.3 + i * 0.15, 0.8 + i * 0.15) * (1 - merge * 0.7)} speed={0.5} />
          ))}
          {/* convergence into one incident node */}
          {(['social', 'report', 'sentiment'] as AgentId[]).map((id, i) => (
            <Flow key={id} from={POS[id]} to={POS.router} t={s * 1.6 + i * 0.3} color={C.amber} n={7} opacity={merge} curve={0.1} speed={0.9} />
          ))}
        </svg>
        {(Object.keys(POS) as AgentId[]).map((id, i) =>
          id === 'router' ? null : <AgentNode key={id} id={id} t={s} size={150} active={act[id] ?? 0.2} style={{left: POS[id][0], top: POS[id][1], opacity: ramp(s, 0.2 + i * 0.25, 0.7 + i * 0.25)}} />,
        )}
        <AgentNode id="router" t={s} size={180} active={0.7} style={{left: POS.router[0], top: POS.router[1], opacity: 1 - merge}} />
        {/* incident node */}
        <div style={{position: 'absolute', left: POS.router[0], top: POS.router[1], translate: '-50% -50%', scale: String(merge), opacity: merge}}>
          <svg width={240} height={240} viewBox="-120 -120 240 240">
            <circle r={60 + 40 * ((s * 1.2) % 1)} fill="none" stroke={C.amber} strokeWidth={3} opacity={1 - ((s * 1.2) % 1)} />
            <circle r={64} fill="#2A1E08" stroke={C.amber} strokeWidth={5} />
            <path d="M0 -34 L30 22 L-30 22 Z" fill={C.amber} />
            <rect x={-3} y={-14} width={6} height={20} rx={3} fill="#2A1E08" />
            <circle cy={14} r={3.5} fill="#2A1E08" />
          </svg>
        </div>
      </div>

      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(7,13,26,0) 32%, rgba(7,13,26,0.94) 42%)', opacity: Math.max(act.social ?? 0, act.report ?? 0, act.sentiment ?? 0)}} />
      {/* kickers */}
      <Reveal s={s} at={0.5} out={4.4} style={{position: 'absolute', left: 120, top: 90}}>
        <Kicker>MULTI-AGENT COLLABORATION</Kicker>
      </Reveal>
      <Reveal s={s} at={13.2} style={{position: 'absolute', left: 0, right: 0, top: 820, textAlign: 'center'}}>
        <Tag color={C.amber} size={30}>Potential incident · Ring Road flyover</Tag>
      </Reveal>
      <Reveal s={s} at={13.8} style={{position: 'absolute', left: 120, top: 90}}>
        <Kicker>AI-POWERED ANALYSIS</Kicker>
      </Reveal>

      {/* Social Feed Agent: cluster the posts that talk about the same road */}
      <div style={{position: 'absolute', left: 820, top: 160, opacity: act.social}}>
        <Kicker style={{marginBottom: 26}}>SOCIAL FEED AGENT</Kicker>
        {[
          ['Accident under the Ring Road flyover', 'Post · photo'],
          ['Traffic crawling near the flyover', 'Page post · video'],
          ['Road closed near the flyover exit', 'Upload form · text'],
        ].map(([t, kind], i) => {
          const gather = ramp(s, 5.6, 6.3, INOUT);
          return (
            <div key={i} style={{position: 'absolute', left: i * 40 * (1 - gather) + (i % 2) * 30 * (1 - gather), top: 70 + i * (150 - 115 * gather), rotate: `${(i - 1) * 2 * (1 - gather)}deg`, opacity: ramp(s, 4.9 + i * 0.15, 5.3 + i * 0.15)}}>
              <MiniPost text={t} kind={kind} />
            </div>
          );
        })}
        <div style={{position: 'absolute', left: 560, top: 120, width: 420, opacity: ramp(s, 6.1, 6.5)}}>
          <div style={{fontFamily: DISPLAY, fontWeight: 700, fontSize: 40, color: C.white, lineHeight: 1.15}}>3 reports,<br />same road</div>
          <div style={{marginTop: 18}}>
            <Tag color={C.amber}>Clustered: Ring Road flyover</Tag>
          </div>
        </div>
      </div>

      {/* User Report Agent: the photo becomes structured facts */}
      <div style={{position: 'absolute', left: 780, top: 170, opacity: act.report}}>
        <Kicker style={{marginBottom: 26}}>USER REPORT AGENT</Kicker>
        <div style={{position: 'relative', width: 620, height: 350, borderRadius: 22, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5)'}}>
          <IncidentPhoto w={620} h={350} />
          <div style={{position: 'absolute', left: 0, right: 0, top: keys(s, [7.3, 8.3], [0, 350], (v) => v), height: 4, background: C.cyan, opacity: win(s, 7.3, 8.4, 0.1)}} />
          {[
            {x: 215, y: 205, w: 230, h: 95, at: 7.7, l: 'Collision'},
            {x: 150, y: 285, w: 60, h: 60, at: 8.0, l: 'Cone'},
            {x: 0, y: 105, w: 620, h: 70, at: 8.3, l: 'Flyover'},
          ].map((b) => (
            <div key={b.l} style={{position: 'absolute', left: b.x, top: b.y, width: b.w, height: b.h, border: `3px solid ${C.cyan}`, borderRadius: 8, opacity: ramp(s, b.at, b.at + 0.2)}}>
              <div style={{position: 'absolute', left: -3, top: -34, background: C.cyan, color: C.navy, fontFamily: UI, fontWeight: 700, fontSize: 20, padding: '3px 10px', borderRadius: 6}}>{b.l}</div>
            </div>
          ))}
        </div>
        <div style={{position: 'absolute', left: 660, top: 90, display: 'flex', flexDirection: 'column', gap: 22, width: 440}}>
          <Check on={ramp(s, 7.7, 8.0)}>Accident: 2 vehicles</Check>
          <Check on={ramp(s, 8.0, 8.3)}>1 of 2 lanes blocked</Check>
          <Check on={ramp(s, 8.3, 8.6)}>Vehicles queuing</Check>
          <Check on={ramp(s, 8.6, 8.9)}>Landmark: flyover</Check>
        </div>
      </div>

      {/* Sentiment Agent: tone + place */}
      <div style={{position: 'absolute', left: 800, top: 170, opacity: act.sentiment}}>
        <Kicker style={{marginBottom: 30}}>SENTIMENT AGENT</Kicker>
        {[
          ['“Traffic is completely stopped.”', 'Frustrated', 'Ring Road'],
          ['“Accident near the flyover.”', 'Concerned', 'Flyover'],
          ['“Road blocked due to waterlogging.”', 'Concerned', 'Lake Road'],
        ].map(([q, mood, place], i) => (
          <div key={i} style={{marginBottom: 34, opacity: ramp(s, 9.7 + i * 0.5, 10.1 + i * 0.5), translate: `${(1 - ramp(s, 9.7 + i * 0.5, 10.1 + i * 0.5)) * 40}px 0`}}>
            <div style={{fontFamily: DISPLAY, fontWeight: 600, fontSize: 40, color: C.white}}>{q}</div>
            <div style={{display: 'flex', gap: 14, marginTop: 12, opacity: ramp(s, 10.2 + i * 0.5, 10.5 + i * 0.5)}}>
              <Tag color={C.amber} size={22}>{mood}</Tag>
              <Tag color={C.blue} size={22}>{place}</Tag>
            </div>
          </div>
        ))}
      </div>

      <Cue at={4.9} name="whoosh1" volume={0.25} />
      <Cue at={6.1} name="pop" volume={0.3} />
      <Cue at={7.1} name="whoosh2" volume={0.25} />
      <Cue at={7.3} name="scan" volume={0.5} />
      <Cue at={9.5} name="whoosh1" volume={0.25} />
      <Cue at={12.8} name="whoosh3" volume={0.3} />
      <Cue at={13.3} name="alert" volume={0.35} />
    </AbsoluteFill>
  );
};
