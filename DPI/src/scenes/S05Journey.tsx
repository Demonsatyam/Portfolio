import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Cue, INOUT, keys, ramp, Reveal, useSec} from '../anim';
import {Chip, H, Icon, Kicker, Packet, Panel, Stage} from '../cast/Kit';
import {Pip, Speaker} from '../cast/People';
import {C, DISPLAY, lines, MONO, UI} from '../theme';
import {when} from './S02Packet';

const L = lines(4);
const START = [0, L[1].at - 0.3, L[3].at - 0.3, L[5].at - 0.3, 99];

// fly-through: each station grows in from the distance and we pass through it on the way out
const Station: React.FC<{s: number; k: number; children: React.ReactNode}> = ({s, k, children}) => {
  const a = START[k], b = START[k + 1];
  if (s < a - 0.8 || s > b + 0.05) return null;
  const inP = k === 0 ? 1 : ramp(s, a - 0.8, a, INOUT);
  const outP = ramp(s, b - 0.7, b, INOUT);
  return <AbsoluteFill style={{scale: String(0.55 + 0.45 * inP + 1.4 * outP), opacity: Math.min(inP, 1 - outP)}}>{children}</AbsoluteFill>;
};

const StepTitle: React.FC<{n: number; t: string; sub: string}> = ({n, t, sub}) => (
  <div style={{position: 'absolute', left: 96, top: 80}}>
    <Kicker>STEP {n}</Kicker>
    <H size={64} style={{marginTop: 8}}>{t}</H>
    <div style={{fontFamily: UI, fontSize: 28, color: C.mute, marginTop: 6}}>{sub}</div>
  </div>
);

const Field: React.FC<{k: string; v: string; color: string; on: number}> = ({k, v, color, on}) => (
  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '13px 0', borderBottom: '1px solid #22335A', opacity: on, translate: `${(1 - on) * 30}px 0`}}>
    <span style={{fontFamily: UI, fontSize: 25, color: C.mute}}>{k}</span>
    <span style={{fontFamily: MONO, fontSize: 27, color}}>{v}</span>
  </div>
);

// header bytes of the followed packet (Ethernet 14 · IPv4 20 · TCP 20), consistent with the values shown
const BYTES = [
  {name: 'Ethernet', color: C.blue, b: '00 1a 2b 3c 4d 5e 3c 22 fb 7a 1e 04 08 00'},
  {name: 'IPv4', color: C.cyan, b: '45 00 02 39 1c 46 40 00 40 06 b1 e6 c0 a8 01 64 ac d9 0e ce'},
  {name: 'TCP', color: C.purple, b: 'd4 31 01 bb 5a 1c 3e 07 9f 02 11 c4 50 18 01 f6 e3 21 00 00'},
].map((r) => ({...r, b: r.b.split(' ')}));
// which bytes light up when each field is extracted: [row, from, to)
const PICK: [number, number, number][][] = [[[0, 0, 12]], [[1, 9, 10], [1, 12, 20]], [[2, 0, 4]]];

const TUPLE = [
  ['Source IP', '192.168.1.100', C.cyan],
  ['Destination IP', '172.217.14.206', C.cyan],
  ['Source port', '54321', C.purple],
  ['Destination port', '443', C.purple],
  ['Protocol', 'TCP', C.blue],
];

