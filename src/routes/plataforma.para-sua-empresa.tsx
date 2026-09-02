import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { usePlatformAuth } from "@/platform/auth";
import { Protected } from "@/platform/guard";
import { db } from "@/platform/db";
import { useLobs } from "@/platform/queries";
import { notifyWebinarRequest } from "@/platform/server";
import { Button, Card, EmptyState, Field, PageHeader, inputClass } from "@/platform/ui";

export const Route = createFileRoute("/plataforma/para-sua-empresa")({
  component: () => (
    <Protected>
      <CompanyRequest />
    </Protected>
  ),
});

const AUDIENCE = ["Até 20 pessoas", "20 a 50", "50 a 150", "Mais de 150", "Ainda não sei"];

function CompanyRequest() {
  const { session, profile } = usePlatformAuth();
  const { data: lobs } = useLobs();

  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    audience: "",
    windows: "",
    notes: "",
  });
  const [slugs, setSlugs] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setForm((f) => ({
      ...f,
      name: f.name || (profile.name ?? ""),
      email: f.email || profile.email,
      company: f.company || (profile.company ?? ""),
    }));
  }, [profile]);

  function toggle(slug: string) {
    setSlugs((s) => (s.includes(slug) ? s.filter((x) => x !== slug) : [...s, slug]));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy || !session) return;
    setBusy(true);
    const { error } = await db.from("company_webinar_requests").insert({
      user_id: session.user.id,
      name: form.name.trim(),
      email: form.email.trim(),
      company: form.company.trim() || null,
      lob_slugs: slugs,
      audience_size: form.audience || null,
      preferred_windows: form.windows.trim() || null,
      notes: form.notes.trim() || null,
    });
    if (error) {
      console.error("[platform] pedido de webinar falhou", error);
      toast.error("Não deu para enviar. Tente de novo.");
      setBusy(false);
      return;
    }
    try {
      await notifyWebinarRequest({
        data: { company: form.company.trim(), email: form.email.trim(), lobs: slugs },
      });
    } catch {
      /* a notificação por e-mail é acessória; o registro já está salvo */
    }
    setBusy(false);
    setDone(true);
  }

  if (done) {
    return (
      <div className="space-y-8">
        <PageHeader title="Traga para sua empresa" />
        <EmptyState
          title="Pedido registrado."
          body="A equipe organizadora entra em contato pelo e-mail informado para combinar formato e datas."
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Traga para sua empresa"
        sub="Quer o workshop rodando dentro da sua empresa, com o time todo? Conte o contexto e a equipe organizadora entra em contato. Não há agendamento automático aqui."
      />

      <Card className="max-w-2xl p-6">
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nome" required>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className={inputClass}
              />
            </Field>
            <Field label="E-mail" required>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Empresa" required>
            <input
              required
              value={form.company}
              onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
              className={inputClass}
            />
          </Field>

          <div>
            <span className="text-[13px] font-medium text-pf-text">Áreas de interesse</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {(lobs ?? []).map((l) => {
                const on = slugs.includes(l.slug);
                return (
                  <button
                    key={l.slug}
                    type="button"
                    onClick={() => toggle(l.slug)}
                    className={`rounded-full border px-3 py-1.5 text-[13px] transition ${
                      on
                        ? "border-pf-text bg-pf-text text-white"
                        : "border-pf-border text-pf-muted hover:border-pf-text/40 hover:text-pf-text"
                    }`}
                  >
                    {l.title.replace(/^ChatGPT Work para\s*/i, "")}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Tamanho estimado da audiência">
              <select
                value={form.audience}
                onChange={(e) => setForm((f) => ({ ...f, audience: e.target.value }))}
                className={inputClass}
              >
                <option value="">Selecione</option>
                {AUDIENCE.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </Field>
            <Field
              label="Janelas de data preferidas"
              hint="Ex.: segunda quinzena de outubro, manhãs."
            >
              <input
                value={form.windows}
                onChange={(e) => setForm((f) => ({ ...f, windows: e.target.value }))}
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Observações">
            <textarea
              rows={4}
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              className={inputClass}
            />
          </Field>

          <Button type="submit" disabled={busy}>
            {busy ? "Enviando…" : "Enviar pedido"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
