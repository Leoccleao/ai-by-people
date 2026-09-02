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

interface OfficeHourConfirmationEmailProps {
  sessionTitle: string;
  when: string;
  meetingUrl?: string | null;
  recipientName?: string | null;
}

export const OfficeHourConfirmationEmail = ({
  sessionTitle,
  when,
  meetingUrl,
  recipientName,
}: OfficeHourConfirmationEmailProps) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>Inscrição confirmada: {sessionTitle}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Inscrição confirmada</Heading>
        <Text style={text}>
          {recipientName ? `Olá, ${recipientName}. ` : "Olá. "}
          Sua inscrição em <strong>{sessionTitle}</strong> está confirmada.
        </Text>
        <Text style={{ ...text, margin: "0 0 25px" }}>
          <strong>Quando:</strong> {when} (horário de Brasília)
        </Text>
        {meetingUrl ? (
          <Button style={button} href={meetingUrl}>
            Entrar na sala
          </Button>
        ) : (
          <Text style={text}>O link da sala será enviado antes da sessão.</Text>
        )}
        <Text style={footer}>
          O convite de calendário (.ics) está disponível na página de Office Hours da plataforma.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default OfficeHourConfirmationEmail;

export const template = {
  component: OfficeHourConfirmationEmail,
  subject: (data: Record<string, unknown>) =>
    `Inscrição confirmada: ${String(data.sessionTitle ?? "office hours")}`,
  displayName: "Plataforma · confirmação de office hours",
  previewData: {
    sessionTitle: "Office hours de Marketing",
    when: "quinta-feira, 18 de setembro de 2026 às 16:00",
    meetingUrl: "https://meet.google.com/exemplo",
    recipientName: "Ana",
  },
};
