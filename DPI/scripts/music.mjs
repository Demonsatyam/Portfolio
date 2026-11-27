// Synthesises the score (public/audio/music.wav) and SFX (public/audio/sfx/*.wav), no deps.
// Section boundaries come from src/timing.json so the music follows the narration.
// ponytail: procedural electronic score; drop a licensed track at public/audio/music.wav to replace it.
import fs from 'node:fs';

const SR = 44100;
const T = JSON.parse(fs.readFileSync('src/timing.json', 'utf8'));
const sec = (f) => f / T.fps;
const start = T.scenes.map((s) => sec(s.start));
const st = (i) => start[i];
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
const BPM = 100, beat = 60 / BPM, bar = beat * 4;
const Dm = [['D2', 'A2', 'F3', 'C4', 'E4'], ['Bb1', 'F2', 'D3', 'A3', 'C4'], ['F2', 'C3', 'A3', 'E4'], ['C2', 'G2', 'E3', 'G3', 'D4']];
const sections = [
  // opening: atmospheric, mysterious
  {a: 0, b: st(1) + 0.6, chords: [['D2', 'A2', 'E3', 'F3', 'C4'], ['Bb1', 'F2', 'C3', 'D3', 'A3']], pad: 0.24, arp: 0, kick: 0, pulse: 0, piano: 0.35},
  // packet + firewall: subtle electronic pulse
  {a: st(1), b: st(3) + 0.6, chords: Dm, pad: 0.18, arp: 0.07, kick: 0, pulse: 0.45, piano: 0},
  // architecture + journey: rhythmic
  {a: st(3), b: st(5) + 0.6, chords: Dm, pad: 0.16, arp: 0.15, kick: 0.3, pulse: 0, piano: 0},
  // inspection + classification: focused, lighter
  {a: st(5), b: st(7) + 0.6, chords: [['G1', 'D2', 'Bb2', 'F3', 'A3'], ['D2', 'A2', 'F3', 'C4'], ['Eb2', 'Bb2', 'G3', 'D4'], ['A1', 'E2', 'C#3', 'G3']], pad: 0.18, arp: 0.11, kick: 0, pulse: 0.3, piano: 0},
  // blocking: short dramatic tension
  {a: st(7), b: st(8) + 0.6, chords: [['D2', 'A2', 'D3', 'F3'], ['Eb2', 'Bb2', 'Eb3', 'G3'], ['D2', 'A2', 'D3', 'F3'], ['C#2', 'G#2', 'E3', 'A3']], pad: 0.2, arp: 0, kick: 0.22, pulse: 0.6, piano: 0},
  // multithreading: energetic, futuristic
  {a: st(8), b: st(9) + 0.6, chords: Dm, pad: 0.15, arp: 0.2, kick: 0.4, pulse: 0.12, piano: 0},
  // report
  {a: st(9), b: st(10) + 0.8, chords: [['F2', 'C3', 'A3', 'E4'], ['C2', 'G2', 'E3', 'D4'], ['D2', 'A2', 'F3', 'C4'], ['Bb1', 'F2', 'D3', 'A3']], pad: 0.18, arp: 0.1, kick: 0.2, pulse: 0, piano: 0},
  // ending: powerful but restrained
  {a: st(10), b: LEN, chords: [['D2', 'A2', 'F3', 'A3', 'E4'], ['Bb1', 'F2', 'D3', 'F3', 'C4'], ['F2', 'C3', 'A3', 'C4', 'G4'], ['C2', 'G2', 'E3', 'G3', 'D4']], pad: 0.27, arp: 0.06, kick: 0, pulse: 0, piano: 0.42},
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
// risers into the blocking scene and the multithreading scene
for (const [a, b] of [[st(7) - 2.5, st(7) + 0.2], [st(8) - 2.5, st(8) + 0.2]]) {
  let lp = 0;
  for (let i = Math.floor(a * SR); i < b * SR; i++) {
    const t = i / SR, p = (t - a) / (b - a);
    lp += (0.01 + 0.25 * p * p) * ((rnd() * 2 - 1) - lp);
    const v = lp * p * p * 0.3 + Math.sin(2 * Math.PI * (200 + 600 * p * p) * t) * p ** 3 * 0.035;
    L[i] += v; R[i] += v;
  }
}
// low server-room ambience under the opening and the NOC shots
{
  let b = 0, lp = 0;
  for (let i = 0; i < Math.floor((st(3) + 1) * SR); i++) {
    const t = i / SR; b = (b + 0.02 * (rnd() * 2 - 1)) * 0.995; lp += 0.05 * (b - lp);
    const v = (lp * 0.7 + Math.sin(2 * Math.PI * 60 * t) * 0.012 + Math.sin(2 * Math.PI * 120 * t) * 0.006) * env(t, 0, st(3) + 1, 2, 2);
    L[i] += v; R[i] += v * 0.92;
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
sfx('drop', 1.2, (t) => { const v = kick(t) * 0.7 + Math.sin(2 * Math.PI * (420 - 300 * Math.min(1, t / 0.4)) * t) * Math.exp(-t / 0.25) * 0.3; return [v, v]; });
sfx('type', 0.6, (t) => { const k = Math.floor(t / 0.075), tt = t - k * 0.075; const v = (rnd() * 2 - 1) * Math.exp(-tt / 0.006) * 0.35 + Math.sin(2 * Math.PI * (2200 + k * 90) * tt) * Math.exp(-tt / 0.01) * 0.15; return [v * (k % 2 ? 0.7 : 1), v * (k % 2 ? 1 : 0.7)]; });
sfx('queue', 0.5, (t) => [Math.sin(2 * Math.PI * 880 * t) * Math.exp(-t / 0.03) * 0.3 + Math.sin(2 * Math.PI * 1320 * (t - 0.09)) * (t > 0.09 ? Math.exp(-(t - 0.09) / 0.03) : 0) * 0.25]);
sfx('engine', 1.8, (() => { let ph = 0; return (t) => { const rpm = 38 + 30 * smooth(t / 0.6) - 8 * smooth((t - 0.8) / 0.8); ph += rpm / SR; const saw = ((ph % 1) * 2 - 1); const v = (saw * 0.25 + Math.sin(2 * Math.PI * ph * 2) * 0.2) * Math.min(1, t * 20) * (1 - smooth((t - 1.3) / 0.5)); return [v * 0.6, v * 0.5]; }; })());
console.log('wrote music.wav (' + LEN.toFixed(1) + 's) and sfx');
