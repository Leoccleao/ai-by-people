import { createFileRoute } from "@tanstack/react-router";
import { ProgramStub } from "@/components/ProgramStub";
import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/soberania")({
  head: () => ({
    meta: [
      { title: "Soberania — AI by People" },
      { name: "description", content: "Capacidade técnica profunda em profissionais brasileiros, de graça. Um país que só consome IA feita fora aluga o próprio futuro." },
      { property: "og:title", content: "Soberania — AI by People" },
      { property: "og:url", content: "/soberania" },
    ],
    links: [{ rel: "canonical", href: "/soberania" }],
  }),
  component: () => {
    const { t } = useI18n();
    return <ProgramStub kicker={t.nav.programs} title={t.nav.sovereignty} />;
  },
});
