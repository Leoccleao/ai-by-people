import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, Section, Kicker } from "@/components/PageShell";
import { ContactSection } from "@/components/ContactForm";
import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/")({
  component: Home,
});

const PROGRAMS = [
  { to: "/corporativo", key: "corporate" as const, num: "01" },
  { to: "/ecossistema", key: "ecosystem" as const, num: "02" },
  { to: "/soberania", key: "sovereignty" as const, num: "03" },
  { to: "/escolas", key: "schools" as const, num: "04" },
  { to: "/formadores", key: "trainers" as const, num: "05" },
  { to: "/indice", key: "index" as const, num: "06" },
];

const PROGRAM_BLURBS: Record<string, { pt: string; en: string }> = {
  corporate: {
    pt: "Imersão prática para times sêniores. Um caso real, um protótipo funcional, uma equipe capaz.",
    en: "Hands-on immersion for senior teams. A real case, a working prototype, a capable team.",
  },
  ecosystem: {
    pt: "Arquitetura e operação de comunidades de desenvolvedores para plataformas de tecnologia.",
    en: "Architecture and operation of developer communities for technology platforms.",
  },
  sovereignty: {
    pt: "Formação técnica profunda, gratuita, para profissionais brasileiros. O núcleo sem fins lucrativos.",
    en: "Deep, free technical formation for Brazilian professionals. The non-profit core.",
  },
  schools: {
    pt: "Letramento crítico e prático em IA para o ensino médio e universidades.",
    en: "Critical and practical AI literacy for secondary schools and universities.",
  },
  trainers: {
    pt: "Formamos quem forma. Professores, coordenadores e facilitadores internos.",
    en: "We train those who train. Teachers, coordinators and internal facilitators.",
  },
  index: {
    pt: "Pesquisa anual com dados primários sobre fluência real em IA no Brasil.",
    en: "Annual research with primary data on real AI fluency in Brazil.",
  },
};

