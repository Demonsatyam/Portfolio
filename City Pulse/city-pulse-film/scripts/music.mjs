// Synthesises the score (public/audio/music.wav) and SFX (public/audio/sfx/*.wav), no deps.
// Section boundaries come from src/timing.json so the music follows the narration.
// ponytail: procedural ambient score; drop a licensed track at public/audio/music.wav to replace it.
import fs from 'node:fs';

const SR = 44100;
const T = JSON.parse(fs.readFileSync('src/timing.json', 'utf8'));
const sec = (f) => f / T.fps;
const start = T.scenes.map((s) => sec(s.start));
const LEN = sec(T.total) + 0.5;

// ---------- helpers ----------
let seed = 1234567;
const rnd = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const midi = (m) => 440 * 2 ** ((m - 69) / 12);
const N = (name) => { const m = name.match(/^([A-G])(#|b)?(\d)$/); return 12 * (+m[3] + 1) + {C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11}[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0); };
const smooth = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
const env = (t, a, b, fadeIn = 1, fadeOut = 1) => smooth((t - a) / fadeIn) * (1 - smooth((t - (b - fadeOut)) / fadeOut));

function writeWav(path, L, R) {
  const n = L.length, buf = Buffer.alloc(44 + n * 4);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 4, 4); buf.write('WAVEfmt ', 8);
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(n * 4, 40);
  let peak = 0; for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
  const g = peak > 0.89 ? 0.89 / peak : 1; // keep true peak ≈ -1 dBFS
  for (let i = 0; i < n; i++) {
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * g)) * 32767), 44 + i * 4);
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * g)) * 32767), 46 + i * 4);
  }
  fs.writeFileSync(path, buf);
}

// soft pad voice: detuned saw-ish (few harmonics) through slow attack
const padSample = (f, t) => {
  let s = 0;
  for (const d of [-0.006, 0, 0.007]) for (let h = 1; h <= 4; h++) s += Math.sin(2 * Math.PI * f * (1 + d) * h * t + h) / (h * h);
  return s / 6;
};
// pluck: sine + soft 2nd/3rd harmonic, exponential decay
const pluck = (f, t, decay = 0.35) => (t < 0 ? 0 : Math.exp(-t / decay) * (Math.sin(2 * Math.PI * f * t) + 0.3 * Math.sin(4 * Math.PI * f * t) * Math.exp(-t / 0.08) + 0.12 * Math.sin(6 * Math.PI * f * t)) * Math.min(1, t * 400));
const kick = (t) => (t < 0 || t > 0.5 ? 0 : Math.sin(2 * Math.PI * (45 * t + 60 * 0.06 * (1 - Math.exp(-t / 0.06)))) * Math.exp(-t / 0.18) * Math.min(1, t * 800));

// ---------- score ----------
const n = Math.ceil(LEN * SR);
const L = new Float32Array(n), R = new Float32Array(n);
const BPM = 96, beat = 60 / BPM, bar = beat * 4;

const sA = 0, sB = start[1], sC = start[2], sD = start[5], sE = start[7], sF = start[10], end = LEN;
const sections = [
  // [from, to, chords(by bar), pad gain, arp gain, kick gain, pulse gain]
  {a: sA, b: sB + 0.6, chords: [['D3', 'A3', 'C#4', 'E4', 'F#4'], ['B2', 'F#3', 'A3', 'D4', 'E4'], ['G2', 'D3', 'F#3', 'B3', 'E4'], ['A2', 'E3', 'G3', 'C#4', 'E4']], pad: 0.22, arp: 0, kick: 0, pulse: 0, piano: 0.5},
  {a: sB, b: sC + 0.4, chords: [['B1', 'F#2', 'D3', 'C#4'], ['G1', 'D2', 'B2', 'F#3']], pad: 0.2, arp: 0, kick: 0, pulse: 0.5, piano: 0},
  {a: sC, b: sD + 0.6, chords: [['G2', 'D3', 'F#3', 'B3'], ['E2', 'B2', 'D3', 'F#3', 'G3'], ['D2', 'A2', 'C#3', 'E3', 'F#3'], ['A1', 'E2', 'G2', 'C#3', 'E3']], pad: 0.17, arp: 0.16, kick: 0.32, pulse: 0, piano: 0},
  {a: sD, b: sE + 0.4, chords: [['E2', 'B2', 'D3', 'G3'], ['C2', 'G2', 'B2', 'E3'], ['D2', 'A2', 'C#3', 'F#3'], ['B1', 'F#2', 'A2', 'D3']], pad: 0.17, arp: 0.2, kick: 0.38, pulse: 0.15, piano: 0},
  {a: sE, b: sF + 0.8, chords: [['D2', 'A2', 'F#3', 'A3', 'E4'], ['A1', 'E2', 'C#3', 'E3', 'A3'], ['B1', 'F#2', 'D3', 'F#3', 'B3'], ['G1', 'D2', 'B2', 'D3', 'F#3']], pad: 0.22, arp: 0.13, kick: 0.24, pulse: 0, piano: 0.3},
  {a: sF, b: end, chords: [['D2', 'A2', 'E3', 'F#3', 'A3', 'C#4']], pad: 0.26, arp: 0, kick: 0, pulse: 0, piano: 0.45},
];