export const S05Journey: React.FC = () => {
  const s = useSec();
  const travel = START.slice(1, 4).reduce((a, t) => a + Math.max(0, 1 - Math.abs(s - t + 0.4) / 0.5), 0);
  const scroll = s * 50 + START.slice(1, 4).reduce((a, t) => a + ramp(s, t - 0.8, t, INOUT) * 900, 0);
  const pick = (g: number) => ramp(s, when(L[4], [0.02, 0.3, 0.72][g]), when(L[4], [0.02, 0.3, 0.72][g]) + 0.4);
  const merge = ramp(s, L[7].at - 0.2, L[7].at + 0.8, INOUT);
  const count = Math.max(1, Math.min(9, Math.floor(keys(s, [L[7].at + 0.8, START[3] + 18], [1, 9], (x) => x))));

  return (
    <Stage grid={0.45} scroll={scroll}>
      {/* 0 · intro: following one packet into the engine */}
      <Station s={s} k={0}>
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <Packet x={960} y={500} color={C.cyan} size={keys(s, [0, 6.5], [2.2, 3.2])} rot={Math.sin(s * 1.4) * 3} />
          <div style={{position: 'absolute', top: 640, textAlign: 'center', width: '100%'}}>
            <Reveal s={s} at={0.4}><Kicker>FOLLOW ONE PACKET</Kicker></Reveal>
            <Reveal s={s} at={0.8}><H size={84}>The journey of a packet</H></Reveal>
            <Reveal s={s} at={1.4}><div style={{fontFamily: MONO, fontSize: 28, color: C.mute, marginTop: 10}}>packet #4 · 583 bytes · 192.168.1.100 → 172.217.14.206</div></Reveal>
          </div>
        </AbsoluteFill>
        <Pip s={s} who="engineer" line={L[0]} on={Math.min(ramp(s, 0.2, 0.7), 1 - ramp(s, L[0].end + 0.3, L[0].end + 0.7))} style={{top: 90, bottom: "auto"}} />
        <Speaker s={s} line={L[0]} style={{bottom: 60}} />
      </Station>

      {/* 1 · PCAP reader */}
      <Station s={s} k={1}>
        <StepTitle n={1} t="PCAP Reader" sub="Opens the capture and reads it record by record" />
        <div style={{position: 'absolute', left: 96, top: 330, width: 760}}>
          {[['Global header', '24 B', C.amber, L[2].at], ['Record header #1', '16 B', C.blue, 0], ['Packet data #1', '74 B', C.dim, 0], ['…', '', C.dim, 0], ['Record header #4', '16 B', C.cyan, when(L[2], 0.3)], ['Packet data #4', '583 B', C.cyan, when(L[2], 0.78)], ['Record header #5', '16 B', C.blue, 0]].map(([n, b, col, t], i) => {
            const hot = t ? ramp(s, t as number, (t as number) + 0.3) : 0;
            return (
              <div key={i} style={{display: 'flex', justifyContent: 'space-between', padding: '16px 24px', marginBottom: 8, borderRadius: 12, background: hot ? (col as string) + '30' : '#0F1A30', border: `2px solid ${hot ? col : '#22335A'}`, fontFamily: MONO, fontSize: 26, color: hot ? C.white : C.mute, opacity: ramp(s, START[1] + i * 0.12, START[1] + 0.3 + i * 0.12)}}>
                <span>{n}</span><span>{b}</span>
              </div>
            );
          })}
          <Note2 on={ramp(s, START[1] + 0.6, START[1] + 1)}>capture.pcap</Note2>
        </div>
        <Panel style={{left: 960, top: 330, width: 860, padding: '22px 34px'}} on={ramp(s, L[2].at - 0.2, L[2].at + 0.3)} glow={C.amber}>
          <div style={{fontFamily: DISPLAY, fontSize: 30, fontWeight: 700, color: C.amber}}>Global header</div>
          <Field k="magic number" v="0xa1b2c3d4" color={C.white} on={ramp(s, L[2].at, L[2].at + 0.3)} />
          <Field k="version · snaplen" v="2.4 · 65535" color={C.white} on={ramp(s, L[2].at + 0.3, L[2].at + 0.6)} />
          <Field k="link type" v="1 (Ethernet)" color={C.white} on={ramp(s, L[2].at + 0.6, L[2].at + 0.9)} />
          <div style={{fontFamily: DISPLAY, fontSize: 30, fontWeight: 700, color: C.cyan, marginTop: 26, opacity: ramp(s, when(L[2], 0.3), when(L[2], 0.3) + 0.3)}}>Record header #4</div>
          <Field k="timestamp" v="+0.013117 s" color={C.cyan} on={ramp(s, when(L[2], 0.48), when(L[2], 0.48) + 0.3)} />
          <Field k="captured / original length" v="583 / 583 B" color={C.cyan} on={ramp(s, when(L[2], 0.62), when(L[2], 0.62) + 0.3)} />
          <div style={{fontFamily: MONO, fontSize: 24, color: C.mute, marginTop: 22, lineHeight: 1.5, opacity: ramp(s, when(L[2], 0.8), when(L[2], 0.8) + 0.4)}}>
            00 1a 2b 3c 4d 5e 3c 22 fb 7a 1e 04 08 00 45 00 02 39 1c 46 40 00 40 06 …
          </div>
        </Panel>
      </Station>

      {/* 2 · Packet parser */}
      <Station s={s} k={2}>
        <StepTitle n={2} t="Packet Parser" sub="Splits the raw bytes into headers and reads their fields" />
        <div style={{position: 'absolute', left: 96, top: 330}}>
          {BYTES.map((r, ri) => (
            <div key={r.name} style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22, opacity: ramp(s, START[2] + 0.3 + ri * 0.3, START[2] + 0.6 + ri * 0.3)}}>
              <div style={{width: 130, fontFamily: DISPLAY, fontWeight: 700, fontSize: 26, color: r.color}}>{r.name}</div>
              <div style={{display: 'flex', flexWrap: 'wrap', width: 760, gap: 4}}>
                {r.b.map((b, i) => {
                  const lit = PICK.reduce((a, grp, g) => a + (grp.some(([row, f, t]) => row === ri && i >= f && i < t) ? pick(g) : 0), 0);
                  return <span key={i} style={{width: 34, textAlign: 'center', fontFamily: MONO, fontSize: 22, padding: '6px 0', borderRadius: 6, color: lit ? C.bg : C.white, background: lit ? r.color : r.color + '22'}}>{b}</span>;
                })}
              </div>
            </div>
          ))}
          <div style={{fontFamily: UI, fontSize: 22, color: C.mute, marginTop: 8, opacity: ramp(s, START[2] + 1.4, START[2] + 1.8)}}>UDP packets are parsed the same way: 8-byte header with ports</div>
        </div>
        <Panel style={{left: 1040, top: 330, width: 780, padding: '18px 34px'}} on={ramp(s, L[4].at - 0.2, L[4].at + 0.3)}>
          <div style={{fontFamily: DISPLAY, fontSize: 30, fontWeight: 700, marginBottom: 6}}>Extracted</div>
          <Field k="Source MAC" v="3c:22:fb:7a:1e:04" color={C.blue} on={pick(0)} />
          <Field k="Destination MAC" v="00:1a:2b:3c:4d:5e" color={C.blue} on={pick(0)} />
          <Field k="Source IP" v="192.168.1.100" color={C.cyan} on={pick(1)} />
          <Field k="Destination IP" v="172.217.14.206" color={C.cyan} on={pick(1)} />
          <Field k="Protocol" v="6 · TCP" color={C.cyan} on={pick(1)} />
          <Field k="Source port" v="54321" color={C.purple} on={pick(2)} />
          <Field k="Destination port" v="443" color={C.purple} on={pick(2)} />
        </Panel>
      </Station>

      {/* 3 · Five-tuple */}
      <Station s={s} k={3}>
        <StepTitle n={3} t="The Five-Tuple" sub="Five values that name a connection" />
        {TUPLE.map(([k, v, col], i) => {
          const t = when(L[6], [0.02, 0.2, 0.42, 0.6, 0.85][i]);
          const o = ramp(s, Math.min(t, START[3] + 1 + i * 0.15), Math.min(t, START[3] + 1 + i * 0.15) + 0.4);
          const x0 = 96 + i * 352, x1 = 560 + i * 160;
          return (
            <div key={k} style={{position: 'absolute', left: x0 + (x1 - x0) * merge, top: 360 + 210 * merge, width: 330 - 170 * merge, opacity: o * (1 - merge), padding: '20px 22px', borderRadius: 18, background: col + '22', border: `2px solid ${col}`, boxShadow: s > t && s < t + 1 ? `0 0 30px ${col}88` : 'none'}}>
              <div style={{fontFamily: UI, fontSize: 22, color: C.mute}}>{k}</div>
              <div style={{fontFamily: MONO, fontSize: 32, color: C.white, marginTop: 4}}>{v}</div>
            </div>
          );
        })}
        <div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center', opacity: merge, scale: String(0.8 + 0.2 * merge)}}>
          <div style={{padding: '26px 44px', borderRadius: 60, background: `linear-gradient(90deg, ${C.cyan}33, ${C.purple}33)`, border: `3px solid ${C.cyan}`, boxShadow: `0 0 60px ${C.cyan}55`, fontFamily: MONO, fontSize: 38, color: C.white}}>
            192.168.1.100:54321 → 172.217.14.206:443 · TCP
          </div>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 470, textAlign: 'center', fontFamily: DISPLAY, fontWeight: 700, fontSize: 26, letterSpacing: 6, color: C.cyan, opacity: merge}}>CONNECTION IDENTIFIER</div>
        <Panel style={{left: 360, top: 740, width: 1200, padding: '18px 34px'}} on={ramp(s, L[7].at + 0.6, L[7].at + 1.1)}>
          <div style={{display: 'flex', fontFamily: UI, fontSize: 21, color: C.mute, letterSpacing: 2, paddingBottom: 8}}><span style={{width: 180}}>FLOW</span><span style={{flex: 1}}>FIVE-TUPLE</span><span style={{width: 180, textAlign: 'right'}}>PACKETS</span></div>
          <div style={{display: 'flex', alignItems: 'center', fontFamily: MONO, fontSize: 28, color: C.white, padding: '12px 0', borderTop: '1px solid #22335A'}}>
            <span style={{width: 180, color: C.cyan}}>flow #1</span><span style={{flex: 1}}>…100:54321 → …206:443 TCP</span><span style={{width: 180, textAlign: 'right', color: C.green, fontSize: 36}}>{count}</span>
          </div>
        </Panel>
        {Array.from({length: 8}, (_, i) => {
          const t0 = L[7].at + 0.8 + i * ((START[3] + 18 - L[7].at - 0.8) / 8);
          const p = ramp(s, t0 - 0.9, t0, INOUT);
          return p > 0 && p < 1 ? <Packet key={i} x={keys(p, [0, 1], [-60, 1300])} y={850} color={C.cyan} size={0.8} /> : null;
        })}
        <Chip color={C.green} size={24} style={{position: 'absolute', left: 360, top: 900, opacity: ramp(s, L[7].end, L[7].end + 0.4)}}>same five values → same flow</Chip>
      </Station>

      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 50%, transparent 30%, ${C.cyan}22)`, opacity: travel, pointerEvents: 'none'}} />
      {START.slice(1, 4).map((t) => <Cue key={t} at={t - 0.8} name="whoosh1" volume={0.4} />)}
      <Cue at={L[2].at} name="type" volume={0.35} />
      <Cue at={when(L[2], 0.3)} name="blip" volume={0.35} />
      {[0, 1, 2].map((g) => <Cue key={g} at={when(L[4], [0.02, 0.3, 0.72][g])} name="scan" volume={0.25} />)}
      {[0.02, 0.2, 0.42, 0.6, 0.85].map((f) => <Cue key={f} at={when(L[6], f)} name="blip" volume={0.35} />)}
      <Cue at={L[7].at} name="impact" volume={0.3} />
    </Stage>
  );
};

const Note2: React.FC<{on: number; children: React.ReactNode}> = ({on, children}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 14, opacity: on, fontFamily: MONO, fontSize: 24, color: C.cyan}}><Icon name="file" size={34} />{children}</div>
);
