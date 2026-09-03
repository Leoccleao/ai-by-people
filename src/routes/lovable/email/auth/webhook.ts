import * as React from 'react'
import { createAuthEmailHandler } from '@lovable.dev/email-js'
import { createFileRoute } from '@tanstack/react-router'
import { SignupEmail } from '@/lib/email-templates/signup'
import { InviteEmail } from '@/lib/email-templates/invite'
import { MagicLinkEmail } from '@/lib/email-templates/magic-link'
import { RecoveryEmail } from '@/lib/email-templates/recovery'
import { EmailChangeEmail } from '@/lib/email-templates/email-change'
import { ReauthenticationEmail } from '@/lib/email-templates/reauthentication'

// Configuration
const SITE_NAME = "IA no Trabalho"
const SENDER_DOMAIN = "notify.aibypeople.org"
const ROOT_DOMAIN = "aibypeople.org"
// ATENÇÃO — não volte FROM_DOMAIN para o domínio raiz sem antes checar o DNS.
// _dmarc.aibypeople.org está em p=reject e o SPF do raiz é "include:secureserver.net -all",
// que não autoriza o Mailgun; não há DKIM publicado em notify.aibypeople.org.
// Com From: no raiz, o Google recusa a mensagem (nem chega no spam).
// O subdomínio remetente tem SPF do Mailgun e DMARC próprio p=none, então o From
// alinhado com ele entrega. Para exibir o raiz, é preciso DKIM publicado
// (ou display_from_root habilitado no Lovable) — aí sim dá para reverter.
const FROM_DOMAIN = "notify.aibypeople.org"
const SITE_URL = `https://${ROOT_DOMAIN}`

// The SDK handler owns verification, dispatch, and retry semantics; this file
// owns only the email decisions: subjects, templates, and per-type props.
//
// Construído sob demanda, e não no carregamento do módulo: createAuthEmailHandler
// lança quando falta LOVABLE_API_KEY, e como a rota entra no routeTree isso
// derrubava o app inteiro em dev (500 em toda página), onde a chave não existe.
let handler: ((request: Request) => Promise<Response>) | null = null

function getHandler() {
  if (handler) return handler
  handler = createAuthEmailHandler({
  apiKey: process.env.LOVABLE_API_KEY!,
  from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
  senderDomain: SENDER_DOMAIN,
  sendUrl: process.env.LOVABLE_SEND_URL,
  emails: {
    signup: {
      subject: 'Confirme seu e-mail',
      render: (data) =>
        React.createElement(SignupEmail, {
          siteName: SITE_NAME,
          siteUrl: SITE_URL,
          recipient: data.email,
          confirmationUrl: data.url,
        }),
    },
    invite: {
      subject: 'Você foi convidado',
      render: (data) =>
        React.createElement(InviteEmail, {
          siteName: SITE_NAME,
          siteUrl: SITE_URL,
          confirmationUrl: data.url,
        }),
    },
    magiclink: {
      subject: 'Seu link de acesso',
      render: (data) =>
        React.createElement(MagicLinkEmail, {
          siteName: SITE_NAME,
          confirmationUrl: data.url,
        }),
    },
    recovery: {
      subject: 'Redefinir sua senha',
      render: (data) =>
        React.createElement(RecoveryEmail, {
          siteName: SITE_NAME,
          confirmationUrl: data.url,
        }),
    },
    email_change: {
      subject: 'Confirme seu novo e-mail',
      render: (data) =>
        React.createElement(EmailChangeEmail, {
          siteName: SITE_NAME,
          oldEmail: data.old_email ?? '',
          email: data.email,
          newEmail: data.new_email ?? '',
          confirmationUrl: data.url,
        }),
    },
    reauthentication: {
      subject: 'Seu código de verificação',
      render: (data) =>
        React.createElement(ReauthenticationEmail, { token: data.token ?? '' }),
    },
    },
  })
  return handler
}

export const Route = createFileRoute("/lovable/email/auth/webhook")({
  server: {
    handlers: {
      POST: ({ request }) => getHandler()(request),
    },
  },
})
