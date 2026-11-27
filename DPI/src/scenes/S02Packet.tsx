import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Cue, INOUT, lerp, ramp, Reveal, useSec} from '../anim';
import {Kicker, Packet, Stage} from '../cast/Kit';
import {C, DISPLAY, Line, lines, MONO, UI} from '../theme';

const L = lines(1);
// time at a fraction of a spoken line (for words inside a sentence)
export const when = (l: Line, frac: number) => l.at + (l.end - l.at) * frac;

const LAYERS = [
  {name: 'Ethernet', size: '14 bytes', color: C.blue, q: 'Which device on this local link?', rows: [['Dst MAC', '00:1a:2b:3c:4d:5e'], ['Src MAC', '3c:22:fb:7a:1e:04'], ['EtherType', '0x0800 IPv4']], nest: [960, 560, 1320, 640], bar: [160, 360]},
  {name: 'IP header', size: '20+ bytes', color: C.cyan, q: 'Where from? Where to?', rows: [['Src IP', '192.168.1.100'], ['Dst IP', '172.217.14.206'], ['Protocol', '6 (TCP)']], nest: [960, 575, 1080, 500], bar: [530, 380]},
  {name: 'TCP header', size: '20+ bytes', color: C.purple, q: 'Which conversation, in what order?', rows: [['Src port', '54321'], ['Dst port', '443'], ['Seq / Ack', 'ordering']], nest: [960, 590, 840, 360], bar: [920, 380]},
  {name: 'Payload', size: 'variable', color: C.green, q: 'The actual application data', rows: [['Bytes', '16 03 01 02 00 …'], ['For HTTPS', 'TLS records'], ['', '']], nest: [960, 605, 600, 220], bar: [1310, 450]},
];
const ANNOT = [
  {t: 'FROM', d: 'where it came from', x: 380, y: 330, f: 0.24},
  {t: 'TO', d: "where it's going", x: 1540, y: 330, f: 0.38},
  {t: 'HOW', d: 'how to deliver it', x: 380, y: 760, f: 0.52},
  {t: 'DATA', d: 'what is being sent', x: 1540, y: 760, f: 0.78},
];

