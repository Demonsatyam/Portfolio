import { Reveal } from "@/components/motion/Reveal";

export function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <Reveal className="mb-14">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
      <h2 className="font-display text-[clamp(2rem,5vw,3.75rem)] font-semibold leading-none tracking-[-0.04em]">{title}</h2>
    </Reveal>
  );
}
