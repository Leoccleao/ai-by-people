import { Link } from "@tanstack/react-router";
import { useI18n } from "@/i18n/I18nProvider";
import { PROGRAM_ROUTES } from "@/i18n/translations";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-rule mt-32">
      <div className="mx-auto max-w-6xl px-6 py-16 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="font-serif text-2xl text-ink">
            AI by People<span className="text-accent">.</span>
          </div>
          <p className="text-sm text-ink-muted mt-2 italic">{t.common.tagline}</p>
          <p className="text-xs text-ink-muted mt-8 max-w-sm leading-relaxed">
            {t.footer.note2}
          </p>
        </div>
        <div className="md:col-span-4">
          <div className="text-xs uppercase tracking-[0.2em] text-ink-muted mb-4">
            {t.footer.programs}
          </div>
          <ul className="space-y-2 text-sm">
            {PROGRAM_ROUTES.map((p) => (
              <li key={p.to}>
                <Link to={p.to} className="text-ink-muted hover:text-ink inline-flex items-baseline gap-3">
                  <span className="font-mono text-[10px] text-accent">{p.num}</span>
                  <span>{t.nav[p.key]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-3">
          <div className="text-xs uppercase tracking-[0.2em] text-ink-muted mb-4">
            {t.footer.contact}
          </div>
          <a href="mailto:contato@aibypeople.org" className="text-sm text-ink hover:text-accent">
            contato@aibypeople.org
          </a>
        </div>
      </div>
    </footer>
  );
}
