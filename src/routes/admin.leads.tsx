import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

type Lead = {
  id: string;
  created_at: string;
  source: string;
  name: string | null;
  email: string;
  organization: string | null;
  program: string | null;
  message: string | null;
  language: string | null;
};

const TOKEN_KEY = "abp_admin_token";

export const Route = createFileRoute("/admin/leads")({
  head: () => ({
    meta: [
      { title: "Admin — Leads" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminLeads,
});

function csvEscape(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function toCSV(rows: Lead[]): string {
  const cols: (keyof Lead)[] = [
    "created_at",
    "source",
    "name",
    "email",
    "organization",
    "program",
    "message",
    "language",
    "id",
  ];
  const header = cols.join(",");
  const body = rows.map((r) => cols.map((c) => csvEscape(r[c])).join(",")).join("\n");
  return `${header}\n${body}\n`;
}

function AdminLeads() {
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);

  async function load(t: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/public/admin/leads", {
        method: "POST",
        headers: { Authorization: `Bearer ${t}` },
      });
      if (res.status === 401) {
        setError("Token inválido.");
        setAuthed(false);
        localStorage.removeItem(TOKEN_KEY);
        return;
      }
      if (!res.ok) {
        setError(`Erro ${res.status}`);
        return;
      }
      const data = (await res.json()) as { leads: Lead[] };
      setLeads(data.leads);
      setAuthed(true);
      localStorage.setItem(TOKEN_KEY, t);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
    if (stored) {
      setToken(stored);
      void load(stored);
    }
  }, []);

  function downloadCSV() {
    const blob = new Blob([toCSV(leads)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setAuthed(false);
    setToken("");
    setLeads([]);
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-paper text-ink flex items-center justify-center px-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (token.trim()) void load(token.trim());
          }}
          className="w-full max-w-sm"
        >
          <div className="text-[11px] uppercase tracking-[0.3em] text-accent font-mono mb-6">
            Admin
          </div>
          <h1 className="font-serif text-3xl mb-6">Leads</h1>
          <label className="block text-[11px] uppercase tracking-[0.2em] text-ink-muted">
            Token de acesso
          </label>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="mt-2 w-full border-b border-rule bg-transparent py-2 focus:outline-none focus:border-ink"
            autoFocus
          />
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-8 border border-ink px-8 py-3 text-sm uppercase tracking-[0.2em] hover:bg-ink hover:text-paper transition disabled:opacity-50"
          >
            {loading ? "…" : "Entrar"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b border-rule">
        <div className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-accent font-mono">Admin</div>
            <h1 className="font-serif text-2xl mt-1">Leads · {leads.length}</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => void load(token)}
              className="border border-ink/30 px-4 py-2 text-xs uppercase tracking-[0.2em] hover:border-ink"
            >
              Atualizar
            </button>
            <button
              onClick={downloadCSV}
              disabled={leads.length === 0}
              className="border border-ink bg-ink text-paper px-4 py-2 text-xs uppercase tracking-[0.2em] hover:bg-transparent hover:text-ink transition disabled:opacity-50"
            >
              Baixar CSV
            </button>
            <button
              onClick={logout}
              className="text-xs uppercase tracking-[0.2em] text-ink-muted hover:text-ink"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        {leads.length === 0 ? (
          <p className="text-ink-muted">Sem leads ainda.</p>
        ) : (
          <div className="overflow-x-auto border border-rule">
            <table className="w-full text-sm">
              <thead className="bg-paper-elev text-left text-[11px] uppercase tracking-[0.15em] text-ink-muted">
                <tr>
                  <th className="px-3 py-2">Data</th>
                  <th className="px-3 py-2">Origem</th>
                  <th className="px-3 py-2">Nome</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Organização</th>
                  <th className="px-3 py-2">Programa</th>
                  <th className="px-3 py-2">Mensagem</th>
                  <th className="px-3 py-2">Lang</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id} className="border-t border-rule align-top">
                    <td className="px-3 py-2 whitespace-nowrap font-mono text-xs">
                      {new Date(l.created_at).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">{l.source}</td>
                    <td className="px-3 py-2">{l.name}</td>
                    <td className="px-3 py-2">
                      <a href={`mailto:${l.email}`} className="underline">{l.email}</a>
                    </td>
                    <td className="px-3 py-2">{l.organization}</td>
                    <td className="px-3 py-2">{l.program}</td>
                    <td className="px-3 py-2 max-w-md whitespace-pre-wrap">{l.message}</td>
                    <td className="px-3 py-2 uppercase text-xs">{l.language}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
