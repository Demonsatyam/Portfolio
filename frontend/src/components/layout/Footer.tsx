import { Reveal } from "@/components/motion/Reveal";
import { profile } from "@/data/portfolio";

export function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden border-t border-line px-4 pt-28 pb-10">
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-1/2 h-[400px] w-[800px] -translate-x-1/2 translate-y-1/2 rounded-full bg-accent/25 blur-[140px]" />
      <div className="relative mx-auto max-w-6xl">
        <Reveal>
          <h2 className="font-display text-[clamp(2.5rem,8vw,7rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
            Let&apos;s build something
            <br />
            <span className="text-muted">that stays up.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="mt-12 flex flex-wrap gap-3">
          <a href={`mailto:${profile.email}`} className="rounded-full bg-fg px-6 py-3 font-medium text-bg transition hover:scale-[1.03] active:scale-95">
            {profile.email}
          </a>
          <a href={profile.github} target="_blank" rel="noreferrer" className="rounded-full border border-line px-6 py-3 transition hover:border-muted">GitHub ↗</a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="rounded-full border border-line px-6 py-3 transition hover:border-muted">LinkedIn ↗</a>
        </Reveal>
        <div className="mt-28 flex flex-wrap justify-between gap-4 border-t border-line pt-6 text-sm text-muted">
          <span>© {profile.name}</span>
          <span>{profile.location}</span>
        </div>
      </div>
    </footer>
  );
}
