import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Section } from "@/components/PageShell";
import { ContactSection } from "@/components/ContactForm";
import {
  NumberedGrid,
  ProgramCTA,
  ProgramHero,
  SectionHead,
} from "@/components/ProgramParts";
import { Reveal } from "@/hooks/use-reveal";
import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/ecossistema")({
  head: () => ({
    meta: [
      { title: "Ecossistema — AI by People" },
      {
        name: "description",
        content:
          "Construímos e organizamos ecossistemas de desenvolvedores para empresas de tecnologia. Comunidade, champions, eventos e adoção real — não números de vaidade.",
      },
      { property: "og:title", content: "Ecossistema — AI by People" },
      { property: "og:description", content: "Uma plataforma não vale nada sem quem constrói em cima dela." },
      { property: "og:url", content: "/ecossistema" },
    ],
    links: [{ rel: "canonical", href: "/ecossistema" }],
  }),
  component: Page,
});

function Page() {
  const { t } = useI18n();
  const p = t.pages.ecosystem;

  return (
    <PageShell>
      <ProgramHero eyebrow={p.eyebrow} headline={p.headline} sub={p.sub} />

      {/* Argument */}
      <Section className="py-32 md:py-40 border-t border-rule">
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

      {/* Offers */}
      <section className="border-t border-rule bg-paper-elev">
        <div className="mx-auto max-w-6xl px-6 py-32 md:py-40">
          <SectionHead kicker={p.offerKicker} title={p.offerTitle} />
          <NumberedGrid items={p.offers} cols={3} />
        </div>
      </section>

      {/* Track record */}
      <section className="border-t border-rule bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-6 py-32 md:py-40">
          <Reveal>
            <div className="text-[11px] uppercase tracking-[0.3em] text-accent font-mono mb-6">
              {p.trackKicker}
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="font-serif text-[clamp(1.85rem,4vw,3rem)] leading-[1.05] tracking-tight max-w-3xl">
              {p.trackTitle}
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-8 max-w-3xl text-paper/75 text-lg leading-relaxed">{p.trackBody}</p>
          </Reveal>
        </div>
      </section>

      {/* Engage */}
      <Section className="py-32 md:py-40 border-t border-rule">
        <SectionHead kicker={p.engageKicker} title={p.engageTitle} />
        <NumberedGrid items={p.engage} cols={3} />
      </Section>

      <ProgramCTA label={p.cta} />
      <ContactSection />
    </PageShell>
  );
}
