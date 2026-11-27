import React from 'react';
import {Audio} from '@remotion/media';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {AbsoluteFill, interpolate, staticFile} from 'remotion';
import {S01Commute} from './scenes/S01Commute';
import {S02Problem} from './scenes/S02Problem';
import {S03Intro} from './scenes/S03Intro';
import {S04Sources} from './scenes/S04Sources';
import {S05Agents} from './scenes/S05Agents';
import {S06Validate} from './scenes/S06Validate';
import {S07Predict} from './scenes/S07Predict';
import {S08Alert} from './scenes/S08Alert';
import {S09Response} from './scenes/S09Response';
import {S10Ecosystem} from './scenes/S10Ecosystem';
import {S11Brand} from './scenes/S11Brand';
import {C, T} from './theme';

export const SCENES: {id: string; name: string; component: React.FC}[] = [
  {id: 'S01-Commute', name: '01 Everyday commute', component: S01Commute},
  {id: 'S02-Problem', name: '02 The problem', component: S02Problem},
  {id: 'S03-Intro', name: '03 Introducing City Pulse', component: S03Intro},
  {id: 'S04-Sources', name: '04 24/7 information gathering', component: S04Sources},
  {id: 'S05-Agents', name: '05 Multi-agent intelligence', component: S05Agents},
  {id: 'S06-Validate', name: '06 Incident validation', component: S06Validate},
  {id: 'S07-Predict', name: '07 Predictive intelligence', component: S07Predict},
  {id: 'S08-Alert', name: '08 Personalised alert', component: S08Alert},
  {id: 'S09-Response', name: '09 Smart city response', component: S09Response},
  {id: 'S10-Ecosystem', name: '10 Complete ecosystem', component: S10Ecosystem},
  {id: 'S11-Brand', name: '11 Brand reveal', component: S11Brand},
];

// music ducks under the voice, opens up in the gaps and fades at the end
const voWindows = T.scenes.map((sc) => [sc.start + T.lead - 6, sc.start + T.lead + sc.vo + 6]);
const musicVolume = (f: number) => {
  const speaking = voWindows.some(([a, b]) => f >= a && f <= b);
  const end = interpolate(f, [T.total - 45, T.total], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const start = interpolate(f, [0, 20], [0, 1], {extrapolateRight: 'clamp'});
  return (speaking ? 0.3 : 0.5) * end * start;
};

export const Film: React.FC = () => (
  <AbsoluteFill style={{background: C.night}}>
    <TransitionSeries>
      {SCENES.flatMap(({id, name, component: Scene}, i) => [
        <TransitionSeries.Sequence key={id} name={name} durationInFrames={T.scenes[i].frames}>
          <Scene />
          <Audio from={T.lead} src={staticFile(`vo/s${String(i + 1).padStart(2, '0')}.wav`)} volume={1} />
        </TransitionSeries.Sequence>,
        i < SCENES.length - 1 ? <TransitionSeries.Transition key={id + '-t'} presentation={fade()} timing={linearTiming({durationInFrames: T.trans})} /> : null,
      ])}
    </TransitionSeries>
    <Audio src={staticFile('audio/music.wav')} volume={musicVolume} />
  </AbsoluteFill>
);
