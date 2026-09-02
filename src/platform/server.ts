import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Funções de servidor da plataforma.
 *
 * `supabaseAdmin` (service role) só é importado dentro dos handlers: este
 * arquivo é referenciado por rotas, e um import de topo vazaria a chave para o
 * bundle do cliente.
 */

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/* ---------------------------------------------------------------- acesso */

/**
 * Decide se um e-mail pode receber magic link: convidado, já cadastrado, ou
 * colega de domínio de alguém que já entrou. A regra vive no banco
 * (`email_may_access`), que só o service role pode chamar.
 */
export const checkEmailAccess = createServerFn({ method: "POST" })
  .validator((d: { email: string }) => ({
    email: String(d.email ?? "")
      .trim()
      .toLowerCase(),
  }))
  .handler(
    async ({ data }): Promise<{ allowed: boolean; hasAccount: boolean; reason?: string }> => {
      if (!EMAIL_RE.test(data.email)) {
        return { allowed: false, hasAccount: false, reason: "invalid" };
      }
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

      const { data: allowed, error } = await supabaseAdmin.rpc(
        "email_may_access" as never,
        {
          _email: data.email,
        } as never,
      );
      if (error) {
        console.error("[platform] email_may_access falhou", error);
        throw new Error("Não foi possível verificar o acesso agora.");
      }

      const { data: profile } = await supabaseAdmin
        .from("profiles" as never)
        .select("id")
        .eq("email", data.email)
        .maybeSingle();

      const domain = data.email.split("@")[1] ?? "";
      const { data: blocked } = await supabaseAdmin
        .from("blocked_domains" as never)
        .select("domain")
        .eq("domain", domain)
        .maybeSingle();

      return {
        allowed: Boolean(allowed),
        hasAccount: Boolean(profile),
        reason: allowed ? undefined : blocked ? "personal_domain" : "not_invited",
      };
    },
  );

/* ---------------------------------------------------------------- admin */

async function assertAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("user_roles" as never)
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (!data) throw new Error("Acesso restrito a administradores.");
}

/** Cadastra convidados (individual ou em lote) e libera o domínio corporativo. */
export const adminInviteEmails = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: { emails: string[]; note?: string }) => ({
    emails: (Array.isArray(d.emails) ? d.emails : []).map((e) => String(e).trim().toLowerCase()),
    note: d.note ? String(d.note).slice(0, 200) : undefined,
  }))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const valid = [...new Set(data.emails.filter((e) => EMAIL_RE.test(e)))];
    const invalid = data.emails.filter((e) => e && !EMAIL_RE.test(e));
    if (valid.length === 0) return { invited: 0, invalid, skipped: 0 };

    const { data: existing } = await supabaseAdmin
      .from("invited_emails" as never)
      .select("email")
      .in("email", valid);
    const already = new Set((existing ?? []).map((r: { email: string }) => r.email));
    const fresh = valid.filter((e) => !already.has(e));

    if (fresh.length > 0) {
      const { error } = await supabaseAdmin.from("invited_emails" as never).insert(
        fresh.map((email) => ({
          email,
          note: data.note ?? null,
          invited_by: context.userId,
        })) as never,
      );
      if (error) throw new Error(error.message);
    }

    const sent = await sendInviteEmails(fresh);
    return { invited: fresh.length, invalid, skipped: already.size, emailsSent: sent };
  });

/** Promove ou rebaixa um participante. */
export const adminSetRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: { userId: string; admin: boolean }) => ({
    userId: String(d.userId),
    admin: Boolean(d.admin),
  }))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    if (data.userId === context.userId && !data.admin) {
      throw new Error("Você não pode remover o seu próprio acesso de admin.");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.admin) {
      const { error } = await supabaseAdmin
        .from("user_roles" as never)
        .upsert({ user_id: data.userId, role: "admin" } as never);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin
        .from("user_roles" as never)
        .delete()
        .eq("user_id", data.userId)
        .eq("role", "admin");
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

/** Desativa/reativa uma conta sem apagar histórico de engajamento. */
export const adminSetActive = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: { userId: string; active: boolean }) => ({
    userId: String(d.userId),
    active: Boolean(d.active),
  }))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("profiles" as never)
      .update({ is_active: data.active } as never)
      .eq("id", data.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ---------------------------------------------------------------- e-mail */

type MailPayload = { to: string[]; subject: string; html: string };

/**
 * Envio transacional via Resend. Sem `RESEND_API_KEY` configurada a plataforma
 * segue funcionando — o convite continua valendo e a pessoa entra pedindo o
 * magic link em /plataforma/entrar. O retorno diz o que aconteceu.
 */
async function sendMail(payload: MailPayload): Promise<"sent" | "skipped" | "failed"> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.PLATFORM_MAIL_FROM;
  if (!key || !from || payload.to.length === 0) return "skipped";
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({ from, to: payload.to, subject: payload.subject, html: payload.html }),
    });
    if (!res.ok) {
      console.error("[platform] resend respondeu", res.status, await res.text());
      return "failed";
    }
    return "sent";
  } catch (err) {
    console.error("[platform] envio de e-mail falhou", err);
    return "failed";
  }
}

