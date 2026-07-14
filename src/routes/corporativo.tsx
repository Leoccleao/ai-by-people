import { createFileRoute } from "@tanstack/react-router";
import { ProgramPage } from "@/components/ProgramPage";
import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/corporativo")({
  head: () => ({
    meta: [
      { title: "Corporativo — AI by People" },
      { name: "description", content: "Programa de capacitação prática em IA para times sêniores. Diagnóstico, workshop e apresentação. Um protótipo funcional ao final." },
      { property: "og:title", content: "Corporativo — AI by People" },
      { property: "og:description", content: "Capacitação prática em IA para times sêniores. Um protótipo funcional. Uma equipe capaz." },
    ],
    links: [{ rel: "canonical", href: "/corporativo" }],
  }),
  component: Page,
});

function Page() {
  const { t } = useI18n();
  return (
    <ProgramPage
      kicker={t.corporate.kicker}
      title={t.corporate.title}
      hero={t.corporate.hero}
      sub={t.corporate.sub}
      argTitle={t.corporate.argTitle}
      argBody={t.corporate.argBody}
      callout={{ title: t.corporate.argTitle, body: t.corporate.argBody }}
      sectionKicker={t.corporate.phasesKicker}
      sectionTitle={t.corporate.phasesTitle}
      items={[
        { t: t.corporate.phase1Title, b: t.corporate.phase1Body },
        { t: t.corporate.phase2Title, b: t.corporate.phase2Body },
        { t: t.corporate.phase3Title, b: t.corporate.phase3Body },
      ]}
      stats={t.corporate.stats}
      cases={[
        { t: t.corporate.case1Title, b: t.corporate.case1Body },
        { t: t.corporate.case2Title, b: t.corporate.case2Body },
      ]}
      extra={
        <section className="mx-auto max-w-6xl px-6 py-24 border-t border-rule">
          <div className="grid md:grid-cols-12 gap-10">
            <h2 className="md:col-span-5 font-serif text-3xl md:text-4xl text-ink leading-snug">
              {t.corporate.openTitle}
            </h2>
            <p className="md:col-span-7 text-ink/75 text-lg leading-relaxed">{t.corporate.openBody}</p>
          </div>
        </section>
      }
      cta={t.corporate.cta}
    />
  );
}
