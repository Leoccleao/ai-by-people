import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Section } from "@/components/PageShell";
import { ContactSection } from "@/components/ContactForm";
import { NumberedGrid, ProgramCTA, ProgramHero, SectionHead } from "@/components/ProgramParts";
import { Reveal } from "@/hooks/use-reveal";
import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/soberania")({
  head: () => ({
    meta: [
      { title: "Soberania — AI by People" },
      {
        name: "description",
        content:
          "Formação técnica profunda, gratuita, para profissionais brasileiros. Não se trata de construir um modelo nacional — trata-se de construir as pessoas que saberiam construir.",
      },
      { property: "og:title", content: "Soberania — AI by People" },
      { property: "og:description", content: "Um país que só consome IA feita fora está alugando o próprio futuro." },
      { property: "og:url", content: "/soberania" },
    ],
    links: [{ rel: "canonical", href: "/soberania" }],
  }),
  component: Page,
});

function Page() {
  const { t } = useI18n();
  const p = t.pages.sovereignty;

  return (
    <PageShell>
      <ProgramHero eyebrow={p.eyebrow} headline={p.headline} sub={p.sub} />

      {/* Manifesto */}
      <section className="border-y border-rule bg-paper-elev">
        <div className="mx-auto max-w-4xl px-6 py-32 md:py-48">
          <Reveal>
            <div className="text-[11px] uppercase tracking-[0.3em] text-accent font-mono mb-14 text-center">
              {p.manifestoKicker}
            </div>
          </Reveal>
          <div className="space-y-10 md:space-y-14">
            {p.manifesto.map((para, i) => (
              <Reveal key={i} delay={i * 120}>
                <p
                  className={`font-serif leading-[1.35] text-ink max-w-[46ch] mx-auto ${
                    i === 0
                      ? "text-[clamp(1.5rem,3vw,2.25rem)]"
                      : i === p.manifesto.length - 1
                        ? "text-[clamp(1.35rem,2.6vw,2rem)] italic text-accent"
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

      {/* What we do */}
      <Section className="py-32 md:py-40">
        <SectionHead kicker={p.whatKicker} title={p.whatTitle} />
        <NumberedGrid items={p.what} cols={2} />
      </Section>

      {/* Who */}
      <Section className="py-24 md:py-32 border-t border-rule">
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
            <Reveal delay={160}>
              <p className="text-ink-muted text-lg leading-relaxed">{p.whoBody}</p>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Support */}
      <section className="border-t border-rule bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-6 py-32 md:py-40">
          <Reveal>
            <div className="text-[11px] uppercase tracking-[0.3em] text-accent font-mono mb-6">
              {p.supportKicker}
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="font-serif text-[clamp(1.85rem,4.5vw,3.5rem)] leading-[1.05] tracking-tight max-w-3xl">
              {p.supportTitle}
            </h2>
          </Reveal>
          <div className="mt-16 grid md:grid-cols-3 gap-px bg-paper/15 border border-paper/15">
            {p.support.map((s, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="bg-ink p-8 md:p-10 h-full">
                  <div className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</div>
                  <h3 className="font-serif text-[1.5rem] md:text-[1.85rem] text-paper mt-3 leading-tight">
                    {s.t}
                  </h3>
                  <p className="text-paper/70 mt-4 leading-relaxed">{s.b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ProgramCTA label={p.cta} />
      <ContactSection />
    </PageShell>
  );
}
