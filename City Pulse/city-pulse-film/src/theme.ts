import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadTight} from '@remotion/google-fonts/InterTight';
import timing from './timing.json';

export const {fontFamily: UI} = loadInter('normal', {weights: ['400', '500', '600', '700'], subsets: ['latin']});
export const {fontFamily: DISPLAY} = loadTight('normal', {weights: ['500', '600', '700', '800'], subsets: ['latin']});

// Colour carries meaning: blue/cyan = intelligence, amber = potential, red = verified danger, green = recommended.
export const C = {
  night: '#070D1A',
  navy: '#0B1426',
  navy2: '#111D33',
  charcoal: '#1A2130',
  slate: '#26324A',
  road: '#1C2840',
  line: '#33476B',
  white: '#F4F7FB',
  mute: '#8D9BB5',
  blue: '#4C8DFF',
  cyan: '#38D3F0',
  teal: '#2CC7A8',
  amber: '#F5A524',
  red: '#EF4B4B',
  green: '#2FCB6F',
  skin: '#B9785A',
  skinShade: '#9A5F45',
  jacket: '#2A7F8F',
  helmet: '#E9EEF5',
};

export const T = timing;
export const FPS = timing.fps;
export const LEAD = timing.lead;
