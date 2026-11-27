import React from 'react';
import {C, DISPLAY} from '../theme';

// City Pulse mark: a map pin whose inner line is a pulse trace (a road that "beats").
// `draw` 0..1 strokes the pulse; the wordmark is optional.
export const Mark: React.FC<{size: number; draw?: number; color?: string}> = ({size, draw = 1, color = C.cyan}) => (
  <svg width={size} height={size} viewBox="0 0 120 120">
    <path d="M60 112 C60 112 18 70 18 46 C18 22 37 6 60 6 C83 6 102 22 102 46 C102 70 60 112 60 112 Z" fill={C.navy} stroke={color} strokeWidth={5} />
    <path d="M30 48 L46 48 L53 32 L63 64 L71 40 L76 48 L90 48" fill="none" stroke={C.white} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${draw} 1`} />
  </svg>
);

export const Wordmark: React.FC<{size: number; style?: React.CSSProperties}> = ({size, style}) => (
  <div style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: size, letterSpacing: -size * 0.03, color: C.white, lineHeight: 1, ...style}}>
    City<span style={{color: C.cyan}}> Pulse</span>
  </div>
);
