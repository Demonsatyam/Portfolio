import { Reveal } from "@/components/motion/Reveal";
import { Reel } from "@/components/reel/Reel";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { projects } from "@/data/portfolio";

const reelLabels = {
  identity: "Animation: records from five sources merge into one customer profile while query time drops from 450 to 120 milliseconds.",
  dpi: "Animation: network packets pass through a classifier and are sorted into protocol lanes.",
  citypulse: "Animation: an AI agent plans, calls tools and retrieves documents before answering a traffic question.",
};

export function Work() {
  return (
    <section id="work" className="px-4 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Selected work" title="Systems, in motion." />
        <div className="space-y-24">
          {projects.map((p, i) => (
            <article key={p.id} className="grid items-center gap-10 md:grid-cols-12">
              <Reveal className={`md:col-span-7 ${i % 2 ? "md:order-2" : ""}`}>
                <div className="overflow-hidden rounded-3xl border border-line transition-transform duration-500 hover:-translate-y-1">
                  <Reel id={p.id} label={reelLabels[p.id]} />
                </div>
              </Reveal>
              <Reveal delay={0.1} className="md:col-span-5">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                  0{i + 1} · {p.tag}
                </p>
                <h3 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">{p.title}</h3>
                <p className="mt-4 text-muted">{p.blurb}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {p.metrics.map((m) => (
                    <li key={m} className="rounded-full bg-accent/10 px-3 py-1 text-sm text-[#a9c3ff]">{m}</li>
                  ))}
                </ul>
                <p className="mt-6 font-mono text-xs text-muted">{p.stack.join("  /  ")}</p>
              </Reveal>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
