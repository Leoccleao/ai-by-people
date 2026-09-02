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

type MailStatus = "sent" | "skipped" | "failed";

/**
 * Envio pelo e-mail gerenciado do Lovable (`sendTemplateEmail`), o mesmo canal
 * dos e-mails de auth — não há provedor externo para configurar. Sem
 * `LOVABLE_API_KEY` a plataforma segue funcionando: o convite continua valendo
 * e a pessoa entra pedindo o magic link em /plataforma/entrar.
 */
async function sendTemplate(
  templateName: string,
  to: string,
  templateData: Record<string, unknown>,
): Promise<MailStatus> {
  if (!to || !process.env.LOVABLE_API_KEY) return "skipped";
  try {
    const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
    const res = await sendTemplateEmail(templateName, to, { templateData });
    return res.sent ? "sent" : "skipped";
  } catch (err) {
    console.error(`[platform] envio de '${templateName}' falhou`, err);
    return "failed";
  }
}

/** Pior status do lote: se um falhou, o lote falhou. */
function worst(results: MailStatus[]): MailStatus {
  if (results.length === 0) return "skipped";
  if (results.includes("failed")) return "failed";
  if (results.includes("sent")) return "sent";
  return "skipped";
}

function platformUrl(path: string) {
  const base = process.env.PLATFORM_BASE_URL ?? "https://aibypeople.org";
  return `${base.replace(/\/$/, "")}${path}`;
}

async function sendInviteEmails(emails: string[]): Promise<MailStatus> {
  if (emails.length === 0) return "skipped";
  const loginUrl = platformUrl("/plataforma/entrar");
  const results = await Promise.all(
    emails.map((email) =>
      sendTemplate("platform-invite", email, {
        loginUrl,
        domain: email.split("@")[1] ?? "",
      }),
    ),
  );
  return worst(results);
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

    const status = await sendTemplate("office-hour-confirmation", who.email, {
      sessionTitle: session.title,
      when,
      meetingUrl: session.meeting_url,
      recipientName: who.name,
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
    const results = await Promise.all(
      to.map((recipient) =>
        sendTemplate("webinar-request", recipient, {
          company: data.company,
          contactEmail: data.email,
          areas: data.lobs.join(", "),
          adminUrl: platformUrl("/plataforma/admin/solicitacoes"),
        }),
      ),
    );
    return { status: worst(results) };
  });
