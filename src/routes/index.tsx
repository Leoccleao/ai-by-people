import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, Section, Kicker } from "@/components/PageShell";
import { ContactSection } from "@/components/ContactForm";
import { Reveal } from "@/hooks/use-reveal";
import { useI18n } from "@/i18n/I18nProvider";
import { PROGRAM_ROUTES } from "@/i18n/translations";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI by People — IA feita por pessoas" },
      {
        name: "description",
        content:
          "Organização sem fins lucrativos. Formamos pessoas capazes de construir com IA — não de apenas assistir. Programas para empresas, escolas, universidades e o ecossistema de desenvolvedores.",
      },
      { property: "og:url", content: "/" },
    ],
  }),
  component: Home,
});

// Impact numbers are placeholders — to be filled in a later pass.
const IMPACT_PLACEHOLDERS = ["—", "—", "—", "—"];

function Home() {
  const { t, lang } = useI18n();

  return (
    <PageShell>
      {/* HERO */}
      <Section className="pt-14 md:pt-16 pb-14 md:pb-40">
        <Reveal>
          <div className="text-[11px] uppercase tracking-[0.3em] text-accent font-mono mb-10">
            {t.common.nonprofitEyebrow}
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="font-serif font-normal text-[clamp(2.75rem,7vw,6rem)] leading-[1.02] tracking-[-0.02em] text-ink max-w-5xl">
            {t.home.heroTitle}
          </h1>
        </Reveal>
        <Reveal delay={180}>
          <p className="mt-10 max-w-2xl text-[clamp(1.05rem,1.5vw,1.35rem)] leading-relaxed text-ink-muted font-serif italic">
            {t.home.heroSub}
          </p>
        </Reveal>
        <Reveal delay={280}>
          <div className="flex flex-wrap gap-3 mt-12">
            <a
              href="#programas"
              className="border border-ink bg-ink text-paper px-7 py-3.5 text-sm uppercase tracking-[0.2em] hover:bg-transparent hover:text-ink transition"
            >
              {t.common.explorePrograms}
            </a>
            <a
              href="#contato"
              className="border border-ink px-7 py-3.5 text-sm uppercase tracking-[0.2em] hover:bg-ink hover:text-paper transition"
            >
              {t.common.getInTouch}
            </a>
          </div>
        </Reveal>
      </Section>

      {/* ETYMOLOGY */}
      <section className="border-y border-rule bg-paper-elev">
        <div className="mx-auto max-w-5xl px-6 py-14 md:py-20 text-center">
          <Reveal>
            <div className="font-mono text-[11px] uppercase tracking-[0.4em] text-accent mb-6">
              Ars · Facere
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="font-serif text-[clamp(1.75rem,4vw,3.25rem)] leading-[1.05] text-ink mb-8">
              <span className="text-accent italic">ars</span>
              <span className="text-ink-muted mx-4 md:mx-6">+</span>
              <span className="text-accent italic">facere</span>
              <span className="text-ink-muted mx-4 md:mx-6">→</span>
              <span className="italic">artificialis</span>
            </div>
          </Reveal>
          <Reveal delay={160}>
            <p className="font-serif text-[clamp(1.2rem,2.2vw,1.85rem)] leading-[1.4] text-ink max-w-[44ch] mx-auto italic">
              {t.home.etymBody}
            </p>
          </Reveal>
        </div>
      </section>


      {/* PROBLEM */}
      <Section className="py-16 md:py-20">
        <Reveal>
          <Kicker>{t.home.problemKicker}</Kicker>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="font-serif text-[clamp(2rem,5vw,4rem)] leading-[1.05] tracking-tight text-ink max-w-4xl">
            {t.home.problemTitle}
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-x-12 gap-y-10 grid-cols-1 md:grid-cols-3">
          {t.home.problems.map((p, i) => (
            <Reveal key={i} delay={i * 100}>
              <div className="border-t-2 border-ink pt-6">
                <div className="font-mono text-xs text-accent mb-5">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="font-serif text-[1.5rem] md:text-[1.75rem] text-ink leading-snug">{p.t}</h3>
                <p className="text-ink-muted mt-4 leading-relaxed max-w-[38ch]">{p.b}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* THESIS + CONTRAST */}
      <section id="tese" className="border-t border-rule bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <Reveal>
            <div className="text-[11px] uppercase tracking-[0.3em] text-accent font-mono mb-8">
              {t.home.thesisKicker}
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="font-serif text-[clamp(2rem,5vw,4.25rem)] leading-[1.1] tracking-tight max-w-4xl">
              {t.home.thesisTitle}
            </h2>
          </Reveal>

          <div className="mt-20 grid md:grid-cols-2 gap-px bg-paper/15">
            <Reveal>
              <div className="bg-ink p-10 h-full">
                <div className="text-[11px] uppercase tracking-[0.2em] text-paper/50 mb-8">
                  — {t.home.contrastLeft}
                </div>
                <ul className="space-y-4">
                  {t.home.contrastLeftItems.map((it, i) => (
                    <li key={i} className="text-paper/55 leading-relaxed">
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="bg-ink p-10 h-full">
                <div className="text-[11px] uppercase tracking-[0.2em] text-accent mb-8">
                  + {t.home.contrastRight}
                </div>
                <ul className="space-y-4">
                  {t.home.contrastRightItems.map((it, i) => (
                    <li key={i} className="text-paper leading-relaxed">
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <Reveal delay={100}>
            <p className="mt-16 font-serif italic text-[clamp(1.5rem,3vw,2.25rem)] text-paper/90">
              {t.home.thesisClose}
            </p>
          </Reveal>
        </div>
      </section>

      {/* PROGRAMS */}
      <Section id="programas" className="py-16 md:py-20">
        <Reveal>
          <Kicker>{t.home.programsKicker}</Kicker>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="font-serif text-[clamp(2rem,5vw,4rem)] leading-[1.05] tracking-tight text-ink max-w-3xl">
            {t.home.programsTitle}
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="text-ink-muted text-lg mt-6 max-w-2xl leading-relaxed">
            {t.home.programsSub}
          </p>
        </Reveal>

        <div className="mt-16 grid md:grid-cols-2 gap-px bg-rule border border-rule">
          {PROGRAM_ROUTES.map((p, i) => (
            <Reveal key={p.to} delay={i * 60}>
              <Link
                to={p.to}
                className="group bg-paper hover:bg-paper-elev transition p-8 md:p-10 flex flex-col h-full"
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-xs text-accent">{p.num}</span>
                  <span className="text-ink-muted group-hover:text-accent transition text-lg">→</span>
                </div>
                <h3 className="font-serif text-[1.75rem] md:text-[2rem] text-ink group-hover:text-accent transition mt-6 leading-tight">
                  {t.nav[p.key]}
                </h3>
                <p className="text-ink-muted mt-4 leading-relaxed max-w-[42ch] flex-1">
                  {t.programBlurbs[p.key]}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* IMPACT */}
      <section className="border-y border-rule">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <Reveal>
            <Kicker>{t.home.impactKicker}</Kicker>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="font-serif text-[clamp(1.75rem,4vw,3.25rem)] leading-tight text-ink max-w-3xl">
              {t.home.impactTitle}
            </h2>
          </Reveal>
          <div className="mt-16 grid gap-y-12 md:grid-cols-4 gap-x-8">
            {IMPACT_PLACEHOLDERS.map((n, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="border-t-2 border-ink pt-6">
                  <div className="font-serif text-[clamp(3rem,6vw,4.5rem)] text-ink leading-none">{n}</div>
                  <p className="text-ink-muted text-sm mt-4 leading-relaxed">
                    {t.home.impactLabels[i]}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <p className="text-ink-muted/70 text-xs mt-14 italic max-w-xl">{t.home.impactNote}</p>
          </Reveal>
        </div>
      </section>

      {/* MANIFESTO CLOSER */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <p className="font-serif text-[clamp(1.75rem,4.5vw,3.5rem)] leading-[1.2] text-ink">
              {t.common.manifestoClose}
            </p>
          </Reveal>
        </div>
      </section>

      <ContactSection />

      {/* Suppress "unused" warning on lang while we might key visuals off it later */}
      <span data-lang={lang} className="hidden" />
    </PageShell>
  );
}
