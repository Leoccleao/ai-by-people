import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { usePlatformAuth } from "./auth";
import { useLobs } from "./queries";
import { buttonClass } from "./ui";

export const BRAND = "Roadshow IA";

function Wordmark() {
  return (
    <Link to="/plataforma" className="text-[15px] font-semibold tracking-tight text-pf-text">
      {BRAND}
    </Link>
  );
}

/** Casca da plataforma. `bare` = páginas públicas (landing, login, cadastro). */
export function PlatformShell({
  children,
  bare = false,
  wide = false,
}: {
  children: ReactNode;
  bare?: boolean;
  wide?: boolean;
}) {
  return (
    <div className="pf-scope flex min-h-screen flex-col font-sans">
      {bare ? <PublicHeader /> : <AppHeader />}
      <main
        className={`flex-1 ${wide ? "mx-auto w-full max-w-[1400px]" : "mx-auto w-full max-w-6xl"} px-5 py-8 md:py-10`}
      >
        {children}
      </main>
      <PlatformFooter />
    </div>
  );
}

function PublicHeader() {
  return (
    <header className="border-b border-pf-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Wordmark />
        <div className="flex items-center gap-2">
          <Link
            to="/plataforma/entrar"
            search={{ proximo: undefined }}
            className={buttonClass("secondary", "sm")}
          >
            Entrar
          </Link>
          <Link to="/plataforma/cadastro" className={buttonClass("primary", "sm")}>
            Criar conta
          </Link>
        </div>
      </div>
    </header>
  );
}

function AppHeader() {
  const { profile, isAdmin, signOut } = usePlatformAuth();
  const { data: lobs } = useLobs();
  const [lobsOpen, setLobsOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const navigate = useNavigate();

  const linkCls = "text-sm text-pf-muted transition hover:text-pf-text";
  const activeCls = { className: "text-sm text-pf-text font-medium" };

  async function onSignOut() {
    await signOut();
    void navigate({ to: "/plataforma" });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-pf-border bg-pf-bg/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-3.5">
        <div className="flex items-center gap-8">
          <Wordmark />
          <nav className="hidden items-center gap-6 md:flex">
            <Link to="/plataforma/inicio" className={linkCls} activeProps={activeCls}>
              Início
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setLobsOpen(true)}
              onMouseLeave={() => setLobsOpen(false)}
            >
              <button className={`${linkCls} inline-flex items-center gap-1`}>
                Conteúdo <span className="text-[10px]">▾</span>
              </button>
              {lobsOpen && (
                <div className="absolute left-0 top-full pt-2">
                  <div className="w-72 rounded-xl border border-pf-border bg-pf-bg py-1.5 shadow-[0_16px_40px_-20px_rgba(13,13,13,0.3)]">
                    {(lobs ?? []).map((l) => (
                      <Link
                        key={l.slug}
                        to="/plataforma/lob/$slug"
                        params={{ slug: l.slug }}
                        className="flex items-center justify-between gap-3 px-4 py-2 text-sm text-pf-muted hover:bg-pf-surface hover:text-pf-text"
                      >
                        <span className="truncate">{l.title}</span>
                        {l.status === "coming_soon" && (
                          <span className="shrink-0 text-[11px] text-pf-faint">em breve</span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Link to="/plataforma/office-hours" className={linkCls} activeProps={activeCls}>
              Office Hours
            </Link>
            <Link to="/plataforma/historias" className={linkCls} activeProps={activeCls}>
              Histórias de Sucesso
            </Link>
            {isAdmin && (
              <Link to="/plataforma/admin" className={linkCls} activeProps={activeCls}>
                Admin
              </Link>
            )}
          </nav>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <span className="max-w-[180px] truncate text-[13px] text-pf-faint">
            {profile?.name || profile?.email}
          </span>
          <button onClick={onSignOut} className={buttonClass("ghost", "sm")}>
            Sair
          </button>
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobile((m) => !m)}
          aria-label="menu"
          aria-expanded={mobile}
        >
          <span className="mb-1.5 block h-px w-6 bg-pf-text" />
          <span className="mb-1.5 block h-px w-6 bg-pf-text" />
          <span className="block h-px w-4 bg-pf-text" />
        </button>
      </div>

      {mobile && (
        <div className="space-y-3 border-t border-pf-border px-5 py-5 md:hidden">
          <Link to="/plataforma/inicio" className="block text-sm" onClick={() => setMobile(false)}>
            Início
          </Link>
          <div className="pt-1 text-[11px] uppercase tracking-wider text-pf-faint">Conteúdo</div>
          {(lobs ?? []).map((l) => (
            <Link
              key={l.slug}
              to="/plataforma/lob/$slug"
              params={{ slug: l.slug }}
              className="block pl-1 text-sm text-pf-muted"
              onClick={() => setMobile(false)}
            >
              {l.title}
            </Link>
          ))}
          <Link
            to="/plataforma/office-hours"
            className="block pt-1 text-sm"
            onClick={() => setMobile(false)}
          >
            Office Hours
          </Link>
          <Link
            to="/plataforma/historias"
            className="block text-sm"
            onClick={() => setMobile(false)}
          >
            Histórias de Sucesso
          </Link>
          {isAdmin && (
            <Link to="/plataforma/admin" className="block text-sm" onClick={() => setMobile(false)}>
              Admin
            </Link>
          )}
          <button onClick={onSignOut} className="block pt-2 text-sm text-pf-muted">
            Sair
          </button>
        </div>
      )}
    </header>
  );
}

function PlatformFooter() {
  return (
    <footer className="mt-16 border-t border-pf-border">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-[13px] text-pf-faint">
        <span>{BRAND}</span>
        <div className="flex flex-wrap gap-5">
          <Link to="/plataforma/termos" className="hover:text-pf-text">
            Termos de Uso
          </Link>
          <Link to="/plataforma/privacidade" className="hover:text-pf-text">
            Política de Privacidade
          </Link>
          <a href="/profissionais" className="hover:text-pf-text">
            Formação Profissional
          </a>
        </div>
      </div>
    </footer>
  );
}
