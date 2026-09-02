import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/platform/db";
import { useLobs } from "@/platform/queries";
import { downloadCsv, formatDate, toCsv } from "@/platform/lib";
import { DataTable, StatCard, Td } from "@/platform/admin-ui";
import { Button, Spinner } from "@/platform/ui";
import type {
  DomainStats,
  EngagementEvent,
  Profile,
} from "@/integrations/supabase/platform-schema";

export const Route = createFileRoute("/plataforma/admin/")({
  component: Engagement,
});

const PERIODS = [
  { value: "7", label: "Últimos 7 dias" },
  { value: "30", label: "Últimos 30 dias" },
  { value: "90", label: "Últimos 90 dias" },
  { value: "all", label: "Todo o período" },
];

/** Teto de eventos lidos para os recortes filtrados — o MVP prevê ~500 usuários. */
const EVENT_CAP = 50_000;

function Engagement() {
  const [period, setPeriod] = useState("30");
  const [lobId, setLobId] = useState("");
  const { data: lobs } = useLobs();

  const domains = useQuery({
    queryKey: ["pf", "admin", "domains"],
    queryFn: async (): Promise<DomainStats[]> => {
      const { data, error } = await db
        .from("admin_domain_stats")
        .select("*")
        .order("users", { ascending: false });
      if (error) throw error;
      return (data ?? []) as DomainStats[];
    },
  });

  const events = useQuery({
    queryKey: ["pf", "admin", "events", period, lobId],
    queryFn: async (): Promise<EngagementEvent[]> => {
      let q = db.from("engagement_events").select("*").limit(EVENT_CAP);
      if (period !== "all") {
        const since = new Date(Date.now() - Number(period) * 86_400_000).toISOString();
        q = q.gte("created_at", since);
      }
      if (lobId) q = q.eq("lob_id", lobId);
      const { data, error } = await q.order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as EngagementEvent[];
    },
  });

  const users = useQuery({
    queryKey: ["pf", "admin", "profiles-lite"],
    queryFn: async (): Promise<Profile[]> => {
      const { data, error } = await db.from("profiles").select("*");
      if (error) throw error;
      return (data ?? []) as Profile[];
    },
  });

  /** Agregado do recorte filtrado (período + área), por domínio. */
  const filtered = useMemo(() => {
    const rows = new Map<
      string,
      {
        domain: string;
        users: Set<string>;
        plays: number;
        downloads: number;
        ohSignups: number;
        views: number;
      }
    >();
    for (const e of events.data ?? []) {
      const domain = e.email_domain ?? "—";
      const row = rows.get(domain) ?? {
        domain,
        users: new Set<string>(),
        plays: 0,
        downloads: 0,
        ohSignups: 0,
        views: 0,
      };
      row.users.add(e.user_id);
      if (e.type === "video_play") row.plays += 1;
      else if (e.type === "download") row.downloads += 1;
      else if (e.type === "oh_signup") row.ohSignups += 1;
      else if (e.type === "page_view") row.views += 1;
      rows.set(domain, row);
    }
    return [...rows.values()]
      .map((r) => ({ ...r, activeUsers: r.users.size }))
      .sort((a, b) => b.activeUsers - a.activeUsers);
  }, [events.data]);

  const totals = useMemo(() => {
    const all = domains.data ?? [];
    return {
      users: all.reduce((s, d) => s + d.users, 0),
      active: all.reduce((s, d) => s + d.active_30d, 0),
      companies: all.length,
      plays: filtered.reduce((s, r) => s + r.plays, 0),
      downloads: filtered.reduce((s, r) => s + r.downloads, 0),
    };
  }, [domains.data, filtered]);

  function exportDomains() {
    downloadCsv(
      `engajamento-por-dominio-${period}.csv`,
      toCsv(
        filtered.map((r) => ({
          dominio: r.domain,
          usuarios_ativos: r.activeUsers,
          visualizacoes: r.views,
          videos_iniciados: r.plays,
          downloads: r.downloads,
          inscricoes_office_hours: r.ohSignups,
        })),
        [
          "dominio",
          "usuarios_ativos",
          "visualizacoes",
          "videos_iniciados",
          "downloads",
          "inscricoes_office_hours",
        ],
      ),
    );
  }

  function exportUsers() {
    const byUser = new Map<string, { plays: number; downloads: number }>();
    for (const e of events.data ?? []) {
      const row = byUser.get(e.user_id) ?? { plays: 0, downloads: 0 };
      if (e.type === "video_play") row.plays += 1;
      if (e.type === "download") row.downloads += 1;
      byUser.set(e.user_id, row);
    }
    downloadCsv(
      `engajamento-por-usuario-${period}.csv`,
      toCsv(
        (users.data ?? []).map((u) => ({
          nome: u.name ?? "",
          email: u.email,
          empresa: u.company ?? "",
          dominio: u.email_domain,
          area: u.role_lob ?? "",
          origem: u.origin === "invite" ? "convite" : "auto-cadastro",
          criado_em: formatDate(u.created_at),
          ultimo_acesso: u.last_seen_at ? formatDate(u.last_seen_at) : "",
          videos_iniciados: byUser.get(u.id)?.plays ?? 0,
          downloads: byUser.get(u.id)?.downloads ?? 0,
        })),
        [
          "nome",
          "email",
          "empresa",
          "dominio",
          "area",
          "origem",
          "criado_em",
          "ultimo_acesso",
          "videos_iniciados",
          "downloads",
        ],
      ),
    );
  }

  const loading = domains.isLoading || events.isLoading;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Empresas" value={totals.companies} />
        <StatCard label="Usuários" value={totals.users} />
        <StatCard label="Ativos (30d)" value={totals.active} />
        <StatCard label="Vídeos iniciados" value={totals.plays} />
        <StatCard label="Downloads" value={totals.downloads} />
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <label className="text-[13px]">
          <span className="block text-pf-faint">Período</span>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="mt-1 rounded-lg border border-pf-border bg-pf-bg px-2.5 py-1.5 text-[13px]"
          >
            {PERIODS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-[13px]">
          <span className="block text-pf-faint">Área</span>
          <select
            value={lobId}
            onChange={(e) => setLobId(e.target.value)}
            className="mt-1 rounded-lg border border-pf-border bg-pf-bg px-2.5 py-1.5 text-[13px]"
          >
            <option value="">Todas</option>
            {(lobs ?? []).map((l) => (
              <option key={l.id} value={l.id}>
                {l.title}
              </option>
            ))}
          </select>
        </label>
        <div className="ml-auto flex gap-2">
          <Button variant="secondary" size="sm" onClick={exportDomains}>
            CSV por empresa
          </Button>
          <Button variant="secondary" size="sm" onClick={exportUsers}>
            CSV por usuário
          </Button>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <DataTable
          head={[
            "Domínio",
            "Usuários ativos",
            "Visualizações",
            "Vídeos",
            "Downloads",
            "Office hours",
            "Cadastrados",
          ]}
          empty={filtered.length === 0}
        >
          {filtered.map((r) => {
            const total = (domains.data ?? []).find((d) => d.domain === r.domain);
            return (
              <tr key={r.domain} className="hover:bg-pf-surface">
                <Td className="font-medium">{r.domain}</Td>
                <Td>{r.activeUsers}</Td>
                <Td>{r.views}</Td>
                <Td>{r.plays}</Td>
                <Td>{r.downloads}</Td>
                <Td>{r.ohSignups}</Td>
                <Td className="text-pf-muted">{total?.users ?? "—"}</Td>
              </tr>
            );
          })}
        </DataTable>
      )}

      <p className="text-[12px] leading-relaxed text-pf-faint">
        Os números do topo (empresas, usuários, ativos) consideram toda a base. A tabela e os
        contadores de vídeo e download seguem o período e a área selecionados.
      </p>
    </div>
  );
}
