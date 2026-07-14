import { createFileRoute } from "@tanstack/react-router";
import { ProgramPage } from "@/components/ProgramPage";
import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/escolas")({
  head: () => ({
    meta: [
      { title: "Escolas — AI by People" },
      { name: "description", content: "Letramento em IA para o ensino médio e universidades. Diagnóstico, workshops com professores e alunos, redesenho de avaliação." },
      { property: "og:title", content: "Escolas — AI by People" },
      { property: "og:description", content: "Nem banir nem ignorar é estratégia. Como formar pessoas que pensem quando a resposta é grátis." },
    ],
    links: [{ rel: "canonical", href: "/escolas" }],
  }),
  component: Page,
});

function Page() {
  const { t } = useI18n();
  return (
    <ProgramPage
      kicker={t.schools.kicker}
      title={t.schools.title}
      hero={t.schools.hero}
      sub={t.schools.sub}
      argTitle={t.schools.argTitle}
      argBody={t.schools.argBody}
      sectionKicker={t.schools.whatKicker}
      sectionTitle={t.schools.whatTitle}
      items={t.schools.what}
      cta={t.schools.cta}
    />
  );
}
