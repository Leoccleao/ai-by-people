import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { PageShell, Section } from "./PageShell";
import { ContactSection } from "./ContactForm";
import { useI18n } from "@/i18n/I18nProvider";

type Item = { t: string; b: string };

export function ProgramPage(props: {
  kicker: string;
  title: string;
  hero: string;
  sub: string;
  argTitle: string;
  argBody: string;
  sectionKicker: string;
  sectionTitle: string;
  items: Item[];
  stats?: string[];
  cases?: Item[];
  callout?: { title: string; body: string };
  cta: string;
  extra?: ReactNode;
}) {
  const { t } = useI18n();
  return (
    <PageShell>
      {/* Hero */}
      <Section className="pt-20 pb-24">
        <div className="text-xs uppercase tracking-[0.2em] text-accent font-mono mb-6">
          {props.kicker}
        </div>
        <h1 className="font-serif text-5xl md:text-7xl leading-[1.02] tracking-tight text-ink max-w-4xl">
          {props.hero}
        </h1>
        <p className="text-ink/70 text-lg md:text-xl mt-8 max-w-2xl leading-relaxed">{props.sub}</p>
      </Section>

      <hr className="border-0 border-t border-rule mx-6 md:mx-auto md:max-w-6xl" />

      {/* Argument */}
      <Section className="py-24">
        <div className="grid md:grid-cols-12 gap-10">
          <h2 className="md:col-span-5 font-serif text-3xl md:text-4xl text-ink leading-snug">
            {props.argTitle}
          </h2>
          <p className="md:col-span-7 text-ink/75 text-lg leading-relaxed">{props.argBody}</p>
        </div>

        {props.callout && (
          <div className="mt-16 border-l-2 border-accent pl-6 py-2 max-w-3xl">
            <div className="font-serif text-2xl md:text-3xl text-ink italic">"{props.callout.title}"</div>
            <p className="text-ink/70 mt-3">{props.callout.body}</p>
          </div>
        )}

        {props.stats && (
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 border-t border-rule">
            {props.stats.map((s, i) => (
              <div key={i} className="py-6 border-b border-rule md:border-b-0 md:border-r last:border-r-0 pr-4 pl-1">
                <div className="text-sm text-ink/80 font-mono">{s}</div>
              </div>
            ))}
          </div>
        )}
      </Section>

      <hr className="border-0 border-t border-rule mx-6 md:mx-auto md:max-w-6xl" />

      {/* Items */}
      <Section className="py-24">
        <div className="text-xs uppercase tracking-[0.2em] text-accent font-mono mb-4">
          {props.sectionKicker}
        </div>
        <h2 className="font-serif text-3xl md:text-5xl text-ink max-w-3xl leading-tight">
          {props.sectionTitle}
        </h2>
        <div className="mt-14 grid gap-x-12 gap-y-10 md:grid-cols-2">
          {props.items.map((item, i) => (
            <div key={i} className="border-t border-rule pt-6">
              <div className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</div>
              <h3 className="font-serif text-2xl text-ink mt-2">{item.t}</h3>
              <p className="text-ink/70 mt-3 leading-relaxed">{item.b}</p>
            </div>
          ))}
        </div>
      </Section>

      {props.cases && (
        <>
          <hr className="border-0 border-t border-rule mx-6 md:mx-auto md:max-w-6xl" />
          <Section className="py-24">
            <div className="text-xs uppercase tracking-[0.2em] text-accent font-mono mb-4">
              {t.corporate.casesKicker}
            </div>
            <h2 className="font-serif text-3xl md:text-5xl text-ink max-w-3xl leading-tight">
              {t.corporate.casesTitle}
            </h2>
            <div className="mt-14 grid gap-8 md:grid-cols-2">
              {props.cases.map((c, i) => (
                <article key={i} className="border border-rule p-8 bg-paper-elev">
                  <h3 className="font-serif text-2xl text-ink">{c.t}</h3>
                  <p className="text-ink/70 mt-4 leading-relaxed">{c.b}</p>
                </article>
              ))}
            </div>
          </Section>
        </>
      )}

      {props.extra}

      {/* CTA */}
      <Section className="py-24 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="font-serif text-3xl md:text-4xl text-ink leading-tight">{props.cta}</p>
          <Link
            to="/"
            hash="contato"
            className="mt-8 inline-block border border-ink px-8 py-3 text-sm uppercase tracking-widest hover:bg-ink hover:text-paper transition"
          >
            {t.common.backToContact}
          </Link>
        </div>
      </Section>

      <ContactSection />
    </PageShell>
  );
}