for (const S of sections) {
  const i0 = Math.floor(S.a * SR), i1 = Math.min(n, Math.ceil(S.b * SR));
  const nBars = S.chords.length;
  let lp1 = 0, lp2 = 0;
  for (let i = i0; i < i1; i++) {
    const t = i / SR, lt = t - S.a;
    const e = env(t, S.a, S.b, 1.2, S === sections[sections.length - 1] ? 3.2 : 1.2);
    const chord = S.chords[Math.floor(lt / (bar * 2)) % nBars].map((x) => midi(N(x)));
    let pad = 0; for (const f of chord) pad += padSample(f, t);
    // slow-moving lowpass on the pad, opens over the section
    const cut = 0.04 + 0.05 * Math.sin(lt * 0.2) ** 2;
    lp1 += cut * (pad - lp1); lp2 += cut * (lp1 - lp2);
    let l = lp2 * S.pad, r = lp2 * S.pad;
    // arpeggio, 16ths
    if (S.arp) {
      const step = beat / 4, k = Math.floor(lt / step), tt = lt - k * step;
      const notes = [...chord.slice(1), ...chord.slice(1).map((f) => f * 2)];
      const pat = [0, 2, 1, 3, 4, 2, 5, 3];
      const f = notes[pat[k % 8] % notes.length] * 2;
      const v = pluck(f, tt, 0.14) * S.arp * (k % 4 === 0 ? 1 : 0.65);
      const pan = Math.sin(k * 0.9) * 0.5;
      l += v * (1 - pan) * 0.6; r += v * (1 + pan) * 0.6;
    }
    if (S.kick) { const tb = lt % beat; const k = kick(tb) * S.kick; l += k; r += k; }
    if (S.kick) { const off = (lt + beat / 2) % beat; const h = off < 0.03 ? (rnd() * 2 - 1) * Math.exp(-off / 0.008) * 0.05 : 0; l += h * 0.7; r += h; }
    if (S.pulse) { // heartbeat-like low pulse
      const p = (lt % (beat * 2)) / (beat * 2); const pp = Math.exp(-((p - 0.0) % 1) * 9) + 0.6 * Math.exp(-Math.max(0, p - 0.18) * 11) * (p > 0.18 ? 1 : 0);
      const v = Math.sin(2 * Math.PI * 55 * t) * pp * S.pulse * 0.5; l += v; r += v;
    }
    if (S.piano) { // sparse piano-like notes on top
      const step = beat * 1.5, k = Math.floor(lt / step), tt = lt - k * step;
      const mel = chord.map((f) => f * 4); const f = mel[(k * 3) % mel.length];
      const v = (k % 3 === 2 ? 0 : 1) * pluck(f, tt, 0.9) * S.piano * 0.18;
      l += v * 0.8; r += v * 1.1;
    }
    L[i] += l * e; R[i] += r * e;
  }
}
// riser into the alert (end of predictive scene)
{
  const a = sE - 3, b = sE + 0.2; let lp = 0;
  for (let i = Math.floor(a * SR); i < b * SR; i++) {
    const t = i / SR, p = (t - a) / (b - a);
    lp += (0.01 + 0.25 * p * p) * ((rnd() * 2 - 1) - lp);
    const v = lp * p * p * 0.35 + Math.sin(2 * Math.PI * (200 + 600 * p * p) * t) * p ** 3 * 0.04;
    L[i] += v; R[i] += v;
  }
}
// ambience: low city rumble (s1–s2) and birds (s1)
{
  let b = 0, lp = 0;
  for (let i = 0; i < Math.floor((sC + 1) * SR); i++) {
    const t = i / SR; b = (b + 0.02 * (rnd() * 2 - 1)) * 0.995; lp += 0.05 * (b - lp);
    const v = lp * 0.9 * env(t, 0, sC + 1, 2, 1.5); L[i] += v; R[i] += v * 0.9;
  }
  for (let c = 0; c < 9; c++) { // chirps
    const t0 = 0.4 + c * 0.75 + rnd() * 0.4, pan = rnd();
    for (let j = 0; j < 3; j++) {
      const ts = t0 + j * 0.11, f0 = 3000 + rnd() * 1500;
      for (let i = Math.floor(ts * SR); i < (ts + 0.07) * SR; i++) {
        const tt = i / SR - ts; const v = Math.sin(2 * Math.PI * (f0 * tt + 9000 * tt * tt)) * Math.sin(Math.PI * tt / 0.07) * 0.025 * env(i / SR, 0, sB, 1, 2);
        L[i] += v * (1 - pan); R[i] += v * pan;
      }
    }
  }
}
// distant siren in the problem scene, very soft
{
  const a = sB + 5, b = sB + 10;
  for (let i = Math.floor(a * SR); i < b * SR; i++) {
    const t = i / SR; const f = 700 + 180 * Math.sin(2 * Math.PI * 0.45 * t);
    const v = Math.sin(2 * Math.PI * f * t + 3 * Math.sin(2 * Math.PI * 0.45 * t)) * 0.012 * env(t, a, b, 1.5, 2);
    L[i] += v * 0.4; R[i] += v;
  }
}
fs.mkdirSync('public/audio/sfx', {recursive: true});
writeWav('public/audio/music.wav', L, R);

