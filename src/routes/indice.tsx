import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ProgramPage } from "@/components/ProgramPage";
import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/indice")({
  head: () => ({
    meta: [
      { title: "Índice de Fluência em IA — AI by People" },
      { name: "description", content: "Pesquisa anual com dados primários medindo fluência real em IA no Brasil — em profissionais, empresas, escolas e no ecossistema de desenvolvedores." },
      { property: "og:title", content: "Índice de Fluência em IA — AI by People" },
      { property: "og:description", content: "O primeiro retrato honesto da fluência em IA no Brasil." },
    ],
    links: [{ rel: "canonical", href: "/indice" }],
  }),
  component: Page,
});

function EmailCapture() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    console.log("[index-signup]", email);
    setOk(true);
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-24 border-t border-rule bg-ink text-paper">
      <div className="grid md:grid-cols-12 gap-10 items-end">
        <div className="md:col-span-6">
          <div className="text-xs uppercase tracking-[0.2em] text-accent font-mono mb-4">
            {t.indexPage.openTitle}
          </div>
          <h2 className="font-serif text-3xl md:text-5xl leading-tight">
            {t.indexPage.captureTitle}
          </h2>
          <p className="text-paper/70 mt-4 max-w-md">{t.indexPage.captureSub}</p>
        </div>
        <form onSubmit={submit} className="md:col-span-6 flex flex-col sm:flex-row gap-3">
          <input
            required
            type="email"
            placeholder={t.indexPage.capturePlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-transparent border-b border-paper/40 focus:border-paper py-3 text-paper placeholder:text-paper/40 focus:outline-none"
          />
          <button
            type="submit"
            className="border border-paper px-6 py-3 text-sm uppercase tracking-widest hover:bg-paper hover:text-ink transition"
          >
            {t.indexPage.captureBtn}
          </button>
        </form>
        {ok && <p className="text-accent text-sm md:col-span-12">{t.indexPage.captureOk}</p>}
      </div>
    </section>
  );
}

function Page() {
  const { t } = useI18n();
  return (
    <ProgramPage
      kicker={t.indexPage.kicker}
      title={t.indexPage.title}
      hero={t.indexPage.hero}
      sub={t.indexPage.sub}
      argTitle={t.indexPage.whyKicker}
      argBody={t.indexPage.whyBody}
      sectionKicker={t.indexPage.methodKicker}
      sectionTitle={t.indexPage.methodTitle}
      items={t.indexPage.method}
      extra={
        <>
          <section className="mx-auto max-w-6xl px-6 py-24 border-t border-rule">
            <div className="text-xs uppercase tracking-[0.2em] text-accent font-mono mb-4">
              {t.indexPage.statusKicker}
            </div>
            <p className="font-serif text-2xl md:text-3xl text-ink max-w-3xl">{t.indexPage.statusBody}</p>
            <p className="text-ink/70 mt-6 max-w-3xl">{t.indexPage.openBody}</p>
          </section>
          <EmailCapture />
        </>
      }
      cta={t.indexPage.captureTitle}
    />
  );
}
