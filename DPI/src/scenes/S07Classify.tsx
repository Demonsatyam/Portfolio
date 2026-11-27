import React from 'react';
import {Cue, INOUT, keys, ramp, Reveal, useSec} from '../anim';
import {Chip, Icon, Kicker, Panel, Stage, Wire} from '../cast/Kit';
import {C, DISPLAY, lines, MONO, UI} from '../theme';
import {when} from './S02Packet';

const L = lines(6);
const ITEMS = [
  {d: 'www.youtube.com', app: 'YOUTUBE'},
  {d: 'www.facebook.com', app: 'FACEBOOK'},
  {d: 'www.google.com', app: 'GOOGLE'},
  {d: 'github.com', app: 'GITHUB'},
  {d: 'no hostname found', app: 'UNKNOWN'},
];
const STEPS = ['Domain', 'Signature matching', 'AppType', 'Flow classification'];

export const S07Classify: React.FC = () => {
  const s = useSec();
  const t0 = (i: number) => 0.9 + i * 2.3;
  const stepAt = [0.6, when(L[0], 0.55), L[1].at + 0.6, when(L[2], 0.55)];
  const flowHi = ramp(s, when(L[2], 0.55), when(L[2], 0.55) + 0.5);
  return (
    <Stage grid={0.2}>
      <Reveal s={s} at={0.3} style={{position: 'absolute', left: 96, top: 70}}><Kicker>APPLICATION CLASSIFICATION</Kicker></Reveal>
      {/* the process, top */}
      <div style={{position: 'absolute', left: 96, right: 96, top: 140, display: 'flex', alignItems: 'center', gap: 18}}>
        {STEPS.map((st, i) => {
          const on = ramp(s, stepAt[i], stepAt[i] + 0.4);
          return (
            <React.Fragment key={st}>
              <div style={{flex: 1, padding: '18px 0', textAlign: 'center', borderRadius: 14, fontFamily: DISPLAY, fontWeight: 700, fontSize: 30, color: C.white, background: `rgba(121,92,255,${0.08 + 0.25 * on})`, border: `2px solid ${on > 0.5 ? C.purple : '#22335A'}`, opacity: 0.4 + 0.6 * on}}>{st}</div>
              {i < 3 ? <div style={{fontSize: 34, color: on > 0.5 ? C.purple : C.dim}}>→</div> : null}
            </React.Fragment>
          );
        })}
      </div>
      {/* engine */}
      <Panel style={{left: 760, top: 300, width: 400, height: 640, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18}} glow={C.purple} on={ramp(s, 0.4, 0.9)}>
        <Icon name="search" color={C.purple} size={90} />
        <div style={{fontFamily: DISPLAY, fontWeight: 700, fontSize: 34, textAlign: 'center'}}>Signature<br />matching</div>
        <div style={{fontFamily: MONO, fontSize: 20, color: C.mute, textAlign: 'center', lineHeight: 1.6}}>youtube → YOUTUBE<br />facebook → FACEBOOK<br />google → GOOGLE<br />github → GITHUB</div>
      </Panel>
      {ITEMS.map((it, i) => {
        const a = t0(i);
        const inP = ramp(s, a, a + 0.6, INOUT);
        const go = ramp(s, a + 0.7, a + 1.3, INOUT);
        const out = ramp(s, a + 1.3, a + 1.8);
        const y = 330 + i * 125;
        const unknown = it.app === 'UNKNOWN';
        const col = unknown ? C.mute : C.purple;
        return (
          <React.Fragment key={it.d}>
            <div style={{position: 'absolute', left: keys(inP, [0, 1], [-420, 96]), top: y, opacity: inP}}>
              <Chip color={unknown ? C.dim : C.cyan} size={27}>{it.d}</Chip>
            </div>
            <Wire pts={[[500, y + 28], [760, 620]]} color={C.cyan} p={go} width={2} opacity={1 - out * 0.7} />
            <Wire pts={[[1160, 620], [1260, y + 28]]} color={col} p={out} width={2} opacity={0.6} />
            <div style={{position: 'absolute', left: 1270, top: y, display: 'flex', alignItems: 'center', gap: 16, opacity: out, translate: `${(1 - out) * -30}px 0`}}>
              <Chip color={col} size={27} solid={!unknown}>{unknown ? 'UNKNOWN' : `AppType::${it.app}`}</Chip>
              <span style={{fontFamily: MONO, fontSize: 24, color: flowHi > 0.5 ? C.green : C.mute, padding: '6px 12px', borderRadius: 8, border: `2px solid ${flowHi > 0.5 ? C.green : 'transparent'}`}}>flow #{i + 1}</span>
            </div>
          </React.Fragment>
        );
      })}
      <div style={{position: 'absolute', left: 1270, top: 960, fontFamily: UI, fontSize: 25, color: C.green, opacity: flowHi}}>Stored on the flow → later packets inherit the label</div>
      <div style={{position: 'absolute', left: 96, top: 960, fontFamily: UI, fontSize: 22, color: C.mute, opacity: ramp(s, 2, 2.5)}}>Only domains with a known signature are recognized.</div>
      {ITEMS.map((it, i) => <Cue key={it.d} at={t0(i) + 1.3} name={it.app === 'UNKNOWN' ? 'reject' : 'blip'} volume={0.4} />)}
      {ITEMS.map((it, i) => <Cue key={'w' + it.d} at={t0(i)} name="whoosh3" volume={0.15} />)}
      <Cue at={when(L[2], 0.55)} name="confirm" volume={0.35} />
    </Stage>
  );
};
