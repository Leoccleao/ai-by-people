import { createFileRoute } from "@tanstack/react-router";
import { ProgramPage } from "@/components/ProgramPage";
import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/formadores")({
  head: () => ({
    meta: [
      { title: "Formação de Formadores — AI by People" },
      { name: "description", content: "Formamos professores, coordenadores e facilitadores internos para conduzir a metodologia por conta própria." },
      { property: "og:title", content: "Formação de Formadores — AI by People" },
      { property: "og:description", content: "Nosso trabalho é replicar quem replica. É assim que a coisa escala." },
    ],
    links: [{ rel: "canonical", href: "/formadores" }],
  }),
  component: Page,
});

function Page() {
  const { t } = useI18n();
  return (
    <ProgramPage
      kicker={t.trainers.kicker}
      title={t.trainers.title}
      hero={t.trainers.hero}
      sub={t.trainers.sub}
      argTitle={t.trainers.argTitle}
      argBody={t.trainers.argBody}
      sectionKicker={t.trainers.howKicker}
      sectionTitle={t.trainers.howTitle}
      items={t.trainers.how}
      cta={t.trainers.cta}
    />
  );
}
