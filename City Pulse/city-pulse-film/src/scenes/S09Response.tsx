import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Cue, INOUT, keys, lerp, ramp, Reveal, useSec} from '../anim';
import {Commuter} from '../cast/Commuter';
import {ControlRoom, Personnel} from '../cast/Officer';
import {Street} from '../cast/Street';
import {Kicker} from '../cast/UI';
import {C, DISPLAY, UI} from '../theme';

const ROWS: [string, string, string?][] = [
  ['Type', 'Road accident · 2 vehicles'],
  ['Location', 'Ring Road flyover, northbound'],
  ['Severity', 'High', C.red],
  ['Evidence', '4 reports · 2 photos · 1 video'],
  ['Detected', '07:48 · verified 07:50'],
  ['Affected roads', '3 nearby (predicted)', C.amber],
];

export const S09Response: React.FC = () => {
  const s = useSec();
  const split = ramp(s, 2.4, 3.2, INOUT);
  const leftW = lerp(1920, 960, split);
  const alert = ramp(s, 3.6, 4.0);
  const card = ramp(s, 4.3, 4.8);
  const reach = keys(s, [7.6, 8.4], [0, 1]);
  const pressed = ramp(s, 8.5, 8.7);
  const go = ramp(s, 9.0, 12.2, (v) => v);
  return (
    <AbsoluteFill style={{background: C.night}}>
      {/* right: traffic control room */}
      <div style={{position: 'absolute', left: 960, top: 0, width: 960, height: 1080, overflow: 'hidden'}}>
        <ControlRoom t={s} alert={alert} reach={reach} look={ramp(s, 4.6, 5.2)} />
        {/* field team markers moving in on the wall map (officer-assigned) */}
        <svg width={960} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
          {[
            [180, 520],
            [640, 470],
          ].map(([x0, y0], i) => (
            <g key={i} opacity={ramp(s, 9.0, 9.3)}>
              <Personnel x={lerp(x0, 405 + (i ? 30 : -30), go)} y={lerp(y0, 350, go)} s={1.1} />
            </g>
          ))}
        </svg>
        <div style={{position: 'absolute', left: 60, top: 40, opacity: alert, translate: `0 ${(1 - alert) * -20}px`, display: 'flex', alignItems: 'center', gap: 14, background: '#3E1414', border: `2px solid ${C.red}`, borderRadius: 14, padding: '10px 18px', fontFamily: UI, fontWeight: 700, fontSize: 22, color: '#FFB3B3', letterSpacing: 1}}>
          <span style={{width: 12, height: 12, borderRadius: 6, background: C.red}} />
          INCOMING · VERIFIED INCIDENT
        </div>
        {/* incident report on the officer's console */}
        <div style={{position: 'absolute', right: 36, bottom: 228, width: 500, opacity: card, translate: `0 ${(1 - card) * 40}px`, background: 'rgba(12,19,34,0.97)', border: '2px solid #2C3F66', borderRadius: 26, padding: '24px 28px', fontFamily: UI, color: C.white, boxShadow: '0 30px 70px rgba(0,0,0,0.6)'}}>
          <div style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 30}}>Incident report</div>
          <div style={{fontSize: 16, color: C.mute, marginTop: 2, marginBottom: 12}}>Demo data · ID CP-0412</div>
          {ROWS.map(([k, v, col], i) => (
            <div key={k} style={{display: 'flex', justifyContent: 'space-between', gap: 16, padding: '9px 0', borderTop: '1px solid #22314F', opacity: ramp(s, 4.6 + i * 0.35, 4.9 + i * 0.35)}}>
              <span style={{fontSize: 20, color: C.mute}}>{k}</span>
              <span style={{fontSize: 21, fontWeight: 600, color: col ?? C.white, textAlign: 'right'}}>{v}</span>
            </div>
          ))}
          <div style={{marginTop: 16, borderRadius: 14, padding: '14px 0', textAlign: 'center', fontWeight: 700, fontSize: 21, background: pressed > 0.5 ? '#163A2A' : C.teal, color: pressed > 0.5 ? C.green : C.navy, border: `2px solid ${pressed > 0.5 ? C.green : C.teal}`, scale: String(1 - 0.04 * Math.sin(pressed * Math.PI))}}>
            {pressed > 0.5 ? '✓ Response coordinated by officer' : 'Coordinate response'}
          </div>
        </div>
      </div>

      {/* left: the commuter, now on the green route */}
      <div style={{position: 'absolute', left: 0, top: 0, width: leftW, height: 1080, overflow: 'hidden', borderRight: split > 0 ? `4px solid ${C.night}` : 'none'}}>
        <Street x={s * 520} sun={0.65} slice />
        <Commuter pose="riding" t={s} moving screenGlow={C.green} style={{position: 'absolute', left: leftW / 2 - 350, top: 420, width: 700, height: 633}} />
        <Reveal s={s} at={0.8} style={{position: 'absolute', left: 80, top: 80}}>
          <Kicker color={C.green}>COMMUTERS INFORMED</Kicker>
        </Reveal>
      </div>
      <Reveal s={s} at={3.8} style={{position: 'absolute', left: 1020, top: 110}}>
        <Kicker color="#FF8A8A">AUTHORITIES ALERTED</Kicker>
      </Reveal>

      {/* earlier response */}
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 210, background: 'linear-gradient(180deg, rgba(7,13,26,0), rgba(7,13,26,0.92) 45%)', opacity: ramp(s, 9.0, 9.5)}} />
      <Reveal s={s} at={9.1} style={{position: 'absolute', left: 80, bottom: 78}}>
        <div style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 64, color: C.white}}>EARLIER RESPONSE</div>
      </Reveal>
      <Reveal s={s} at={9.7} style={{position: 'absolute', left: 80, bottom: 36}}>
        <div style={{fontFamily: UI, fontWeight: 500, fontSize: 28, color: C.mute}}>City Pulse informs. People decide.</div>
      </Reveal>

      <Cue at={2.4} name="whoosh1" volume={0.3} />
      <Cue at={3.6} name="alert" volume={0.4} />
      {ROWS.map((_, i) => <Cue key={i} at={4.6 + i * 0.35} name="blip" volume={0.18} />)}
      <Cue at={8.5} name="tap" volume={0.5} />
      <Cue at={8.6} name="confirm" volume={0.45} />
    </AbsoluteFill>
  );
};
