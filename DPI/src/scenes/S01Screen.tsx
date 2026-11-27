import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Cue, keys, ramp, Reveal, useSec} from '../anim';
import {Kicker, Shot, Stage} from '../cast/Kit';
import {NetWorld} from '../cast/NetWorld';
import {isTalking, Person, Speaker} from '../cast/People';
import {C, DISPLAY, lines, MONO, UI} from '../theme';

const L = lines(0);

// wide shot: the user at a desk at night, laptop glow on their face
const Room: React.FC<{s: number}> = ({s}) => (
  <AbsoluteFill>
    <svg viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
      <defs>
        <radialGradient id="lamp" cx="0.5" cy="0" r="1"><stop offset="0" stopColor="#FFC98A" stopOpacity={0.28} /><stop offset="1" stopColor="#FFC98A" stopOpacity={0} /></radialGradient>
        <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={C.cyan} stopOpacity={0.35} /><stop offset="1" stopColor={C.cyan} stopOpacity={0} /></radialGradient>
      </defs>
      <rect width={1920} height={1080} fill="#0A1020" />
      {/* window with the city at night */}
      <rect x={1220} y={110} width={560} height={480} rx={8} fill="#08132A" stroke="#1C2A48" strokeWidth={10} />
      {Array.from({length: 14}, (_, i) => {
        const w = 30 + (i * 37) % 40, h = 120 + (i * 53) % 260, x = 1230 + i * 40;
        return <g key={i}><rect x={x} y={590 - h} width={w} height={h} fill="#0E1B36" />{Array.from({length: Math.floor(h / 30)}, (_, j) => <rect key={j} x={x + 6} y={600 - h + j * 30} width={6} height={8} fill={(i * 7 + j * 3) % 5 === 0 ? '#FFC870' : '#1F3360'} />)}</g>;
      })}
      <line x1={1500} y1={110} x2={1500} y2={590} stroke="#1C2A48" strokeWidth={8} />
      {/* shelf + plant */}
      <rect x={180} y={300} width={360} height={14} fill="#1A2440" />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={200 + i * 34} y={230 - (i % 2) * 14} width={26} height={70 + (i % 2) * 14} fill={['#24406E', '#2E2A52', '#1E4A5A', '#3A2E48'][i]} />)}
      <path d="M440 300 C430 250 450 220 470 210 C470 240 480 260 470 300 Z M470 300 C480 240 510 230 520 220 C515 260 500 280 490 300 Z" fill="#1F5A48" />
      {/* lamp */}
      <path d="M300 760 L340 520 L420 470" stroke="#2A3550" strokeWidth={10} fill="none" />
      <path d="M390 450 L470 440 L460 500 Z" fill="#3A4560" />
      <polygon points="430,480 260,1080 900,1080" fill="url(#lamp)" />
    </svg>
    {/* the user, behind the laptop */}
    <Person who="user" t={s} talk={isTalking(s, L[0])} look={0.2} style={{position: 'absolute', left: 680, top: 150, width: 560, height: 728}} />
    <svg viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
      <ellipse cx={960} cy={560} rx={360} ry={260} fill="url(#glow)" />
      {/* laptop lid (back) */}
      <path d="M780 600 L1140 600 L1160 770 L760 770 Z" fill="#1C2438" stroke="#33405E" strokeWidth={3} />
      <circle cx={960} cy={680} r={14} fill="#2B3654" />
      <path d="M780 600 L1140 600" stroke={C.cyan} strokeWidth={3} opacity={0.6} />
      {/* desk */}
      <rect x={0} y={770} width={1920} height={40} fill="#161E31" />
      <rect x={0} y={810} width={1920} height={270} fill="#0D1424" />
      <rect x={1240} y={720} width={70} height={50} rx={8} fill="#22304E" />
      <path d="M1310 735 C1335 735 1335 760 1310 760" stroke="#22304E" strokeWidth={8} fill="none" />
    </svg>
  </AbsoluteFill>
);

