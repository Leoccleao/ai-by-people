import { useEffect, useRef, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { usePlatformAuth } from "./auth";
import { CompleteProfile, profileIsComplete } from "./complete-profile";
import { PlatformShell } from "./shell";
import { EmptyState, Spinner, buttonClass } from "./ui";

/**
 * Guarda de rota da plataforma. Todo o conteúdo fica atrás do login; `admin`
 * exige ainda o papel de administrador.
 */
export function Protected({
  children,
  admin = false,
  wide = false,
}: {
  children: ReactNode;
  admin?: boolean;
  wide?: boolean;
}) {
  const { loading, session, profile, isAdmin } = usePlatformAuth();
  const navigate = useNavigate();
  const href = useRouterState({ select: (s) => s.location.href });

  // O destino é congelado na montagem e o redirecionamento acontece uma vez só:
  // como a navegação é assíncrona, reagir ao `href` corrente reenfileiraria o
  // redirect com a URL de login já dentro de `proximo`, aninhando sem parar.
  const target = useRef(href);
  const redirected = useRef(false);

  useEffect(() => {
    if (loading || session || redirected.current) return;
    redirected.current = true;
    const proximo = target.current.startsWith("/plataforma/entrar") ? undefined : target.current;
    void navigate({ to: "/plataforma/entrar", search: { proximo }, replace: true });
  }, [loading, session, navigate]);

  if (loading || !session) {
    return (
      <PlatformShell bare>
        <Spinner />
      </PlatformShell>
    );
  }

  if (profile && !profile.is_active) {
    return (
      <PlatformShell bare>
        <EmptyState
          title="Sua conta está desativada"
          body="Fale com a equipe organizadora para reativar o acesso."
        />
      </PlatformShell>
    );
  }

  // Convidado que entrou pela tela de login nunca preencheu nome/empresa/área.
  if (profile && !profileIsComplete(profile)) {
    return (
      <PlatformShell>
        <CompleteProfile />
      </PlatformShell>
    );
  }

  if (admin && !isAdmin) {
    return (
      <PlatformShell>
        <EmptyState
          title="Área restrita"
          body="Esta seção é só para administradores da plataforma."
          action={
            <Link to="/plataforma/inicio" className={buttonClass("secondary")}>
              Voltar ao início
            </Link>
          }
        />
      </PlatformShell>
    );
  }

  return <PlatformShell wide={wide}>{children}</PlatformShell>;
}
