import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import { stats } from "@/data/portfolio";

export function Stats() {
  return (
    <section aria-label="Impact" className="border-y border-line px-4">
      <dl className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="border-line px-2 py-10 md:px-6 [&:not(:last-child)]:md:border-r">
            <dt className="sr-only">{s.label}</dt>
            <dd className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
              <CountUp to={s.value} decimals={s.decimals} suffix={s.suffix} />
            </dd>
            <dd className="mt-2 text-sm text-muted">{s.label}</dd>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}
