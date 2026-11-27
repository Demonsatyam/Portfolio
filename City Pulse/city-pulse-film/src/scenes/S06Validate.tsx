import React from 'react';
import {AbsoluteFill, interpolateColors} from 'remotion';
import {Cue, keys, ramp, useSec} from '../anim';
import {IncidentPhoto} from '../cast/UI';
import {C, DISPLAY, UI} from '../theme';

const STEPS: [string, number][] = [['DETECT', 0.4], ['CROSS-CHECK', 2.6], ['VALIDATE', 5.8], ['CONFIRM', 10.3]];

const Row: React.FC<{ok: boolean | 'info'; on: number; children: React.ReactNode; extra?: React.ReactNode}> = ({ok, on, children, extra}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 16, height: 58, opacity: on, translate: `${(1 - on) * 30}px 0`, fontFamily: UI, fontSize: 28, fontWeight: 600, color: ok === false ? '#C9D1DF' : C.white}}>
    <div style={{width: 36, height: 36, borderRadius: 18, flexShrink: 0, background: ok === true ? C.cyan : ok === 'info' ? C.blue : '#4A5570', display: 'flex', alignItems: 'center', justifyContent: 'center', color: ok === true ? C.navy : C.white, fontWeight: 800, fontSize: 21}}>{ok === true ? '✓' : ok === 'info' ? 'i' : '✕'}</div>
    <span style={{flex: 1}}>{children}</span>
    {extra}
  </div>
);

