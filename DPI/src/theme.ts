import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadTight} from '@remotion/google-fonts/InterTight';
import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';
import timing from './timing.json';

export const {fontFamily: UI} = loadInter('normal', {weights: ['400', '500', '600', '700'], subsets: ['latin']});
export const {fontFamily: DISPLAY} = loadTight('normal', {weights: ['500', '600', '700', '800'], subsets: ['latin']});
export const {fontFamily: MONO} = loadMono('normal', {weights: ['400', '500', '700'], subsets: ['latin']});

// Colour carries meaning: blue/cyan = data & inspection, purple = highlight/identified, green = forwarded, red = blocked/dropped.
export const C = {
  bg: '#070B16',
  navy: '#0C1426',
  panel: '#0F1A30',
  line: '#22335A',
  dim: '#3A4C74',
  mute: '#8E9DBB',
  white: '#FFFFFF',
  blue: '#2678FF',
  cyan: '#00D4FF',
  purple: '#795CFF',
  green: '#24D18B',
  red: '#FF4545',
  amber: '#FFB547',
};

export const T = timing;
export const FPS = timing.fps;
export type Line = {who: string; at: number; end: number; text: string};
// scene-local line timings in seconds, so visuals land on the words
export const lines = (scene: number): Line[] => T.scenes[scene].lines.map((l) => ({who: l.who, at: l.at / FPS, end: (l.at + l.dur) / FPS, text: l.text}));
