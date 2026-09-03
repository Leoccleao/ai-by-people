import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { usePlatformAuth } from "@/platform/auth";
import { Protected } from "@/platform/guard";
import { areaLabel } from "@/platform/shell";
import { useLobs, useMyProgress, useOfficeHours } from "@/platform/queries";
import { countSteps } from "@/platform/guide-schema";
import { formatDateTime } from "@/platform/lib";
import {
  AreaDot,
  Chip,
  Eyebrow,
  ProgressBar,
  SectionHead,
  areaGradient,
} from "@/platform/revamp-ui";
import { EmptyState, Spinner, buttonClass } from "@/platform/ui";
import type { Lob, LobProgress } from "@/integrations/supabase/platform-schema";

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

/** Etapas concluídas de uma área, limitado ao que o guia realmente tem. */
function stepsDone(lob: Lob, progress?: Record<string, LobProgress>) {
  const total = countSteps(lob.guide);
  const done = (progress?.[lob.id]?.steps_done ?? []).length;
  return { done: Math.min(done, total), total };
}

function Home() {
  const { profile } = usePlatformAuth();
  const { data: lobs, isLoading } = useLobs();
  const { data: progress } = useMyProgress();
  const { data: oh } = useOfficeHours();

  const published = useMemo(() => (lobs ?? []).filter((l) => l.status === "published"), [lobs]);

  /** O que retomar: a área do usuário se estiver no ar, senão a primeira publicada. */
  const resume = useMemo(() => {
    const mine = published.find((l) => l.slug === profile?.role_lob);
    return mine ?? published[0] ?? null;
  }, [published, profile?.role_lob]);

  const upcoming = useMemo(
    () => (oh?.sessions ?? []).filter((s) => new Date(s.starts_at) > new Date()).slice(0, 3),
    [oh?.sessions],
  );

  const recent = useMemo(
    () =>
      [...(lobs ?? [])]
        .filter((l) => l.status === "published")
        .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
        .slice(0, 3),
    [lobs],
  );

  if (isLoading) return <Spinner />;

  return (
    <div className="space-y-10">
      <header>
        <Eyebrow>Sua trilha</Eyebrow>
        <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.02em] text-pf-text">
          {firstName(profile?.name) ? `Olá, ${firstName(profile?.name)}.` : "Olá."}
        </h1>
        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-pf-muted">
          Cada área tem um workshop gravado, o roteiro para refazer com os seus dados e os arquivos
          usados na sala.
        </p>
      </header>

      {resume && <ResumeCard lob={resume} progress={progress} />}

      <section>
        <SectionHead
          title="Áreas de atuação"
          meta={`${(lobs ?? []).length} áreas · 1 workshop cada`}
        />
        {(lobs ?? []).length === 0 ? (
          <div className="mt-4">
            <EmptyState title="Nenhum conteúdo publicado ainda" />
          </div>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(lobs ?? []).map((l) => (
              <AreaCard key={l.id} lob={l} />
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div>
          <Eyebrow>Próximos office hours</Eyebrow>
          {upcoming.length === 0 ? (
            <p className="mt-4 text-[13.5px] text-pf-muted">
              Nenhuma sessão agendada. As próximas datas aparecem aqui.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-pf-border overflow-hidden rounded-xl border border-pf-border">
              {upcoming.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="text-[14px] font-medium text-pf-text">{s.title}</p>
                    <p className="mt-0.5 text-[12.5px] text-pf-faint">
                      {formatDateTime(s.starts_at)} · Brasília
                    </p>
                  </div>
                  <Link
                    to="/plataforma/office-hours"
                    className={`${buttonClass("secondary", "sm")} shrink-0`}
                  >
                    {oh?.signedUp.includes(s.id) ? "Inscrito" : "Inscrever-se"}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <Eyebrow>Recém-publicado</Eyebrow>
          {recent.length === 0 ? (
            <p className="mt-4 text-[13.5px] text-pf-muted">Nada publicado ainda.</p>
          ) : (
            <ul className="mt-4 divide-y divide-pf-border overflow-hidden rounded-xl border border-pf-border">
              {recent.map((l) => (
                <li key={l.id} className="flex items-start gap-3 px-5 py-3.5">
                  <AreaDot color={l.accent} className="mt-1.5" />
                  <div className="min-w-0">
                    <p className="text-[14px] font-medium text-pf-text">
                      {areaLabel(l.slug)}: guia do webinar publicado
                    </p>
                    <p className="mt-0.5 text-[12.5px] text-pf-faint">
                      {countSteps(l.guide)} etapas · {l.guide?.demos.length ?? 0} demos
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

/* ---------------------------------------------------------------- retomar */

function ResumeCard({ lob, progress }: { lob: Lob; progress?: Record<string, LobProgress> }) {
  const { done, total } = stepsDone(lob, progress);
  const demo = lob.guide?.demos[0];
  const nextStep = lob.guide?.demos
    .flatMap((d) => d.steps)
    .find((s) => !(progress?.[lob.id]?.steps_done ?? []).includes(s.id));

  return (
    <section>
      <Eyebrow>{done > 0 ? "Continue de onde parou" : "Comece por aqui"}</Eyebrow>
      <div className="mt-3 overflow-hidden rounded-2xl border border-pf-border bg-pf-bg">
        <div className="grid gap-5 p-5 sm:grid-cols-[300px_minmax(0,1fr)]">
          <Link
            to="/plataforma/lob/$slug"
            params={{ slug: lob.slug }}
            className="relative flex min-h-[180px] flex-col justify-between overflow-hidden rounded-xl p-4"
            style={{ background: areaGradient(lob.accent, lob.accent_2) }}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/75">
              {areaLabel(lob.slug)}
            </span>
            <span className="text-[15px] font-semibold leading-snug text-white">{lob.title}</span>
          </Link>

          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              {total > 0 && (
                <Chip>
                  {demo?.label ?? "Demo 1"} · etapa {Math.min(done + 1, total)} de {total}
                </Chip>
              )}
              {lob.guide?.demos.length ? <Chip>{lob.guide.demos.length} demos</Chip> : null}
            </div>

            <h2 className="mt-3 text-[19px] font-semibold tracking-[-0.02em] text-pf-text">
              {nextStep ? (demo?.title ?? lob.title) : lob.title}
            </h2>
            <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-pf-muted">
              {nextStep
                ? `Próxima etapa: ${nextStep.title}. Os arquivos-fonte já estão no roteiro.`
                : (lob.subtitle ?? "")}
            </p>

            {total > 0 && (
              <div className="mt-4 max-w-md">
                <ProgressBar done={done} total={total} />
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                to="/plataforma/lob/$slug"
                params={{ slug: lob.slug }}
                className={buttonClass("primary")}
              >
                {done > 0 ? "Retomar workshop" : "Abrir workshop"}
              </Link>
              <Link
                to="/plataforma/lob/$slug"
                params={{ slug: lob.slug }}
                hash="materiais"
                className={buttonClass("secondary")}
              >
                Ver materiais
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- área */

function AreaCard({ lob }: { lob: Lob }) {
  const soon = lob.status === "coming_soon";
  const steps = countSteps(lob.guide);
  const meta = soon
    ? (lob.event_date ?? "Em breve")
    : [
        lob.guide?.demos.length ? `${lob.guide.demos.length} demos` : null,
        steps ? `${steps} etapas` : null,
      ]
        .filter(Boolean)
        .join(" · ");

  return (
    <Link
      to="/plataforma/lob/$slug"
      params={{ slug: lob.slug }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-pf-border bg-pf-bg transition hover:border-pf-text/20"
    >
      <div
        className="relative flex h-[150px] items-start justify-between p-4"
        style={{ background: areaGradient(lob.accent, lob.accent_2) }}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/80">
          {areaLabel(lob.slug)}
        </span>
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
            soon ? "bg-black/25 text-white/90" : "bg-white text-pf-text"
          }`}
        >
          {soon ? "Em breve" : "Disponível"}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[15px] font-semibold leading-snug text-pf-text">{lob.title}</h3>
        {lob.subtitle && (
          <p className="mt-2 flex-1 text-[13px] leading-relaxed text-pf-muted">{lob.subtitle}</p>
        )}
        {meta && <p className="mt-4 font-mono text-[10.5px] text-pf-fainter">{meta}</p>}
      </div>
    </Link>
  );
}
