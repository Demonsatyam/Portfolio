# Satyam Kumar Thakur — Portfolio

Next.js 16 · Tailwind 4 · Motion · Remotion Player

```bash
cd frontend
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Structure (`frontend/src`)

```
app/                    layout, page, global styles + design tokens
components/
  layout/               Nav, Footer
  sections/             Hero, Stats, Work, Experience, Skills, Achievements
  reel/                 Remotion Player wrappers (Reel, ReelPlayer, HeroShowreel)
  motion/               Motion primitives (Reveal, SplitText, CountUp, MotionProvider)
  ui/                   small shared UI (SectionHeading)
data/portfolio.ts       all text content: profile, projects, experience, skills
remotion/
  compositions/         one file per video (HeroReel, IdentityMerge, PacketPipeline, AgentTrace)
  registry.ts           id → composition, duration, reduced-motion still frame
  theme.ts, primitives.tsx, timeline.ts
```

Resume is served from `frontend/public/resume.pdf`.

Deploy: import the repo on Vercel and set **Root Directory** to `frontend`.
