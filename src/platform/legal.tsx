export type LegalSection = { h: string; p: string[] };

/**
 * Termos e Política de Privacidade. O texto é um ponto de partida operacional:
 * descreve o que a plataforma de fato faz e precisa passar por revisão jurídica
 * antes de valer como documento definitivo.
 */
export function LegalPage({
  title,
  updatedAt,
  sections,
}: {
  title: string;
  updatedAt: string;
  sections: LegalSection[];
}) {
  return (
    <article className="mx-auto max-w-2xl py-10 md:py-14">
      <h1 className="text-2xl font-semibold text-pf-text">{title}</h1>
      <p className="mt-2 text-[13px] text-pf-faint">Última atualização: {updatedAt}</p>

      <div className="mt-8 space-y-8">
        {sections.map((s) => (
          <section key={s.h}>
            <h2 className="text-[15px] font-semibold text-pf-text">{s.h}</h2>
            {s.p.map((p) => (
              <p key={p} className="mt-2.5 text-[14px] leading-relaxed text-pf-muted">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>

      <p className="mt-12 border-t border-pf-border pt-6 text-[12px] leading-relaxed text-pf-faint">
        Dúvidas sobre este documento ou sobre seus dados: fale com a equipe organizadora do IA no
        Trabalho.
      </p>
    </article>
  );
}
