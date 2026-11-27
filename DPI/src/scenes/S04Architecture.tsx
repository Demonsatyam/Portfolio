import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Cue, ramp, Reveal, useSec} from '../anim';
import {along, Block, Chip, Icon, Kicker, P, Panel, Shot, Stage, Wire} from '../cast/Kit';
import {Presenter} from '../cast/People';
import {C, lines, MONO, UI} from '../theme';
import {when} from './S02Packet';

const L = lines(3);

// the pipeline as a snake: top row left→right, bottom row right→left
export const STAGES: {t: string; sub: string; icon: React.ComponentProps<typeof Icon>['name']; at: P; f: number; color?: string}[] = [
  {t: 'Wireshark Capture', sub: 'recorded traffic', icon: 'wave', at: [250, 360], f: 0.02},
  {t: 'Input PCAP', sub: 'capture.pcap', icon: 'file', at: [605, 360], f: 0.1},
  {t: 'DPI Engine', sub: 'every packet', icon: 'cpu', at: [960, 360], f: 0.2, color: C.purple},
  {t: 'Packet Parsing', sub: 'Eth · IP · TCP/UDP', icon: 'search', at: [1315, 360], f: 0.27},
  {t: 'App Classification', sub: 'SNI · HTTP Host', icon: 'tag', at: [1670, 360], f: 0.38},
  {t: 'Blocking Rules', sub: 'IP · app · domain', icon: 'shield', at: [1670, 720], f: 0.53},
  {t: 'Forward / Drop', sub: 'per flow', icon: 'split', at: [1315, 720], f: 0.6},
  {t: 'Filtered Output', sub: 'output.pcap', icon: 'file', at: [960, 720], f: 0.72, color: C.green},
  {t: 'Processing Report', sub: 'stats · apps · domains', icon: 'report', at: [605, 720], f: 0.86, color: C.green},
];
const MAIN: P[] = [[250, 360], [1670, 360], [1670, 720], [1315, 720]];
const FWD: P[] = [[1315, 720], [960, 720]];
const DROP: P[] = [[1315, 720], [1315, 930]];

// fake capture list (illustrative)
const CAP = [
  ['1', '0.000000', '192.168.1.100', '172.217.14.206', 'TCP', '74'],
  ['2', '0.012418', '172.217.14.206', '192.168.1.100', 'TCP', '74'],
  ['3', '0.012502', '192.168.1.100', '172.217.14.206', 'TCP', '66'],
  ['4', '0.013117', '192.168.1.100', '172.217.14.206', 'TLSv1.3', '583'],
  ['5', '0.020931', '192.168.1.100', '8.8.8.8', 'DNS', '75'],
  ['6', '0.031776', '192.168.1.100', '140.82.112.4', 'TCP', '74'],
];

