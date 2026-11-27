import React from 'react';
import {Audio} from '@remotion/media';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {AbsoluteFill, interpolate, staticFile} from 'remotion';
import {S01Screen} from './scenes/S01Screen';
import {S02Packet} from './scenes/S02Packet';
import {S03Why} from './scenes/S03Why';
import {S04Architecture} from './scenes/S04Architecture';
import {S05Journey} from './scenes/S05Journey';
import {S06SNI} from './scenes/S06SNI';
import {S07Classify} from './scenes/S07Classify';
import {S08Block} from './scenes/S08Block';
import {S09Threads} from './scenes/S09Threads';
import {S10Report} from './scenes/S10Report';
import {S11Summary} from './scenes/S11Summary';
import {C, T} from './theme';

export const SCENES: {id: string; component: React.FC}[] = [
  {id: 'S01-Screen', component: S01Screen},
  {id: 'S02-Packet', component: S02Packet},
  {id: 'S03-Why', component: S03Why},
  {id: 'S04-Architecture', component: S04Architecture},
  {id: 'S05-Journey', component: S05Journey},
  {id: 'S06-SNI', component: S06SNI},
  {id: 'S07-Classify', component: S07Classify},
  {id: 'S08-Block', component: S08Block},
  {id: 'S09-Threads', component: S09Threads},
  {id: 'S10-Report', component: S10Report},
  {id: 'S11-Summary', component: S11Summary},
];

// music ducks under every spoken line, opens up in the gaps, fades at the end
const voWindows = T.scenes.flatMap((sc) => sc.lines.map((l) => [sc.start + l.at - 8, sc.start + l.at + l.dur + 8]));
const musicVolume = (f: number) => {
  const speaking = voWindows.some(([a, b]) => f >= a && f <= b);
  const end = interpolate(f, [T.total - 60, T.total - 10], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const start = interpolate(f, [0, 20], [0, 1], {extrapolateRight: 'clamp'});
  return (speaking ? 0.22 : 0.42) * end * start;
};

export const Film: React.FC = () => (
  <AbsoluteFill style={{background: C.bg}}>
    <TransitionSeries>
      {SCENES.flatMap(({id, component: Scene}, i) => [
        <TransitionSeries.Sequence key={id} name={T.scenes[i].name} durationInFrames={T.scenes[i].frames}>
          <Scene />
          {T.scenes[i].lines.map((l) => <Audio key={l.file} from={l.at} src={staticFile(l.file)} volume={1} />)}
        </TransitionSeries.Sequence>,
        i < SCENES.length - 1 ? <TransitionSeries.Transition key={id + '-t'} presentation={fade()} timing={linearTiming({durationInFrames: T.trans})} /> : null,
      ])}
    </TransitionSeries>
    <Audio src={staticFile('audio/music.wav')} volume={musicVolume} />
  </AbsoluteFill>
);
