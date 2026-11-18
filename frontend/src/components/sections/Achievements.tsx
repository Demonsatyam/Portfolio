import { Reveal } from "@/components/motion/Reveal";
import { achievements } from "@/data/portfolio";

export function Achievements() {
  return (
    <section aria-labelledby="awards" className="px-4 pb-28">
      <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
        <h2 id="awards" className="sr-only">Achievements</h2>
        {achievements.map((a, i) => (
          <Reveal key={a.title} delay={i * 0.08} className="group relative overflow-hidden rounded-3xl border border-line bg-surface p-8">
            <div className="absolute -right-16 -top-16 size-40 rounded-full bg-accent-2/20 blur-3xl transition-opacity duration-500 group-hover:opacity-100 md:opacity-0" />
            <p className="font-mono text-sm text-muted">{a.year}</p>
            <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight">{a.title}</h3>
            <p className="mt-2 text-muted">{a.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
