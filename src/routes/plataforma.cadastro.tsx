import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { usePlatformAuth } from "@/platform/auth";
import { auth } from "@/platform/db";
import { PlatformShell } from "@/platform/shell";
import { checkEmailAccess } from "@/platform/server";
import { Button, Card, Checkbox, Field, inputClass } from "@/platform/ui";

export const Route = createFileRoute("/plataforma/cadastro")({
  component: SignUp,
});

const ROLE_OPTIONS = [
  { value: "marketing", label: "Marketing" },
  { value: "vendas", label: "Vendas" },
  { value: "financas", label: "Finanças" },
  { value: "estrategia-operacoes", label: "Estratégia & Operações" },
  { value: "dados", label: "Análise de Dados" },
  { value: "juridico", label: "Jurídico" },
  { value: "outro", label: "Outro" },
];

/** Empresa sugerida a partir do domínio: "acme.com.br" → "Acme". */
function companyFromEmail(email: string): string {
  const domain = email.split("@")[1];
  if (!domain) return "";
  const base = domain.split(".")[0] ?? "";
  return base ? base.charAt(0).toUpperCase() + base.slice(1) : "";
}

function SignUp() {
  const { loading, session } = usePlatformAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", company: "", roleLob: "" });
  const [companyTouched, setCompanyTouched] = useState(false);
  const [terms, setTerms] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && session) void navigate({ to: "/plataforma/inicio", replace: true });
  }, [loading, session, navigate]);

  function setEmail(email: string) {
    setForm((f) => ({
      ...f,
      email,
      company: companyTouched ? f.company : companyFromEmail(email),
    }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    if (!terms) {
      setError("É preciso aceitar os Termos de Uso e a Política de Privacidade.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const check = await checkEmailAccess({ data: { email: form.email } });
      if (!check.allowed) {
        setError(
          check.reason === "invalid"
            ? "Confira o e-mail digitado."
            : check.reason === "personal_domain"
              ? "O auto-cadastro só funciona com e-mail corporativo. E-mails pessoais (gmail, outlook e afins) entram apenas por convite."
              : "Ainda não há ninguém da sua empresa cadastrado. Peça um convite a quem organizou o workshop.",
        );
        return;
      }

      const { error: otpError } = await auth.signInWithOtp({
        email: form.email.trim().toLowerCase(),
        options: {
          emailRedirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}/plataforma/inicio`
              : undefined,
          shouldCreateUser: true,
          data: {
            name: form.name.trim(),
            company: form.company.trim(),
            role_lob: form.roleLob,
            // Registrado com timestamp no banco pelo trigger de signup (LGPD).
            terms_accepted: "true",
          },
        },
      });
      if (otpError) throw otpError;
      setSent(true);
    } catch (err) {
      console.error("[platform] cadastro falhou", err);
      setError("Não foi possível concluir o cadastro agora. Tente de novo em instantes.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PlatformShell bare>
      <div className="mx-auto max-w-md py-10 md:py-16">
        <h1 className="text-2xl font-semibold text-pf-text">Criar conta</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-pf-muted">
          Se alguém da sua empresa já participou do workshop, o seu e-mail corporativo já basta.
        </p>

        <Card className="mt-6 p-6">
          {sent ? (
            <div>
              <p className="text-[15px] font-medium text-pf-text">Confirme seu e-mail.</p>
              <p className="mt-2 text-sm leading-relaxed text-pf-muted">
                Enviamos um link para <strong>{form.email}</strong>. Clicar nele confirma o e-mail e
                já entra na plataforma.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <Field label="Nome" required>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className={inputClass}
                />
              </Field>
              <Field label="E-mail corporativo" required>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@suaempresa.com.br"
                  className={inputClass}
                />
              </Field>
              <Field label="Empresa" required>
                <input
                  required
                  value={form.company}
                  onChange={(e) => {
                    setCompanyTouched(true);
                    setForm((f) => ({ ...f, company: e.target.value }));
                  }}
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
                  {ROLE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </Field>

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

              {error && (
                <p className="rounded-lg bg-[#B4432E]/5 px-3 py-2.5 text-[13px] leading-relaxed text-[#B4432E]">
                  {error}
                </p>
              )}
              <Button type="submit" disabled={busy} className="w-full">
                {busy ? "Enviando…" : "Criar conta"}
              </Button>
            </form>
          )}
        </Card>

        <p className="mt-5 text-sm text-pf-muted">
          Já tem conta?{" "}
          <Link
            to="/plataforma/entrar"
            search={{ proximo: undefined }}
            className="text-pf-link underline underline-offset-2"
          >
            Entrar
          </Link>
        </p>
      </div>
    </PlatformShell>
  );
}
