import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { db } from "@/platform/db";
import { useLobs } from "@/platform/queries";
import { downloadCsv, formatDateTime, toCsv } from "@/platform/lib";
import { DataTable, StatusSelect, Td } from "@/platform/admin-ui";
import { Button, Spinner } from "@/platform/ui";
import type { StoryStatus, SuccessStory } from "@/integrations/supabase/platform-schema";

export const Route = createFileRoute("/plataforma/admin/historias")({
  component: AdminStories,
});

const STATUS: { value: StoryStatus; label: string }[] = [
  { value: "nova", label: "Nova" },
  { value: "em_avaliacao", label: "Em avaliação" },
  { value: "selecionada", label: "Selecionada" },
  { value: "arquivada", label: "Arquivada" },
];

function AdminStories() {
  const qc = useQueryClient();
  const { data: lobs } = useLobs();

  const { data, isLoading } = useQuery({
    queryKey: ["pf", "admin", "stories"],
    queryFn: async (): Promise<SuccessStory[]> => {
      const { data, error } = await db
        .from("success_stories")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as SuccessStory[];
    },
  });

  const lobTitle = useMemo(() => {
    const m = new Map<string, string>();
    for (const l of lobs ?? []) m.set(l.id, l.title);
    return m;
  }, [lobs]);

  async function setStatus(id: string, status: StoryStatus) {
    const { error } = await db.from("success_stories").update({ status }).eq("id", id);
    if (error) toast.error("Não deu para atualizar.");
    else {
      await qc.invalidateQueries({ queryKey: ["pf", "admin", "stories"] });
      toast.success("Status atualizado.");
    }
  }

  function exportCsv() {
    downloadCsv(
      "historias-de-sucesso.csv",
      toCsv(
        (data ?? []).map((s) => ({
          criado_em: formatDateTime(s.created_at),
          titulo: s.title,
          nome: s.name,
          email: s.email,
          empresa: s.company ?? "",
          area: s.lob_id ? (lobTitle.get(s.lob_id) ?? "") : "",
          descricao: s.description,
          video: s.video_url,
          consentimento_contato: formatDateTime(s.consent_contact_at),
          ciencia_nao_publicacao: formatDateTime(s.consent_no_publish_ack_at),
          status: s.status,
        })),
        [
          "criado_em",
          "titulo",
          "nome",
          "email",
          "empresa",
          "area",
          "descricao",
          "video",
          "consentimento_contato",
          "ciencia_nao_publicacao",
          "status",
        ],
      ),
    );
  }

  if (isLoading) return <Spinner />;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-medium uppercase tracking-wider text-pf-faint">
          Histórias recebidas ({data?.length ?? 0})
        </h2>
        <Button variant="secondary" size="sm" onClick={exportCsv}>
          Exportar CSV
        </Button>
      </div>

      <DataTable
        head={["História", "Quem enviou", "Área", "Vídeo", "Recebida", "Status"]}
        empty={(data ?? []).length === 0}
      >
        {(data ?? []).map((s) => (
          <tr key={s.id} className="hover:bg-pf-surface">
            <Td>
              <span className="font-medium">{s.title}</span>
              <span className="mt-1 block max-w-md text-[12px] leading-relaxed text-pf-muted">
                {s.description}
              </span>
            </Td>
            <Td>
              {s.name}
              <span className="block text-[12px] text-pf-faint">{s.email}</span>
              {s.company && <span className="block text-[12px] text-pf-faint">{s.company}</span>}
            </Td>
            <Td>{s.lob_id ? (lobTitle.get(s.lob_id) ?? "—") : "—"}</Td>
            <Td>
              <a
                href={s.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pf-link underline underline-offset-2"
              >
                Abrir
              </a>
            </Td>
            <Td>{formatDateTime(s.created_at)}</Td>
            <Td>
              <StatusSelect
                value={s.status}
                options={STATUS}
                onChange={(v) => void setStatus(s.id, v)}
              />
            </Td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
