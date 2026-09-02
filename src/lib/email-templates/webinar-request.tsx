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
import { button, container, h1, list, main, text } from "./theme";

interface WebinarRequestEmailProps {
  company: string;
  contactEmail: string;
  areas: string;
  adminUrl: string;
}

/** Aviso interno para o time organizador — não vai para o participante. */
export const WebinarRequestEmail = ({
  company,
  contactEmail,
  areas,
  adminUrl,
}: WebinarRequestEmailProps) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>Novo pedido de webinar: {company}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Novo pedido de webinar</Heading>
        <Text style={list}>
          <strong>Empresa:</strong> {company || "—"}
        </Text>
        <Text style={list}>
          <strong>Contato:</strong> {contactEmail}
        </Text>
        <Text style={text}>
          <strong>Áreas:</strong> {areas || "—"}
        </Text>
        <Button style={button} href={adminUrl}>
          Ver na área admin
        </Button>
      </Container>
    </Body>
  </Html>
);

export default WebinarRequestEmail;

export const template = {
  component: WebinarRequestEmail,
  subject: (data: Record<string, unknown>) =>
    `Novo pedido de webinar — ${String(data.company || "empresa não informada")}`,
  displayName: "Plataforma · pedido de webinar (interno)",
  previewData: {
    company: "Acme",
    contactEmail: "ana@acme.com.br",
    areas: "marketing, vendas",
    adminUrl: "https://aibypeople.org/plataforma/admin/solicitacoes",
  },
};
