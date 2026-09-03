import { useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { usePlatformAuth } from "@/platform/auth";
import { PlatformShell } from "@/platform/shell";
import { Card, buttonClass } from "@/platform/ui";

export const Route = createFileRoute("/plataforma/")({
  component: Landing,
});

const AREAS = [
  "Marketing",
  "Vendas",
  "Finanças",
  "Estratégia & Operações",
  "Análise de Dados",
  "Jurídico",
];

function Landing() {
  const { loading, session } = usePlatformAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && session) void navigate({ to: "/plataforma/inicio", replace: true });
  }, [loading, session, navigate]);

  return (
    <PlatformShell bare>
      <section className="py-10 md:py-16">
        <p className="text-[13px] font-medium uppercase tracking-wider text-pf-faint">
          IA no Trabalho
        </p>
        <h1 className="mt-3 max-w-3xl text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.1] tracking-tight text-pf-text">
          O conteúdo do workshop, disponível para refazer com os seus dados.
        </h1>
        <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-pf-muted">
          Webinar gravado, guia do workshop e todos os materiais follow along — organizados por
          área. Quem participou já tem acesso; colegas da mesma empresa criam conta sozinhos.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/plataforma/entrar"
            search={{ proximo: undefined }}
            className={buttonClass("primary", "lg")}
          >
            Entrar
          </Link>
          <Link to="/plataforma/cadastro" className={buttonClass("secondary", "lg")}>
            Criar conta com e-mail corporativo
          </Link>
        </div>
      </section>

      <section className="border-t border-pf-border py-10">
        <h2 className="text-sm font-medium uppercase tracking-wider text-pf-faint">Áreas</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {AREAS.map((a) => (
            <Card key={a} className="px-5 py-4">
              <span className="text-[15px] font-medium text-pf-text">{a}</span>
            </Card>
          ))}
        </div>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-pf-muted">
          Todo o conteúdo fica atrás do login. Se o seu e-mail corporativo pertence a uma empresa
          que já participou, você consegue criar conta sozinho — sem esperar convite.
        </p>
      </section>

      <section className="border-t border-pf-border py-10">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              t: "Assista de novo",
              b: "O webinar completo da sua área, com o guia do workshop do lado.",
            },
            {
              t: "Refaça com os seus dados",
              b: "Todos os arquivos follow along para baixar, individualmente ou em um .zip.",
            },
            {
              t: "Tire dúvida ao vivo",
              b: "Office hours periódicos por área, com inscrição em um clique.",
            },
          ].map((x) => (
            <div key={x.t}>
              <h3 className="text-[15px] font-semibold text-pf-text">{x.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-pf-muted">{x.b}</p>
            </div>
          ))}
        </div>
      </section>
    </PlatformShell>
  );
}