// ---------- SFX ----------
const sfx = (name, dur, fn) => {
  const m = Math.ceil(dur * SR), l = new Float32Array(m), r = new Float32Array(m);
  for (let i = 0; i < m; i++) { const [a, b] = fn(i / SR, i); l[i] = a; r[i] = b ?? a; }
  writeWav(`public/audio/sfx/${name}.wav`, l, r);
};
const whoosh = (dur, f0, f1, panFrom, panTo) => { let s1 = 0, s2 = 0; return (t) => { const p = t / dur; const cf = (f0 + (f1 - f0) * p) / SR; s1 += cf * 6 * ((rnd() * 2 - 1) - s1); s2 += cf * 6 * (s1 - s2); const v = (s1 - s2) * Math.sin(Math.PI * p) ** 2 * 1.6; const pan = panFrom + (panTo - panFrom) * p; return [v * (1 - pan), v * pan]; }; };
sfx('whoosh1', 0.7, whoosh(0.7, 300, 2400, 0.2, 0.8));
sfx('whoosh2', 0.9, whoosh(0.9, 1800, 250, 0.8, 0.3));
sfx('whoosh3', 0.6, whoosh(0.6, 500, 3200, 0.5, 0.5));
const bell = (f, t, d) => (t < 0 ? 0 : (Math.sin(2 * Math.PI * f * t) + 0.25 * Math.sin(2 * Math.PI * f * 2.76 * t) * Math.exp(-t / 0.1)) * Math.exp(-t / d) * Math.min(1, t * 300));
sfx('notify', 1.4, (t) => [0.5 * (bell(midi(N('A5')), t, 0.35) + bell(midi(N('E6')), t - 0.13, 0.5))]);
sfx('confirm', 0.9, (t) => [0.4 * (bell(midi(N('D5')), t, 0.2) + bell(midi(N('F#5')), t - 0.08, 0.2) + bell(midi(N('A5')), t - 0.16, 0.35))]);
sfx('reject', 0.7, (t) => [0.35 * (bell(midi(N('E5')), t, 0.15) + bell(midi(N('B4')), t - 0.12, 0.25))]);
sfx('tap', 0.12, (t) => [Math.sin(2 * Math.PI * 1800 * t) * Math.exp(-t / 0.012) * 0.5 + (rnd() * 2 - 1) * Math.exp(-t / 0.004) * 0.3]);
sfx('blip', 0.15, (t) => [Math.sin(2 * Math.PI * (1400 + 2000 * t) * t) * Math.exp(-t / 0.03) * 0.35]);
sfx('pop', 0.2, (t) => [Math.sin(2 * Math.PI * (500 - 900 * t) * t) * Math.exp(-t / 0.05) * 0.6]);
sfx('alert', 1.6, (t) => [kick(t) * 0.8 + 0.3 * (bell(midi(N('C#5')), t - 0.05, 0.4) + bell(midi(N('G5')), t - 0.05, 0.4))]);
sfx('scan', 1.6, (t) => { const v = Math.sin(2 * Math.PI * (600 + 900 * t) * t) * 0.06 * Math.sin(Math.PI * t / 1.6) * (0.6 + 0.4 * Math.sin(2 * Math.PI * 14 * t)); return [v, v]; });
sfx('impact', 3.5, (() => { let lp = 0; return (t) => { lp += 0.02 * ((rnd() * 2 - 1) - lp); const v = kick(t) * 0.9 + Math.sin(2 * Math.PI * 36 * t) * Math.exp(-t / 0.9) * 0.4 + lp * Math.exp(-t / 0.6) * 0.8 + 0.12 * bell(midi(N('D6')), t, 1.4) + 0.08 * bell(midi(N('A6')), t - 0.03, 1.4); return [v, v]; }; })());
sfx('engine', 1.8, (() => { let ph = 0; return (t) => { const rpm = 38 + 30 * smooth(t / 0.6) - 8 * smooth((t - 0.8) / 0.8); ph += rpm / SR; const saw = ((ph % 1) * 2 - 1); const v = (saw * 0.25 + Math.sin(2 * Math.PI * ph * 2) * 0.2) * Math.min(1, t * 20) * (1 - smooth((t - 1.3) / 0.5)); return [v * 0.6, v * 0.5]; }; })());
console.log('wrote music.wav (' + LEN.toFixed(1) + 's) and sfx');
