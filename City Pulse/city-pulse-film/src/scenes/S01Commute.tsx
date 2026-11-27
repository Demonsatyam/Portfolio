import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Cue, keys, lerp, ramp, useSec} from '../anim';
import {Commuter} from '../cast/Commuter';
import {Street} from '../cast/Street';
import {MiniMap, Phone} from '../cast/UI';
import {alongPoly, HOME, ISO, mixView, ROUTE_NORMAL, TOP} from '../city/city';
import {IsoCity} from '../city/IsoCity';
import {C, DISPLAY, UI} from '../theme';

// 0–3.2 aerial sunrise push-in · 3.2–5.8 street: phone + helmet · 5.8–7.4 phone close-up, route draws · 7.4– phone map opens into the city
export const S01Commute: React.FC = () => {
  const s = useSec();
  const skyline = (
    <AbsoluteFill style={{background: `linear-gradient(180deg, #1B2D52 0%, #6B6A8E 38%, #F0A46E 62%, ${C.navy2} 63%)`}} />
  );
  return (
    <AbsoluteFill style={{background: C.navy}}>
      {s < 3.2 ? (
        <>
          {skyline}
          <IsoCity
            view={ISO}
            cam={{x: lerp(10, HOME[0] + 3, ramp(s, 0, 3.2)), y: lerp(10, HOME[1] - 3, ramp(s, 0, 3.2)), zoom: keys(s, [0, 3.2], [0.95, 1.45])}}
            t={s + 4}
            sun={keys(s, [0, 3.2], [1, 0.75])}
            density={keys(s, [0, 3], [0.25, 0.8])}
          />
          <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(255,170,110,0.18), rgba(0,0,0,0) 45%)'}} />
        </>
      ) : null}

      {s >= 3.2 && s < 5.8 ? (
        <>
          <Street x={(s - 3.2) * 40} sun={0.85} />
          <Commuter
            pose="standing"
            phone={keys(s, [3.4, 3.9, 4.5, 4.8], [0, 1, 1, 0])}
            helmet={keys(s, [4.7, 5.4], [0, 1])}
            style={{position: 'absolute', left: 520, top: 380, width: 760, height: 690, scale: keys(s, [3.2, 5.8], [1, 1.06])}}
          />
        </>
      ) : null}

      {s >= 5.8 && s < 7.4 ? (
        <AbsoluteFill style={{background: `radial-gradient(circle at 50% 45%, #1A2A4A, ${C.night})`}}>
          <Phone style={{left: 750, top: 110, scale: keys(s, [5.8, 7.0, 7.4], [1.0, 1.08, 2.6]), opacity: keys(s, [7.2, 7.4], [1, 0])}}>
            <MiniMap w={392} h={832} S={17} cx={9.75} cy={9.75} routes={[{pts: ROUTE_NORMAL, color: C.blue, progress: ramp(s, 6.0, 7.0)}]} you={HOME} />
            <div style={{position: 'absolute', left: 18, right: 18, top: 70, background: 'rgba(12,19,34,0.92)', borderRadius: 22, padding: '18px 22px', color: C.white, fontFamily: UI}}>
              <div style={{fontSize: 18, color: C.mute, fontWeight: 600}}>Daily route</div>
              <div style={{fontFamily: DISPLAY, fontSize: 30, fontWeight: 700, marginTop: 4}}>Home → Office</div>
            </div>
          </Phone>
        </AbsoluteFill>
      ) : null}

      {s >= 7.4 ? (
        <>
          <AbsoluteFill style={{background: C.navy2}} />
          <IsoCity
            view={mixView(TOP, ISO, ramp(s, 7.4, 8.6))}
            cam={{x: 9.75, y: 9.75, zoom: keys(s, [7.4, 9], [0.95, 1.12])}}
            t={s + 4}
            sun={0.55}
            density={0.85}
            routes={[{pts: ROUTE_NORMAL, color: C.blue, width: 8}]}
            overlay={(pr) => {
              const [x, y] = pr(alongPoly(ROUTE_NORMAL, ramp(s, 7.6, 9.2, (v) => v) * 0.06));
              return (
                <g transform={`translate(${x} ${y})`}>
                  <circle r={26} fill={C.blue} opacity={0.25} />
                  <circle r={13} fill={C.white} />
                  <circle r={8} fill={C.blue} />
                </g>
              );
            }}
          />
        </>
      ) : null}

      <Cue at={0} name="whoosh2" volume={0.25} />
      <Cue at={3.2} name="whoosh1" volume={0.35} />
      <Cue at={5.3} name="engine" volume={0.55} />
      <Cue at={5.8} name="whoosh3" volume={0.3} />
      <Cue at={6.0} name="blip" volume={0.4} />
      <Cue at={7.4} name="whoosh2" volume={0.35} />
    </AbsoluteFill>
  );
};
