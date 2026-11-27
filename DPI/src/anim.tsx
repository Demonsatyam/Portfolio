import React from 'react';
import {Audio} from '@remotion/media';
import {Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

export const OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const INOUT = Easing.bezier(0.65, 0, 0.35, 1);

// 0→1 between seconds a and b
export const ramp = (s: number, a: number, b: number, ease = OUT) => interpolate(s, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
// in at [a, a+d], out at [b-d, b]
export const win = (s: number, a: number, b: number, d = 0.4) => Math.min(ramp(s, a, a + d), 1 - ramp(s, b - d, b, INOUT));
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
// piecewise keyframes over seconds
export const keys = (s: number, times: number[], values: number[], ease = INOUT) => interpolate(s, times, values, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});

export const useSec = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return frame / fps;
};

export type Sfx = 'whoosh1' | 'whoosh2' | 'whoosh3' | 'notify' | 'confirm' | 'reject' | 'tap' | 'blip' | 'pop' | 'alert' | 'scan' | 'impact' | 'drop' | 'type' | 'queue';
// scene-local sound cue
export const Cue: React.FC<{at: number; name: Sfx; volume?: number}> = ({at, name, volume = 0.7}) => {
  const {fps} = useVideoConfig();
  return <Audio from={Math.round(at * fps)} src={staticFile(`audio/sfx/${name}.wav`)} volume={volume} />;
};

// a line of type that rises in from a mask (titles never drift after they land)
export const Reveal: React.FC<{s: number; at: number; out?: number; children: React.ReactNode; style?: React.CSSProperties; dist?: number}> = ({s, at, out, children, style, dist = 60}) => {
  const p = ramp(s, at, at + 0.55);
  const o = out === undefined ? 0 : ramp(s, out, out + 0.35, INOUT);
  return (
    <div style={{overflow: 'hidden', paddingBottom: 8, ...style}}>
      <div style={{translate: `0 ${(1 - p) * dist - o * dist * 0.4}px`, opacity: Math.min(p * 1.5, 1) * (1 - o)}}>{children}</div>
    </div>
  );
};
