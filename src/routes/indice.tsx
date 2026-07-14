import { createFileRoute } from "@tanstack/react-router";
import { ProgramStub } from "@/components/ProgramStub";
import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/indice")({
  head: () => ({
    meta: [
      { title: "Índice de Fluência em IA — AI by People" },
      { name: "description", content: "Pesquisa anual com dado primário sobre fluência real em IA no Brasil. Sem medida, o país debate política de IA no escuro." },
      { property: "og:title", content: "Índice de Fluência em IA — AI by People" },
      { property: "og:url", content: "/indice" },
    ],
    links: [{ rel: "canonical", href: "/indice" }],
  }),
  component: () => {
    const { t } = useI18n();
    return <ProgramStub kicker={t.nav.programs} title={t.nav.index} />;
  },
});
