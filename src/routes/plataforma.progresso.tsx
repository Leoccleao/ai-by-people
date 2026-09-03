import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Protected } from "@/platform/guard";
import { areaLabel } from "@/platform/shell";
import { useLobs, useMyProgress } from "@/platform/queries";
import { countSteps } from "@/platform/guide-schema";
import { AreaDot, Eyebrow, ProgressBar, SectionHead } from "@/platform/revamp-ui";
import { Card, EmptyState, Spinner, buttonClass } from "@/platform/ui";

export const Route = createFileRoute("/plataforma/progresso")({
  component: () => (
    <Protected>
      <Progresso />
    </Protected>
  ),
});

function Progresso() {
  const { data: lobs, isLoading } = useLobs();
  const { data: progress } = useMyProgress();

  const linhas = useMemo(
    () =>
      (lobs ?? [])
        .filter((l) => l.status === "published")
        .map((l) => {
          const total = countSteps(l.guide);
          const row = progress?.[l.id];
          const done = Math.min((row?.steps_done ?? []).length, total);
          const checklist = l.guide?.checklist.length ?? 0;
          const checked = Math.min((row?.checklist_done ?? []).length, checklist);
          return { lob: l, total, done, checklist, checked };
        }),
    [lobs, progress],
  );

  const totalEtapas = linhas.reduce((n, r) => n + r.total, 0);
  const totalFeitas = linhas.reduce((n, r) => n + r.done, 0);

  if (isLoading) return <Spinner />;

  return (
    <div className="space-y-8">
      <header>
        <Eyebrow>Meu progresso</Eyebrow>
        <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.02em] text-pf-text">
          O que você já percorreu.
        </h1>
        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-pf-muted">
          As etapas que você marca no roteiro de cada área ficam guardadas na sua conta.
        </p>
      </header>

      {linhas.length === 0 ? (
        <EmptyState
          title="Nenhuma área publicada ainda"
          body="Assim que o primeiro workshop entrar no ar, seu progresso aparece aqui."
        />
      ) : (
        <>
          <Card className="p-5">
            <SectionHead
              title="No total"
              meta={`${totalFeitas} de ${totalEtapas} etapas concluídas`}
            />
            <div className="mt-4">
              <ProgressBar done={totalFeitas} total={totalEtapas} />
            </div>
          </Card>

          <div className="space-y-3">
            {linhas.map(({ lob, total, done, checklist, checked }) => (
              <Card key={lob.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5">
                      <AreaDot color={lob.accent} />
                      <span className="text-[14px] font-medium text-pf-text">
                        {areaLabel(lob.slug)}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[13px] text-pf-muted">{lob.title}</p>
                    <p className="mt-2 font-mono text-[10.5px] text-pf-fainter">
                      {done} de {total} etapas
                      {checklist > 0 ? ` · checklist ${checked} de ${checklist}` : ""}
                    </p>
                  </div>
                  <Link
                    to="/plataforma/lob/$slug"
                    params={{ slug: lob.slug }}
                    className={`${buttonClass("secondary", "sm")} shrink-0`}
                  >
                    {done > 0 && done < total ? "Retomar" : "Abrir"}
                  </Link>
                </div>
                <div className="mt-4">
                  <ProgressBar done={done} total={total} />
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
