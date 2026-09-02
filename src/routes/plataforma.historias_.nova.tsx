import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { usePlatformAuth } from "@/platform/auth";
import { Protected } from "@/platform/guard";
import { db } from "@/platform/db";
import { useLobs } from "@/platform/queries";
import { Button, Card, Checkbox, Field, PageHeader, inputClass } from "@/platform/ui";

export const Route = createFileRoute("/plataforma/historias_/nova")({
  component: () => (
    <Protected>
      <NewStory />
    </Protected>
  ),
});

const DISCLAIMERS = [
  "O envio da sua história não gera qualquer compromisso de publicação, premiação ou contrapartida.",
  "Os cases são avaliados e selecionados por equipes internas da OpenAI, mediante processo interno próprio.",
  "Nenhum conteúdo será publicado ou divulgado sem sua autorização prévia e expressa (e, quando aplicável, da sua empresa).",
  "Não inclua no vídeo dados confidenciais, pessoais ou de clientes. Prefira dados fictícios ou anonimizados.",
  "Ao enviar, você declara ter direito de compartilhar o conteúdo do vídeo.",
];

const MAX_DESCRIPTION = 1000;

function NewStory() {
  const { session, profile } = usePlatformAuth();
  const { data: lobs } = useLobs();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    lobId: "",
    title: "",
    description: "",
    videoUrl: "",
  });
  const [consentContact, setConsentContact] = useState(false);
  const [consentNoPublish, setConsentNoPublish] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    setForm((f) => ({
      ...f,
      name: f.name || (profile.name ?? ""),
      email: f.email || profile.email,
      company: f.company || (profile.company ?? ""),
    }));
  }, [profile]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy || !session) return;
    if (!consentContact || !consentNoPublish) {
      setError("Os dois consentimentos são obrigatórios para enviar.");
      return;
    }
    try {
      new URL(form.videoUrl);
    } catch {
      setError("O link do vídeo precisa ser uma URL completa (começando com https://).");
      return;
    }

    setBusy(true);
    setError(null);
    const now = new Date().toISOString();
    const { error: insertError } = await db.from("success_stories").insert({
      user_id: session.user.id,
      name: form.name.trim(),
      email: form.email.trim(),
      company: form.company.trim() || null,
      lob_id: form.lobId || null,
      title: form.title.trim(),
      description: form.description.trim(),
      video_url: form.videoUrl.trim(),
      consent_contact_at: now,
      consent_no_publish_ack_at: now,
    });
    setBusy(false);
    if (insertError) {
      console.error("[platform] envio de história falhou", insertError);
      setError("Não deu para enviar agora. Tente de novo em instantes.");
      return;
    }
    toast.success("História enviada. Obrigado.");
    void navigate({ to: "/plataforma/historias" });
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Histórias de Sucesso"
        title="Conte sua história de sucesso"
        sub="Não precisa ser um vídeo produzido. Uma demo gravada na sua própria máquina — gravação de tela simples — está ótima. Queremos histórias reais de uso no Brasil."
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="p-6">
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

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Empresa">
                <input
                  value={form.company}
                  onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                  className={inputClass}
                />
              </Field>
              <Field label="Área relacionada">
                <select
                  value={form.lobId}
                  onChange={(e) => setForm((f) => ({ ...f, lobId: e.target.value }))}
                  className={inputClass}
                >
                  <option value="">Selecione</option>
                  {(lobs ?? []).map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.title}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Título curto" required>
              <input
                required
                maxLength={120}
                placeholder="Ex.: Fechamento mensal com meio dia a menos de conferência"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className={inputClass}
              />
            </Field>

            <Field
              label="O que você fez"
              required
              hint={`${form.description.length}/${MAX_DESCRIPTION} caracteres`}
            >
              <textarea
                required
                rows={6}
                maxLength={MAX_DESCRIPTION}
                placeholder="Qual era o trabalho antes, o que você construiu e o que mudou na prática."
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className={inputClass}
              />
            </Field>

            <Field
              label="Link do vídeo demo"
              required
              hint="YouTube não listado, Loom, Google Drive — qualquer link que a gente consiga abrir."
            >
              <input
                type="url"
                required
                placeholder="https://"
                value={form.videoUrl}
                onChange={(e) => setForm((f) => ({ ...f, videoUrl: e.target.value }))}
                className={inputClass}
              />
            </Field>

            <div className="space-y-3 rounded-lg border border-pf-border bg-pf-surface p-4">
              <Checkbox checked={consentContact} onChange={setConsentContact}>
                Autorizo a equipe organizadora e a OpenAI a assistirem ao vídeo e entrarem em
                contato comigo sobre esta história.
              </Checkbox>
              <Checkbox checked={consentNoPublish} onChange={setConsentNoPublish}>
                Estou ciente de que a submissão não gera compromisso de publicação e de que nada
                será publicado sem minha autorização prévia e por escrito.
              </Checkbox>
            </div>

            {error && (
              <p className="rounded-lg bg-[#B4432E]/5 px-3 py-2.5 text-[13px] leading-relaxed text-[#B4432E]">
                {error}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={busy}>
                {busy ? "Enviando…" : "Enviar história"}
              </Button>
              <Link to="/plataforma/historias" className="self-center text-[13px] text-pf-muted">
                Cancelar
              </Link>
            </div>
          </form>
        </Card>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <Card className="p-5">
            <h2 className="text-[12px] font-medium uppercase tracking-wider text-pf-faint">
              Antes de enviar
            </h2>
            <ul className="mt-3 space-y-2.5 text-[12px] leading-relaxed text-pf-muted">
              {DISCLAIMERS.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </Card>
        </aside>
      </div>
    </div>
  );
}
