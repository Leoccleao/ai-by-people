import { createFileRoute } from "@tanstack/react-router";
import { ProgramStub } from "@/components/ProgramStub";
import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/escolas")({
  head: () => ({
    meta: [
      { title: "Escolas — AI by People" },
      { name: "description", content: "Fluência em IA no ensino médio e na universidade, com escolas e professores — não contra eles." },
      { property: "og:title", content: "Escolas — AI by People" },
      { property: "og:url", content: "/escolas" },
    ],
    links: [{ rel: "canonical", href: "/escolas" }],
  }),
  component: () => {
    const { t } = useI18n();
    return <ProgramStub kicker={t.nav.programs} title={t.nav.schools} />;
  },
});
