import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell, Section } from "@/components/PageShell";
import { ContactSection } from "@/components/ContactForm";
import { NumberedGrid, ProgramCTA, ProgramHero, SectionHead } from "@/components/ProgramParts";
import { Reveal } from "@/hooks/use-reveal";
import { useI18n } from "@/i18n/I18nProvider";
import { professionalsPt } from "@/i18n/professionals";

export const Route = createFileRoute("/profissionais_/$pilar")({
  // Slugs are a closed set — anything else is a 404 rather than an empty page.
  beforeLoad: ({ params }) => {
    if (!professionalsPt.pillars.some((p) => p.slug === params.pilar)) throw notFound();
  },
  head: ({ params }) => {
    const pillar = professionalsPt.pillars.find((p) => p.slug === params.pilar);
    if (!pillar) return {};
    const title = `${pillar.nav} · Formação Profissional — AI by People`;
    return {
      meta: [
        { title },
        { name: "description", content: pillar.blurb },
        { property: "og:title", content: title },
        { property: "og:description", content: pillar.headline },
        { property: "og:url", content: `/profissionais/${pillar.slug}` },
      ],
      links: [{ rel: "canonical", href: `/profissionais/${pillar.slug}` }],
    };
  },
  component: Page,
});

function Page() {
  const { t } = useI18n();
  const { pilar } = Route.useParams();
  const p = t.pages.professionals;
  const pillar = p.pillars.find((x) => x.slug === pilar);
  if (!pillar) return null;
  const others = p.pillars.filter((x) => x.slug !== pilar);

  return (
    <PageShell>
      <Section className="pt-10 md:pt-12">
        <Reveal>
          <Link
            to="/profissionais"
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-muted hover:text-accent transition"
          >
            ← {p.pillarPage.back}
          </Link>
        </Reveal>
      </Section>

      <ProgramHero
        eyebrow={`${p.pillarPage.eyebrowPrefix} · ${pillar.nav}`}
        headline={pillar.headline}
        sub={pillar.sub}
        note={`${p.pillarPage.whoKicker}: ${pillar.who}`}
      />

      {/* What changes in the function */}
      <Section className="py-16 md:py-20 border-t border-rule">
        <SectionHead kicker={p.pillarPage.changesKicker} title={p.pillarPage.changesTitle} />
        <NumberedGrid items={pillar.changes} cols={2} />
      </Section>

      {/* What you build */}
      <section className="border-t border-rule bg-paper-elev">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <SectionHead kicker={p.pillarPage.buildKicker} title={p.pillarPage.buildTitle} />
          <NumberedGrid items={pillar.builds} cols={2} />
        </div>
      </section>

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

      {/* Other pillars */}
      <Section className="py-16 md:py-20 border-t border-rule">
        <Reveal>
          <div className="text-[11px] uppercase tracking-[0.3em] text-accent font-mono mb-8">
            {p.pillarPage.otherPillars}
          </div>
        </Reveal>
        <div className="grid gap-px bg-rule border border-rule md:grid-cols-2">
          {others.map((o, i) => (
            <Reveal key={o.slug} delay={i * 50}>
              <Link
                to="/profissionais/$pilar"
                params={{ pilar: o.slug }}
                className="group bg-paper hover:bg-paper-elev transition p-6 md:p-7 flex items-baseline justify-between gap-4 h-full"
              >
                <span className="font-serif text-[1.35rem] text-ink group-hover:text-accent transition">
                  {o.nav}
                </span>
                <span className="text-ink-muted group-hover:text-accent transition">→</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <ProgramCTA label={p.cta} />
      <ContactSection />
    </PageShell>
  );
}
