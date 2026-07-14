import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";

const PROGRAM_ROUTES = [
  { to: "/corporativo", key: "corporate" as const },
  { to: "/ecossistema", key: "ecosystem" as const },
  { to: "/soberania", key: "sovereignty" as const },
  { to: "/escolas", key: "schools" as const },
  { to: "/formadores", key: "trainers" as const },
  { to: "/indice", key: "index" as const },
];

export function Header() {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);

  return (
    <header className="border-b border-rule bg-paper/95 backdrop-blur-sm sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between gap-6">
        <Link to="/" className="font-serif text-xl tracking-tight text-ink" onClick={() => setMobile(false)}>
          AI by People<span className="text-accent">.</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link to="/" className="text-ink/70 hover:text-ink transition" activeProps={{ className: "text-ink" }} activeOptions={{ exact: true }}>
            {t.nav.home}
          </Link>
          <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
            <button className="text-ink/70 hover:text-ink transition inline-flex items-center gap-1">
              {t.nav.programs}
              <span className="text-xs">↓</span>
            </button>
            {open && (
              <div className="absolute right-0 top-full pt-3">
                <div className="w-72 border border-rule bg-paper shadow-lg py-2">
                  {PROGRAM_ROUTES.map((p) => (
                    <Link
                      key={p.to}
                      to={p.to}
                      className="block px-5 py-2.5 text-sm text-ink/80 hover:bg-ink/5 hover:text-ink"
                    >
                      {t.nav[p.key]}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <a href="#contato" className="text-ink/70 hover:text-ink transition">{t.nav.contact}</a>
          <LangToggle lang={lang} setLang={setLang} />
        </nav>
        <button className="md:hidden text-ink" onClick={() => setMobile((m) => !m)} aria-label="menu">
          <span className="block w-6 h-px bg-ink mb-1.5" />
          <span className="block w-6 h-px bg-ink mb-1.5" />
          <span className="block w-4 h-px bg-ink" />
        </button>
      </div>
      {mobile && (
        <div className="md:hidden border-t border-rule px-6 py-4 space-y-3">
          <Link to="/" className="block text-ink" onClick={() => setMobile(false)}>{t.nav.home}</Link>
          <div className="text-xs uppercase tracking-widest text-ink/50 pt-2">{t.nav.programs}</div>
          {PROGRAM_ROUTES.map((p) => (
            <Link key={p.to} to={p.to} className="block text-ink/80 pl-2" onClick={() => setMobile(false)}>
              {t.nav[p.key]}
            </Link>
          ))}
          <LangToggle lang={lang} setLang={setLang} />
        </div>
      )}
    </header>
  );
}

function LangToggle({ lang, setLang }: { lang: "pt" | "en"; setLang: (l: "pt" | "en") => void }) {
  return (
    <div className="inline-flex items-center gap-1 text-xs font-mono border border-rule px-1 py-0.5">
      <button
        onClick={() => setLang("pt")}
        className={`px-2 py-1 transition ${lang === "pt" ? "bg-ink text-paper" : "text-ink/60 hover:text-ink"}`}
      >
        PT
      </button>
      <button
        onClick={() => setLang("en")}
        className={`px-2 py-1 transition ${lang === "en" ? "bg-ink text-paper" : "text-ink/60 hover:text-ink"}`}
      >
        EN
      </button>
    </div>
  );
}
