import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { experience } from "@/data/portfolio";

export function Experience() {
  return (
    <section id="experience" className="px-4 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Experience" title="Where I ship." />
        <ol className="relative border-l border-line">
          {experience.map((e, i) => (
            <li key={e.role} className="relative pb-16 pl-8 last:pb-0 md:pl-12">
              <span className="absolute -left-[5px] top-2 size-[9px] rounded-full bg-accent shadow-[0_0_16px_var(--accent)]" />
              <Reveal delay={i * 0.05}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">{e.role}</h3>
                  <span className="font-mono text-sm text-muted">{e.period}</span>
                </div>
                <p className="mt-1 text-accent">{e.company}</p>
                <ul className="mt-6 grid gap-3 md:grid-cols-2">
                  {e.points.map((pt) => (
                    <li key={pt} className="rounded-2xl border border-line bg-surface p-4 text-sm leading-relaxed text-muted transition-colors hover:border-[#333] hover:text-fg">
                      {pt}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
