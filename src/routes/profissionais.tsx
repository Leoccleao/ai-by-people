import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, Section } from "@/components/PageShell";
import { ContactSection } from "@/components/ContactForm";
import { NumberedGrid, ProgramCTA, ProgramHero, SectionHead } from "@/components/ProgramParts";
import { Reveal } from "@/hooks/use-reveal";
import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/profissionais")({
  head: () => ({
    meta: [
      { title: "Formação Profissional — AI by People" },
      {
        name: "description",
        content:
          "Upskilling em IA pela função que a pessoa exerce: finanças, marketing, vendas, estratégia e operações, análise de dados e jurídico. Trabalho real, não curso genérico.",
      },
      { property: "og:title", content: "Formação Profissional — AI by People" },
      {
        property: "og:description",
        content: "Fluência em IA não é um assunto. É a sua função, feita de outro jeito.",
      },
      { property: "og:url", content: "/profissionais" },
    ],
    links: [{ rel: "canonical", href: "/profissionais" }],
  }),
  component: Page,
});

function Page() {
  const { t } = useI18n();
  const p = t.pages.professionals;

  return (
    <PageShell>
      <ProgramHero eyebrow={p.eyebrow} headline={p.headline} sub={p.sub} />

      {/* Argument */}
      <Section className="py-16 md:py-20 border-t border-rule">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <Reveal>
              <div className="text-[11px] uppercase tracking-[0.3em] text-accent font-mono mb-6">
                {p.argKicker}
              </div>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="font-serif text-[clamp(1.85rem,4vw,3rem)] leading-[1.05] tracking-tight text-ink">
                {p.argTitle}
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-7">
            <Reveal delay={160}>
              <p className="text-ink-muted text-lg leading-relaxed">{p.argBody}</p>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Pillars */}
      <section className="border-t border-rule bg-paper-elev">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <SectionHead kicker={p.pillarsKicker} title={p.pillarsTitle} sub={p.pillarsSub} />

          <div className="mt-16 grid md:grid-cols-2 gap-px bg-rule border border-rule">
            {p.pillars.map((pillar, i) => (
              <Reveal key={pillar.slug} delay={i * 60}>
                <Link
                  to="/profissionais/$pilar"
                  params={{ pilar: pillar.slug }}
                  className="group bg-paper hover:bg-paper-elev transition p-8 md:p-10 flex flex-col h-full"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-xs text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-ink-muted group-hover:text-accent transition text-lg">
                      →
                    </span>
                  </div>
                  <h3 className="font-serif text-[1.75rem] md:text-[2rem] text-ink group-hover:text-accent transition mt-6 leading-tight">
                    {pillar.nav}
                  </h3>
                  <p className="text-ink-muted mt-4 leading-relaxed max-w-[42ch] flex-1">
                    {pillar.blurb}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Method */}
      <Section className="py-16 md:py-20 border-t border-rule">
        <SectionHead kicker={p.methodKicker} title={p.methodTitle} />
        <NumberedGrid items={p.method} cols={3} />
      </Section>

      {/* Platform */}
      <section className="border-t border-rule bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <Reveal>
            <div className="text-[11px] uppercase tracking-[0.3em] text-accent font-mono mb-6">
              {p.platformKicker}
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="font-serif text-[clamp(1.85rem,4vw,3rem)] leading-[1.05] tracking-tight max-w-3xl">
              {p.platformTitle}
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-8 max-w-3xl text-paper/75 text-lg leading-relaxed">{p.platformBody}</p>
          </Reveal>
          <Reveal delay={240}>
            <Link
              to="/plataforma"
              className="mt-10 inline-block border border-paper px-8 py-3.5 text-sm uppercase tracking-[0.2em] hover:bg-paper hover:text-ink transition"
            >
              {p.platformCta}
            </Link>
          </Reveal>
        </div>
      </section>

      <ProgramCTA label={p.cta} />
      <ContactSection />
    </PageShell>
  );
}
