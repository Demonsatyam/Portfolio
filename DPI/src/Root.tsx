import React from 'react';
import {Composition, Folder} from 'remotion';
import {Contact} from './Contact';
import {Film, SCENES} from './Film';
import {T} from './theme';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="DPIEngine" component={Film} width={1920} height={1080} fps={T.fps} durationInFrames={T.total} />
    <Folder name="Scenes">
      {SCENES.map((sc, i) => (
        <Composition key={sc.id} id={sc.id} component={sc.component} width={1920} height={1080} fps={T.fps} durationInFrames={T.scenes[i].frames} />
      ))}
    </Folder>
    <Composition id="Contact" component={Contact} width={1920} height={1080} fps={T.fps} durationInFrames={T.total} defaultProps={{tiles: [[0, 1.5]] as [number, number][]}} />
  </>
);
