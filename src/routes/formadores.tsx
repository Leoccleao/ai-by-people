import { createFileRoute } from "@tanstack/react-router";
import { ProgramStub } from "@/components/ProgramStub";
import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/formadores")({
  head: () => ({
    meta: [
      { title: "Formação de Formadores — AI by People" },
      { name: "description", content: "Um professor formado alcança 150 alunos por ano. É assim que o método escala sem a gente na sala." },
      { property: "og:title", content: "Formação de Formadores — AI by People" },
      { property: "og:url", content: "/formadores" },
    ],
    links: [{ rel: "canonical", href: "/formadores" }],
  }),
  component: () => {
    const { t } = useI18n();
    return <ProgramStub kicker={t.nav.programs} title={t.nav.trainers} />;
  },
});
