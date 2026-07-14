import { createFileRoute } from "@tanstack/react-router";
import { ProgramPage } from "@/components/ProgramPage";
import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/soberania")({
  head: () => ({
    meta: [
      { title: "Soberania — AI by People" },
      { name: "description", content: "Formação técnica profunda e gratuita para profissionais brasileiros. Um país que só consome IA aluga o próprio futuro." },
      { property: "og:title", content: "Soberania — AI by People" },
      { property: "og:description", content: "O núcleo sem fins lucrativos. Capacidade técnica como pilar de soberania." },
    ],
    links: [{ rel: "canonical", href: "/soberania" }],
  }),
  component: Page,
});

function Page() {
  const { t } = useI18n();
  return (
    <ProgramPage
      kicker={t.sovereignty.kicker}
      title={t.sovereignty.title}
      hero={t.sovereignty.hero}
      sub={t.sovereignty.sub}
      argTitle={t.sovereignty.argTitle}
      argBody={t.sovereignty.argBody}
      sectionKicker={t.sovereignty.supportKicker}
      sectionTitle={t.sovereignty.supportTitle}
      items={t.sovereignty.support}
      extra={
        <section className="mx-auto max-w-6xl px-6 py-24 border-t border-rule bg-paper-elev">
          <div className="text-xs uppercase tracking-[0.2em] text-accent font-mono mb-4">
            {t.sovereignty.whatKicker}
          </div>
          <h2 className="font-serif text-3xl md:text-5xl text-ink max-w-3xl leading-tight">
            {t.sovereignty.whatTitle}
          </h2>
          <p className="text-ink/75 text-lg leading-relaxed mt-8 max-w-3xl">{t.sovereignty.whatBody}</p>
        </section>
      }
      cta={t.sovereignty.cta}
    />
  );
}
