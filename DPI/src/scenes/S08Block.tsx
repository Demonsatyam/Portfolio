import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Cue, INOUT, keys, ramp, Reveal, useSec} from '../anim';
import {Chip, Kicker, Packet, Panel, Shot, Stage} from '../cast/Kit';
import {Presenter} from '../cast/People';
import {C, DISPLAY, lines, MONO, UI} from '../theme';

const L = lines(7);
const RULES = [
  ['IP rule', '192.168.1.50', 'block source IP'],
  ['Application rule', 'YouTube', 'block AppType'],
  ['Domain rule', 'tiktok', 'block matching hostnames'],
];
const GATES = [
  {x: 620, q: 'Source IP blocked?'},
  {x: 960, q: 'Application blocked?'},
  {x: 1300, q: 'Domain matches a rule?'},
];
const FLOW = ['SYN', 'SYN-ACK', 'ACK', 'Client Hello', 'Data', 'Data', 'Data', 'Data'];

// a packet walking through the gates; fails at gate `fail` (or passes all with -1)
const Walker: React.FC<{s: number; t: number; fail: number; label: string}> = ({s, t, fail, label}) => {
  const stops = fail < 0 ? 3 : fail + 1;
  const times = [t, ...GATES.slice(0, stops).map((_, i) => t + 0.6 * (i + 1))];
  const xs = [200, ...GATES.slice(0, stops).map((g) => g.x)];
  const end = times[times.length - 1];
  let x = keys(s, times, xs), y = 560;
  if (s > end && fail < 0) { x = keys(s, [end, end + 0.5], [GATES[2].x, 1660], INOUT); y = keys(s, [end, end + 0.5], [560, 380], INOUT); }
  if (s > end && fail >= 0) y = keys(s, [end + 0.1, end + 0.6], [560, 850], INOUT);
  if (s < t || s > end + 2.2) return null;
  const col = s > end + 0.05 ? (fail < 0 ? C.green : C.red) : C.cyan;
  return <Packet x={x} y={y} color={col} size={1.5} label={label} opacity={1 - ramp(s, end + 1.6, end + 2.2)} />;
};