export const S04Architecture: React.FC = () => {
  const s = useSec();
  const at = (f: number) => when(L[1], f);
  const flow = ramp(s, at(0.62), at(0.7));
  return (
    <Stage grid={0.25}>
      <Shot s={s} from={0} to={L[1].at - 0.1} fade={0.3}>
        <Presenter s={s} who="engineer" line={L[0]} x={1240} gesture={ramp(s, 3, 4)} kicker="STEP ZERO: CAPTURE" />
        <Panel style={{left: 96, top: 170, width: 1080, padding: 0, overflow: 'hidden'}} on={ramp(s, 0.8, 1.3)}>
          <div style={{padding: '16px 24px', background: '#15213D', fontFamily: UI, fontSize: 22, color: C.mute}}>Packet capture (e.g. Wireshark)</div>
          {CAP.map((r, i) => (
            <div key={i} style={{display: 'flex', fontFamily: MONO, fontSize: 21, color: i === 3 ? C.white : C.mute, padding: '10px 24px', background: i === 3 ? C.blue + '33' : 'transparent', opacity: ramp(s, 1.4 + i * 0.25, 1.7 + i * 0.25)}}>
              {r.map((c, j) => <span key={j} style={{width: [60, 150, 260, 260, 140, 80][j]}}>{c}</span>)}
            </div>
          ))}
        </Panel>
        <div style={{position: 'absolute', left: 96, top: 640, display: 'flex', alignItems: 'center', gap: 24, opacity: ramp(s, 3.4, 3.9), translate: `0 ${(1 - ramp(s, 3.4, 3.9)) * 30}px`}}>
          <Icon name="file" color={C.cyan} size={110} />
          <div>
            <div style={{fontFamily: MONO, fontSize: 40, color: C.white}}>capture.pcap</div>
            <Chip color={C.amber} size={22} style={{marginTop: 12, opacity: ramp(s, 5.4, 5.9)}}>offline · works on a recording, not a live link</Chip>
          </div>
        </div>
      </Shot>
      <Shot s={s} from={L[1].at - 0.3} to={60}>
        <AbsoluteFill>
          <Reveal s={s} at={L[1].at} style={{position: 'absolute', left: 96, top: 84}}><Kicker>THE COMPLETE ARCHITECTURE</Kicker></Reveal>
          {/* connections draw in behind the stages */}
          {STAGES.slice(1).map((st, i) => {
            const a = STAGES[i].at, b = st.at;
            return <Wire key={i} pts={[a, b]} color={i >= 6 ? C.green : C.blue} p={ramp(s, at(st.f) - 0.35, at(st.f))} arrow={false} />;
          })}
          <Wire pts={DROP} color={C.red} p={ramp(s, at(0.6), at(0.66))} />
          <div style={{position: 'absolute', left: 1235, top: 905, width: 160, textAlign: 'center', opacity: ramp(s, at(0.62), at(0.68))}}><Chip color={C.red} size={24}>✕ DROP</Chip></div>
          {/* packets streaming through */}
          {Array.from({length: 12}, (_, i) => {
            const u = (s * 0.07 + i / 12) % 1;
            const drop = i % 4 === 1;
            const [x, y] = u < 0.72 ? along(MAIN, u / 0.72) : along(drop ? DROP : FWD, (u - 0.72) / 0.28);
            const col = u < 0.72 ? C.cyan : drop ? C.red : C.green;
            const fadeOut = u > 0.72 && drop ? 1 - ramp(u, 0.9, 1) : 1;
            return <div key={i} style={{position: 'absolute', left: x - 9, top: y - 9, width: 18, height: 18, borderRadius: 5, background: col, boxShadow: `0 0 16px ${col}`, opacity: flow * fadeOut}} />;
          })}
          {STAGES.map((st) => {
            const o = ramp(s, at(st.f), at(st.f) + 0.45);
            const hot = Math.max(0, 1 - Math.abs(s - at(st.f) - 0.6) / 0.9);
            return <Block key={st.t} x={st.at[0]} y={st.at[1]} w={320} h={124} title={st.t} sub={st.sub} color={st.color ?? C.blue} on={o} active={hot} size={27} icon={<Icon name={st.icon} color={st.color ?? C.cyan} size={46} />} />;
          })}
          <div style={{position: 'absolute', left: 96, right: 96, bottom: 64, fontFamily: UI, fontSize: 26, color: C.mute, opacity: ramp(s, L[1].end, L[1].end + 0.5)}}>
            Input: a recorded PCAP file  ·  Output: a filtered PCAP file + a processing report
          </div>
        </AbsoluteFill>
      </Shot>
      <Cue at={1.4} name="type" volume={0.35} />
      <Cue at={3.4} name="pop" volume={0.5} />
      <Cue at={L[1].at - 0.3} name="whoosh3" volume={0.3} />
      {STAGES.map((st) => <Cue key={st.t} at={at(st.f)} name="blip" volume={0.32} />)}
      <Cue at={at(0.62)} name="drop" volume={0.35} />
    </Stage>
  );
};
