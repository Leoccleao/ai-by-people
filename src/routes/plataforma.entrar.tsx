import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { usePlatformAuth } from "@/platform/auth";
import { auth } from "@/platform/db";
import { PlatformShell } from "@/platform/shell";
import { checkEmailAccess } from "@/platform/server";
import { Button, Card, Field, inputClass } from "@/platform/ui";

export const Route = createFileRoute("/plataforma/entrar")({
  validateSearch: (search: Record<string, unknown>) => ({
    proximo: typeof search.proximo === "string" ? search.proximo : undefined,
  }),
  component: SignIn,
});

function SignIn() {
  const { loading, session } = usePlatformAuth();
  const { proximo } = Route.useSearch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && session) {
      void navigate({ to: proximo ?? "/plataforma/inicio", replace: true });
    }
  }, [loading, session, navigate, proximo]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const check = await checkEmailAccess({ data: { email } });
      if (!check.allowed) {
        setError(
          check.reason === "invalid"
            ? "Confira o e-mail digitado."
            : check.reason === "personal_domain"
              ? "Use o seu e-mail corporativo. E-mails pessoais só entram por convite da equipe organizadora."
              : "Este e-mail ainda não tem acesso. Se sua empresa participou do workshop, use o e-mail corporativo — ou fale com quem te convidou.",
        );
        return;
      }
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}${proximo ?? "/plataforma/inicio"}`
          : undefined;

      const { error: otpError } = await auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: { emailRedirectTo: redirectTo, shouldCreateUser: true },
      });
      if (otpError) throw otpError;
      setSent(true);
    } catch (err) {
      console.error("[platform] login falhou", err);
      setError("Não foi possível enviar o link agora. Tente de novo em instantes.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PlatformShell bare>
      <div className="mx-auto max-w-md py-10 md:py-16">
        <h1 className="text-2xl font-semibold text-pf-text">Entrar</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-pf-muted">
          Informe seu e-mail corporativo. Enviamos um link de acesso — sem senha.
        </p>

        <Card className="mt-6 p-6">
          {sent ? (
            <div>
              <p className="text-[15px] font-medium text-pf-text">Link enviado.</p>
              <p className="mt-2 text-sm leading-relaxed text-pf-muted">
                Verifique a caixa de entrada de <strong>{email}</strong> e clique no link para
                entrar. Ele vale por pouco tempo — se expirar, é só pedir outro.
              </p>
              <button
                onClick={() => setSent(false)}
                className="mt-4 text-sm text-pf-link underline underline-offset-2"
              >
                Usar outro e-mail
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <Field label="E-mail corporativo" required>
                <input
                  type="email"
                  required
                  autoFocus
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@suaempresa.com.br"
                  className={inputClass}
                />
              </Field>
              {error && (
                <p className="rounded-lg bg-[#B4432E]/5 px-3 py-2.5 text-[13px] leading-relaxed text-[#B4432E]">
                  {error}
                </p>
              )}
              <Button type="submit" disabled={busy} className="w-full">
                {busy ? "Enviando…" : "Receber link de acesso"}
              </Button>
            </form>
          )}
        </Card>

        <p className="mt-5 text-sm text-pf-muted">
          Primeira vez aqui?{" "}
          <Link to="/plataforma/cadastro" className="text-pf-link underline underline-offset-2">
            Criar conta
          </Link>
        </p>
      </div>
    </PlatformShell>
  );
}
