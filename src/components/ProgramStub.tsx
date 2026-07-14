import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { PageShell, Section, Kicker } from "./PageShell";
import { ContactSection } from "./ContactForm";
import { useI18n } from "@/i18n/I18nProvider";

/**
 * Placeholder used by the six program routes while their full copy is drafted.
 * Full ProgramPage layout will land in step 2.
 */
export function ProgramStub({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children?: ReactNode;
}) {
  const { t } = useI18n();
  return (
    <PageShell>
      <Section className="pt-14 md:pt-16 pb-40">
        <Kicker>{kicker}</Kicker>
        <h1 className="font-serif font-normal text-[clamp(2.5rem,6vw,5rem)] leading-[1.05] tracking-[-0.02em] text-ink max-w-4xl">
          {title}
        </h1>
        <div className="mt-10 max-w-2xl">
          <span className="inline-block border border-accent text-accent text-[11px] uppercase tracking-[0.25em] font-mono px-3 py-1">
            {t.common.soon}
          </span>
          <p className="mt-8 text-ink-muted text-lg leading-relaxed font-serif italic">
            {t.stub.body}
          </p>
          {children}
          <div className="mt-12 flex flex-wrap gap-3">
            <Link
              to="/"
              className="border border-ink px-6 py-3 text-sm uppercase tracking-[0.2em] hover:bg-ink hover:text-paper transition"
            >
              {t.nav.home}
            </Link>
            <a
              href="/#contato"
              className="border border-rule px-6 py-3 text-sm uppercase tracking-[0.2em] hover:border-ink transition"
            >
              {t.common.getInTouch}
            </a>
          </div>
        </div>
      </Section>
      <ContactSection />
    </PageShell>
  );
}