export const S02Packet: React.FC = () => {
  const s = useSec();
  const stop = ramp(s, 0.6, 2.6, INOUT); // hero packet decelerates to centre
  const zoom = ramp(s, 2.4, 3.6, INOUT);
  const env = 1 - ramp(s, L[2].at - 0.4, L[2].at + 0.3); // envelope gives way to the layers
  const morph = ramp(s, L[3].at - 0.6, L[3].at + 0.4, INOUT); // nested dolls → header bar
  const active = L.slice(3).reduce((a, l, k) => (s >= l.at - 0.2 ? k : a), -1);

  return (
    <Stage grid={0.35} scroll={s * 40}>
      {/* the stream */}
      {s < 4 ? (
        <AbsoluteFill style={{opacity: 1 - zoom}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 538, height: 4, background: `linear-gradient(90deg, transparent, ${C.blue}, transparent)`}} />
          {Array.from({length: 14}, (_, i) => {
            const x = ((s * 520 + i * 160) % 2240) - 160;
            return <Packet key={i} x={x} y={540} color={i % 3 ? C.blue : C.cyan} size={0.8} opacity={1 - stop * 0.8} />;
          })}
        </AbsoluteFill>
      ) : null}
      {/* hero packet → big envelope */}
      {env > 0 ? (
        <AbsoluteFill style={{opacity: env}}>
          <Packet x={lerp(-100, 960, stop)} y={540} color={C.cyan} size={lerp(1.2, 9, zoom)} />
          {ANNOT.map((a) => {
            const at = s >= L[1].at ? when(L[1], a.f) : 999;
            const o = ramp(s, at, at + 0.4);
            return (
              <div key={a.t} style={{position: 'absolute', left: a.x - 170, top: a.y - 60, width: 340, textAlign: 'center', opacity: o, scale: String(0.9 + 0.1 * o)}}>
                <div style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 52, color: C.white, letterSpacing: 6}}>{a.t}</div>
                <div style={{fontFamily: UI, fontSize: 28, color: C.cyan}}>{a.d}</div>
              </div>
            );
          })}
          <Reveal s={s} at={L[0].at + 0.4} style={{position: 'absolute', left: 96, top: 90}}><Kicker>A PACKET IS A DIGITAL ENVELOPE</Kicker></Reveal>
        </AbsoluteFill>
      ) : null}
      {/* layers: nested, then laid out as a header bar */}
      {s > L[2].at - 0.4 ? (
        <AbsoluteFill>
          <Reveal s={s} at={L[2].at} out={L[3].at - 0.5} style={{position: 'absolute', left: 96, top: 90}}><Kicker>OPEN IT UP: LAYERS INSIDE LAYERS</Kicker></Reveal>
          <Reveal s={s} at={L[3].at} style={{position: 'absolute', left: 96, top: 90}}><Kicker>PACKET STRUCTURE</Kicker></Reveal>
          {LAYERS.map((ly, k) => {
            const appear = ramp(s, L[2].at + k * 0.45, L[2].at + k * 0.45 + 0.5);
            const [nx, ny, nw, nh] = ly.nest;
            const x = lerp(nx - nw / 2, ly.bar[0], morph), y = lerp(ny - nh / 2, 190, morph);
            const w = lerp(nw, ly.bar[1] - 12, morph), h = lerp(nh, 130, morph);
            const on = k === active ? 1 : 0;
            return (
              <div key={ly.name} style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 20, opacity: appear, scale: String(0.94 + 0.06 * appear),
                background: `${ly.color}${on ? '38' : '18'}`, border: `3px solid ${ly.color}${on || morph < 1 ? 'FF' : '99'}`, boxShadow: on ? `0 0 50px ${ly.color}77` : 'none', boxSizing: 'border-box', padding: '16px 22px'}}>
                <div style={{fontFamily: DISPLAY, fontWeight: 700, fontSize: 34, color: C.white}}>{ly.name}</div>
                <div style={{fontFamily: MONO, fontSize: 22, color: ly.color}}>{ly.size}</div>
              </div>
            );
          })}
          {/* per-layer detail cards */}
          {LAYERS.map((ly, k) => {
            const l = L[3 + k];
            const o = ramp(s, l.at - 0.1, l.at + 0.5);
            const cx = ly.bar[0] + (ly.bar[1] - 12) / 2;
            return (
              <React.Fragment key={ly.name}>
                <div style={{position: 'absolute', left: cx - 1.5, top: 320, width: 3, height: 90 * o, background: ly.color}} />
                <div style={{position: 'absolute', left: cx - 185, top: 410, width: 370, opacity: o * (k === active ? 1 : 0.6), translate: `0 ${(1 - o) * 30}px`, background: 'rgba(15,26,48,0.88)', border: `2px solid ${ly.color}${k === active ? 'FF' : '66'}`, borderRadius: 18, padding: '22px 24px', fontFamily: UI, color: C.white}}>
                  <div style={{fontSize: 27, fontWeight: 600, lineHeight: 1.25, minHeight: 68}}>{ly.q}</div>
                  {ly.rows.filter((r) => r[0]).map(([a, b]) => (
                    <div key={a} style={{marginTop: 16}}>
                      <div style={{fontSize: 19, color: C.mute, letterSpacing: 2}}>{a.toUpperCase()}</div>
                      <div style={{fontFamily: MONO, fontSize: 26, color: ly.color}}>{b}</div>
                    </div>
                  ))}
                </div>
              </React.Fragment>
            );
          })}
          <div style={{position: 'absolute', left: 160, right: 160, top: 930, textAlign: 'center', fontFamily: UI, fontSize: 26, color: C.mute, opacity: ramp(s, L[6].end, L[6].end + 0.5)}}>
            Each layer wraps the next: Ethernet ⊃ IP ⊃ TCP ⊃ payload
          </div>
        </AbsoluteFill>
      ) : null}
      <Cue at={0.3} name="whoosh1" volume={0.35} />
      <Cue at={2.4} name="pop" volume={0.5} />
      {ANNOT.map((a) => <Cue key={a.t} at={when(L[1], a.f)} name="blip" volume={0.4} />)}
      {[0, 1, 2, 3].map((k) => <Cue key={k} at={L[2].at + k * 0.45} name="tap" volume={0.4} />)}
      <Cue at={L[3].at - 0.6} name="whoosh3" volume={0.35} />
      {L.slice(3).map((l, k) => <Cue key={k} at={l.at} name="blip" volume={0.35} />)}
    </Stage>
  );
};
