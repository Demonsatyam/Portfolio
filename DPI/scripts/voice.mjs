// Regenerates narration + dialogue (macOS `say`), src/timing.json (every line's start/length per scene)
// and out/dpi-engine.srt. Usage: node scripts/voice.mjs [--skip-say]
// ponytail: on-device macOS voices; for a studio VO drop sXX_YY.wav files into public/vo and rerun with --skip-say.
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';

const VOICES = {N: ['Aman', 168], U: ['Daniel', 178], E: ['Tara', 172], A: ['Samantha', 176]}; // narrator, user, engineer, admin
const skipSay = process.argv.includes('--skip-say');
const FPS = 30;
const LEAD = 0.6; // picture before the first line
const GAP = 0.35; // between lines
const TAIL = 1.4; // after the last line
const TRANS = 12; // crossfade frames between scenes
const MIN = [24, 30, 29, 26, 48, 46, 22, 33, 44, 27, 28]; // brief's scene lengths (s)

const scenes = [];
for (const raw of fs.readFileSync('scripts/narration.txt', 'utf8').split('\n')) {
  if (raw.startsWith('#')) scenes.push({name: raw.slice(1).trim(), lines: []});
  else if (raw.trim()) {
    const m = raw.match(/^([NUEA])(?:\+([\d.]+))?\|\s*(.+)$/);
    if (!m) throw new Error('bad line: ' + raw);
    scenes.at(-1).lines.push({who: m[1], pre: +(m[2] ?? 0), text: m[3]});
  }
}

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

fs.mkdirSync('public/vo', {recursive: true});
const out = scenes.map((sc, i) => {
  let t = LEAD;
  const lines = sc.lines.map((l, j) => {
    const file = `vo/s${String(i + 1).padStart(2, '0')}_${String(j + 1).padStart(2, '0')}.wav`;
    const [voice, rate] = VOICES[l.who];
    if (!skipSay) execFileSync('say', ['-v', voice, '-r', String(rate), '--data-format=LEI16@44100', '-o', 'public/' + file, l.text]);
    const dur = wavSeconds('public/' + file);
    t += l.pre;
    const line = {who: l.who, file, at: Math.round(t * FPS), dur: Math.round(dur * FPS), text: l.text};
    t += dur + GAP;
    return line;
  });
  return {name: sc.name, frames: Math.round(Math.max(MIN[i] ?? 0, t - GAP + TAIL) * FPS), lines};
});

let at = 0;
for (const s of out) { s.start = at; at += s.frames - TRANS; }
const total = at + TRANS;
fs.writeFileSync('src/timing.json', JSON.stringify({fps: FPS, trans: TRANS, scenes: out, total}, null, 1));

// subtitles: each line split into sentence chunks, timed by character share
const ts = (f) => { const ms = Math.round((f / FPS) * 1000); const p = (n, w = 2) => String(n).padStart(w, '0'); return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`; };
const WHO = {N: '', U: 'USER: ', E: 'ENGINEER: ', A: 'ADMIN: '};
let n = 0, srt = '';
for (const s of out) for (const l of s.lines) {
  const chunks = l.text.match(/[^.?!]+[.?!]*/g).map((c) => c.trim()).filter(Boolean);
  const total = chunks.reduce((a, c) => a + c.length, 0);
  let f = s.start + l.at;
  for (const c of chunks) {
    const d = (l.dur * c.length) / total;
    srt += `${++n}\n${ts(f)} --> ${ts(f + d)}\n${WHO[l.who]}${c.replace('four four three', '443')}\n\n`;
    f += d;
  }
}
fs.mkdirSync('out', {recursive: true});
fs.writeFileSync('out/dpi-engine.srt', srt);
console.log(out.map((s, i) => `s${i + 1}: ${(s.frames / FPS).toFixed(1)}s  vo ends ${((s.lines.at(-1).at + s.lines.at(-1).dur) / FPS).toFixed(1)}s`).join('\n'));
console.log(`total ${(total / FPS).toFixed(1)}s`);
