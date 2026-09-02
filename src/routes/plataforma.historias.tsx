import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Protected } from "@/platform/guard";
import { db } from "@/platform/db";
import { formatDate } from "@/platform/lib";
import { Card, EmptyState, PageHeader, Spinner, Tag, buttonClass } from "@/platform/ui";
import type { StoryStatus, SuccessStory } from "@/integrations/supabase/platform-schema";

export const Route = createFileRoute("/plataforma/historias")({
  component: () => (
    <Protected>
      <Stories />
    </Protected>
  ),
});

const STORY_STATUS_LABEL: Record<StoryStatus, string> = {
  nova: "Recebida",
  em_avaliacao: "Em avaliação",
  selecionada: "Selecionada",
  arquivada: "Arquivada",
};

function Stories() {
  const { data, isLoading } = useQuery({
    queryKey: ["pf", "my-stories"],
    queryFn: async (): Promise<SuccessStory[]> => {
      const { data, error } = await db
        .from("success_stories")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as SuccessStory[];
    },
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Histórias de Sucesso"
        sub="Buscamos histórias reais de uso no Brasil. Não precisa ser um vídeo produzido — uma gravação de tela feita na sua própria máquina já é o suficiente."
        actions={
          <Link to="/plataforma/historias/nova" className={buttonClass("primary")}>
            Conte sua história
          </Link>
        }
      />

      <section>
        <h2 className="text-sm font-medium uppercase tracking-wider text-pf-faint">
          Suas submissões
        </h2>
        {isLoading ? (
          <Spinner />
        ) : (data ?? []).length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title="Você ainda não enviou nenhuma história"
              body="Se você construiu algo com o que aprendeu no workshop — mesmo pequeno —, vale contar."
              action={
                <Link to="/plataforma/historias/nova" className={buttonClass("secondary")}>
                  Enviar minha história
                </Link>
              }
            />
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {(data ?? []).map((s) => (
              <Card key={s.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-[15px] font-semibold text-pf-text">{s.title}</h3>
                    <p className="mt-1 text-[12px] text-pf-faint">
                      Enviada em {formatDate(s.created_at)}
                    </p>
                    <p className="mt-2.5 max-w-2xl text-[13px] leading-relaxed text-pf-muted">
                      {s.description}
                    </p>
                    <a
                      href={s.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2.5 inline-block text-[13px] text-pf-link underline underline-offset-2"
                    >
                      Ver o vídeo →
                    </a>
                  </div>
                  <Tag>{STORY_STATUS_LABEL[s.status]}</Tag>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Card className="bg-pf-surface p-6">
        <h2 className="text-[15px] font-semibold text-pf-text">Como funciona a avaliação</h2>
        <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-pf-muted">
          <li>
            O envio da sua história não gera qualquer compromisso de publicação, premiação ou
            contrapartida.
          </li>
          <li>
            Os cases são avaliados e selecionados por equipes internas da OpenAI, mediante processo
            interno próprio.
          </li>
          <li>
            Nenhum conteúdo será publicado ou divulgado sem sua autorização prévia e expressa (e,
            quando aplicável, da sua empresa).
          </li>
        </ul>
      </Card>
    </div>
  );
}
