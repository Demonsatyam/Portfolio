import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Cue, INOUT, keys, ramp, useSec} from '../anim';
import {Icon, Packet, Shot, Stage} from '../cast/Kit';
import {Presenter} from '../cast/People';
import {C, DISPLAY, lines, MONO, UI} from '../theme';
import {when} from './S02Packet';

const L = lines(2);

const Row: React.FC<{k: string; v: string; on: number; color?: string; mark?: React.ReactNode; strong?: boolean}> = ({k, v, on, color = C.cyan, mark = '✓', strong}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '14px 22px', marginBottom: 10, borderRadius: 14, background: strong ? color + '26' : 'rgba(255,255,255,0.03)', border: `2px solid ${strong ? color : '#22335A'}`, opacity: on, translate: `${(1 - on) * -24}px 0`}}>
    <span style={{width: 34, height: 34, borderRadius: 17, background: color + '33', color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, flexShrink: 0}}>{mark}</span>
    <span style={{fontFamily: UI, fontSize: 26, color: C.mute, width: 250, flexShrink: 0}}>{k}</span>
    <span style={{fontFamily: MONO, fontSize: 27, color: strong ? C.white : color, fontWeight: strong ? 700 : 500}}>{v}</span>
  </div>
);

const Side: React.FC<{x: number; title: string; sub: string; color: string; icon: 'shield' | 'search'; dim: number; s: number; t0: number; children: React.ReactNode}> = ({x, title, sub, color, icon, dim, s, t0, children}) => {
  const fall = ramp(s, t0, t0 + 0.9, INOUT);
  const scanY = 250 + ((s * 140) % 40);
  return (
    <div style={{position: 'absolute', left: x, top: 70, width: 860, height: 940, borderRadius: 28, background: 'rgba(12,20,38,0.75)', border: `2px solid ${color}55`, opacity: 0.35 + 0.65 * dim, overflow: 'hidden'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '30px 36px 0'}}>
        <Icon name={icon} color={color} size={54} />
        <div>
          <div style={{fontFamily: DISPLAY, fontWeight: 700, fontSize: 40, color: C.white}}>{title}</div>
          <div style={{fontFamily: UI, fontSize: 22, color: C.mute}}>{sub}</div>
        </div>
      </div>
      {/* gate the packet passes through */}
      <div style={{position: 'absolute', left: 60, right: 60, top: 250, height: 8, borderRadius: 4, background: color, boxShadow: `0 0 30px ${color}`}} />
      {icon === 'search' && dim > 0.5 ? <div style={{position: 'absolute', left: 60, right: 60, top: scanY, height: 2, background: color, opacity: 0.5}} /> : null}
      <Packet x={430} y={keys(fall, [0, 1], [175, 250])} color={C.cyan} size={1.6} opacity={1 - ramp(s, t0 + 0.8, t0 + 1.1)} />
      <div style={{position: 'absolute', left: 36, right: 36, top: 300}}>{children}</div>
    </div>
  );
};

export const S03Why: React.FC = () => {
  const s = useSec();
  const t1 = L[1].at, t3 = L[3].at;
  const row = (t: number) => ramp(s, t, t + 0.35);
  const q = 0.6 + 0.4 * Math.sin(s * 6);
  return (
    <Stage>
      <Shot s={s} from={0} to={L[1].at + 0.2} fade={0.3}>
        <Presenter s={s} who="engineer" line={L[0]} gesture={ramp(s, 1.2, 2)} kicker="WHY DEEP PACKET INSPECTION?" />
      </Shot>
      <Shot s={s} from={L[1].at - 0.2} to={60}>
        <AbsoluteFill>
          <Side x={60} title="Traditional firewall" sub="Decides on headers + configured rules" color={C.blue} icon="shield" dim={1} s={s} t0={t1 + 0.4}>
            <Row k="Source IP" v="192.168.1.100" on={row(when(L[1], 0.55))} />
            <Row k="Destination IP" v="172.217.14.206" on={row(when(L[1], 0.68))} />
            <Row k="Destination port" v="443" on={row(L[2].at + 0.2)} strong color={C.cyan} />
            <Row k="Protocol" v="TCP" on={row(L[2].at + 0.6)} />
            <Row k="Payload" v="encrypted" on={row(L[2].at + 1.0)} mark={<Icon name="lock" color={C.mute} size={24} />} color={C.mute} />
            <div style={{marginTop: 26, padding: '22px 26px', borderRadius: 16, border: `2px dashed ${C.amber}`, opacity: row(when(L[2], 0.55)), fontFamily: UI}}>
              <div style={{fontSize: 24, color: C.mute}}>What it knows</div>
              <div style={{fontSize: 34, color: C.white, fontWeight: 600, marginTop: 6}}>Secure web traffic on port 443</div>
              <div style={{fontSize: 34, color: C.amber, fontWeight: 700, marginTop: 6, opacity: s > when(L[2], 0.75) ? q : 0}}>Application: ?</div>
            </div>
          </Side>
          <Side x={1000} title="DPI Engine" sub="Headers + supported application-layer data" color={C.purple} icon="search" dim={ramp(s, t3 - 0.3, t3 + 0.3)} s={s} t0={t3}>
            <Row k="Headers" v="IP · ports · TCP" on={row(t3 + 0.9)} />
            <Row k="TLS handshake" v="Client Hello" on={row(L[4].at + 0.1)} color={C.purple} />
            <Row k="SNI hostname" v="www.youtube.com" on={row(when(L[4], 0.3))} strong color={C.purple} />
            <Row k="Application" v="YouTube" on={row(when(L[4], 0.62))} strong color={C.green} />
            <Row k="Filtering rules" v="check → forward / drop" on={row(when(L[4], 0.85))} color={C.green} />
            <Row k="Payload" v="still encrypted" on={row(when(L[4], 0.95))} mark={<Icon name="lock" color={C.mute} size={24} />} color={C.mute} />
          </Side>
          <div style={{position: 'absolute', left: 940, top: 500, width: 80, textAlign: 'center', fontFamily: DISPLAY, fontWeight: 800, fontSize: 34, color: C.mute}}>vs</div>
        </AbsoluteFill>
      </Shot>
      <Cue at={L[1].at - 0.2} name="whoosh2" volume={0.35} />
      <Cue at={t1 + 1.1} name="tap" volume={0.5} />
      <Cue at={when(L[2], 0.75)} name="reject" volume={0.35} />
      <Cue at={t3} name="scan" volume={0.45} />
      <Cue at={when(L[4], 0.3)} name="blip" volume={0.5} />
      <Cue at={when(L[4], 0.62)} name="confirm" volume={0.45} />
    </Stage>
  );
};
