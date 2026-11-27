import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Cue, keys, ramp, Reveal, useSec} from '../anim';
import {Icon, Kicker, Shot, Stage} from '../cast/Kit';
import {NetWorld} from '../cast/NetWorld';
import {CAST, Person} from '../cast/People';
import {C, DISPLAY, FPS, lines, T, UI} from '../theme';
import {when} from './S02Packet';
import {STAGES} from './S04Architecture';

const L = lines(10);
const LEN = T.scenes[10].frames / FPS;
const CAPS: {t: string; d: string; icon: React.ComponentProps<typeof Icon>['name']; color: string}[] = [
  {t: 'Network Protocol Parsing', d: 'Ethernet · IPv4 · TCP · UDP', icon: 'search', color: C.blue},
  {t: 'Deep Packet Inspection', d: 'TLS SNI · HTTP Host', icon: 'eye', color: C.purple},
  {t: 'Flow Tracking', d: 'Five-Tuple connections', icon: 'tag', color: C.cyan},
  {t: 'Multithreaded Processing', d: 'Reader · LB · FP · Writer', icon: 'cpu', color: C.blue},
  {t: 'Intelligent Traffic Filtering', d: 'IP · app · domain rules', icon: 'shield', color: C.green},
];

export const S11Summary: React.FC = () => {
  const s = useSec();
  const endAt = L[2].end + 0.8;
  const end = ramp(s, endAt, endAt + 1);
  const black = ramp(s, LEN - 1.6, LEN - 0.2);
  return (
    <Stage grid={0.2}>
      {/* recap: architecture + five capabilities */}
      <Shot s={s} from={0} to={L[2].at - 0.3}>
        <Reveal s={s} at={0.3} style={{position: 'absolute', left: 96, top: 70}}><Kicker>THE COMPLETE PICTURE</Kicker></Reveal>
        <div style={{position: 'absolute', left: 96, right: 96, top: 150, display: 'flex', alignItems: 'center', gap: 8}}>
          {STAGES.map((st, i) => {
            const o = ramp(s, 0.5 + i * 0.22, 0.8 + i * 0.22);
            const col = st.color ?? C.blue;
            return (
              <React.Fragment key={st.t}>
                <div style={{flex: 1, height: 96, borderRadius: 12, border: `2px solid ${col}`, background: col + '1C', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, opacity: o}}>
                  <Icon name={st.icon} color={col} size={34} />
                  <div style={{fontFamily: UI, fontWeight: 600, fontSize: 16, color: C.white, textAlign: 'center', lineHeight: 1.1}}>{st.t}</div>
                </div>
                {i < STAGES.length - 1 ? <span style={{color: C.dim, fontSize: 20, opacity: o}}>→</span> : null}
              </React.Fragment>
            );
          })}
        </div>
        <div style={{position: 'absolute', left: 96, right: 96, top: 340, display: 'flex', gap: 24}}>
          {CAPS.map((c, i) => {
            const t = when(L[1], 0.08 + i * 0.17);
            const o = ramp(s, t, t + 0.5);
            const hot = Math.max(0, 1 - Math.abs(s - t - 0.8) / 1.2);
            return (
              <div key={c.t} style={{flex: 1, height: 520, borderRadius: 24, padding: '36px 26px', boxSizing: 'border-box', background: `linear-gradient(180deg, ${c.color}${hot > 0.3 ? '33' : '1A'}, rgba(12,20,38,0.9))`, border: `2px solid ${c.color}${hot > 0.3 ? 'FF' : '77'}`, boxShadow: `0 0 ${50 * hot}px ${c.color}55`, opacity: o, translate: `0 ${(1 - o) * 50}px`}}>
                <div style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 64, color: c.color, opacity: 0.6}}>0{i + 1}</div>
                <div style={{marginTop: 24}}><Icon name={c.icon} color={c.color} size={72} /></div>
                <div style={{fontFamily: DISPLAY, fontWeight: 700, fontSize: 36, color: C.white, marginTop: 24, lineHeight: 1.12}}>{c.t}</div>
                <div style={{fontFamily: UI, fontSize: 22, color: C.mute, marginTop: 14}}>{c.d}</div>
              </div>
            );
          })}
        </div>
      </Shot>
      {/* the cast in front of the network */}
      <Shot s={s} from={L[2].at - 0.5} to={endAt + 0.6}>
        <AbsoluteFill style={{opacity: 0.55, scale: String(keys(s, [L[2].at, endAt], [1.1, 1.0]))}}><NetWorld t={s} cy={420} density={1.2} /></AbsoluteFill>
        <AbsoluteFill style={{background: 'linear-gradient(transparent 45%, rgba(7,11,22,0.95) 92%)'}} />
        {(['user', 'engineer', 'admin'] as const).map((w, i) => (
          <React.Fragment key={w}>
            <Person who={w} t={s + i * 1.3} look={[0.3, 0, -0.3][i]} style={{position: 'absolute', left: 300 + i * 480, top: 400, width: 440, height: 572, opacity: ramp(s, L[2].at - 0.3 + i * 0.25, L[2].at + 0.2 + i * 0.25)}} />
            <div style={{position: 'absolute', left: 300 + i * 480, width: 440, top: 990, textAlign: 'center', fontFamily: DISPLAY, fontWeight: 700, fontSize: 20, letterSpacing: 4, color: CAST[w].color, opacity: ramp(s, L[2].at + 0.4, L[2].at + 0.8)}}>{CAST[w].role}</div>
          </React.Fragment>
        ))}
        <div style={{position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center'}}>
          <Reveal s={s} at={L[2].at + 0.2}><div style={{fontFamily: DISPLAY, fontWeight: 600, fontSize: 52, color: C.mute}}>Not just seeing packets.</div></Reveal>
          <Reveal s={s} at={when(L[2], 0.45)}><div style={{fontFamily: DISPLAY, fontWeight: 700, fontSize: 64, color: C.white}}>Understanding the traffic.</div></Reveal>
        </div>
      </Shot>
      {/* end screen */}
      {end > 0 ? (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', textAlign: 'center', opacity: end}}>
          <div style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 160, color: C.white, letterSpacing: 6, textShadow: `0 0 60px ${C.blue}AA`}}>DPI ENGINE</div>
          <div style={{width: 560, height: 3, margin: '14px auto 18px', background: `linear-gradient(90deg, transparent, ${C.cyan}, transparent)`}} />
          <div style={{fontFamily: UI, fontWeight: 500, fontSize: 40, color: C.cyan, letterSpacing: 10}}>DEEP PACKET INSPECTION SYSTEM</div>
          <div style={{fontFamily: UI, fontSize: 32, color: C.mute, marginTop: 56, opacity: ramp(s, endAt + 1.2, endAt + 2)}}>
            Understand Traffic. <span style={{color: C.white}}>Classify Connections.</span> <span style={{color: C.green}}>Control Network Flow.</span>
          </div>
        </AbsoluteFill>
      ) : null}
      <AbsoluteFill style={{background: '#000', opacity: black}} />
      {CAPS.map((c, i) => <Cue key={c.t} at={when(L[1], 0.08 + i * 0.17)} name="blip" volume={0.35} />)}
      <Cue at={L[2].at - 0.5} name="whoosh2" volume={0.3} />
      <Cue at={endAt} name="impact" volume={0.55} />
    </Stage>
  );
};

