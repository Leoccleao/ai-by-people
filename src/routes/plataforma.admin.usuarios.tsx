import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usePlatformAuth } from "@/platform/auth";
import { db } from "@/platform/db";
import { adminInviteEmails, adminSetActive, adminSetRole } from "@/platform/server";
import { downloadCsv, formatDate, toCsv } from "@/platform/lib";
import { DataTable, Td } from "@/platform/admin-ui";
import { Button, Card, Field, Spinner, Tag, inputClass } from "@/platform/ui";
import type { InvitedEmail, Profile } from "@/integrations/supabase/platform-schema";

export const Route = createFileRoute("/plataforma/admin/usuarios")({
  component: Users,
});

function Users() {
  const qc = useQueryClient();
  const { session } = usePlatformAuth();
  const [query, setQuery] = useState("");

  const people = useQuery({
    queryKey: ["pf", "admin", "people"],
    queryFn: async (): Promise<{ profiles: Profile[]; adminIds: string[] }> => {
      const [{ data: profiles, error }, { data: roles }] = await Promise.all([
        db.from("profiles").select("*").order("created_at", { ascending: false }),
        db.from("user_roles").select("user_id, role").eq("role", "admin"),
      ]);
      if (error) throw error;
      return {
        profiles: (profiles ?? []) as Profile[],
        adminIds: (roles ?? []).map((r) => r.user_id),
      };
    },
  });

  const invites = useQuery({
    queryKey: ["pf", "admin", "invites"],
    queryFn: async (): Promise<InvitedEmail[]> => {
      const { data, error } = await db
        .from("invited_emails")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return (data ?? []) as InvitedEmail[];
    },
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = people.data?.profiles ?? [];
    if (!q) return list;
    return list.filter((p) =>
      [p.name, p.email, p.company, p.email_domain].some((v) => v?.toLowerCase().includes(q)),
    );
  }, [people.data?.profiles, query]);

  const pending = useMemo(() => (invites.data ?? []).filter((i) => !i.claimed_at), [invites.data]);

  async function setRole(userId: string, admin: boolean) {
    try {
      await adminSetRole({ data: { userId, admin } });
      await qc.invalidateQueries({ queryKey: ["pf", "admin", "people"] });
      toast.success(admin ? "Promovido a admin." : "Acesso de admin removido.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não deu para alterar o papel.");
    }
  }

  async function setActive(userId: string, active: boolean) {
    try {
      await adminSetActive({ data: { userId, active } });
      await qc.invalidateQueries({ queryKey: ["pf", "admin", "people"] });
      toast.success(active ? "Conta reativada." : "Conta desativada.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não deu para alterar a conta.");
    }
  }

  function exportCsv() {
    downloadCsv(
      "usuarios.csv",
      toCsv(
        filtered.map((p) => ({
          nome: p.name ?? "",
          email: p.email,
          empresa: p.company ?? "",
          dominio: p.email_domain,
          area: p.role_lob ?? "",
          origem: p.origin === "invite" ? "convite" : "auto-cadastro",
          ativo: p.is_active ? "sim" : "não",
          admin: people.data?.adminIds.includes(p.id) ? "sim" : "não",
          criado_em: formatDate(p.created_at),
          ultimo_acesso: p.last_seen_at ? formatDate(p.last_seen_at) : "",
        })),
        [
          "nome",
          "email",
          "empresa",
          "dominio",
          "area",
          "origem",
          "ativo",
          "admin",
          "criado_em",
          "ultimo_acesso",
        ],
      ),
    );
  }

  return (
    <div className="space-y-8">
      <InviteBox
        onDone={() => void qc.invalidateQueries({ queryKey: ["pf", "admin", "invites"] })}
      />

      <section>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-sm font-medium uppercase tracking-wider text-pf-faint">
            Pessoas cadastradas
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nome, e-mail ou empresa"
              className={`${inputClass} h-9 w-64 py-1.5 text-[13px]`}
            />
            <Button variant="secondary" size="sm" onClick={exportCsv}>
              Exportar CSV
            </Button>
          </div>
        </div>

        {people.isLoading ? (
          <Spinner />
        ) : (
          <div className="mt-4">
            <DataTable
              head={["Pessoa", "Empresa", "Área", "Origem", "Último acesso", "Ações"]}
              empty={filtered.length === 0}
            >
              {filtered.map((p) => {
                const isAdmin = people.data?.adminIds.includes(p.id) ?? false;
                const isSelf = p.id === session?.user.id;
                return (
                  <tr key={p.id} className="hover:bg-pf-surface">
                    <Td>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{p.name || "—"}</span>
                        {isAdmin && <Tag>admin</Tag>}
                        {!p.is_active && <Tag tone="soon">desativado</Tag>}
                      </div>
                      <span className="text-[12px] text-pf-faint">{p.email}</span>
                    </Td>
                    <Td>
                      {p.company || "—"}
                      <span className="block text-[12px] text-pf-faint">{p.email_domain}</span>
                    </Td>
                    <Td>{p.role_lob || "—"}</Td>
                    <Td>{p.origin === "invite" ? "Convite" : "Auto-cadastro"}</Td>
                    <Td>{p.last_seen_at ? formatDate(p.last_seen_at) : "—"}</Td>
                    <Td>
                      <div className="flex flex-wrap gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isSelf && isAdmin}
                          onClick={() => setRole(p.id, !isAdmin)}
                        >
                          {isAdmin ? "Remover admin" : "Tornar admin"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isSelf}
                          onClick={() => setActive(p.id, !p.is_active)}
                        >
                          {p.is_active ? "Desativar" : "Reativar"}
                        </Button>
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </DataTable>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-sm font-medium uppercase tracking-wider text-pf-faint">
          Convites pendentes ({pending.length})
        </h2>
        {invites.isLoading ? (
          <Spinner />
        ) : (
          <div className="mt-4">
            <DataTable head={["E-mail", "Nota", "Convidado em"]} empty={pending.length === 0}>
              {pending.map((i) => (
                <tr key={i.email} className="hover:bg-pf-surface">
                  <Td className="font-medium">{i.email}</Td>
                  <Td className="text-pf-muted">{i.note || "—"}</Td>
                  <Td>{formatDate(i.created_at)}</Td>
                </tr>
              ))}
            </DataTable>
          </div>
        )}
      </section>
    </div>
  );
}

function InviteBox({ onDone }: { onDone: () => void }) {
  const [raw, setRaw] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  async function invite() {
    const emails = raw
      .split(/[\s,;]+/)
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    if (emails.length === 0) return;

    setBusy(true);
    try {
      const res = await adminInviteEmails({ data: { emails, note: note || undefined } });
      const parts = [`${res.invited} convidado(s)`];
      if (res.skipped) parts.push(`${res.skipped} já existiam`);
      if (res.invalid.length) parts.push(`${res.invalid.length} inválido(s)`);
      if (res.emailsSent === "skipped") parts.push("e-mail não enviado (provedor não configurado)");
      toast.success(parts.join(" · "));
      setRaw("");
      setNote("");
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não deu para convidar.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-[15px] font-semibold text-pf-text">Convidar pessoas</h2>
      <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-pf-muted">
        Cole um ou vários e-mails, separados por vírgula, ponto e vírgula ou quebra de linha. Cada
        domínio corporativo convidado passa a aceitar auto-cadastro dos colegas.
      </p>
      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
        <Field label="E-mails">
          <textarea
            rows={3}
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            placeholder="ana@empresa.com.br, joao@empresa.com.br"
            className={inputClass}
          />
        </Field>
        <Field label="Nota (opcional)" hint="Ex.: turma de setembro.">
          <input value={note} onChange={(e) => setNote(e.target.value)} className={inputClass} />
        </Field>
      </div>
      <Button className="mt-4" onClick={invite} disabled={busy || !raw.trim()}>
        {busy ? "Convidando…" : "Convidar"}
      </Button>
    </Card>
  );
}
