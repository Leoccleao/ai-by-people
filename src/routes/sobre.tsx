import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Section } from "@/components/PageShell";
import { ContactSection } from "@/components/ContactForm";
import { ProgramCTA, ProgramHero, SectionHead } from "@/components/ProgramParts";
import { Reveal } from "@/hooks/use-reveal";
import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre — AI by People" },
      {
        name: "description",
        content:
          "AI by People é uma organização sem fins lucrativos. O programa Corporate é pago e financia integralmente Soberania, Escolas, Formação de Formadores e o Índice.",
      },
      { property: "og:title", content: "Sobre — AI by People" },
      { property: "og:description", content: "Uma organização sem fins lucrativos que desenvolve pessoas." },
      { property: "og:url", content: "/sobre" },
    ],
    links: [{ rel: "canonical", href: "/sobre" }],
  }),
  component: Page,
});

function Page() {
  const { t } = useI18n();
  const p = t.pages.about;

  return (
    <PageShell>
      <ProgramHero eyebrow={p.eyebrow} headline={p.headline} sub={p.sub} />

      {/* Model */}
      <Section className="py-14 md:py-20 border-t border-rule">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <Reveal>
              <div className="text-[11px] uppercase tracking-[0.3em] text-accent font-mono mb-6">
                {p.modelKicker}
              </div>
            </Reveal>
          </div>
          <div className="md:col-span-7">
            <Reveal delay={80}>
              <p className="font-serif text-[clamp(1.35rem,2.4vw,1.85rem)] leading-[1.4] text-ink">
                {p.modelBody}
              </p>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Funding */}
      <section className="border-t border-rule bg-paper-elev">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <SectionHead kicker={p.fundingKicker} title={p.fundingTitle} />
          <ul className="mt-10 divide-y divide-rule border-y border-rule">
            {p.funding.map((f, i) => (
              <Reveal key={i} delay={i * 60}>
                <li className="py-5 grid grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[220px_minmax(0,1fr)] gap-4 md:gap-10 items-baseline">
                  <div className="flex items-baseline gap-4 min-w-0">
                    <span className="font-mono text-xs text-accent shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-serif text-lg md:text-xl text-ink truncate">{f.t}</span>
                  </div>
                  <p className="text-ink-muted leading-relaxed col-span-2 md:col-span-1">{f.b}</p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Origin */}
      <Section className="py-14 md:py-20 border-t border-rule">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <Reveal>
              <div className="text-[11px] uppercase tracking-[0.3em] text-accent font-mono mb-6">
                {p.originKicker}
              </div>
            </Reveal>
          </div>
          <div className="md:col-span-7">
            <Reveal delay={80}>
              <p className="font-serif text-[clamp(1.35rem,2.4vw,1.85rem)] leading-[1.4] text-ink">
                {p.originBody}
              </p>
            </Reveal>
          </div>
        </div>
      </Section>

      <ProgramCTA label={p.cta} />
      <ContactSection />
    </PageShell>
  );
}
