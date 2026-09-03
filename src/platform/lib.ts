import { db } from "./db";
import type { EngagementType, Lob, OfficeHour } from "@/integrations/supabase/platform-schema";

/* ---------------------------------------------------------------- engajamento */

/**
 * Registra um evento de engajamento. Nunca deve derrubar a página: se o insert
 * falhar (offline, RLS), o log fica no console e o usuário segue navegando.
 */
export async function track(
  type: EngagementType,
  opts: { userId?: string | null; lobId?: string | null; assetId?: string | null } = {},
) {
  if (!opts.userId) return;
  const { error } = await db.from("engagement_events").insert({
    user_id: opts.userId,
    type,
    lob_id: opts.lobId ?? null,
    asset_id: opts.assetId ?? null,
  });
  if (error) console.warn("[platform] evento não registrado", type, error.message);
}

/* ---------------------------------------------------------------- formatação */

export function formatBytes(bytes: number | null | undefined): string {
  if (!bytes || bytes <= 0) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let v = bytes;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i += 1;
  }
  return `${v < 10 && i > 0 ? v.toFixed(1) : Math.round(v)} ${units[i]}`;
}

const BR = "pt-BR";
const TZ = "America/Sao_Paulo";

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(BR, {
    timeZone: TZ,
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = iso.length <= 10 ? new Date(`${iso}T12:00:00Z`) : new Date(iso);
  return d.toLocaleDateString(BR, {
    timeZone: TZ,
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDuration(min: number | null | undefined): string {
  if (!min) return "—";
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}h${m ? String(m).padStart(2, "0") : ""}` : `${m} min`;
}

/** Extensão em caixa alta, para o rótulo de tipo do arquivo. */
export function fileKind(filename: string): string {
  const ext = filename.split(".").pop();
  return ext ? ext.toUpperCase() : "ARQ";
}

/* ---------------------------------------------------------------- vídeo */

/** Normaliza URL de YouTube/Vimeo para a forma embutível. */
export function toEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return `https://www.youtube.com/embed${u.pathname}`;
    if (host.endsWith("youtube.com")) {
      if (u.pathname.startsWith("/embed/")) return url;
      const v = u.searchParams.get("v");
      return v ? `https://www.youtube.com/embed/${v}` : url;
    }
    if (host.endsWith("vimeo.com")) {
      if (host.startsWith("player.")) return url;
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${id}` : url;
    }
    return url;
  } catch {
    return null;
  }
}

/* ---------------------------------------------------------------- calendário */

function icsEscape(v: string) {
  return v.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

function icsStamp(d: Date) {
  return `${d.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;
}

/** Convite de calendário da sessão, gerado no navegador (sem depender de e-mail). */
export function buildIcs(session: OfficeHour, lob?: Lob | null): string {
  const start = new Date(session.starts_at);
  const end = new Date(start.getTime() + (session.duration_min || 60) * 60_000);
  const description = [session.description, session.meeting_url && `Sala: ${session.meeting_url}`]
    .filter(Boolean)
    .join("\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//IA no Trabalho//Office Hours//PT-BR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${session.id}@roadshow-ia`,
    `DTSTAMP:${icsStamp(new Date())}`,
    `DTSTART:${icsStamp(start)}`,
    `DTEND:${icsStamp(end)}`,
    `SUMMARY:${icsEscape(lob ? `${session.title} · ${lob.title}` : session.title)}`,
    description ? `DESCRIPTION:${icsEscape(description)}` : "",
    session.meeting_url ? `URL:${session.meeting_url}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* ---------------------------------------------------------------- csv */

function csvEscape(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = Array.isArray(v) ? v.join(" | ") : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv<T extends Record<string, unknown>>(rows: T[], cols: (keyof T)[]): string {
  const header = cols.map((c) => String(c)).join(",");
  const body = rows.map((r) => cols.map((c) => csvEscape(r[c])).join(",")).join("\n");
  return `${header}\n${body}\n`;
}

export function downloadCsv(filename: string, csv: string) {
  downloadBlob(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }), filename);
}
