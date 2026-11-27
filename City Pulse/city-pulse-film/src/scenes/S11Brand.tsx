import React from 'react';
import {AbsoluteFill, Interactive} from 'remotion';
import {Cue, ramp, Reveal, useSec} from '../anim';
import {Mark, Wordmark} from '../cast/Logo';
import {TOP} from '../city/city';
import {IsoCity} from '../city/IsoCity';
import {C, DISPLAY} from '../theme';

export const S11Brand: React.FC = () => {
  const s = useSec();
  const out = ramp(s, 4.1, 5.0);
  return (
    <AbsoluteFill style={{background: C.night}}>
      <AbsoluteFill style={{opacity: 0.22 * (1 - out)}}>
        <IsoCity view={TOP} cam={{x: 10, y: 10, zoom: 0.5 + s * 0.02}} t={s + 90} net={1} night={1} density={0.6} buildingOpacity={0.4} />
      </AbsoluteFill>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: 1 - out}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 36}}>
          <div style={{scale: String(ramp(s, 0.2, 0.7))}}>
            <Mark size={170} draw={ramp(s, 0.35, 1.2)} />
          </div>
          <Reveal s={s} at={0.45} dist={140}>
            <Wordmark size={160} />
          </Reveal>
        </div>
        <Reveal s={s} at={1.45} style={{marginTop: 40}}>
          <Interactive.Div name="Tagline" style={{fontFamily: DISPLAY, fontWeight: 600, fontSize: 64, color: '#D7E2F5'}}>
            Know Before You Go.
          </Interactive.Div>
        </Reveal>
      </AbsoluteFill>
      <Cue at={0.3} name="impact" volume={0.55} />
    </AbsoluteFill>
  );
};
