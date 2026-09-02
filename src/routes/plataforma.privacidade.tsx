import { createFileRoute } from "@tanstack/react-router";
import { PlatformShell } from "@/platform/shell";
import { LegalPage } from "@/platform/legal";

export const Route = createFileRoute("/plataforma/privacidade")({
  head: () => ({ meta: [{ title: "Política de Privacidade — Roadshow IA" }] }),
  component: () => (
    <PlatformShell bare>
      <LegalPage
        title="Política de Privacidade"
        updatedAt="2 de setembro de 2026"
        sections={[
          {
            h: "1. Que dados coletamos",
            p: [
              "No cadastro: nome, e-mail corporativo, empresa e área de atuação. O aceite dos Termos de Uso e desta Política é registrado com data e hora.",
              "No uso da plataforma: visualização de página, início e conclusão de vídeo, download de arquivos e inscrição em office hours — sempre associados à sua conta.",
              "Nos formulários opcionais: os dados que você mesmo escreve ao pedir um webinar para sua empresa ou ao enviar uma história de sucesso.",
            ],
          },
          {
            h: "2. Para que usamos",
            p: [
              "Dar acesso ao conteúdo, confirmar inscrições em office hours e responder aos pedidos que você envia.",
              "Entender o engajamento por empresa — de forma agregada por domínio de e-mail — para decidir que conteúdo produzir e onde oferecer apoio.",
              "Não vendemos dados e não usamos os seus dados para publicidade.",
            ],
          },
          {
            h: "3. Com quem compartilhamos",
            p: [
              "Com a equipe organizadora do Roadshow de IA e com a OpenAI, para operação do programa e avaliação de histórias de sucesso.",
              "Com fornecedores de infraestrutura necessários à operação (hospedagem, banco de dados, envio de e-mail transacional), estritamente para essa finalidade.",
            ],
          },
          {
            h: "4. Base legal e seus direitos (LGPD)",
            p: [
              "Tratamos seus dados com base no seu consentimento, registrado no cadastro, e no legítimo interesse de operar o programa de formação.",
              "Você pode solicitar acesso, correção, portabilidade ou exclusão dos seus dados, além de revogar o consentimento, escrevendo para a equipe organizadora. A exclusão da conta remove seus dados pessoais; métricas agregadas por domínio, que não identificam pessoas, podem ser mantidas.",
            ],
          },
          {
            h: "5. Retenção e segurança",
            p: [
              "Mantemos os dados enquanto sua conta existir e pelo tempo necessário ao programa.",
              "O acesso é feito por link de uso único enviado por e-mail; vídeos e arquivos são servidos apenas a usuários autenticados, por URLs assinadas com expiração curta.",
            ],
          },
          {
            h: "6. Vídeos enviados por você",
            p: [
              "Ao enviar uma história de sucesso, evite dados confidenciais, pessoais ou de clientes no vídeo. Prefira dados fictícios ou anonimizados.",
              "O vídeo é assistido apenas pelas equipes de avaliação e não é publicado sem sua autorização prévia e expressa.",
            ],
          },
        ]}
      />
    </PlatformShell>
  ),
});