function Home() {
  const { t, lang } = useI18n();

  return (
    <PageShell>
      {/* HERO */}
      <Section className="pt-24 pb-32">
        <div className="text-xs uppercase tracking-[0.3em] text-accent font-mono mb-8">
          {t.common.tagline}
        </div>
        <h1 className="font-serif text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.02] tracking-tight text-ink max-w-5xl">
          {t.home.heroTitle}
        </h1>
        <p className="text-ink/70 text-lg md:text-2xl mt-10 max-w-3xl leading-relaxed font-serif italic">
          {t.home.heroSub}
        </p>
        <div className="flex flex-wrap gap-4 mt-12">
          <a
            href="#programas"
            className="border border-ink bg-ink text-paper px-8 py-4 text-sm uppercase tracking-widest hover:bg-transparent hover:text-ink transition"
          >
            {t.common.explorePrograms}
          </a>
          <a
            href="#contato"
            className="border border-ink px-8 py-4 text-sm uppercase tracking-widest hover:bg-ink hover:text-paper transition"
          >
            {t.common.getInTouch}
          </a>
        </div>
      </Section>

      {/* ETYMOLOGY */}
      <section className="border-y border-rule bg-paper-elev">
        <div className="mx-auto max-w-5xl px-6 py-32 text-center">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-accent mb-10">
            Ars · Facere
          </div>
          <p className="font-serif text-3xl md:text-5xl leading-[1.25] text-ink italic">
            {t.home.etymBody}
          </p>
        </div>
      </section>

      {/* PROBLEM */}
      <Section className="py-32">
        <Kicker>{t.home.problemKicker}</Kicker>
        <h2 className="font-serif text-4xl md:text-6xl text-ink max-w-4xl leading-tight">
          {t.home.problemTitle}
        </h2>
        <div className="mt-20 grid gap-x-12 gap-y-12 md:grid-cols-3">
          {[
            [t.home.problem1Title, t.home.problem1Body],
            [t.home.problem2Title, t.home.problem2Body],
            [t.home.problem3Title, t.home.problem3Body],
          ].map(([title, body], i) => (
            <div key={i} className="border-t-2 border-ink pt-6">
              <div className="font-mono text-xs text-accent mb-4">{String(i + 1).padStart(2, "0")}</div>
              <h3 className="font-serif text-2xl text-ink leading-snug">{title}</h3>
              <p className="text-ink/70 mt-4 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* THESIS + CONTRAST */}
      <section className="border-t border-rule bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-6 py-32">
          <div className="text-xs uppercase tracking-[0.3em] text-accent font-mono mb-8">
            {t.home.thesisKicker}
          </div>
          <h2 className="font-serif text-4xl md:text-6xl leading-[1.1] max-w-4xl">
            {t.home.thesisTitle}
          </h2>
          <p className="text-paper/70 text-lg mt-8 max-w-3xl leading-relaxed">
            {t.home.thesisBody}
          </p>

          <div className="mt-20 grid md:grid-cols-2 gap-px bg-paper/15">
            <div className="bg-ink p-10">
              <div className="text-xs uppercase tracking-widest text-paper/50 mb-6">
                — {t.home.contrastLeft}
              </div>
              <ul className="space-y-4">
                {t.home.contrastLeftItems.map((it: string, i: number) => (
                  <li key={i} className="text-paper/60 line-through decoration-accent/50 decoration-1">
                    {it}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-ink p-10">
              <div className="text-xs uppercase tracking-widest text-accent mb-6">
                + {t.home.contrastRight}
              </div>
              <ul className="space-y-4">
                {t.home.contrastRightItems.map((it: string, i: number) => (
                  <li key={i} className="text-paper">{it}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <Section className="py-32" >
        <div id="programas" />
        <Kicker>{t.home.programsKicker}</Kicker>
        <h2 className="font-serif text-4xl md:text-6xl text-ink max-w-3xl leading-tight">
          {t.home.programsTitle}
        </h2>
        <p className="text-ink/70 text-lg mt-6 max-w-2xl">{t.home.programsSub}</p>
        <div className="mt-16 grid gap-px bg-rule border border-rule">
          {PROGRAMS.map((p) => (
            <Link
              key={p.to}
              to={p.to}
              className="group bg-paper p-8 md:p-10 hover:bg-paper-elev transition flex md:items-center gap-6 md:gap-10 flex-col md:flex-row"
            >
              <div className="font-mono text-xs text-accent md:w-12">{p.num}</div>
              <div className="flex-1">
                <h3 className="font-serif text-2xl md:text-3xl text-ink group-hover:text-accent transition">
                  {t.nav[p.key]}
                </h3>
                <p className="text-ink/70 mt-2 max-w-2xl">{PROGRAM_BLURBS[p.key][lang]}</p>
              </div>
              <div className="text-ink/40 group-hover:text-accent transition text-xl">→</div>
            </Link>
          ))}
        </div>
      </Section>

      {/* IMPACT */}
      <section className="border-y border-rule">
        <div className="mx-auto max-w-6xl px-6 py-32">
          <Kicker>{t.home.impactKicker}</Kicker>
          <h2 className="font-serif text-4xl md:text-5xl text-ink max-w-3xl leading-tight">
            {t.home.impactTitle}
          </h2>
          <div className="mt-16 grid gap-y-12 md:grid-cols-4 gap-x-8">
            {t.home.impact.map((it: { n: string; label: string }, i: number) => (
              <div key={i} className="border-t-2 border-ink pt-6">
                <div className="font-serif text-5xl md:text-6xl text-ink">{it.n}</div>
                <p className="text-ink/60 text-sm mt-3 leading-relaxed">{it.label}</p>
              </div>
            ))}
          </div>
          <p className="text-ink/40 text-xs mt-12 italic">{t.home.impactNote}</p>
        </div>
      </section>

      {/* MANIFESTO CLOSER */}
      <section className="py-40">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="font-serif text-3xl md:text-5xl leading-[1.2] text-ink">
            {t.common.manifestoClose}
          </p>
        </div>
      </section>

      <ContactSection />
    </PageShell>
  );
}
