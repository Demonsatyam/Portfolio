import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { skills } from "@/data/portfolio";

export function Skills() {
  const all = skills.flatMap((s) => s.items);
  return (
    <section id="skills" className="py-28">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading eyebrow="Toolbox" title="Backend first. Mobile too." />
      </div>
      <div aria-hidden className="mb-16 overflow-hidden border-y border-line py-6 [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
        <div className="marquee flex w-max gap-12 font-display text-4xl font-semibold tracking-tight text-(--marquee) md:text-6xl">
          {[...all, ...all].map((s, i) => (
            <span key={i}>{s}</span>
          ))}
        </div>
      </div>
      <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:grid-cols-2 lg:grid-cols-5">
        {skills.map((g, i) => (
          <Reveal key={g.group} delay={i * 0.06} className="rounded-2xl border border-line bg-surface p-5">
            <h3 className="mb-4 font-medium">{g.group}</h3>
            <ul className="flex flex-wrap gap-1.5">
              {g.items.map((s) => (
                <li key={s} className="rounded-md border border-line px-2 py-1 text-xs text-muted">{s}</li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
