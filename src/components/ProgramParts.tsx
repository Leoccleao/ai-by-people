import { type ReactNode } from "react";
import { Reveal } from "@/hooks/use-reveal";

/** Eyebrow + serif headline + subhead — reused across all program pages. */
export function ProgramHero({
  eyebrow,
  headline,
  sub,
  note,
}: {
  eyebrow: string;
  headline: string;
  sub: string;
  note?: string;
}) {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-24 md:pt-32 pb-24 md:pb-32">
      <Reveal>
        <div className="text-[11px] uppercase tracking-[0.3em] text-accent font-mono mb-10">
          {eyebrow}
        </div>
      </Reveal>
      <Reveal delay={80}>
        <h1 className="font-serif font-normal text-[clamp(2.5rem,6.5vw,5.5rem)] leading-[1.03] tracking-[-0.02em] text-ink max-w-5xl">
          {headline}
        </h1>
      </Reveal>
      <Reveal delay={180}>
        <p className="mt-10 max-w-2xl text-[clamp(1.05rem,1.5vw,1.3rem)] leading-relaxed text-ink-muted font-serif italic">
          {sub}
        </p>
      </Reveal>
      {note && (
        <Reveal delay={280}>
          <p className="mt-10 max-w-2xl border-l-2 border-accent pl-5 text-sm text-ink-muted leading-relaxed">
            {note}
          </p>
        </Reveal>
      )}
    </div>
  );
}

/** Section header: small accent kicker + serif title. */
export function SectionHead({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <div className="max-w-4xl">
      <Reveal>
        <div className="text-[11px] uppercase tracking-[0.3em] text-accent font-mono mb-6">
          {kicker}
        </div>
      </Reveal>
      <Reveal delay={80}>
        <h2 className="font-serif text-[clamp(1.85rem,4.5vw,3.5rem)] leading-[1.05] tracking-tight text-ink">
          {title}
        </h2>
      </Reveal>
      {sub && (
        <Reveal delay={160}>
          <p className="mt-6 text-lg text-ink-muted leading-relaxed max-w-2xl">{sub}</p>
        </Reveal>
      )}
    </div>
  );
}

/** Numbered grid of items — used for reality, what, offers, engage, support, etc. */
export function NumberedGrid({
  items,
  cols = 2,
}: {
  items: { t: string; b: string }[];
  cols?: 2 | 3 | 4;
}) {
  const colCls =
    cols === 4
      ? "md:grid-cols-2 lg:grid-cols-4"
      : cols === 3
        ? "md:grid-cols-3"
        : "md:grid-cols-2";
  return (
    <div className={`mt-16 grid gap-x-12 gap-y-12 ${colCls}`}>
      {items.map((it, i) => (
        <Reveal key={i} delay={i * 70}>
          <div className="border-t-2 border-ink pt-6">
            <div className="font-mono text-xs text-accent mb-4">{String(i + 1).padStart(2, "0")}</div>
            <h3 className="font-serif text-[1.4rem] md:text-[1.6rem] leading-snug text-ink">{it.t}</h3>
            <p className="text-ink-muted mt-3 leading-relaxed max-w-[42ch]">{it.b}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/** Full-width dark callout on a hairline accent rule. */
export function Callout({ children }: { children: ReactNode }) {
  return (
    <Reveal>
      <div className="border-l-2 border-accent bg-paper-elev py-10 md:py-12 pl-8 md:pl-12 pr-6 md:pr-16 max-w-4xl">
        <p className="font-serif text-[clamp(1.25rem,2.4vw,1.85rem)] leading-[1.35] text-ink">
          {children}
        </p>
      </div>
    </Reveal>
  );
}

/** Editorial numeric stats row (four columns of big serif numerals). */
export function StatsRow({ items }: { items: { n: string; l: string }[] }) {
  return (
    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 border-t border-rule">
      {items.map((s, i) => (
        <Reveal key={i} delay={i * 60}>
          <div className="py-8 md:py-10 border-b border-rule md:border-b-0 md:border-r last:md:border-r-0 pr-4">
            <div className="font-serif text-[clamp(2rem,3.5vw,3rem)] leading-none text-ink">{s.n}</div>
            <p className="text-ink-muted text-sm mt-3 leading-snug">{s.l}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/** CTA anchor to /#contato. */
export function ProgramCTA({ label }: { label: string }) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-32 md:py-40 text-center border-t border-rule">
      <Reveal>
        <p className="font-serif text-[clamp(1.75rem,3.5vw,2.75rem)] leading-tight text-ink max-w-3xl mx-auto">
          {label}
        </p>
      </Reveal>
      <Reveal delay={120}>
        <a
          href="/#contato"
          className="mt-10 inline-block border border-ink bg-ink text-paper px-8 py-3.5 text-sm uppercase tracking-[0.2em] hover:bg-transparent hover:text-ink transition"
        >
          {label}
        </a>
      </Reveal>
    </div>
  );
}
