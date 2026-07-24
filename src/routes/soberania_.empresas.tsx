import { createFileRoute } from "@tanstack/react-router";
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

export const Route = createFileRoute("/soberania_/empresas")({
  head: () => ({
    meta: [
      { title: "SoberanIA · Apoio empresarial — AI by People" },
      {
        name: "description",
        content:
          "Patrocine uma cohorte da SoberanIA: sua empresa propõe um desafio real, acompanha o Demo Day e ganha acesso a talentos de IA e entregas técnicas reutilizáveis.",
      },
      { property: "og:title", content: "SoberanIA · Apoio empresarial — AI by People" },
      {
        property: "og:description",
        content: "Apoie como empresa. Forme talentos de IA com impacto real.",
      },
      { property: "og:url", content: "/soberania/empresas" },
    ],
    links: [{ rel: "canonical", href: "/soberania/empresas" }],
  }),
  component: Page,
});

function Page() {
  const { t } = useI18n();
  const p = t.pages.sovereigntyCompanies;

  return (
    <PageShell>
      <ProgramHero eyebrow={p.eyebrow} headline={p.headline} sub={p.sub} />

      {/* Checklist */}
      <Section className="pb-14 md:pb-16">
        <Reveal>
          <ul className="max-w-2xl space-y-4 border-l-2 border-accent pl-6 md:pl-8">
            {p.checklist.map((it, i) => (
              <li key={i} className="flex gap-3 items-baseline text-ink leading-relaxed">
                <span className="text-accent shrink-0">·</span>
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      {/* What it means */}
      <Section className="py-16 md:py-20 border-t border-rule">
        <SectionHead kicker={p.meaningKicker} title={p.meaningTitle} />
        <div className="mt-8 max-w-2xl space-y-6">
          <Reveal delay={120}>
            <p className="text-lg text-ink-muted leading-relaxed">{p.meaningP1}</p>
          </Reveal>
          <Reveal delay={180}>
            <p className="text-lg text-ink-muted leading-relaxed">{p.meaningP2}</p>
          </Reveal>
        </div>
      </Section>

      {/* Sponsor a cohort */}
      <section className="border-t border-rule bg-paper-elev">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <SectionHead kicker={p.sponsorKicker} title={p.sponsorTitle} />
          <div className="mt-16 grid md:grid-cols-2 gap-px bg-rule border border-rule">
            {[
              { title: p.participateTitle, items: p.participate },
              { title: p.receiveTitle, items: p.receive },
            ].map((block, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="bg-paper p-8 md:p-10 h-full">
                  <h3 className="font-serif text-[1.5rem] md:text-[1.85rem] text-ink leading-tight">
                    {block.title}
                  </h3>
                  <ul className="mt-6 space-y-3 text-ink-muted">
                    {block.items.map((it, j) => (
                      <li key={j} className="flex gap-3 leading-relaxed">
                        <span className="text-accent shrink-0 mt-2 h-px w-3 bg-accent" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-14">
            <Callout>{p.callout}</Callout>
          </div>
        </div>
      </section>

      {/* Process */}
      <Section className="py-16 md:py-20 border-t border-rule">
        <SectionHead kicker={p.processKicker} title={p.processTitle} />
        <div className="mt-16 space-y-px bg-rule border border-rule">
          {p.steps.map((s, i) => (
            <Reveal key={i} delay={i * 70}>
              <div className="bg-paper p-6 md:p-8 grid md:grid-cols-12 gap-4 md:gap-8 items-baseline">
                <div className="md:col-span-1 font-mono text-xs text-accent">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="md:col-span-4 font-serif text-[1.25rem] md:text-[1.5rem] text-ink leading-tight">
                  {s.t}
                </h3>
                <p className="md:col-span-7 text-ink-muted leading-relaxed">{s.b}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Benefits */}
      <Section className="py-16 md:py-20 border-t border-rule">
        <SectionHead kicker={p.benefitsKicker} title={p.benefitsTitle} />
        <NumberedGrid items={p.benefits} cols={3} />
      </Section>

      <ProgramCTA label={p.cta} />
      <ContactSection />
    </PageShell>
  );
}
