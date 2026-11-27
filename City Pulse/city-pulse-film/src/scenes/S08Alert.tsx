import React from 'react';
import {AbsoluteFill, interpolateColors} from 'remotion';
import {Cue, INOUT, keys, ramp, Reveal, useSec} from '../anim';
import {Commuter} from '../cast/Commuter';
import {Street} from '../cast/Street';
import {Kicker, MiniMap, Phone} from '../cast/UI';
import {alongPoly, INCIDENT, ISO, mixView, NOW, ROUTE_ALT, ROUTE_REST, TOP} from '../city/city';
import {IsoCity} from '../city/IsoCity';
import {C, DISPLAY, UI} from '../theme';
import {IncidentMark} from './S02Problem';
import {spreadJams, Zone} from './S07Predict';

const Finger: React.FC<{x: number; y: number; on: number}> = ({x, y, on}) => (
  <div style={{position: 'absolute', left: x - 30, top: y - 30, width: 60, height: 60, borderRadius: 30, background: 'rgba(255,255,255,0.35)', border: '3px solid rgba(255,255,255,0.8)', opacity: on, scale: String(1.3 - 0.3 * on)}} />
);

export const S08Alert: React.FC = () => {
  const s = useSec();
  const alertIn = ramp(s, 1.8, 2.3);
  const alertOut = ramp(s, 4.6, 5.0, INOUT);
  const red = ramp(s, 4.9, 5.5);
  const alt = ramp(s, 6.8, 8.0, INOUT);
  const sheet = ramp(s, 7.2, 7.7);
  const chosen = ramp(s, 8.4, 8.6);
  const recalc = s > 8.6 && s < 9.2;
  const nav = ramp(s, 9.2, 9.5);
  const glow = s < 1.8 ? C.blue : s < 9.2 ? C.amber : C.green;

  return (
    <AbsoluteFill style={{background: C.night}}>
      {s < 10.1 ? (
        <>
          {/* left: the commuter, stopped at a red light, phone in its handlebar mount */}
          <div style={{position: 'absolute', left: 0, top: 0, width: 1040, height: 1080, overflow: 'hidden'}}>
            <Street x={2400} sun={0.6} signal={s < 9.3 ? 'red' : 'green'} slice />
            <Commuter pose="riding" t={s} moving={s > 9.5} screenGlow={glow} style={{position: 'absolute', left: 120, top: 420, width: 700, height: 633}} />
            <Reveal s={s} at={2.2} out={6.5} style={{position: 'absolute', left: 90, top: 90}}>
              <Kicker>PERSONALIZED ALERTS</Kicker>
            </Reveal>
            <Reveal s={s} at={6.9} style={{position: 'absolute', left: 90, top: 90}}>
              <Kicker color={C.green}>ALTERNATIVE ROUTES</Kicker>
            </Reveal>
          </div>
          {/* right: the phone */}
          <Phone style={{left: 1220, top: 110, scale: String(keys(s, [0, 9.7, 10.1], [1, 1.03, 2.8])), opacity: 1 - ramp(s, 9.95, 10.1)}} time="7:51">
            <MiniMap
              w={392} h={832} S={16} cx={11} cy={10.5}
              routes={[
                {pts: ROUTE_REST, color: interpolateColors(red, [0, 1], [C.blue, C.red]), opacity: 1 - nav * 0.7},
                {pts: ROUTE_ALT, color: C.green, progress: alt, width: 10},
              ]}
              zone={{at: INCIDENT, r: 3.2, color: C.red, opacity: red * 0.22}}
              incident={red > 0 ? {at: INCIDENT, color: C.red, r: 13} : null}
              you={NOW}
            />
            {/* header */}
            <div style={{position: 'absolute', left: 18, right: 18, top: 68, background: 'rgba(12,19,34,0.94)', borderRadius: 22, padding: '16px 22px', color: C.white, fontFamily: UI}}>
              <div style={{fontSize: 17, color: nav ? C.green : C.mute, fontWeight: 700}}>{recalc ? 'Recalculating…' : 'Navigating'}</div>
              <div style={{fontFamily: DISPLAY, fontSize: 28, fontWeight: 700, marginTop: 2}}>{nav > 0.5 ? 'Alternative route' : 'Usual route'}</div>
            </div>
            {/* notification */}
            <div style={{position: 'absolute', left: 14, right: 14, top: 64, translate: `0 ${(1 - alertIn) * -330 - alertOut * 360}px`, background: '#F7F8FB', borderRadius: 28, padding: '20px 22px 22px', fontFamily: UI, color: '#141B2B', boxShadow: '0 20px 50px rgba(0,0,0,0.5)'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 16, fontWeight: 800, letterSpacing: 2, color: '#B26B00'}}>
                <span style={{width: 26, height: 26, borderRadius: 8, background: C.amber, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#1A1206'}}>!</span>
                TRAFFIC ALERT · CITY PULSE
              </div>
              <div style={{fontFamily: DISPLAY, fontWeight: 700, fontSize: 25, lineHeight: 1.22, marginTop: 10}}>Potential disruption ahead on your daily route</div>
              <div style={{fontSize: 19, marginTop: 8, color: '#3B4660'}}>Accident reported near Ring Road flyover.</div>
              <div style={{fontSize: 17, marginTop: 4, color: '#6A7590'}}>Est. delay ~18 min · simulated</div>
              <div style={{marginTop: 14, background: '#13203A', color: C.white, borderRadius: 14, padding: '13px 0', textAlign: 'center', fontWeight: 700, fontSize: 20}}>View alternative route</div>
            </div>
            {/* comparison sheet */}
            <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, translate: `0 ${(1 - sheet) * 340 + nav * 340}px`, background: '#0E1628', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: '22px 22px 30px', fontFamily: UI, color: C.white}}>
              {[
                ['Usual route', '+18 min*', C.red, false],
                ['Alternative', '+3 min*', C.green, true],
              ].map(([name, d, col, rec]) => (
                <div key={name as string} style={{display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', borderRadius: 18, marginBottom: 12, background: rec ? interpolateColors(chosen, [0, 1], ['#16233D', '#163A2A']) : '#16233D', border: `2px solid ${rec ? interpolateColors(chosen, [0, 1], ['#2A3B5C', C.green]) : '#2A3B5C'}`}}>
                  <span style={{width: 14, height: 14, borderRadius: 7, background: col as string}} />
                  <span style={{flex: 1, fontSize: 21, fontWeight: 600}}>{name}{rec ? <span style={{display: 'block', fontSize: 14, color: C.green, fontWeight: 700, letterSpacing: 1}}>RECOMMENDED</span> : null}</span>
                  <span style={{fontFamily: DISPLAY, fontSize: 24, fontWeight: 700, color: col as string, whiteSpace: 'nowrap'}}>{d}</span>
                </div>
              ))}
              <div style={{fontSize: 15, color: C.mute}}>*Simulated demonstration data</div>
            </div>
            <Finger x={196} y={292} on={keys(s, [4.2, 4.4, 4.6], [0, 1, 0])} />
            <Finger x={196} y={714} on={keys(s, [8.2, 8.4, 8.6], [0, 1, 0])} />
          </Phone>
        </>
      ) : (
        // the phone map opens into the city: they ride the green route, around the red zone
        <IsoCity
          view={mixView(TOP, ISO, ramp(s, 10.1, 11.2))}
          cam={{x: keys(s, [10.1, 12], [11, 12]), y: keys(s, [10.1, 12], [13, 13.5]), zoom: keys(s, [10.1, 12], [1.0, 1.2])}}
          t={s + 52}
          sun={0.35}
          jams={spreadJams(1)}
          routes={[
            {pts: ROUTE_REST, color: C.red, width: 5, opacity: 0.35},
            {pts: ROUTE_ALT, color: C.green, width: 9},
          ]}
          overlay={(pr) => {
            const [x, y] = pr(alongPoly(ROUTE_ALT, keys(s, [10.1, 12], [0, 0.12], (v) => v)));
            return (
              <>
                <Zone pr={pr} r={4.8} opacity={0.9} />
                <IncidentMark p={pr(INCIDENT, 0.2)} s={s} color={C.red} />
                <g transform={`translate(${x} ${y})`}>
                  <circle r={26} fill={C.green} opacity={0.25} />
                  <circle r={13} fill={C.white} />
                  <circle r={8} fill={C.green} />
                </g>
              </>
            );
          }}
        />
      )}

      <Cue at={1.8} name="notify" volume={0.7} />
      <Cue at={4.4} name="tap" volume={0.5} />
      <Cue at={4.9} name="alert" volume={0.25} />
      <Cue at={6.8} name="whoosh3" volume={0.25} />
      <Cue at={8.4} name="tap" volume={0.5} />
      <Cue at={9.2} name="confirm" volume={0.5} />
      <Cue at={9.6} name="engine" volume={0.4} />
      <Cue at={10.0} name="whoosh2" volume={0.3} />
    </AbsoluteFill>
  );
};
