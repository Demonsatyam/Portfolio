import React from 'react';
import {AbsoluteFill, Freeze} from 'remotion';
import {SCENES} from './Film';
import {T} from './theme';

// Dev-only review sheet: 3x3 frozen moments, tiles = [sceneIndex, secondsIntoScene][]
export const Contact: React.FC<{tiles: [number, number][]}> = ({tiles}) => (
  <AbsoluteFill style={{background: '#000', display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
    {tiles.map(([i, sec], k) => {
      const Scene = SCENES[i].component;
      return (
        <div key={k} style={{position: 'relative', width: 640, height: 360, overflow: 'hidden', outline: '1px solid #000'}}>
          <div style={{position: 'absolute', width: 1920, height: 1080, scale: String(1 / 3), transformOrigin: '0 0'}}>
            <Freeze frame={Math.round(sec * T.fps)}>
              <AbsoluteFill>
                <Scene />
              </AbsoluteFill>
            </Freeze>
          </div>
          <div style={{position: 'absolute', left: 6, top: 4, color: '#ff0', font: '700 16px monospace', textShadow: '0 0 4px #000'}}>{`S${i + 1} ${sec}s`}</div>
        </div>
      );
    })}
  </AbsoluteFill>
);
