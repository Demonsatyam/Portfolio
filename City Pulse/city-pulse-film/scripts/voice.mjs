// Regenerates narration (macOS `say`) and src/timing.json (scene lengths fit to the voice).
// Usage: node scripts/voice.mjs [voice] [rate]
// ponytail: on-device macOS voice; swap for a studio/ElevenLabs/HeyGen VO by dropping s01..s11.wav into public/vo and rerunning with --skip-say.
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';

const [voice = 'Aman', rate = '170'] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const skipSay = process.argv.includes('--skip-say');
const FPS = 30;
const LEAD = 0.35; // seconds of picture before the voice starts in each scene
const TAIL = 0.55; // seconds after the voice ends
const MIN = [9, 9, 8, 12, 14, 11, 10, 12, 11, 8, 5]; // brief minimums, compressed to fit 120s // brief's minimum scene lengths (s), compressed slightly

const lines = fs.readFileSync('scripts/narration.txt', 'utf8').trim().split('\n');
fs.mkdirSync('public/vo', {recursive: true});

const wavSeconds = (file) => {
  const b = fs.readFileSync(file);
  let o = 12, rate = 0, align = 0;
  while (o < b.length) {
    const id = b.toString('ascii', o, o + 4), size = b.readUInt32LE(o + 4);
    if (id === 'fmt ') { rate = b.readUInt32LE(o + 12); align = b.readUInt16LE(o + 20); }
    if (id === 'data') return size / align / rate;
    o += 8 + size;
  }
  throw new Error('bad wav ' + file);
};

const scenes = lines.map((text, i) => {
  const file = `public/vo/s${String(i + 1).padStart(2, '0')}.wav`;
  if (!skipSay) execFileSync('say', ['-v', voice, '-r', rate, '--data-format=LEI16@44100', '-o', file, text]);
  const vo = wavSeconds(file);
  const dur = Math.max(MIN[i] ?? 0, LEAD + vo + TAIL);
  return {vo: Math.round(vo * FPS), frames: Math.round(dur * FPS)};
});

const TRANS = 10; // crossfade frames between scenes (scenes overlap by this much)
let at = 0;
for (const s of scenes) { s.start = at; at += s.frames - TRANS; }
const total = at + TRANS;
fs.writeFileSync('src/timing.json', JSON.stringify({fps: FPS, lead: Math.round(LEAD * FPS), trans: TRANS, scenes, total}, null, 2));
console.log(scenes.map((s, i) => `s${i + 1}: ${(s.frames / FPS).toFixed(1)}s (vo ${(s.vo / FPS).toFixed(1)}s)`).join('\n'));
console.log(`total ${(total / FPS).toFixed(1)}s`);