// reverse angle: the browser, typing the address
const Browser: React.FC<{s: number}> = ({s}) => {
  const url = 'www.youtube.com';
  const typed = url.slice(0, Math.floor(keys(s, [5.9, 7.0], [0, url.length], (x) => x)));
  const loaded = ramp(s, 7.4, 8.2);
  return (
    <div style={{position: 'absolute', left: 160, top: 90, width: 1600, height: 900, borderRadius: 22, background: '#0F1626', border: '2px solid #2A3756', overflow: 'hidden', fontFamily: UI, boxShadow: `0 0 120px ${C.cyan}33`}}>
      <div style={{height: 64, background: '#151E33', display: 'flex', alignItems: 'center', gap: 12, padding: '0 24px'}}>
        {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <span key={c} style={{width: 16, height: 16, borderRadius: 8, background: c}} />)}
        <div style={{marginLeft: 24, padding: '10px 22px', background: '#0F1626', borderRadius: '12px 12px 0 0', color: C.white, fontSize: 20, alignSelf: 'flex-end'}}>{loaded > 0.5 ? 'YouTube' : 'New Tab'}</div>
      </div>
      <div style={{height: 76, display: 'flex', alignItems: 'center', padding: '0 24px', borderBottom: '2px solid #1E2944'}}>
        <div style={{flex: 1, height: 50, borderRadius: 25, background: '#1A2440', display: 'flex', alignItems: 'center', padding: '0 26px', gap: 14, fontFamily: MONO, fontSize: 26, color: C.white}}>
          <svg width={20} height={22} viewBox="0 0 20 22"><rect x={2} y={9} width={16} height={12} rx={3} fill={C.green} /><path d="M6 9 V6 a4 4 0 0 1 8 0 V9" stroke={C.green} strokeWidth={2.5} fill="none" /></svg>
          <span style={{color: C.mute}}>https://</span>{typed}<span style={{opacity: s < 7.2 && Math.floor(s * 2) % 2 ? 1 : 0, color: C.cyan}}>|</span>
        </div>
      </div>
      <div style={{padding: 40, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32}}>
        {Array.from({length: 6}, (_, i) => {
          const o = ramp(s, 7.4 + i * 0.08, 7.9 + i * 0.08);
          return (
            <div key={i} style={{opacity: 0.25 + 0.75 * o}}>
              <div style={{height: 250, borderRadius: 16, background: o > 0.5 ? `linear-gradient(135deg, ${['#3A2A6E', '#1E4A7A', '#5A2A3A', '#1E5A5A', '#2A3A6E', '#4A3A2A'][i]}, #121A2E)` : '#1A2440', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                {o > 0.5 ? <div style={{width: 0, height: 0, borderLeft: '34px solid rgba(255,255,255,0.85)', borderTop: '21px solid transparent', borderBottom: '21px solid transparent', marginLeft: 8}} /> : null}
              </div>
              <div style={{height: 18, width: '80%', borderRadius: 9, background: '#243154', marginTop: 18}} />
              <div style={{height: 14, width: '50%', borderRadius: 7, background: '#1C2846', marginTop: 12}} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const S01Screen: React.FC = () => {
  const s = useSec();
  const roomZoom = keys(s, [0, 5.6], [1, 1.35]);
  const screenZoom = keys(s, [5.2, 8.6, 9.6], [0.92, 1.02, 7]);
  const title = ramp(s, L[3].end + 0.3, L[3].end + 1.3);
  return (
    <Stage>
      <Shot s={s} from={0} to={5.8} fade={0.4}>
        <AbsoluteFill style={{scale: String(roomZoom), transformOrigin: '50% 62%'}}><Room s={s} /></AbsoluteFill>
      </Shot>
      <Shot s={s} from={5.4} to={9.6} fade={0.4}>
        <AbsoluteFill style={{background: '#05080F', scale: String(screenZoom), transformOrigin: '50% 45%'}}><Browser s={s} /></AbsoluteFill>
      </Shot>
      <Shot s={s} from={9.1} to={30} fade={0.6}>
        <AbsoluteFill style={{scale: String(keys(s, [9.1, 12, 24], [1.8, 1.05, 0.95])), opacity: 1 - 0.55 * title}}>
          <NetWorld t={s} density={keys(s, [9, 12.5, 14], [0.6, 0.6, 1.3])} highlightUser={1} />
        </AbsoluteFill>
        <Reveal s={s} at={L[2].at + 0.2} out={L[3].end + 0.1} style={{position: 'absolute', left: 96, top: 90}}>
          <Kicker>DATA TRAVELS AS PACKETS</Kicker>
        </Reveal>
        <Reveal s={s} at={L[3].at + 0.3} out={L[3].end + 0.1} style={{position: 'absolute', left: 96, top: 140}}>
          <div style={{fontFamily: DISPLAY, fontSize: 54, fontWeight: 700, color: C.white}}>What is actually moving through the network?</div>
        </Reveal>
      </Shot>
      {title > 0 ? (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
          <div style={{opacity: title, scale: String(0.94 + 0.06 * title), letterSpacing: 4 + 26 * (1 - title)}}>
            <div style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 170, color: C.white, letterSpacing: 'inherit', textShadow: `0 0 60px ${C.blue}AA`}}>DPI ENGINE</div>
            <div style={{width: 520 * title, height: 3, margin: '18px auto', background: `linear-gradient(90deg, transparent, ${C.cyan}, transparent)`}} />
            <div style={{fontFamily: UI, fontWeight: 500, fontSize: 44, color: C.cyan, letterSpacing: 10}}>DEEP PACKET INSPECTION SYSTEM</div>
          </div>
        </AbsoluteFill>
      ) : null}
      <Speaker s={s} line={L[0]} />
      <Cue at={5.9} name="type" volume={0.5} />
      <Cue at={6.5} name="type" volume={0.5} />
      <Cue at={7.2} name="tap" volume={0.6} />
      <Cue at={8.7} name="whoosh1" volume={0.5} />
      <Cue at={9.3} name="scan" volume={0.35} />
      <Cue at={L[3].end + 0.3} name="impact" volume={0.5} />
    </Stage>
  );
};
