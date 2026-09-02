import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { db } from "@/platform/db";
import { useLobs } from "@/platform/queries";
import { downloadCsv, formatDateTime, toCsv } from "@/platform/lib";
import { DataTable, Td } from "@/platform/admin-ui";
import { Button, Card, Field, Spinner, inputClass } from "@/platform/ui";
import type { OfficeHour, Profile } from "@/integrations/supabase/platform-schema";

export const Route = createFileRoute("/plataforma/admin/office-hours")({
  component: AdminOfficeHours,
});

type Draft = {
  title: string;
  lobId: string;
  instructor: string;
  description: string;
  startsAtLocal: string;
  durationMin: string;
  meetingUrl: string;
  recordingUrl: string;
  capacity: string;
};

const EMPTY: Draft = {
  title: "",
  lobId: "",
  instructor: "",
  description: "",
  startsAtLocal: "",
  durationMin: "60",
  meetingUrl: "",
  recordingUrl: "",
  capacity: "",
};

function toLocalInput(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function AdminOfficeHours() {
  const qc = useQueryClient();
  const { data: lobs } = useLobs();
  const [editing, setEditing] = useState<OfficeHour | "new" | null>(null);

  const sessions = useQuery({
    queryKey: ["pf", "admin", "office-hours"],
    queryFn: async (): Promise<{ list: OfficeHour[]; counts: Record<string, number> }> => {
      const [{ data, error }, { data: signups }] = await Promise.all([
        db.from("office_hours").select("*").order("starts_at", { ascending: false }),
        db.from("office_hours_signups").select("office_hour_id"),
      ]);
      if (error) throw error;
      const counts: Record<string, number> = {};
      for (const s of signups ?? []) counts[s.office_hour_id] = (counts[s.office_hour_id] ?? 0) + 1;
      return { list: (data ?? []) as OfficeHour[], counts };
    },
  });

  const lobTitle = useMemo(() => {
    const m = new Map<string, string>();
    for (const l of lobs ?? []) m.set(l.id, l.title);
    return m;
  }, [lobs]);

  async function refresh() {
    await qc.invalidateQueries({ queryKey: ["pf", "admin", "office-hours"] });
    await qc.invalidateQueries({ queryKey: ["pf", "office-hours"] });
  }

  async function remove(session: OfficeHour) {
    const { error } = await db.from("office_hours").delete().eq("id", session.id);
    if (error) toast.error("Não deu para excluir.");
    else {
      toast.success("Sessão excluída.");
      setEditing(null);
      await refresh();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-medium uppercase tracking-wider text-pf-faint">Sessões</h2>
        <Button size="sm" onClick={() => setEditing("new")}>
          Nova sessão
        </Button>
      </div>

      {editing && (
        <SessionForm
          session={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={async () => {
            setEditing(null);
            await refresh();
          }}
        />
      )}

      {sessions.isLoading ? (
        <Spinner />
      ) : (
        <DataTable
          head={["Sessão", "Área", "Quando", "Inscritos", "Ações"]}
          empty={(sessions.data?.list ?? []).length === 0}
        >
          {(sessions.data?.list ?? []).map((s) => (
            <tr key={s.id} className="hover:bg-pf-surface">
              <Td>
                <span className="font-medium">{s.title}</span>
                {s.instructor && (
                  <span className="block text-[12px] text-pf-faint">{s.instructor}</span>
                )}
              </Td>
              <Td>{s.lob_id ? (lobTitle.get(s.lob_id) ?? "—") : "Geral"}</Td>
              <Td>{formatDateTime(s.starts_at)}</Td>
              <Td>
                {sessions.data?.counts[s.id] ?? 0}
                {s.capacity ? ` / ${s.capacity}` : ""}
              </Td>
              <Td>
                <div className="flex flex-wrap gap-1.5">
                  <Button variant="ghost" size="sm" onClick={() => setEditing(s)}>
                    Editar
                  </Button>
                  <SignupsButton session={s} />
                  <Button variant="danger" size="sm" onClick={() => remove(s)}>
                    Excluir
                  </Button>
                </div>
              </Td>
            </tr>
          ))}
        </DataTable>
      )}
    </div>
  );
}

function SignupsButton({ session }: { session: OfficeHour }) {
  const [busy, setBusy] = useState(false);

  async function exportSignups() {
    setBusy(true);
    const { data, error } = await db
      .from("office_hours_signups")
      .select("user_id, created_at")
      .eq("office_hour_id", session.id);
    if (error || !data) {
      toast.error("Não deu para carregar os inscritos.");
      setBusy(false);
      return;
    }
    const ids = data.map((d) => d.user_id);
    const { data: profiles } = await db.from("profiles").select("*").in("id", ids);
    const byId = new Map((profiles ?? []).map((p) => [p.id, p as Profile]));
    downloadCsv(
      `inscritos-${session.id.slice(0, 8)}.csv`,
      toCsv(
        data.map((d) => {
          const p = byId.get(d.user_id);
          return {
            nome: p?.name ?? "",
            email: p?.email ?? "",
            empresa: p?.company ?? "",
            inscrito_em: formatDateTime(d.created_at),
          };
        }),
        ["nome", "email", "empresa", "inscrito_em"],
      ),
    );
    setBusy(false);
  }

  return (
    <Button variant="ghost" size="sm" onClick={exportSignups} disabled={busy}>
      Inscritos (CSV)
    </Button>
  );
}

function SessionForm({
  session,
  onClose,
  onSaved,
}: {
  session: OfficeHour | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { data: lobs } = useLobs();
  const [draft, setDraft] = useState<Draft>(
    session
      ? {
          title: session.title,
          lobId: session.lob_id ?? "",
          instructor: session.instructor ?? "",
          description: session.description ?? "",
          startsAtLocal: toLocalInput(session.starts_at),
          durationMin: String(session.duration_min),
          meetingUrl: session.meeting_url ?? "",
          recordingUrl: session.recording_url ?? "",
          capacity: session.capacity ? String(session.capacity) : "",
        }
      : EMPTY,
  );
  const [busy, setBusy] = useState(false);

  function set<K extends keyof Draft>(k: K, v: Draft[K]) {
    setDraft((d) => ({ ...d, [k]: v }));
  }

  async function save() {
    if (!draft.title.trim() || !draft.startsAtLocal) {
      toast.error("Título e data/hora são obrigatórios.");
      return;
    }
    setBusy(true);
    const payload = {
      title: draft.title.trim(),
      lob_id: draft.lobId || null,
      instructor: draft.instructor.trim() || null,
      description: draft.description.trim() || null,
      // O input datetime-local devolve o horário local do navegador do admin.
      starts_at: new Date(draft.startsAtLocal).toISOString(),
      duration_min: Number(draft.durationMin) || 60,
      meeting_url: draft.meetingUrl.trim() || null,
      recording_url: draft.recordingUrl.trim() || null,
      capacity: draft.capacity ? Number(draft.capacity) : null,
    };
    const res = session
      ? await db.from("office_hours").update(payload).eq("id", session.id)
      : await db.from("office_hours").insert(payload);
    setBusy(false);
    if (res.error) {
      console.error("[platform] salvar sessão falhou", res.error);
      toast.error("Não deu para salvar.");
      return;
    }
    toast.success("Sessão salva.");
    onSaved();
  }

  return (
    <Card className="p-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Título" required>
          <input
            value={draft.title}
            onChange={(e) => set("title", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Área">
          <select
            value={draft.lobId}
            onChange={(e) => set("lobId", e.target.value)}
            className={inputClass}
          >
            <option value="">Geral (todas as áreas)</option>
            {(lobs ?? []).map((l) => (
              <option key={l.id} value={l.id}>
                {l.title}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Início" required hint="No seu fuso; é exibido em horário de Brasília.">
          <input
            type="datetime-local"
            value={draft.startsAtLocal}
            onChange={(e) => set("startsAtLocal", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Duração (min)">
          <input
            type="number"
            min={15}
            value={draft.durationMin}
            onChange={(e) => set("durationMin", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Vagas" hint="Deixe vazio para ilimitado.">
          <input
            type="number"
            min={1}
            value={draft.capacity}
            onChange={(e) => set("capacity", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Instrutor(a)">
          <input
            value={draft.instructor}
            onChange={(e) => set("instructor", e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Field label="Link da sala" hint="Meet, Zoom ou equivalente.">
          <input
            value={draft.meetingUrl}
            onChange={(e) => set("meetingUrl", e.target.value)}
            placeholder="https://"
            className={inputClass}
          />
        </Field>
        <Field label="Link da gravação" hint="Preencha depois da sessão.">
          <input
            value={draft.recordingUrl}
            onChange={(e) => set("recordingUrl", e.target.value)}
            placeholder="https://"
            className={inputClass}
          />
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Descrição">
          <textarea
            rows={3}
            value={draft.description}
            onChange={(e) => set("description", e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="mt-5 flex gap-3">
        <Button onClick={save} disabled={busy}>
          {busy ? "Salvando…" : "Salvar"}
        </Button>
        <Button variant="ghost" onClick={onClose}>
          Cancelar
        </Button>
      </div>
    </Card>
  );
}
