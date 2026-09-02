import { createFileRoute } from "@tanstack/react-router";
import { PlatformShell } from "@/platform/shell";
import { LegalPage } from "@/platform/legal";

export const Route = createFileRoute("/plataforma/termos")({
  head: () => ({ meta: [{ title: "Termos de Uso — Roadshow IA" }] }),
  component: () => (
    <PlatformShell bare>
      <LegalPage
        title="Termos de Uso"
        updatedAt="2 de setembro de 2026"
        sections={[
          {
            h: "1. O que é esta plataforma",
            p: [
              "A plataforma disponibiliza, para participantes dos workshops do Roadshow de IA, o conteúdo de cada área: webinar gravado, guia do workshop e materiais follow along para download.",
              "O acesso é pessoal e intransferível. Todo o conteúdo fica atrás de login.",
            ],
          },
          {
            h: "2. Quem pode acessar",
            p: [
              "Participantes convidados pela equipe organizadora e pessoas com e-mail do mesmo domínio corporativo de alguém já cadastrado, mediante verificação do e-mail.",
              "Endereços de e-mail pessoais (gmail, outlook, hotmail e semelhantes) só recebem acesso por convite explícito da equipe organizadora.",
            ],
          },
          {
            h: "3. Uso do conteúdo",
            p: [
              "Os materiais podem ser usados livremente no seu trabalho, inclusive adaptados aos dados da sua empresa.",
              "Não é permitida a redistribuição pública dos vídeos e materiais, nem sua comercialização.",
            ],
          },
          {
            h: "4. Conta e segurança",
            p: [
              "O acesso é feito por link enviado ao seu e-mail. Não compartilhe esse link: quem tiver o link entra na sua conta.",
              "A equipe organizadora pode desativar contas em caso de uso indevido.",
            ],
          },
          {
            h: "5. Histórias de sucesso",
            p: [
              "O envio de uma história não gera compromisso de publicação, premiação ou contrapartida.",
              "Nenhum conteúdo enviado será publicado ou divulgado sem autorização prévia e expressa de quem enviou e, quando aplicável, da empresa.",
            ],
          },
          {
            h: "6. Mudanças",
            p: [
              "Estes termos podem ser atualizados. Mudanças relevantes são comunicadas por e-mail aos usuários cadastrados.",
            ],
          },
        ]}
      />
    </PlatformShell>
  ),
});
