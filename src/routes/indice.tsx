import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell, Section } from "@/components/PageShell";
import { ContactSection } from "@/components/ContactForm";
import { NumberedGrid, ProgramHero, SectionHead } from "@/components/ProgramParts";
import { Reveal } from "@/hooks/use-reveal";
import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/indice")({
  head: () => ({
    meta: [
      { title: "Índice de Fluência em IA — AI by People" },
      {
        name: "description",
        content:
          "Pesquisa anual, com dado primário, sobre a fluência real em IA de profissionais, empresas, escolas e desenvolvedores no Brasil. Publicada aberta e de graça.",
      },
      { property: "og:title", content: "Índice de Fluência em IA — AI by People" },
      { property: "og:description", content: "Sem medida, o país debate política de IA no escuro." },
      { property: "og:url", content: "/indice" },
    ],
    links: [{ rel: "canonical", href: "/indice" }],
  }),
  component: Page,
});

function Page() {
  const { t } = useI18n();
  const p = t.pages.aiIndex;

  return (
    <PageShell>
      <ProgramHero eyebrow={p.eyebrow} headline={p.headline} sub={p.sub} />

      {/* Why */}
      <section className="border-y border-rule bg-paper-elev">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <Reveal>
            <div className="text-[11px] uppercase tracking-[0.3em] text-accent font-mono mb-10 text-center">
              {p.whyKicker}
            </div>
          </Reveal>
          <Reveal delay={80}>
            <p className="font-serif text-[clamp(1.35rem,2.4vw,1.9rem)] leading-[1.4] text-ink max-w-[52ch] mx-auto">
              {p.whyBody}
            </p>
          </Reveal>
        </div>
      </section>

      {/* What we measure */}
      <Section className="py-16 md:py-20">
        <SectionHead kicker={p.whatKicker} title={p.whatTitle} />
        <NumberedGrid items={p.what} cols={2} />
      </Section>

      {/* Methodology */}
      <Section className="py-14 md:py-16 border-t border-rule">
        <SectionHead kicker={p.methodKicker} title={p.methodTitle} />
        <NumberedGrid items={p.method} cols={3} />
      </Section>

      {/* Commitment + status (dark) */}
      <section className="border-t border-rule bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20 grid md:grid-cols-2 gap-16">
          <div>
            <Reveal>
              <div className="text-[11px] uppercase tracking-[0.3em] text-accent font-mono mb-6">
                {p.commitKicker}
              </div>
            </Reveal>
            <Reveal delay={80}>
              <p className="font-serif text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.3] text-paper">
                {p.commitBody}
              </p>
            </Reveal>
          </div>
          <div>
            <Reveal delay={120}>
              <div className="text-[11px] uppercase tracking-[0.3em] text-accent font-mono mb-6">
                {p.statusKicker}
              </div>
            </Reveal>
            <Reveal delay={200}>
              <p className="font-serif text-[clamp(1.35rem,2.4vw,1.85rem)] leading-[1.3] text-paper/85 border-l-2 border-accent pl-6">
                {p.statusBody}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Email capture */}
      <IndexCapture />

      <ContactSection />
    </PageShell>
  );
}

function IndexCapture() {
  const { t } = useI18n();
  const p = t.pages.aiIndex;
  const [email, setEmail] = useState("");

  return (
    <section className="border-t border-rule">
      <div className="mx-auto max-w-4xl px-6 py-16 md:py-20 text-center">
        <Reveal>
          <h2 className="font-serif text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.05] tracking-tight text-ink max-w-3xl mx-auto">
            {p.captureTitle}
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="mt-6 text-ink-muted text-lg max-w-xl mx-auto">{p.captureSub}</p>
        </Reveal>
        <Reveal delay={180}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!email.trim()) return;
              toast.success(p.captureToast);
              setEmail("");
            }}
            className="mt-10 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={p.capturePlaceholder}
              className="flex-1 border border-ink/20 bg-paper px-5 py-3.5 text-ink placeholder:text-ink-muted/60 focus:outline-none focus:border-accent"
            />
            <button
              type="submit"
              className="border border-ink bg-ink text-paper px-8 py-3.5 text-sm uppercase tracking-[0.2em] hover:bg-transparent hover:text-ink transition"
            >
              {p.captureCta}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
