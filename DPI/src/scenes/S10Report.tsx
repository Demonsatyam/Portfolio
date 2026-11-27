import React from 'react';
import {Cue, keys, ramp, Reveal, useSec} from '../anim';
import {along, Block, Icon, Kicker, Note, P, rand, Stage, Wire} from '../cast/Kit';
import {Pip} from '../cast/People';
import {C, DISPLAY, lines, MONO} from '../theme';

const L = lines(9);
const SRC: P = [430, 210];
const FWD: P[] = [SRC, [430, 330], [230, 330], [230, 500]];
const DRP: P[] = [SRC, [430, 330], [630, 330], [630, 500]];

type Row = [string, string?, string?];
const LEFT: Row[] = [['PROCESSING REPORT', '', 'h'], ['Total Packets', '77'], ['Total Bytes', '5738'], ['TCP Packets', '73'], ['UDP Packets', '4'], ['', ''], ['Forwarded', '69', 'g'], ['Dropped', '8', 'r'], ['', ''], ['APPLICATION BREAKDOWN (TOP 5)', '', 'h'], ['HTTPS', '39', 'b'], ['Unknown', '16', 'b'], ['YouTube', '4', 'b'], ['DNS', '4', 'b'], ['Facebook', '3', 'b']];
const RIGHT: Row[] = [['DETECTED DOMAINS', '', 'h'], ['www.youtube.com'], ['www.facebook.com'], ['www.google.com'], ['github.com'], ['', ''], ['THREAD STATISTICS', '', 'h'], ['Reader → LB0, LB1'], ['LB → FP0, FP1, FP2, FP3'], ['per-thread packet counts'], ['Output Writer → output.pcap']];

const Term: React.FC<{rows: Row[]; s: number; t0: number; step: number}> = ({rows, s, t0, step}) => (
  <div>
    {rows.map(([k, v, kind], i) => {
      const o = ramp(s, t0 + i * step, t0 + i * step + 0.15);
      if (kind === 'h') return <div key={i} style={{fontFamily: MONO, fontSize: 22, color: C.cyan, letterSpacing: 2, marginTop: i ? 8 : 0, marginBottom: 6, opacity: o}}>{k}</div>;
      if (!k) return <div key={i} style={{height: 14}} />;
      const col = kind === 'g' ? C.green : kind === 'r' ? C.red : C.white;
      return (
        <div key={i} style={{display: 'flex', alignItems: 'center', fontFamily: MONO, fontSize: 25, lineHeight: '38px', color: C.white, opacity: o}}>
          <span style={{width: v ? 210 : 'auto', color: v ? C.mute : C.white}}>{k}</span>
          {v ? <span style={{width: 80, textAlign: 'right', color: col, fontWeight: 700}}>{v}</span> : null}
          {kind === 'b' ? <span style={{marginLeft: 16, height: 14, width: (Number(v) / 39) * 160 * ramp(s, t0 + i * step, t0 + i * step + 0.5), background: C.blue, borderRadius: 4}} /> : null}
        </div>
      );
    })}
  </div>
);

