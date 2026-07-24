import { Link, createFileRoute } from "@tanstack/react-router";
import { PageShell, Section } from "@/components/PageShell";
import { ContactSection } from "@/components/ContactForm";
import {
  Callout,
  NumberedGrid,
  ProgramCTA,
  ProgramHero,
  SectionHead,
} from "@/components/ProgramParts";
import { Reveal } from "@/hooks/use-reveal";
import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/soberania_/formacao")({
  head: () => ({
    meta: [
      { title: "SoberanIA · Formação profissional — AI by People" },
      {
        name: "description",
        content:
          "Programa intensivo para estudantes STEM que ensina a stack completa de IA generativa: APIs de LLM, embeddings, RAG, agentes, fine-tuning, avaliação/observabilidade e deploy.",
      },
      { property: "og:title", content: "SoberanIA · Formação profissional — AI by People" },
      {
        property: "og:description",
        content: "Engenharia de agentes com IA generativa — nível produção.",
      },
      { property: "og:url", content: "/soberania/formacao" },
    ],
    links: [{ rel: "canonical", href: "/soberania/formacao" }],
  }),
  component: Page,
});

function Page() {
  const { t } = useI18n();
  const p = t.pages.sovereigntyTraining;

  return (
    <PageShell>
      <ProgramHero eyebrow={p.eyebrow} headline={p.headline} sub={p.sub} note={p.note} />

      {/* What it is */}
      <Section className="py-16 md:py-20 border-t border-rule">
        <SectionHead kicker={p.meaningKicker} title={p.meaningTitle} />
        <Reveal delay={160}>
          <p className="mt-8 max-w-2xl text-lg text-ink-muted leading-relaxed">{p.meaningBody}</p>
        </Reveal>
        <NumberedGrid items={p.meaning} cols={3} />
      </Section>

      {/* Technical curriculum */}
      <section className="border-t border-rule bg-paper-elev">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <SectionHead kicker={p.currKicker} title={p.currTitle} sub={p.currSub} />
          <div className="mt-16 space-y-px bg-rule border border-rule">
            {p.modules.map((m, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="bg-paper p-8 md:p-12 grid md:grid-cols-12 gap-8">
                  <div className="md:col-span-3">
                    <div className="font-mono text-xs text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <h3 className="font-serif text-[1.5rem] md:text-[1.85rem] text-ink mt-3 leading-tight">
                      {m.t}
                    </h3>
                  </div>
                  <div className="md:col-span-4">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-ink-muted mb-3">
                      {p.learnLabel}
                    </div>
                    <p className="text-ink-muted leading-relaxed">{m.learn}</p>
                  </div>
                  <div className="md:col-span-5 space-y-6">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-ink-muted mb-3">
                        {p.buildLabel}
                      </div>
                      <p className="text-ink leading-relaxed">{m.build}</p>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-accent mb-3">
                        {p.passLabel}
                      </div>
                      <p className="text-ink leading-relaxed">{m.pass}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Evaluation */}
      <Section className="py-16 md:py-20 border-t border-rule">
        <SectionHead kicker={p.evalKicker} title={p.evalTitle} sub={p.evalSub} />
        <NumberedGrid items={p.evalCards} cols={4} />
        <Reveal delay={160}>
          <p className="mt-16 max-w-2xl font-serif text-[clamp(1.15rem,2vw,1.5rem)] leading-[1.4] text-ink">
            {p.evalClose}
          </p>
        </Reveal>
      </Section>

      {/* Final portfolio */}
      <Section className="py-16 md:py-20 border-t border-rule">
        <SectionHead kicker={p.portKicker} title={p.portTitle} />
        <Reveal delay={120}>
          <ul className="mt-12 max-w-2xl space-y-4">
            {p.portfolio.map((it, i) => (
              <li key={i} className="flex gap-4 items-baseline text-lg text-ink">
                <span className="font-mono text-xs text-accent shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </Reveal>
        <div className="mt-14">
          <Callout>{p.portCallout}</Callout>
        </div>
      </Section>

      <ProgramCTA label={p.cta} />
      <div className="mx-auto max-w-6xl px-6 pb-14 -mt-6 text-center">
        <Link
          to="/soberania/empresas"
          className="inline-block text-sm text-ink hover:text-accent border-b border-rule hover:border-accent pb-0.5"
        >
          {p.companiesLink}
        </Link>
      </div>
      <ContactSection />
    </PageShell>
  );
}
