import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { usePlatformAuth } from "./auth";
import { useLobs } from "./queries";
import { AreaDot, Eyebrow } from "./revamp-ui";
import { buttonClass } from "./ui";

export const BRAND = "IA no Trabalho";
export const BRAND_TAGLINE = "com OpenAI · ChatGPT Work";

/**
 * Casca da plataforma, em três formas:
 * - `sidebar` (padrão): navegação lateral por área, para navegar o catálogo.
 * - `top`: barra superior fina, para a página do workshop — leitura longa que
 *   pede largura e não se beneficia da lateral sempre presente.
 * - `bare`: páginas públicas (landing, login, cadastro).
 */
export function PlatformShell({
  children,
  chrome = "sidebar",
  bare = false,
  wide = false,
}: {
  children: ReactNode;
  chrome?: "sidebar" | "top" | "bare";
  bare?: boolean;
  /** Telas de tabela (admin) respiram melhor sem o limite de leitura. */
  wide?: boolean;
}) {
  const mode = bare ? "bare" : chrome;
  const width = wide ? "max-w-[1400px]" : "max-w-5xl";

  if (mode === "bare") {
    return (
      <div className="pf-scope flex min-h-screen flex-col">
        <PublicHeader />
        <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 md:py-10">{children}</main>
        <PlatformFooter />
      </div>
    );
  }

  if (mode === "top") {
    return (
      <div className="pf-scope flex min-h-screen flex-col">
        <TopHeader />
        <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8">{children}</main>
        <PlatformFooter />
      </div>
    );
  }

  return (
    <div className="pf-scope min-h-screen md:grid md:grid-cols-[248px_minmax(0,1fr)]">
      <Sidebar />
      <div className="flex min-h-screen flex-col">
        <main className={`mx-auto w-full ${width} flex-1 px-5 py-8 md:px-10 md:py-10`}>
          {children}
        </main>
        <PlatformFooter />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- marca */

function Wordmark({ to = "/plataforma" as const }: { to?: "/plataforma" }) {
  return (
    <Link to={to} className="flex flex-col gap-1">
      <span className="text-[16px] font-semibold tracking-[-0.02em] text-pf-text">{BRAND}</span>
      <Eyebrow>{BRAND_TAGLINE}</Eyebrow>
    </Link>
  );
}

function Initials({ name, email }: { name?: string | null; email?: string | null }) {
  const base = (name || email || "?").trim();
  const parts = base.split(/\s+/).filter(Boolean);
  const txt =
    parts.length > 1
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : base.slice(0, 2).toUpperCase();
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pf-surface-2 text-[11px] font-medium text-pf-muted">
      {txt}
    </span>
  );
}

/* ---------------------------------------------------------------- lateral */

const NAV = [
  { to: "/plataforma/inicio", label: "Início" },
  { to: "/plataforma/progresso", label: "Meu progresso" },
  { to: "/plataforma/office-hours", label: "Office Hours" },
  { to: "/plataforma/historias", label: "Histórias de Sucesso" },
] as const;

function Sidebar() {
  const { profile, isAdmin, signOut } = usePlatformAuth();
  const { data: lobs } = useLobs();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  async function onSignOut() {
    await signOut();
    void navigate({ to: "/plataforma" });
  }

  const body = (
    <>
      <Wordmark />

      <nav className="flex flex-col gap-0.5">
        {NAV.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-2 text-[14px] text-pf-strong transition hover:bg-pf-surface-2"
            activeProps={{ className: "bg-pf-text text-white hover:bg-pf-text" }}
          >
            {n.label}
          </Link>
        ))}
      </nav>

      <div className="flex flex-col gap-0.5">
        <Eyebrow className="px-3 pb-1">Áreas</Eyebrow>
        {(lobs ?? []).map((l) => (
          <Link
            key={l.slug}
            to="/plataforma/lob/$slug"
            params={{ slug: l.slug }}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-[13.5px] text-pf-strong transition hover:bg-pf-surface-2"
            activeProps={{ className: "bg-pf-surface-2 font-medium" }}
          >
            <AreaDot color={l.accent} />
            <span className="min-w-0 flex-1 leading-snug">{areaLabel(l.slug)}</span>
            {l.status === "coming_soon" && (
              <span className="shrink-0 font-mono text-[9.5px] text-pf-fainter">em breve</span>
            )}
          </Link>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-3 border-t border-pf-border pt-4">
        {isAdmin && (
          <Link
            to="/plataforma/admin"
            onClick={() => setOpen(false)}
            className="px-3 text-[13px] text-pf-faint transition hover:text-pf-text"
          >
            Admin
          </Link>
        )}
        <div className="flex items-center gap-2.5 px-1">
          <Initials name={profile?.name} email={profile?.email} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-medium text-pf-text">
              {profile?.name || profile?.email}
            </span>
            <span className="block truncate text-[11.5px] text-pf-faint">
              {profile?.role_lob ? areaLabel(profile.role_lob) : (profile?.company ?? "")}
            </span>
          </span>
          <button
            onClick={onSignOut}
            className="shrink-0 text-[12px] text-pf-faint transition hover:text-pf-text"
          >
            Sair
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* topo compacto no mobile — a lateral vira gaveta */}
      <div className="flex items-center justify-between border-b border-pf-border bg-pf-surface px-5 py-3.5 md:hidden">
        <Wordmark />
        <button onClick={() => setOpen((v) => !v)} aria-label="menu" aria-expanded={open}>
          <span className="mb-1.5 block h-px w-6 bg-pf-text" />
          <span className="mb-1.5 block h-px w-6 bg-pf-text" />
          <span className="block h-px w-4 bg-pf-text" />
        </button>
      </div>
      {open && (
        <div className="flex flex-col gap-6 border-b border-pf-border bg-pf-surface px-5 py-5 md:hidden">
          {body}
        </div>
      )}

      <aside className="sticky top-0 hidden h-screen flex-col gap-7 overflow-y-auto border-r border-pf-border bg-pf-surface px-[18px] py-[22px] md:flex">
        {body}
      </aside>
    </>
  );
}

const AREA_LABEL: Record<string, string> = {
  marketing: "Marketing",
  vendas: "Vendas",
  financas: "Finanças",
  "estrategia-operacoes": "Estratégia & Operações",
  dados: "Análise de Dados",
  juridico: "Jurídico",
  outro: "Outra área",
};

export function areaLabel(slug: string) {
  return AREA_LABEL[slug] ?? slug;
}

/* ---------------------------------------------------------------- topo */

function TopHeader() {
  const { profile, isAdmin } = usePlatformAuth();
  return (
    <header className="border-b border-pf-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4">
        <div className="flex items-center gap-4">
          <Link to="/plataforma/inicio" className="text-[16px] font-semibold tracking-[-0.02em]">
            {BRAND}
          </Link>
          <span className="hidden h-4 w-px bg-pf-border sm:block" />
          <Eyebrow className="hidden sm:block">{BRAND_TAGLINE}</Eyebrow>
        </div>
        <nav className="flex items-center gap-5 text-[14px] text-pf-strong">
          <Link to="/plataforma/inicio" className="transition hover:text-pf-text">
            Áreas
          </Link>
          <Link
            to="/plataforma/office-hours"
            className="hidden transition hover:text-pf-text sm:block"
          >
            Office Hours
          </Link>
          <Link
            to="/plataforma/historias"
            className="hidden transition hover:text-pf-text sm:block"
          >
            Histórias
          </Link>
          {isAdmin && (
            <Link
              to="/plataforma/admin"
              className="hidden text-pf-faint transition hover:text-pf-text sm:block"
            >
              Admin
            </Link>
          )}
          <Initials name={profile?.name} email={profile?.email} />
        </nav>
      </div>
    </header>
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
