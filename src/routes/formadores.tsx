import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Section } from "@/components/PageShell";
import { ContactSection } from "@/components/ContactForm";
import { NumberedGrid, ProgramCTA, ProgramHero, SectionHead } from "@/components/ProgramParts";
import { Reveal } from "@/hooks/use-reveal";
import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/formadores")({
  head: () => ({
    meta: [
      { title: "Formação de Formadores — AI by People" },
      {
        name: "description",
        content:
          "Formamos professores, coordenadores e facilitadores internos para conduzirem o método sozinhos. É assim que isso escala sem a gente na sala.",
      },
      { property: "og:title", content: "Formação de Formadores — AI by People" },
      { property: "og:description", content: "Um professor formado alcança 150 alunos por ano. Nós alcançamos um." },
      { property: "og:url", content: "/formadores" },
    ],
    links: [{ rel: "canonical", href: "/formadores" }],
  }),
  component: Page,
});

function Page() {
  const { t } = useI18n();
  const p = t.pages.trainers;

  return (
    <PageShell>
      <ProgramHero eyebrow={p.eyebrow} headline={p.headline} sub={p.sub} />

      {/* Argument + leverage numbers */}
      <Section className="py-16 md:py-20 border-t border-rule">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <Reveal>
              <div className="text-[11px] uppercase tracking-[0.3em] text-accent font-mono mb-6">
                {p.argKicker}
              </div>
            </Reveal>
            <Reveal delay={80}>
              <p className="font-serif text-[clamp(1.35rem,2.4vw,1.85rem)] leading-[1.4] text-ink">
                {p.argBody}
              </p>
            </Reveal>
          </div>
          <div className="md:col-span-7 md:pl-8 md:border-l border-rule">
            <div className="grid gap-10">
              {p.leverage.map((l, i) => (
                <Reveal key={i} delay={i * 120}>
                  <div>
                    <div className="font-serif text-[clamp(2.25rem,4.5vw,3.75rem)] leading-none tracking-tight text-ink">
                      {l.n}
                    </div>
                    <div className="mt-3 flex items-baseline gap-3 text-ink-muted">
                      <span className="font-mono text-xs text-accent">→</span>
                      <span className="text-lg leading-snug">{l.l}</span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* How it works */}
      <section className="border-t border-rule bg-paper-elev">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <SectionHead kicker={p.howKicker} title={p.howTitle} />
          <NumberedGrid items={p.how} cols={2} />
        </div>
      </section>

      {/* For whom */}
      <Section className="py-16 md:py-20 border-t border-rule">
        <SectionHead kicker={p.forKicker} title={p.forTitle} />
        <div className="mt-16 grid md:grid-cols-2 gap-px bg-rule border border-rule">
          {p.forWhom.map((f, i) => (
            <Reveal key={i} delay={i * 100}>
              <div className="bg-paper p-8 md:p-10 h-full">
                <div className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="font-serif text-[1.5rem] md:text-[1.85rem] text-ink mt-3 leading-tight">
                  {f.t}
                </h3>
                <p className="text-ink-muted mt-4 leading-relaxed">{f.b}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <ProgramCTA label={p.cta} />
      <ContactSection />
    </PageShell>
  );
}
