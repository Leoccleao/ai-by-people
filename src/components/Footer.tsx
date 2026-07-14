import { Link } from "@tanstack/react-router";
import { useI18n } from "@/i18n/I18nProvider";

const PROGRAMS = [
  { to: "/corporativo", key: "corporate" as const },
  { to: "/ecossistema", key: "ecosystem" as const },
  { to: "/soberania", key: "sovereignty" as const },
  { to: "/escolas", key: "schools" as const },
  { to: "/formadores", key: "trainers" as const },
  { to: "/indice", key: "index" as const },
];

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-rule mt-24">
      <div className="mx-auto max-w-6xl px-6 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-serif text-2xl text-ink">
            AI by People<span className="text-accent">.</span>
          </div>
          <p className="text-sm text-ink/60 mt-2 italic">{t.common.tagline}</p>
          <p className="text-xs text-ink/50 mt-6 max-w-sm leading-relaxed">
            {t.footer.rights} {t.footer.note}
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-ink/50 mb-4">{t.footer.programs}</div>
          <ul className="space-y-2 text-sm">
            {PROGRAMS.map((p) => (
              <li key={p.to}>
                <Link to={p.to} className="text-ink/80 hover:text-ink">
                  {t.nav[p.key]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-ink/50 mb-4">{t.footer.contact}</div>
          <a href="mailto:contato@aibypeople.org" className="text-sm text-ink hover:text-accent">
            contato@aibypeople.org
          </a>
        </div>
      </div>
    </footer>
  );
}