export const S06Validate: React.FC = () => {
  const s = useSec();
  const verified = ramp(s, 10.4, 10.9);
  const rejected = ramp(s, 8.0, 8.5);
  const speed = keys(s, [7.0, 7.8], [0, 1]);
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 70% 40%, #12213D 0%, ${C.night} 70%)`}}>
      {/* stepper */}
      <div style={{position: 'absolute', left: 120, top: 84, display: 'flex', alignItems: 'center', gap: 26}}>
        {STEPS.map(([w, at], i) => {
          const on = ramp(s, at, at + 0.4);
          const next = i < 3 ? ramp(s, STEPS[i + 1][1], STEPS[i + 1][1] + 0.4) : 0;
          const col = interpolateColors(on - next * 0.6, [0, 0.4, 1], ['#33425F', C.cyan, C.white]);
          return (
            <React.Fragment key={w}>
              {i ? <div style={{width: 70, height: 4, borderRadius: 2, background: on ? C.cyan : '#26324A', opacity: 0.4 + 0.6 * on}} /> : null}
              <div style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 56, letterSpacing: 1, color: i === 3 ? interpolateColors(verified, [0, 1], [col, C.red]) : col}}>{w}</div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Card A: a report that does not hold up */}
      <div style={{position: 'absolute', left: 120, top: 250, width: 760, borderRadius: 30, background: '#111B30', border: '2px solid #26365A', overflow: 'hidden', opacity: ramp(s, 0.8, 1.3) * (1 - rejected * 0.45), translate: `0 ${(1 - ramp(s, 0.8, 1.3)) * 50 + rejected * 30}px`, filter: `saturate(${1 - rejected * 0.8})`}}>
        <div style={{padding: '18px 30px', background: interpolateColors(rejected, [0, 1], ['#3A2A0C', '#2A3244']), color: interpolateColors(rejected, [0, 1], [C.amber, C.mute]), fontFamily: UI, fontWeight: 700, fontSize: 22, letterSpacing: 3}}>{rejected > 0.5 ? 'UNVERIFIED' : 'POTENTIAL INCIDENT'}</div>
        <div style={{padding: '24px 30px 30px'}}>
          <div style={{display: 'flex', gap: 24, alignItems: 'center'}}>
            <div style={{borderRadius: 14, overflow: 'hidden', flexShrink: 0}}><IncidentPhoto w={200} h={120} old /></div>
            <div>
              <div style={{fontFamily: DISPLAY, fontWeight: 700, fontSize: 38, color: C.white}}>Accident reported</div>
              <div style={{fontFamily: UI, fontSize: 26, color: C.mute, marginTop: 6}}>Single post · Lake Road</div>
            </div>
          </div>
          <div style={{marginTop: 20}}>
            <Row ok={false} on={ramp(s, 3.4, 3.8)}>Photo is two years old</Row>
            <Row ok={false} on={ramp(s, 4.8, 5.2)}>Location doesn’t match</Row>
            <Row ok={false} on={ramp(s, 6.0, 6.4)}>No slowdown in traffic data</Row>
            <Row ok={false} on={ramp(s, 7.0, 7.4)}>No other reports</Row>
          </div>
        </div>
        <div style={{position: 'absolute', right: 34, bottom: 40, rotate: '-8deg', scale: String(keys(s, [8.0, 8.25, 8.4], [1.6, 0.95, 1])), opacity: rejected, border: `5px solid ${C.mute}`, borderRadius: 14, padding: '8px 18px', fontFamily: DISPLAY, fontWeight: 800, fontSize: 34, color: C.mute, letterSpacing: 2}}>NO ALERT SENT</div>
      </div>

      {/* Card B: the flyover incident, corroborated */}
      <div style={{position: 'absolute', left: 1000, top: 250, width: 800, borderRadius: 30, background: '#111B30', border: `2px solid ${interpolateColors(verified, [0, 1], ['#26365A', C.red])}`, overflow: 'hidden', opacity: ramp(s, 1.2, 1.7), translate: `0 ${(1 - ramp(s, 1.2, 1.7)) * 50}px`}}>
        <div style={{padding: '18px 30px', background: interpolateColors(verified, [0, 1], ['#3A2A0C', '#3E1414']), color: interpolateColors(verified, [0, 1], [C.amber, '#FF8A8A']), fontFamily: UI, fontWeight: 700, fontSize: 22, letterSpacing: 3}}>{verified > 0.5 ? 'VERIFIED INCIDENT' : 'POTENTIAL INCIDENT'}</div>
        <div style={{padding: '24px 30px 30px'}}>
          <div style={{display: 'flex', gap: 24, alignItems: 'center'}}>
            <div style={{borderRadius: 14, overflow: 'hidden', flexShrink: 0}}><IncidentPhoto w={200} h={120} /></div>
            <div>
              <div style={{fontFamily: DISPLAY, fontWeight: 700, fontSize: 38, color: C.white}}>Accident</div>
              <div style={{fontFamily: UI, fontSize: 26, color: C.mute, marginTop: 6}}>Ring Road flyover</div>
            </div>
          </div>
          <div style={{marginTop: 20}}>
            <Row ok on={ramp(s, 3.0, 3.4)}>4 reports agree</Row>
            <Row ok on={ramp(s, 4.9, 5.3)}>Location confirmed</Row>
            <Row ok on={ramp(s, 6.2, 6.6)}>Photo and video evidence</Row>
            <Row
              ok
              on={ramp(s, 7.0, 7.4)}
              extra={
                <svg width={150} height={46}>
                  <path d={`M4 10 L40 12 L70 ${12 + 22 * speed} L100 ${12 + 28 * speed} L146 ${12 + 30 * speed}`} fill="none" stroke={C.red} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
            >
              Traffic slowing
            </Row>
            <Row ok="info" on={ramp(s, 7.6, 8.0)}>Weather: light rain</Row>
          </div>
        </div>
        <div style={{position: 'absolute', right: 34, top: 74, scale: String(keys(s, [10.4, 10.65, 10.8], [1.6, 0.95, 1])), opacity: verified, display: 'flex', alignItems: 'center', gap: 12, background: C.red, borderRadius: 16, padding: '10px 20px', fontFamily: DISPLAY, fontWeight: 800, fontSize: 34, color: C.white, letterSpacing: 2}}>
          <span style={{fontSize: 30}}>✓</span> VERIFIED
        </div>
      </div>

      {[3.0, 4.9, 6.2, 7.0].map((a) => <Cue key={a} at={a} name="blip" volume={0.3} />)}
      {[3.4, 4.8, 6.0, 7.0].map((a) => <Cue key={'x' + a} at={a + 0.05} name="tap" volume={0.25} />)}
      <Cue at={8.0} name="reject" volume={0.45} />
      <Cue at={10.4} name="confirm" volume={0.55} />
    </AbsoluteFill>
  );
};