export const S08Block: React.FC = () => {
  const s = useSec();
  const A = L[1].at + 0.2, B = L[1].at + 2.6;
  const gateState = (gi: number) => {
    const passA = A + 0.6 * (gi + 1), passB = B + 0.6 * (gi + 1);
    if (s > passB - 0.05 && s < passB + 0.6 && gi <= 1) return gi === 1 ? C.red : C.green;
    if (s > passA - 0.05 && s < passA + 0.6) return C.green;
    return C.dim;
  };
  const f0 = L[2].at + 0.3;
  const ft = [0, 0.7, 1.4, 2.3, 3.6, 4.2, 4.8, 5.4].map((d) => f0 + d);
  const blocked = ramp(s, ft[3] + 0.6, ft[3] + 0.9);
  return (
    <Stage grid={0.2} light={s < L[2].at ? C.purple : C.red}>
      {/* A · the administrator configures rules */}
      <Shot s={s} from={0} to={L[1].at - 0.1} fade={0.3}>
        <Presenter s={s} who="admin" line={L[0]} x={1260} gesture={ramp(s, 2.5, 3.3)} kicker="SECURITY POLICY" />
        <Panel style={{left: 96, top: 170, width: 1060, padding: '26px 34px'}} on={ramp(s, 0.5, 1)} glow={C.purple}>
          <div style={{fontFamily: DISPLAY, fontWeight: 700, fontSize: 36, marginBottom: 14}}>Blocking rules</div>
          {RULES.map(([k, v, d], i) => {
            const on = ramp(s, 1.3 + i * 0.9, 1.6 + i * 0.9);
            return (
              <div key={k} style={{display: 'flex', alignItems: 'center', gap: 24, padding: '20px 0', borderTop: '1px solid #22335A', opacity: 0.4 + 0.6 * ramp(s, 1 + i * 0.9, 1.3 + i * 0.9)}}>
                <div style={{width: 270}}>
                  <div style={{fontFamily: UI, fontSize: 27, color: C.white, fontWeight: 600}}>{k}</div>
                  <div style={{fontFamily: UI, fontSize: 20, color: C.mute}}>{d}</div>
                </div>
                <div style={{flex: 1, fontFamily: MONO, fontSize: 32, color: C.white, padding: '10px 18px', borderRadius: 10, background: '#0A1224', border: '2px solid #22335A'}}>{v}</div>
                <div style={{width: 84, height: 44, borderRadius: 22, background: on > 0.5 ? C.red : '#22335A', position: 'relative'}}>
                  <div style={{position: 'absolute', top: 5, left: 5 + 40 * on, width: 34, height: 34, borderRadius: 17, background: C.white}} />
                </div>
              </div>
            );
          })}
        </Panel>
      </Shot>

      {/* B · decision gates */}
      <Shot s={s} from={L[1].at - 0.3} to={L[2].at - 0.1}>
        <Reveal s={s} at={L[1].at} style={{position: 'absolute', left: 96, top: 70}}><Kicker color={C.purple}>THE DECISION ENGINE</Kicker></Reveal>
        <div style={{position: 'absolute', left: 0, right: 0, top: 558, height: 4, background: `linear-gradient(90deg, transparent, ${C.blue}88 10%, ${C.blue}88 70%, transparent)`}} />
        {GATES.map((g, i) => {
          const col = gateState(i);
          return (
            <React.Fragment key={g.q}>
              <div style={{position: 'absolute', left: g.x - 140, top: 330, width: 280, textAlign: 'center', fontFamily: UI, fontWeight: 600, fontSize: 26, color: C.white}}><span style={{color: C.purple}}>{i + 1}.</span> {g.q}</div>
              <div style={{position: 'absolute', left: g.x - 8, top: 440, width: 16, height: 240, borderRadius: 8, background: col, boxShadow: col !== C.dim ? `0 0 40px ${col}` : 'none'}} />
            </React.Fragment>
          );
        })}
        <div style={{position: 'absolute', left: 1560, top: 230}}><Chip color={C.green} size={34} solid>FORWARD</Chip></div>
        <div style={{position: 'absolute', left: 860, top: 960, opacity: ramp(s, B + 1.2, B + 1.5)}}><Chip color={C.red} size={34} solid>DROP</Chip></div>
        <Walker s={s} t={A} fail={-1} label="github.com" />
        <Walker s={s} t={B} fail={1} label="www.youtube.com" />
      </Shot>

      {/* C · flow-based blocking */}
      <Shot s={s} from={L[2].at - 0.3} to={99}>
        <Reveal s={s} at={L[2].at} style={{position: 'absolute', left: 96, top: 70}}><Kicker color={C.red}>FLOW-BASED BLOCKING</Kicker></Reveal>
        <Panel style={{left: 96, top: 140, width: 1728, padding: '20px 30px', display: 'flex', alignItems: 'center', gap: 30}} on={ramp(s, L[2].at, L[2].at + 0.4)}>
          <span style={{fontFamily: MONO, fontSize: 28}}>flow #1  192.168.1.100:54321 → 172.217.14.206:443 TCP</span>
          <span style={{flex: 1}} />
          <span style={{fontFamily: UI, fontSize: 24, color: C.mute}}>app</span>
          <Chip color={blocked > 0.5 ? C.purple : C.dim} size={26} solid={blocked > 0.5}>{s > ft[3] + 0.4 ? 'YouTube' : 'unknown'}</Chip>
          <Chip color={blocked > 0.5 ? C.red : C.green} size={26} solid>{blocked > 0.5 ? 'BLOCKED' : 'ALLOWED'}</Chip>
        </Panel>
        {FLOW.map((n, i) => {
          const x = 110 + i * 214, t = ft[i];
          const seen = ramp(s, t, t + 0.3);
          const hello = i === 3, drop = i > 3;
          const col = hello ? C.purple : drop ? C.red : C.green;
          const fall = drop ? ramp(s, t + 0.3, t + 1.0, INOUT) : 0;
          return (
            <React.Fragment key={i}>
              <div style={{position: 'absolute', left: x, top: 330 + fall * 40, width: 190, height: 150, borderRadius: 16, opacity: ramp(s, L[2].at + i * 0.05, L[2].at + 0.3 + i * 0.05) * (1 - fall * 0.55),
                background: seen ? col + '26' : '#0F1A30', border: `2px solid ${seen ? col : '#22335A'}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6}}>
                <div style={{fontFamily: DISPLAY, fontWeight: 700, fontSize: hello ? 27 : 30, color: C.white}}>{n}</div>
                <div style={{fontFamily: MONO, fontSize: 18, color: C.mute}}>{i === 1 ? 'server → client' : hello ? 'SNI www.youtube.com' : drop ? 'TLS record' : 'client → server'}</div>
              </div>
              <div style={{position: 'absolute', left: x, top: 510, width: 190, textAlign: 'center', opacity: seen}}>
                <Chip color={col} size={20} solid>{hello ? 'IDENTIFIED' : drop ? '✕ DROPPED' : '✓ FORWARDED'}</Chip>
              </div>
            </React.Fragment>
          );
        })}
        {/* cursor */}
        <div style={{position: 'absolute', top: 300, left: keys(s, ft, ft.map((_, i) => 110 + i * 214 + 95)) - 2, width: 4, height: 260, background: C.cyan, boxShadow: `0 0 20px ${C.cyan}`, opacity: ramp(s, ft[0] - 0.2, ft[0]) * (1 - ramp(s, ft[7] + 0.5, ft[7] + 0.9))}} />
        {/* the timing point */}
        <div style={{position: 'absolute', left: 110, top: 600, width: 618, opacity: ramp(s, L[3].at + 0.4, L[3].at + 0.9)}}>
          <div style={{height: 14, borderLeft: `3px solid ${C.green}`, borderRight: `3px solid ${C.green}`, borderBottom: `3px solid ${C.green}`}} />
          <div style={{fontFamily: UI, fontSize: 27, color: C.white, marginTop: 16, lineHeight: 1.35}}>Forwarded <b style={{color: C.green}}>before</b> the application was known</div>
        </div>
        <div style={{position: 'absolute', left: 966, top: 600, width: 832, opacity: ramp(s, L[3].at + 3.6, L[3].at + 4.1)}}>
          <div style={{height: 14, borderLeft: `3px solid ${C.red}`, borderRight: `3px solid ${C.red}`, borderBottom: `3px solid ${C.red}`}} />
          <div style={{fontFamily: UI, fontSize: 27, color: C.white, marginTop: 16, lineHeight: 1.35}}>Dropped <b style={{color: C.red}}>after</b> the flow was identified and marked blocked</div>
        </div>
        <AbsoluteFill style={{pointerEvents: 'none', boxShadow: `inset 0 0 ${200 * blocked}px ${C.red}33`, opacity: 1 - ramp(s, ft[7] + 1, ft[7] + 3)}} />
      </Shot>

      {RULES.map((_, i) => <Cue key={i} at={1.3 + i * 0.9} name="tap" volume={0.45} />)}
      <Cue at={A + 1.8} name="confirm" volume={0.4} />
      <Cue at={B + 1.25} name="drop" volume={0.55} />
      {ft.map((t, i) => <Cue key={i} at={t} name={i === 3 ? 'scan' : i > 3 ? 'reject' : 'blip'} volume={i > 3 ? 0.3 : 0.35} />)}
      <Cue at={ft[3] + 0.6} name="alert" volume={0.4} />
    </Stage>
  );
};
