import { createFileRoute } from "@tanstack/react-router";
import { ProgramStub } from "@/components/ProgramStub";
import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/ecossistema")({
  head: () => ({
    meta: [
      { title: "Ecossistema — AI by People" },
      { name: "description", content: "Construímos e organizamos ecossistemas de desenvolvedores para empresas de tecnologia." },
      { property: "og:title", content: "Ecossistema — AI by People" },
      { property: "og:url", content: "/ecossistema" },
    ],
    links: [{ rel: "canonical", href: "/ecossistema" }],
  }),
  component: () => {
    const { t } = useI18n();
    return <ProgramStub kicker={t.nav.programs} title={t.nav.ecosystem} />;
  },
});
