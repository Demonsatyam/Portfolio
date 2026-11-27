# DPI Engine — explainer film (Remotion)

```bash
npm i
npm run dev                                   # Remotion Studio: DPIEngine + one composition per scene
node scripts/voice.mjs                        # regenerate narration/dialogue, src/timing.json, out/dpi-engine.srt
node scripts/music.mjs                        # regenerate score + SFX to the new timings
npx remotion render DPIEngine out/dpi-engine.mp4 --codec=h264
npx remotion render DPIEngine out/dpi-engine-4k.mp4 --codec=h264 --scale=2   # optional 4K
```

Script: `scripts/narration.txt` (`N|` narrator, `U|` user, `E|` engineer, `A|` admin, `+0.5` = pause before the line).
Storyboard and accuracy notes: `STORYBOARD.md`. Scenes: `src/scenes/S01…S11`. Shared parts: `src/cast/`.
