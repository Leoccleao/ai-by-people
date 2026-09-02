import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { db } from "@/platform/db";
import { downloadCsv, formatDateTime, toCsv } from "@/platform/lib";
import { DataTable, StatusSelect, Td } from "@/platform/admin-ui";
import { Button, Spinner } from "@/platform/ui";
import type { CompanyWebinarRequest, RequestStatus } from "@/integrations/supabase/platform-schema";

export const Route = createFileRoute("/plataforma/admin/solicitacoes")({
  component: Requests,
});

const STATUS: { value: RequestStatus; label: string }[] = [
  { value: "novo", label: "Novo" },
  { value: "em_contato", label: "Em contato" },
  { value: "agendado", label: "Agendado" },
  { value: "recusado", label: "Recusado" },
];

function Requests() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["pf", "admin", "requests"],
    queryFn: async (): Promise<CompanyWebinarRequest[]> => {
      const { data, error } = await db
        .from("company_webinar_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as CompanyWebinarRequest[];
    },
  });

  async function setStatus(id: string, status: RequestStatus) {
    const { error } = await db.from("company_webinar_requests").update({ status }).eq("id", id);
    if (error) toast.error("Não deu para atualizar.");
    else {
      await qc.invalidateQueries({ queryKey: ["pf", "admin", "requests"] });
      toast.success("Status atualizado.");
    }
  }

  function exportCsv() {
    downloadCsv(
      "solicitacoes-webinar.csv",
      toCsv(
        (data ?? []).map((r) => ({
          criado_em: formatDateTime(r.created_at),
          empresa: r.company ?? "",
          nome: r.name,
          email: r.email,
          areas: r.lob_slugs,
          audiencia: r.audience_size ?? "",
          janelas: r.preferred_windows ?? "",
          observacoes: r.notes ?? "",
          status: r.status,
        })),
        [
          "criado_em",
          "empresa",
          "nome",
          "email",
          "areas",
          "audiencia",
          "janelas",
          "observacoes",
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
          Webinar sob demanda ({data?.length ?? 0})
        </h2>
        <Button variant="secondary" size="sm" onClick={exportCsv}>
          Exportar CSV
        </Button>
      </div>

      <DataTable
        head={["Empresa", "Contato", "Áreas", "Audiência / janelas", "Recebido", "Status"]}
        empty={(data ?? []).length === 0}
      >
        {(data ?? []).map((r) => (
          <tr key={r.id} className="hover:bg-pf-surface">
            <Td className="font-medium">{r.company || "—"}</Td>
            <Td>
              {r.name}
              <span className="block text-[12px] text-pf-faint">{r.email}</span>
            </Td>
            <Td className="text-pf-muted">{r.lob_slugs.join(", ") || "—"}</Td>
            <Td className="text-pf-muted">
              {r.audience_size || "—"}
              {r.preferred_windows && (
                <span className="block text-[12px] text-pf-faint">{r.preferred_windows}</span>
              )}
              {r.notes && <span className="mt-1 block text-[12px] text-pf-faint">{r.notes}</span>}
            </Td>
            <Td>{formatDateTime(r.created_at)}</Td>
            <Td>
              <StatusSelect
                value={r.status}
                options={STATUS}
                onChange={(v) => void setStatus(r.id, v)}
              />
            </Td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
