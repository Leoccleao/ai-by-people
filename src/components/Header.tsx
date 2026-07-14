import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { PROGRAM_ROUTES } from "@/i18n/translations";

export function Header() {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between gap-6">
        <Link
          to="/"
          onClick={() => setMobile(false)}
          className="font-serif text-xl tracking-[0.02em] text-ink"
        >
          AI by People<span className="text-accent">.</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link
            to="/"
            className="text-ink-muted hover:text-ink transition"
            activeProps={{ className: "text-ink" }}
            activeOptions={{ exact: true }}
          >
            {t.nav.home}
          </Link>
          <div
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <button className="text-ink-muted hover:text-ink transition inline-flex items-center gap-1">
              {t.nav.programs}
              <span className="text-[10px]">▾</span>
            </button>
            {open && (
              <div className="absolute right-0 top-full pt-3">
                <div className="w-72 border border-rule bg-paper shadow-[0_20px_40px_-24px_rgba(26,24,21,0.25)] py-2">
                  {PROGRAM_ROUTES.map((p) => (
                    <Link
                      key={p.to}
                      to={p.to}
                      className="flex items-baseline gap-3 px-5 py-2.5 text-sm text-ink-muted hover:bg-paper-elev hover:text-ink"
                    >
                      <span className="font-mono text-[10px] text-accent">{p.num}</span>
                      <span>{t.nav[p.key]}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <a href="/#tese" className="text-ink-muted hover:text-ink transition">{t.nav.about}</a>
          <a href="/#contato" className="text-ink-muted hover:text-ink transition">{t.nav.contact}</a>
          <LangToggle lang={lang} setLang={setLang} />
        </nav>

        <button
          className="md:hidden text-ink"
          onClick={() => setMobile((m) => !m)}
          aria-label="menu"
        >
          <span className="block w-6 h-px bg-ink mb-1.5" />
          <span className="block w-6 h-px bg-ink mb-1.5" />
          <span className="block w-4 h-px bg-ink" />
        </button>
      </div>

      {mobile && (
        <div className="md:hidden border-t border-rule px-6 py-6 space-y-4">
          <Link to="/" className="block text-ink" onClick={() => setMobile(false)}>
            {t.nav.home}
          </Link>
          <div className="text-xs uppercase tracking-[0.2em] text-ink-muted pt-3">
            {t.nav.programs}
          </div>
          {PROGRAM_ROUTES.map((p) => (
            <Link
              key={p.to}
              to={p.to}
              onClick={() => setMobile(false)}
              className="flex items-baseline gap-3 text-ink-muted pl-1"
            >
              <span className="font-mono text-[10px] text-accent">{p.num}</span>
              <span>{t.nav[p.key]}</span>
            </Link>
          ))}
          <a href="/#tese" className="block text-ink-muted pt-3" onClick={() => setMobile(false)}>
            {t.nav.about}
          </a>
          <a href="/#contato" className="block text-ink-muted" onClick={() => setMobile(false)}>
            {t.nav.contact}
          </a>
          <div className="pt-3">
            <LangToggle lang={lang} setLang={setLang} />
          </div>
        </div>
      )}
    </header>
  );
}

function LangToggle({ lang, setLang }: { lang: "pt" | "en"; setLang: (l: "pt" | "en") => void }) {
  return (
    <div className="inline-flex items-center text-[11px] font-mono border border-rule">
      <button
        onClick={() => setLang("pt")}
        className={`px-2.5 py-1 transition ${lang === "pt" ? "bg-ink text-paper" : "text-ink-muted hover:text-ink"}`}
        aria-pressed={lang === "pt"}
      >
        PT
      </button>
      <span className="w-px h-3 bg-rule" />
      <button
        onClick={() => setLang("en")}
        className={`px-2.5 py-1 transition ${lang === "en" ? "bg-ink text-paper" : "text-ink-muted hover:text-ink"}`}
        aria-pressed={lang === "en"}
      >
        EN
      </button>
    </div>
  );
}
