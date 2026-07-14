import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, Section } from "@/components/PageShell";
import { ContactSection } from "@/components/ContactForm";
import { NumberedGrid, ProgramCTA, ProgramHero, SectionHead } from "@/components/ProgramParts";
import { Reveal } from "@/hooks/use-reveal";
import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/escolas")({
  head: () => ({
    meta: [
      { title: "Escolas — AI by People" },
      {
        name: "description",
        content:
          "Fluência em IA no ensino médio e na universidade, com escolas e professores — não contra eles. Diagnóstico, workshops com alunos, formação de professores e redesenho da avaliação.",
      },
      { property: "og:title", content: "Escolas — AI by People" },
      { property: "og:description", content: "As escolas proibiram o ChatGPT. Depois desistiram. Nenhuma das duas coisas é uma estratégia." },
      { property: "og:url", content: "/escolas" },
    ],
    links: [{ rel: "canonical", href: "/escolas" }],
  }),
  component: Page,
});

function Page() {
  const { t } = useI18n();
  const p = t.pages.schools;

  return (
    <PageShell>
      <ProgramHero eyebrow={p.eyebrow} headline={p.headline} sub={p.sub} />

      {/* Argument */}
      <section className="border-y border-rule bg-paper-elev">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <Reveal>
            <div className="text-[11px] uppercase tracking-[0.3em] text-accent font-mono mb-14 text-center">
              {p.argKicker}
            </div>
          </Reveal>
          <div className="space-y-10 md:space-y-12">
            {p.argument.map((para, i) => (
              <Reveal key={i} delay={i * 120}>
                <p
                  className={`font-serif leading-[1.4] text-ink max-w-[48ch] mx-auto ${
                    i === 0
                      ? "text-[clamp(1.4rem,2.6vw,2rem)]"
                      : "text-[clamp(1.15rem,2vw,1.5rem)] text-ink-muted"
                  }`}
                >
                  {para}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* What */}
      <Section className="py-16 md:py-20">
        <SectionHead kicker={p.whatKicker} title={p.whatTitle} />
        <NumberedGrid items={p.what} cols={2} />
        <Reveal delay={200}>
          <p className="mt-10 text-sm text-ink-muted">
            <Link to="/formadores" className="underline decoration-accent/40 underline-offset-4 hover:decoration-accent">
              → {t.nav.trainers}
            </Link>
          </p>
        </Reveal>
      </Section>

      {/* Who */}
      <Section className="py-14 md:py-16 border-t border-rule">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <Reveal>
              <div className="text-[11px] uppercase tracking-[0.3em] text-accent font-mono mb-6">
                {p.whoKicker}
              </div>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="font-serif text-[clamp(1.75rem,3.5vw,2.5rem)] leading-tight tracking-tight text-ink">
                {p.whoTitle}
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-7">
            <ul className="divide-y divide-rule border-y border-rule">
              {p.whoItems.map((it, i) => (
                <Reveal key={i} delay={i * 80}>
                  <li className="py-5 flex items-baseline gap-6">
                    <span className="font-mono text-xs text-accent w-8">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-serif text-lg md:text-xl text-ink">{it}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Status */}
      <Section className="py-14 md:py-16 border-t border-rule">
        <Reveal>
          <div className="text-[11px] uppercase tracking-[0.3em] text-accent font-mono mb-6">
            {p.statusKicker}
          </div>
        </Reveal>
        <Reveal delay={80}>
          <p className="font-serif text-[clamp(1.35rem,2.4vw,1.85rem)] leading-[1.4] text-ink max-w-3xl border-l-2 border-accent pl-6">
            {p.statusBody}
          </p>
        </Reveal>
      </Section>

      <ProgramCTA label={p.cta} />
      <ContactSection />
    </PageShell>
  );
}