function platformUrl(path: string) {
  const base = process.env.PLATFORM_BASE_URL ?? "";
  return `${base.replace(/\/$/, "")}${path}`;
}

async function sendInviteEmails(emails: string[]) {
  if (emails.length === 0) return "skipped" as const;
  const link = platformUrl("/plataforma/entrar");
  return sendMail({
    to: emails,
    subject: "Seu acesso ao Roadshow IA",
    html: `
      <p>Olá,</p>
      <p>Seu e-mail foi liberado na plataforma do Roadshow de IA: webinars gravados e material follow along por área.</p>
      <p><a href="${link}">Acessar a plataforma</a> — é só informar este e-mail e você recebe um link de entrada.</p>
      <p>Colegas da sua empresa com e-mail do mesmo domínio também podem criar conta sozinhos.</p>
    `,
  });
}

/** Confirmação de inscrição em office hours, com o link da sala. */
export const sendOfficeHourConfirmation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: { officeHourId: string }) => ({ officeHourId: String(d.officeHourId) }))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [{ data: oh }, { data: profile }] = await Promise.all([
      supabaseAdmin
        .from("office_hours" as never)
        .select("*")
        .eq("id", data.officeHourId)
        .maybeSingle(),
      supabaseAdmin
        .from("profiles" as never)
        .select("email, name")
        .eq("id", context.userId)
        .maybeSingle(),
    ]);
    if (!oh || !profile) return { status: "skipped" as const };

    const session = oh as unknown as {
      title: string;
      starts_at: string;
      meeting_url: string | null;
    };
    const who = profile as unknown as { email: string; name: string | null };
    const when = new Date(session.starts_at).toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      dateStyle: "full",
      timeStyle: "short",
    });

    const status = await sendMail({
      to: [who.email],
      subject: `Inscrição confirmada: ${session.title}`,
      html: `
        <p>Olá${who.name ? `, ${who.name}` : ""},</p>
        <p>Sua inscrição em <strong>${session.title}</strong> está confirmada.</p>
        <p><strong>Quando:</strong> ${when} (horário de Brasília)</p>
        ${session.meeting_url ? `<p><strong>Sala:</strong> <a href="${session.meeting_url}">${session.meeting_url}</a></p>` : ""}
        <p>O convite de calendário (.ics) também está disponível na página de Office Hours.</p>
      `,
    });
    return { status };
  });

/** Avisa o time organizador quando entra uma solicitação de webinar. */
export const notifyWebinarRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: { company: string; email: string; lobs: string[] }) => ({
    company: String(d.company ?? ""),
    email: String(d.email ?? ""),
    lobs: Array.isArray(d.lobs) ? d.lobs.map(String) : [],
  }))
  .handler(async ({ data }) => {
    const to = (process.env.PLATFORM_NOTIFY_EMAILS ?? "")
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);
    const status = await sendMail({
      to,
      subject: `Novo pedido de webinar — ${data.company || "empresa não informada"}`,
      html: `
        <p>Nova solicitação de webinar sob demanda.</p>
        <ul>
          <li><strong>Empresa:</strong> ${data.company || "—"}</li>
          <li><strong>Contato:</strong> ${data.email}</li>
          <li><strong>Áreas:</strong> ${data.lobs.join(", ") || "—"}</li>
        </ul>
        <p><a href="${platformUrl("/plataforma/admin/solicitacoes")}">Ver na área admin</a></p>
      `,
    });
    return { status };
  });
