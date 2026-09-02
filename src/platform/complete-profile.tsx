import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { usePlatformAuth } from "./auth";
import { db } from "./db";
import { Button, Card, Checkbox, Field, inputClass } from "./ui";
import { Link } from "@tanstack/react-router";

const AREAS = [
  { value: "marketing", label: "Marketing" },
  { value: "vendas", label: "Vendas" },
  { value: "financas", label: "Finanças" },
  { value: "estrategia-operacoes", label: "Estratégia & Operações" },
  { value: "dados", label: "Análise de Dados" },
  { value: "juridico", label: "Jurídico" },
  { value: "outro", label: "Outro" },
];

function companyFromDomain(domain: string): string {
  const base = domain.split(".")[0] ?? "";
  return base ? base.charAt(0).toUpperCase() + base.slice(1) : "";
}

/**
 * Quem foi convidado e entrou pela tela "Entrar" cria a conta sem passar pelo
 * formulário de cadastro — o magic link de login não carrega metadados. Sem
 * isso a pessoa fica sem nome, empresa e área, o que quebra os formulários da
 * plataforma e esvazia os relatórios do admin. Aqui completamos uma vez só.
 */
export function CompleteProfile() {
  const { profile, refresh } = usePlatformAuth();
  const [form, setForm] = useState({
    name: profile?.name ?? "",
    company: profile?.company ?? companyFromDomain(profile?.email_domain ?? ""),
    roleLob: profile?.role_lob ?? "",
  });
  const needsTerms = !profile?.terms_accepted_at;
  const [terms, setTerms] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy || !profile) return;
    if (needsTerms && !terms) {
      setError("É preciso aceitar os Termos de Uso e a Política de Privacidade.");
      return;
    }
    setBusy(true);
    setError(null);
    const { error: updateError } = await db
      .from("profiles")
      .update({
        name: form.name.trim(),
        company: form.company.trim() || null,
        role_lob: form.roleLob,
        ...(needsTerms ? { terms_accepted_at: new Date().toISOString() } : {}),
      })
      .eq("id", profile.id);
    setBusy(false);
    if (updateError) {
      console.error("[platform] completar perfil falhou", updateError);
      setError("Não deu para salvar agora. Tente de novo em instantes.");
      return;
    }
    await refresh();
    toast.success("Tudo certo. Bem-vindo.");
  }

  return (
    <div className="mx-auto max-w-md py-6 md:py-10">
      <h1 className="text-2xl font-semibold text-pf-text">Falta pouco</h1>
      <p className="mt-2 text-[15px] leading-relaxed text-pf-muted">
        Só precisamos de três informações para organizar seu acesso e mostrar o conteúdo da sua
        área.
      </p>

      <Card className="mt-6 p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Nome" required>
            <input
              required
              autoFocus
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={inputClass}
            />
          </Field>
          <Field label="Empresa" required>
            <input
              required
              value={form.company}
              onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
              className={inputClass}
            />
          </Field>
          <Field label="Sua área" required>
            <select
              required
              value={form.roleLob}
              onChange={(e) => setForm((f) => ({ ...f, roleLob: e.target.value }))}
              className={inputClass}
            >
              <option value="">Selecione</option>
              {AREAS.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
          </Field>

          {needsTerms && (
            <Checkbox checked={terms} onChange={setTerms}>
              Li e aceito os{" "}
              <Link to="/plataforma/termos" className="text-pf-link underline underline-offset-2">
                Termos de Uso
              </Link>{" "}
              e a{" "}
              <Link
                to="/plataforma/privacidade"
                className="text-pf-link underline underline-offset-2"
              >
                Política de Privacidade
              </Link>
              .
            </Checkbox>
          )}

          {error && (
            <p className="rounded-lg bg-[#B4432E]/5 px-3 py-2.5 text-[13px] leading-relaxed text-[#B4432E]">
              {error}
            </p>
          )}

          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Salvando…" : "Continuar"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

/** O perfil está completo o bastante para usar a plataforma? */
export function profileIsComplete(
  profile: { name: string | null; role_lob: string | null } | null,
) {
  return Boolean(profile?.name?.trim() && profile?.role_lob?.trim());
}
