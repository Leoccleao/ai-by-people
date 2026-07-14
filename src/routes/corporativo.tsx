import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Section } from "@/components/PageShell";
import { ContactSection } from "@/components/ContactForm";
import {
  Callout,
  NumberedGrid,
  ProgramCTA,
  ProgramHero,
  SectionHead,
  StatsRow,
} from "@/components/ProgramParts";
import { Reveal } from "@/hooks/use-reveal";
import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/corporativo")({
  head: () => ({
    meta: [
      { title: "Corporate — AI by People" },
      {
        name: "description",
        content:
          "Imersão presencial de 1 a 2 dias em torno de um caso de uso real do seu time. Sai um protótipo funcional e uma equipe capaz de mantê-lo. O único programa pago da AI by People — sua receita financia todos os outros.",
      },
      { property: "og:title", content: "Corporate — AI by People" },
      { property: "og:description", content: "Um caso real. Um protótipo funcional. Um time capaz de manter e evoluir." },
      { property: "og:url", content: "/corporativo" },
    ],
    links: [{ rel: "canonical", href: "/corporativo" }],
  }),
  component: Page,
});

function Page() {
  const { t } = useI18n();
  const p = t.pages.corporate;

  return (
    <PageShell>
      <ProgramHero eyebrow={p.eyebrow} headline={p.headline} sub={p.sub} note={p.fundingNote} />

      {/* Reality */}
      <Section className="py-32 md:py-40 border-t border-rule">
        <SectionHead kicker={p.realityKicker} title={p.realityTitle} />
        <NumberedGrid items={p.reality} cols={2} />
      </Section>

      {/* Phases */}
      <section className="border-t border-rule bg-paper-elev">
        <div className="mx-auto max-w-6xl px-6 py-32 md:py-40">
          <SectionHead kicker={p.phasesKicker} title={p.phasesTitle} />
          <div className="mt-16 space-y-px bg-rule border border-rule">
            {p.phases.map((ph, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="bg-paper p-8 md:p-12 grid md:grid-cols-12 gap-8">
                  <div className="md:col-span-3">
                    <div className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</div>
                    <h3 className="font-serif text-[1.75rem] md:text-[2.25rem] text-ink mt-3 leading-tight">
                      {ph.t}
                    </h3>
                  </div>
                  <div className="md:col-span-6">
                    <p className="text-ink-muted leading-relaxed">{ph.b}</p>
                  </div>
                  <div className="md:col-span-3">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-ink-muted mb-3">
                      Entregas · Deliverables
                    </div>
                    <ul className="space-y-1.5 text-sm text-ink">
                      {ph.deliverables.map((d, j) => (
                        <li key={j} className="flex gap-2">
                          <span className="text-accent">·</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-16">
            <StatsRow items={p.stats} />
          </div>
        </div>
      </section>

      {/* Callout */}
      <Section className="py-32 md:py-40 border-t border-rule">
        <Callout>{p.callout}</Callout>
      </Section>

      {/* Cases */}
      <Section className="py-32 md:py-40 border-t border-rule">
        <SectionHead kicker={p.casesKicker} title={p.casesTitle} />
        <div className="mt-16 grid md:grid-cols-2 gap-px bg-rule border border-rule">
          {p.cases.map((c, i) => (
            <Reveal key={i} delay={i * 100}>
              <article className="bg-paper p-8 md:p-10 h-full">
                <div className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="font-serif text-[1.5rem] md:text-[1.85rem] text-ink mt-3 leading-snug">
                  {c.t}
                </h3>
                <ul className="mt-6 space-y-3 text-ink-muted">
                  {c.items.map((it, j) => (
                    <li key={j} className="flex gap-3 leading-relaxed">
                      <span className="text-accent shrink-0 mt-2 h-px w-3 bg-accent" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Formats */}
      <Section className="py-32 md:py-40 border-t border-rule">
        <SectionHead kicker={p.formatsKicker} title={p.formatsTitle} />
        <NumberedGrid items={p.formats} cols={2} />
      </Section>

      <ProgramCTA label={p.cta} />
      <ContactSection />
    </PageShell>
  );
}
