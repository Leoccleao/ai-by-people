import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usePlatformAuth } from "@/platform/auth";
import { Protected } from "@/platform/guard";
import { db } from "@/platform/db";
import { useLobs, useOfficeHours } from "@/platform/queries";
import { sendOfficeHourConfirmation } from "@/platform/server";
import { buildIcs, downloadBlob, formatDateTime, track } from "@/platform/lib";
import { Button, Card, EmptyState, PageHeader, Spinner, Tag } from "@/platform/ui";
import type { Lob, OfficeHour } from "@/integrations/supabase/platform-schema";

export const Route = createFileRoute("/plataforma/office-hours")({
  component: () => (
    <Protected>
      <OfficeHoursPage />
    </Protected>
  ),
});

function OfficeHoursPage() {
  const { data, isLoading } = useOfficeHours();
  const { data: lobs } = useLobs();

  const byId = useMemo(() => {
    const m = new Map<string, Lob>();
    for (const l of lobs ?? []) m.set(l.id, l);
    return m;
  }, [lobs]);

  const now = Date.now();
  const upcoming = (data?.sessions ?? []).filter((s) => new Date(s.starts_at).getTime() >= now);
  const past = (data?.sessions ?? [])
    .filter((s) => new Date(s.starts_at).getTime() < now)
    .reverse();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Office Hours"
        sub="Sessões ao vivo para tirar dúvida sobre o conteúdo. Inscrição em um clique; o link da sala chega por e-mail e fica aqui."
      />

      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <section>
            <h2 className="text-sm font-medium uppercase tracking-wider text-pf-faint">Próximas</h2>
            {upcoming.length === 0 ? (
              <div className="mt-4">
                <EmptyState
                  title="Nenhuma sessão agendada"
                  body="As próximas datas são divulgadas por aqui e por e-mail."
                />
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {upcoming.map((s) => (
                  <SessionCard
                    key={s.id}
                    session={s}
                    lob={s.lob_id ? (byId.get(s.lob_id) ?? null) : null}
                    signedUp={Boolean(data?.signedUp.includes(s.id))}
                  />
                ))}
              </div>
            )}
          </section>

          {past.length > 0 && (
            <section>
              <h2 className="text-sm font-medium uppercase tracking-wider text-pf-faint">
                Sessões passadas
              </h2>
              <div className="mt-4 space-y-3">
                {past.map((s) => (
                  <SessionCard
                    key={s.id}
                    session={s}
                    lob={s.lob_id ? (byId.get(s.lob_id) ?? null) : null}
                    signedUp={Boolean(data?.signedUp.includes(s.id))}
                    past
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function SessionCard({
  session,
  lob,
  signedUp,
  past = false,
}: {
  session: OfficeHour;
  lob: Lob | null;
  signedUp: boolean;
  past?: boolean;
}) {
  const { session: authSession } = usePlatformAuth();
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const userId = authSession?.user.id ?? null;

  async function signUp() {
    if (!userId || busy) return;
    setBusy(true);
    const { error } = await db
      .from("office_hours_signups")
      .insert({ office_hour_id: session.id, user_id: userId });
    if (error) {
      toast.error(
        error.code === "23505" ? "Você já está inscrito." : "Não deu para inscrever agora.",
      );
      setBusy(false);
      return;
    }
    void track("oh_signup", { userId, lobId: session.lob_id });
    await qc.invalidateQueries({ queryKey: ["pf", "office-hours"] });

    try {
      const res = await sendOfficeHourConfirmation({ data: { officeHourId: session.id } });
      toast.success(
        res.status === "sent"
          ? "Inscrição confirmada. O e-mail com o link já saiu."
          : "Inscrição confirmada. O link da sala está aqui na página.",
      );
    } catch {
      toast.success("Inscrição confirmada.");
    }
    setBusy(false);
  }

  async function cancel() {
    if (!userId || busy) return;
    setBusy(true);
    const { error } = await db
      .from("office_hours_signups")
      .delete()
      .eq("office_hour_id", session.id)
      .eq("user_id", userId);
    if (error) toast.error("Não deu para cancelar agora.");
    else {
      await qc.invalidateQueries({ queryKey: ["pf", "office-hours"] });
      toast.success("Inscrição cancelada.");
    }
    setBusy(false);
  }

  function addToCalendar() {
    downloadBlob(
      new Blob([buildIcs(session, lob)], { type: "text/calendar;charset=utf-8" }),
      `office-hours-${session.id.slice(0, 8)}.ics`,
    );
  }

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {lob && <Tag>{lob.title}</Tag>}
            {signedUp && !past && <Tag>Inscrito</Tag>}
            {past && <Tag tone="soon">Encerrada</Tag>}
          </div>
          <h3 className="mt-2.5 text-[15px] font-semibold text-pf-text">{session.title}</h3>
          <p className="mt-1 text-[13px] text-pf-muted">
            {formatDateTime(session.starts_at)} · horário de Brasília
            {session.instructor ? ` · ${session.instructor}` : ""}
          </p>
          {session.description && (
            <p className="mt-2.5 max-w-2xl text-[13px] leading-relaxed text-pf-muted">
              {session.description}
            </p>
          )}
          {signedUp && !past && session.meeting_url && (
            <a
              href={session.meeting_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-[13px] text-pf-link underline underline-offset-2"
            >
              Entrar na sala →
            </a>
          )}
          {past && session.recording_url && (
            <a
              href={session.recording_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-[13px] text-pf-link underline underline-offset-2"
            >
              Ver a gravação →
            </a>
          )}
        </div>

        {!past && (
          <div className="flex shrink-0 flex-wrap gap-2">
            {signedUp ? (
              <>
                <Button variant="secondary" size="sm" onClick={addToCalendar}>
                  Adicionar ao calendário
                </Button>
                <Button variant="ghost" size="sm" onClick={cancel} disabled={busy}>
                  Cancelar
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={signUp} disabled={busy}>
                {busy ? "…" : "Inscrever-se"}
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
