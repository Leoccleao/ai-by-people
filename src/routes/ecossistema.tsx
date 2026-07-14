import { createFileRoute } from "@tanstack/react-router";
import { ProgramPage } from "@/components/ProgramPage";
import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/ecossistema")({
  head: () => ({
    meta: [
      { title: "Ecossistema — AI by People" },
      { name: "description", content: "Construímos e organizamos ecossistemas de desenvolvedores para empresas de tecnologia. Comunidade, champions, eventos, adoção e inteligência." },
      { property: "og:title", content: "Ecossistema — AI by People" },
      { property: "og:description", content: "Developer Relations para empresas de tecnologia. Comunidade que constrói de verdade." },
    ],
    links: [{ rel: "canonical", href: "/ecossistema" }],
  }),
  component: Page,
});

function Page() {
  const { t } = useI18n();
  return (
    <ProgramPage
      kicker={t.ecosystem.kicker}
      title={t.ecosystem.title}
      hero={t.ecosystem.hero}
      sub={t.ecosystem.sub}
      argTitle={t.ecosystem.argTitle}
      argBody={t.ecosystem.argBody}
      sectionKicker={t.ecosystem.offerKicker}
      sectionTitle={t.ecosystem.offerTitle}
      items={t.ecosystem.offers}
      extra={
        <section className="mx-auto max-w-6xl px-6 py-24 border-t border-rule">
          <div className="text-xs uppercase tracking-[0.2em] text-accent font-mono mb-4">
            {t.ecosystem.whyKicker}
          </div>
          <h2 className="font-serif text-3xl md:text-5xl text-ink max-w-3xl leading-tight">
            {t.ecosystem.whyTitle}
          </h2>
          <p className="text-ink/75 text-lg leading-relaxed mt-8 max-w-3xl">{t.ecosystem.whyBody}</p>
        </section>
      }
      cta={t.ecosystem.cta}
    />
  );
}
