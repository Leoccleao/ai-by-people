import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { usePlatformAuth } from "@/platform/auth";
import { Protected } from "@/platform/guard";
import { useLobs, useMyProgress, useOfficeHours } from "@/platform/queries";
import { formatDateTime } from "@/platform/lib";
import { Button, Card, EmptyState, Spinner, Tag, buttonClass } from "@/platform/ui";
import type { Lob } from "@/integrations/supabase/platform-schema";

export const Route = createFileRoute("/plataforma/inicio")({
  component: () => (
    <Protected>
      <Home />
    </Protected>
  ),
});

function firstName(name: string | null | undefined) {
  return name?.trim().split(/\s+/)[0] ?? "";
}

function Home() {
  const { profile } = usePlatformAuth();
  const { data: lobs, isLoading } = useLobs();
  const { data: progress } = useMyProgress();
  const { data: oh } = useOfficeHours();

  const mine = useMemo(
    () => (lobs ?? []).find((l) => l.slug === profile?.role_lob) ?? null,
    [lobs, profile?.role_lob],
  );

  const upcoming = useMemo(
    () => (oh?.sessions ?? []).filter((s) => new Date(s.starts_at) > new Date()).slice(0, 3),
    [oh?.sessions],
  );

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-[clamp(1.5rem,3vw,2rem)] font-semibold text-pf-text">
          {firstName(profile?.name) ? `Olá, ${firstName(profile?.name)}.` : "Olá."}
        </h1>
        <p className="mt-2 text-[15px] text-pf-muted">
          O conteúdo do Roadshow de IA, disponível para rever e refazer quando quiser.
        </p>
      </header>

      {mine && (
        <section>
          <h2 className="text-sm font-medium uppercase tracking-wider text-pf-faint">
            {progress?.[mine.id] ? "Sua área" : "Continue de onde parou"}
          </h2>
          <Card className="mt-3 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-5 p-6">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  {mine.status === "coming_soon" ? (
                    <Tag tone="soon">Em breve</Tag>
                  ) : (
                    mine.tags.map((t) => <Tag key={t}>{t}</Tag>)
                  )}
                  {progress?.[mine.id] && <Tag>Assistido</Tag>}
                </div>
                <h3 className="mt-3 text-xl font-semibold text-pf-text">{mine.title}</h3>
                {mine.subtitle && (
                  <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-pf-muted">
                    {mine.subtitle}
                  </p>
                )}
              </div>
              <Link
                to="/plataforma/lob/$slug"
                params={{ slug: mine.slug }}
                className={buttonClass("primary")}
              >
                {mine.status === "coming_soon" ? "Ver a área" : "Assistir"}
              </Link>
            </div>
          </Card>
        </section>
      )}

      <section>
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-sm font-medium uppercase tracking-wider text-pf-faint">
            Todas as áreas
          </h2>
          <span className="text-[13px] text-pf-faint">{lobs?.length ?? 0} áreas</span>
        </div>
        {isLoading ? (
          <Spinner />
        ) : (lobs ?? []).length === 0 ? (
          <EmptyState title="Nenhum conteúdo publicado ainda" />
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(lobs ?? []).map((l) => (
              <LobCard key={l.id} lob={l} watched={Boolean(progress?.[l.id])} />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-sm font-medium uppercase tracking-wider text-pf-faint">
            Próximos office hours
          </h2>
          <Link
            to="/plataforma/office-hours"
            className="text-[13px] text-pf-link underline underline-offset-2"
          >
            Ver todos
          </Link>
        </div>
        {upcoming.length === 0 ? (
          <p className="mt-3 text-sm text-pf-muted">
            Nenhuma sessão agendada no momento. Assim que abrir, aparece aqui.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-pf-border rounded-xl border border-pf-border">
            {upcoming.map((s) => (
              <li
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
              >
                <div className="min-w-0">
                  <p className="text-[15px] font-medium text-pf-text">{s.title}</p>
                  <p className="mt-0.5 text-[13px] text-pf-muted">
                    {formatDateTime(s.starts_at)} · horário de Brasília
                  </p>
                </div>
                {oh?.signedUp.includes(s.id) ? (
                  <Tag>Inscrito</Tag>
                ) : (
                  <Link to="/plataforma/office-hours" className={buttonClass("secondary", "sm")}>
                    Inscrever-se
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <ShareBanner />
    </div>
  );
}

function LobCard({ lob, watched }: { lob: Lob; watched: boolean }) {
  const soon = lob.status === "coming_soon";
  return (
    <Link
      to="/plataforma/lob/$slug"
      params={{ slug: lob.slug }}
      className="group flex h-full flex-col rounded-xl border border-pf-border bg-pf-bg p-5 transition hover:border-pf-text/25 hover:bg-pf-surface"
    >
      <div className="flex flex-wrap items-center gap-2">
        {soon ? <Tag tone="soon">Em breve</Tag> : lob.tags.map((t) => <Tag key={t}>{t}</Tag>)}
        {watched && <Tag>Assistido</Tag>}
      </div>
      <h3 className="mt-3 text-[15px] font-semibold leading-snug text-pf-text">{lob.title}</h3>
      {lob.subtitle && (
        <p className="mt-2 flex-1 text-[13px] leading-relaxed text-pf-muted">{lob.subtitle}</p>
      )}
      {lob.instructor && <p className="mt-4 text-[12px] text-pf-faint">{lob.instructor}</p>}
    </Link>
  );
}

function ShareBanner() {
  const { profile } = usePlatformAuth();
  const [copied, setCopied] = useState(false);
  const domain = profile?.email_domain ?? "sua empresa";

  async function copy() {
    const url =
      typeof window !== "undefined" ? `${window.location.origin}/plataforma/cadastro` : "";
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copiado.");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Não deu para copiar. Selecione o link manualmente.");
    }
  }

  return (
    <Card className="bg-pf-surface p-6">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div className="max-w-xl">
          <h2 className="text-[15px] font-semibold text-pf-text">Compartilhe com colegas</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-pf-muted">
            Qualquer pessoa com e-mail <strong>@{domain}</strong> pode criar conta sozinha — não
            precisa de convite nosso.
          </p>
        </div>
        <Button variant="secondary" onClick={copy}>
          {copied ? "Copiado" : "Copiar link de cadastro"}
        </Button>
      </div>
    </Card>
  );
}