export const S10Report: React.FC = () => {
  const s = useSec();
  const run = (x: number) => keys(s, [0.6, 9], [0, x], (q) => q);
  const fwd = Math.round(run(69)), drp = Math.round(run(8));
  const term = ramp(s, L[1].at - 0.4, L[1].at + 0.2);
  return (
    <Stage grid={0.15}>
      <Reveal s={s} at={0.3} style={{position: 'absolute', left: 96, top: 70}}><Kicker color={C.green}>OUTPUT</Kicker></Reveal>
      {/* output stage */}
      <Block x={SRC[0]} y={SRC[1] - 20} w={300} h={90} title="Verdicts" sub="from Fast Path threads" color={C.blue} size={26} />
      <Wire pts={FWD} color={C.green} />
      <Wire pts={DRP} color={C.red} />
      {Array.from({length: 40}, (_, i) => {
        const t0 = 0.6 + i * 0.21, u = (s - t0) / 1.4;
        if (u < 0 || u > 1 || s > 9.4) return null;
        const drop = rand(i * 3) < 0.11;
        const [x, y] = along(drop ? DRP : FWD, u);
        const col = drop ? C.red : C.green;
        return <div key={i} style={{position: 'absolute', left: x - 9, top: y - 9, width: 18, height: 18, borderRadius: 5, background: u < 0.3 ? C.cyan : col, boxShadow: `0 0 14px ${col}`, opacity: drop ? 1 - ramp(u, 0.8, 1) : 1}} />;
      })}
      <Block x={230} y={570} w={300} h={110} title="Output Writer" sub="allowed packets" color={C.green} size={26} />
      <Block x={630} y={570} w={300} h={110} title="Drop path" sub="not written" color={C.red} size={26} />
      <div style={{position: 'absolute', left: 80, top: 680, width: 300, textAlign: 'center'}}>
        <div style={{display: 'flex', justifyContent: 'center'}}><Icon name="file" color={C.green} size={110} /></div>
        <div style={{fontFamily: MONO, fontSize: 26, color: C.white}}>output.pcap</div>
        <div style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 56, color: C.green}}>{fwd}</div>
        <div style={{fontFamily: MONO, fontSize: 20, color: C.mute}}>packets written</div>
      </div>
      <div style={{position: 'absolute', left: 480, top: 760, width: 300, textAlign: 'center'}}>
        <div style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 56, color: C.red}}>{drp}</div>
        <div style={{fontFamily: MONO, fontSize: 20, color: C.mute}}>packets dropped</div>
      </div>
      {/* terminal report */}
      <div style={{position: 'absolute', left: 860, top: 120, width: 980, height: 860, borderRadius: 20, background: '#050913', border: `2px solid ${C.line}`, boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 40px ${C.cyan}22`, opacity: term, translate: `${(1 - term) * 60}px 0`, overflow: 'hidden'}}>
        <div style={{height: 50, background: '#0E172C', display: 'flex', alignItems: 'center', gap: 10, padding: '0 20px'}}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <span key={c} style={{width: 14, height: 14, borderRadius: 7, background: c}} />)}
          <span style={{marginLeft: 16, fontFamily: MONO, fontSize: 20, color: C.mute}}>dpi-engine · report</span>
        </div>
        <div style={{display: 'flex', gap: 40, padding: '26px 34px'}}>
          <div style={{flex: 1.1}}><Term rows={LEFT} s={s} t0={L[1].at} step={0.28} /></div>
          <div style={{flex: 1}}><Term rows={RIGHT} s={s} t0={L[1].at + 2.2} step={0.4} /></div>
        </div>
        <Note style={{left: 34, bottom: 22, opacity: ramp(s, L[1].at + 4, L[1].at + 4.5)}}>Illustrative sample report from a small capture · not a performance benchmark</Note>
      </div>
      <Pip s={s} who="admin" line={L[2]} on={Math.min(ramp(s, L[2].at - 0.4, L[2].at), 1 - ramp(s, L[2].end + 0.8, L[2].end + 1.2))} style={{left: 290, top: 110, right: 'auto', bottom: 'auto', width: 380, height: 286}} />
      <Cue at={0.6} name="whoosh3" volume={0.3} />
      {Array.from({length: 6}, (_, k) => <Cue key={k} at={1 + k * 1.3} name="tap" volume={0.18} />)}
      <Cue at={L[1].at - 0.3} name="whoosh2" volume={0.3} />
      <Cue at={L[1].at} name="type" volume={0.35} />
      <Cue at={L[1].at + 2.2} name="type" volume={0.35} />
      <Cue at={L[1].at + 4.2} name="type" volume={0.3} />
      <Cue at={L[2].at} name="notify" volume={0.35} />
    </Stage>
  );
};
