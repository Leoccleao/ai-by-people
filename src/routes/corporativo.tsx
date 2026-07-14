import { createFileRoute } from "@tanstack/react-router";
import { ProgramStub } from "@/components/ProgramStub";
import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/corporativo")({
  head: () => ({
    meta: [
      { title: "Corporate — AI by People" },
      { name: "description", content: "Imersão hands-on para times e executivos. Um caso real, um protótipo funcional, uma equipe capaz de manter." },
      { property: "og:title", content: "Corporate — AI by People" },
      { property: "og:url", content: "/corporativo" },
    ],
    links: [{ rel: "canonical", href: "/corporativo" }],
  }),
  component: () => {
    const { t } = useI18n();
    return <ProgramStub kicker={t.nav.programs} title={t.nav.corporate} />;
  },
});
