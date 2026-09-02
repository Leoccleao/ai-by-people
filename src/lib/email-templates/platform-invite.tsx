import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";
import { button, container, footer, h1, main, text } from "./theme";

interface PlatformInviteEmailProps {
  loginUrl: string;
  domain?: string;
}

export const PlatformInviteEmail = ({ loginUrl, domain }: PlatformInviteEmailProps) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>Seu acesso à plataforma do Roadshow de IA</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Seu acesso está liberado</Heading>
        <Text style={text}>
          Você já pode entrar na plataforma do Roadshow de IA: webinar gravado, guia do workshop e
          todo o material follow along, organizados por área.
        </Text>
        <Button style={button} href={loginUrl}>
          Acessar a plataforma
        </Button>
        <Text style={{ ...text, margin: "25px 0 0" }}>
          Não existe senha. Você informa este e-mail e recebe um link de entrada.
          {domain
            ? ` Colegas com e-mail @${domain} também podem criar conta sozinhos.`
            : " Colegas da sua empresa, com e-mail do mesmo domínio, também podem criar conta sozinhos."}
        </Text>
        <Text style={footer}>Se você não esperava este convite, pode ignorar esta mensagem.</Text>
      </Container>
    </Body>
  </Html>
);

export default PlatformInviteEmail;

export const template = {
  component: PlatformInviteEmail,
  subject: "Seu acesso ao Roadshow de IA",
  displayName: "Plataforma · convite",
  previewData: { loginUrl: "https://aibypeople.org/plataforma/entrar", domain: "empresa.com.br" },
};
