import { Link, createFileRoute } from "@tanstack/react-router";
import { PageShell, Section } from "@/components/PageShell";
import { ContactSection } from "@/components/ContactForm";
import { ProgramCTA, ProgramHero, SectionHead } from "@/components/ProgramParts";
import { Reveal } from "@/hooks/use-reveal";
import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/soberania")({
  head: () => ({
    meta: [
      { title: "SoberanIA — AI by People" },
      {
        name: "description",
        content:
          "A SoberanIA é uma ONG que capacita estudantes STEM em engenharia de agentes com IA generativa — conectando academia, desafios reais e empregabilidade global.",
      },
      { property: "og:title", content: "SoberanIA — AI by People" },
      {
        property: "og:description",
        content: "Formamos engenheiros de IA para o Brasil competir no mundo.",
      },
      { property: "og:url", content: "/soberania" },
    ],
    links: [{ rel: "canonical", href: "/soberania" }],
  }),
  component: Page,
});

/** Native, editorial recreation of the "B3 vs Nvidia" scale comparison (~1:10). */
function ValueGapChart({
  labelA,
  labelB,
  caption,
}: {
  labelA: string;
  labelB: string;
  caption: string;
}) {
  return (
    <Reveal>
      <div className="mt-12 max-w-3xl">
        <div className="space-y-8">
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-ink-muted font-mono mb-3">
              {labelA}
            </div>
            <div className="h-4 w-[10%] min-w-[2.5rem] bg-ink" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-ink-muted font-mono mb-3">
              {labelB}
            </div>
            <div className="h-4 w-full bg-accent" />
          </div>
        </div>
        <p className="mt-8 text-sm italic text-ink-muted leading-relaxed">{caption}</p>
      </div>
    </Reveal>
  );
}

function Page() {
  const { t } = useI18n();
  const p = t.pages.sovereignty;

  return (
    <PageShell>
      <ProgramHero eyebrow={p.eyebrow} headline={p.headline} sub={p.sub} />

      {/* National sovereignty */}
      <Section className="py-16 md:py-20 border-t border-rule">
        <SectionHead kicker={p.natKicker} title={p.natTitle} />
        <Reveal delay={160}>
          <p className="mt-8 max-w-2xl text-lg text-ink-muted leading-relaxed">{p.natBody}</p>
        </Reveal>
        <Reveal delay={220}>
          <div className="mt-14 max-w-3xl bg-paper-elev border border-rule p-8 md:p-12">
            <h3 className="font-serif text-[1.5rem] md:text-[1.85rem] text-ink leading-tight">
              {p.gapTitle}
            </h3>
            <p className="text-ink-muted mt-4 leading-relaxed">{p.gapBody}</p>
          </div>
        </Reveal>
        <ValueGapChart labelA={p.chartLabelA} labelB={p.chartLabelB} caption={p.chartCaption} />
      </Section>

      {/* The 4 pillars */}
      <section className="border-t border-rule bg-paper-elev">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <SectionHead kicker={p.pillarsKicker} title={p.pillarsTitle} />
          <div className="mt-16 grid gap-x-12 gap-y-12 md:grid-cols-2">
            {p.pillars.map((pl, i) => {
              const isFocus = i === p.pillars.length - 1;
              return (
                <Reveal key={i} delay={i * 70}>
                  <div className={`border-t-2 pt-6 ${isFocus ? "border-accent" : "border-ink"}`}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="font-mono text-xs text-accent">
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      {isFocus && (
                        <span className="text-[10px] uppercase tracking-[0.2em] font-mono bg-accent text-paper px-2 py-0.5">
                          {p.pillarsFocusBadge}
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-[1.4rem] md:text-[1.6rem] leading-snug text-ink">
                      {pl.t}
                    </h3>
                    <p className="text-ink-muted mt-3 leading-relaxed max-w-[42ch]">{pl.b}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <Reveal delay={160}>
            <p className="mt-16 max-w-2xl font-serif text-[clamp(1.15rem,2vw,1.5rem)] leading-[1.4] text-ink">
              {p.pillarsClose}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Who we are */}
      <Section className="py-16 md:py-20 border-t border-rule">
        <SectionHead kicker={p.whoKicker} title={p.whoTitle} />
        <Reveal delay={160}>
          <p className="mt-8 max-w-2xl text-lg text-ink-muted leading-relaxed">{p.whoP1}</p>
        </Reveal>
        <div className="mt-14 grid md:grid-cols-2 gap-x-12 gap-y-12 max-w-5xl">
          <Reveal>
            <div className="border-t-2 border-ink pt-6">
              <h3 className="font-serif text-[1.4rem] md:text-[1.6rem] leading-snug text-ink">
                {p.whyTitle}
              </h3>
              <p className="text-ink-muted mt-3 leading-relaxed">{p.whyBody}</p>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="border-t-2 border-ink pt-6">
              <h3 className="font-serif text-[1.4rem] md:text-[1.6rem] leading-snug text-ink">
                {p.roleTitle}
              </h3>
              <p className="text-ink-muted mt-3 leading-relaxed">{p.roleBody}</p>
            </div>
          </Reveal>
        </div>
        <Reveal delay={120}>
          <div className="mt-14 border-l-2 border-accent bg-paper-elev py-8 md:py-10 pl-8 md:pl-12 pr-6 md:pr-16 max-w-4xl">
            <div className="text-[11px] uppercase tracking-[0.3em] text-accent font-mono mb-4">
              {p.visionTitle}
            </div>
            <p className="font-serif text-[clamp(1.25rem,2.4vw,1.85rem)] leading-[1.35] text-ink">
              {p.visionBody}
            </p>
          </div>
        </Reveal>
      </Section>

      {/* Two fronts */}
      <Section className="py-16 md:py-20 border-t border-rule">
        <SectionHead kicker={p.frontsKicker} title={p.frontsTitle} />
        <div className="mt-16 grid md:grid-cols-2 gap-px bg-rule border border-rule">
          {p.fronts.map((f, i) => (
            <Reveal key={i} delay={i * 100}>
              <Link
                to={i === 0 ? "/soberania/formacao" : "/soberania/empresas"}
                className="group block bg-paper p-8 md:p-10 h-full hover:bg-paper-elev transition"
              >
                <div className="font-mono text-xs text-accent">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-serif text-[1.5rem] md:text-[1.85rem] text-ink mt-3 leading-tight">
                  {f.t}
                </h3>
                <p className="text-ink-muted mt-4 leading-relaxed">{f.b}</p>
                <div className="mt-8 text-sm text-ink border-b border-rule group-hover:border-accent group-hover:text-accent transition inline-block pb-0.5">
                  {f.link}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Supporters */}
      <Section className="py-10 md:py-12 border-t border-rule">
        <Reveal>
          <div className="flex flex-wrap items-baseline gap-x-10 gap-y-4">
            <div className="text-[11px] uppercase tracking-[0.3em] text-accent font-mono">
              {p.supportersKicker}
            </div>
            {p.supporters.map((s, i) => (
              <span key={i} className="font-serif text-lg text-ink-muted">
                {s}
              </span>
            ))}
          </div>
        </Reveal>
      </Section>

      <ProgramCTA label={p.cta} />
      <ContactSection />
    </PageShell>
  );
}
