import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { zipSync, strToU8 } from "fflate";
import { toast } from "sonner";
import { usePlatformAuth } from "@/platform/auth";
import { Protected } from "@/platform/guard";
import { db } from "@/platform/db";
import { useLob, useMyProgress, useOfficeHours } from "@/platform/queries";
import { buildToc, renderMarkdown } from "@/platform/markdown";
import {
  downloadBlob,
  fileKind,
  formatBytes,
  formatDate,
  formatDateTime,
  formatDuration,
  toEmbedUrl,
  track,
} from "@/platform/lib";
import { Button, Card, EmptyState, Spinner, Tag, buttonClass } from "@/platform/ui";
import type { Asset } from "@/integrations/supabase/platform-schema";

export const Route = createFileRoute("/plataforma/lob/$slug")({
  component: () => (
    <Protected>
      <LobPage />
    </Protected>
  ),
});

function LobPage() {
  const { slug } = Route.useParams();
  const { session } = usePlatformAuth();
  const { data, isLoading } = useLob(slug);
  const { data: progress } = useMyProgress();
  const { data: oh } = useOfficeHours();
  const qc = useQueryClient();
  const viewLogged = useRef<string | null>(null);

  const lob = data?.lob ?? null;
  const assets = data?.assets ?? [];
  const userId = session?.user.id ?? null;

  const html = useMemo(() => renderMarkdown(lob?.body_md), [lob?.body_md]);
  const toc = useMemo(() => buildToc(lob?.body_md), [lob?.body_md]);
  const embed = toEmbedUrl(lob?.video_url);
  const watched = Boolean(lob && progress?.[lob.id]);

  const lobOfficeHours = useMemo(
    () =>
      (oh?.sessions ?? []).filter(
        (s) => s.lob_id === lob?.id && new Date(s.starts_at) > new Date(),
      ),
    [oh?.sessions, lob?.id],
  );

  useEffect(() => {
    if (!lob || !userId || viewLogged.current === lob.id) return;
    viewLogged.current = lob.id;
    void track("page_view", { userId, lobId: lob.id });
  }, [lob, userId]);

  async function markWatched() {
    if (!lob || !userId) return;
    const { error } = await db
      .from("lob_progress")
      .upsert({ user_id: userId, lob_id: lob.id, watched_at: new Date().toISOString() });
    if (error) {
      toast.error("Não deu para salvar agora.");
      return;
    }
    void track("video_complete", { userId, lobId: lob.id });
    await qc.invalidateQueries({ queryKey: ["pf", "progress"] });
    toast.success("Marcado como assistido.");
  }

  if (isLoading) return <Spinner />;
  if (!lob) {
    return (
      <EmptyState
        title="Área não encontrada"
        body="O endereço pode estar errado ou o conteúdo saiu do ar."
        action={
          <Link to="/plataforma/inicio" className={buttonClass("secondary")}>
            Voltar ao início
          </Link>
        }
      />
    );
  }

  const soon = lob.status === "coming_soon";

  return (
    <div>
      <nav className="mb-5 text-[13px] text-pf-faint">
        <Link to="/plataforma/inicio" className="hover:text-pf-text">
          Início
        </Link>
        <span className="px-2">/</span>
        <span className="text-pf-muted">{lob.title}</span>
      </nav>

      <header className="border-b border-pf-border pb-6">
        <div className="flex flex-wrap items-center gap-2">
          {soon ? <Tag tone="soon">Em breve</Tag> : lob.tags.map((t) => <Tag key={t}>{t}</Tag>)}
          {watched && <Tag>Assistido</Tag>}
        </div>
        <h1 className="mt-3 max-w-3xl text-[clamp(1.5rem,3.2vw,2.125rem)] font-semibold leading-tight text-pf-text">
          {lob.title}
        </h1>
        {lob.subtitle && (
          <p className="mt-2.5 max-w-2xl text-[15px] leading-relaxed text-pf-muted">
            {lob.subtitle}
          </p>
        )}
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* coluna principal */}
        <div className="min-w-0">
          {soon ? (
            <EmptyState
              title="Conteúdo em produção"
              body="Esta área ainda não tem webinar publicado. Assim que sair, ele aparece aqui — e você pode acompanhar as outras áreas enquanto isso."
              action={
                <Link to="/plataforma/inicio" className={buttonClass("secondary")}>
                  Ver as áreas publicadas
                </Link>
              }
            />
          ) : (
            <>
              {embed ? (
                <div className="overflow-hidden rounded-xl border border-pf-border bg-black">
                  <div className="relative aspect-video">
                    <iframe
                      src={embed}
                      title={lob.title}
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; fullscreen"
                      allowFullScreen
                      onLoad={() => void track("video_play", { userId, lobId: lob.id })}
                    />
                  </div>
                </div>
              ) : (
                <VideoPlaceholder title={lob.title} />
              )}

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-[13px] text-pf-faint">
                  {[
                    lob.instructor,
                    lob.event_date ? formatDate(lob.event_date) : null,
                    lob.duration_min ? formatDuration(lob.duration_min) : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                <Button variant="secondary" size="sm" onClick={markWatched} disabled={watched}>
                  {watched ? "Assistido" : "Marcar como assistido"}
                </Button>
              </div>

              {html ? (
                <article
                  className="pf-prose mt-10 max-w-none"
                  // Conteúdo do guia é escrito só por admins (RLS em `lobs`).
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              ) : (
                <p className="mt-10 text-sm text-pf-muted">
                  O guia deste workshop ainda não foi publicado.
                </p>
              )}
            </>
          )}
        </div>

        {/* coluna lateral */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="space-y-4">
            {toc.length > 0 && (
              <Card className="p-5">
                <h2 className="text-[12px] font-medium uppercase tracking-wider text-pf-faint">
                  Neste guia
                </h2>
                <ul className="mt-3 space-y-1.5">
                  {toc.map((h) => (
                    <li key={h.id} className={h.depth === 3 ? "pl-3" : ""}>
                      <a
                        href={`#${h.id}`}
                        className="text-[13px] leading-snug text-pf-muted hover:text-pf-text"
                      >
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            <FollowAlong assets={assets} lobId={lob.id} lobSlug={lob.slug} userId={userId} />

            {lobOfficeHours.length > 0 && (
              <Card className="p-5">
                <h2 className="text-[12px] font-medium uppercase tracking-wider text-pf-faint">
                  Office hours desta área
                </h2>
                <ul className="mt-3 space-y-3">
                  {lobOfficeHours.slice(0, 2).map((s) => (
                    <li key={s.id}>
                      <p className="text-[13px] font-medium text-pf-text">{s.title}</p>
                      <p className="text-[12px] text-pf-muted">{formatDateTime(s.starts_at)}</p>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/plataforma/office-hours"
                  className={`${buttonClass("secondary", "sm")} mt-4 w-full`}
                >
                  Ver e inscrever-se
                </Link>
              </Card>
            )}

            <Card className="bg-pf-surface p-5">
              <p className="text-[13px] font-medium text-pf-text">
                Criou algo legal com o que aprendeu?
              </p>
              <p className="mt-1.5 text-[12px] leading-relaxed text-pf-muted">
                Não precisa ser vídeo produzido. Uma gravação de tela já serve.
              </p>
              <Link
                to="/plataforma/historias/nova"
                className="mt-3 inline-block text-[13px] text-pf-link underline underline-offset-2"
              >
                Conte sua história →
              </Link>
            </Card>

            <Card className="p-5">
              <p className="text-[13px] font-medium text-pf-text">
                Quer esse webinar na sua empresa?
              </p>
              <Link
                to="/plataforma/para-sua-empresa"
                className="mt-2 inline-block text-[13px] text-pf-link underline underline-offset-2"
              >
                Traga para sua empresa →
              </Link>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
}

/**
 * Ocupa o lugar do player quando a área já está publicada mas a gravação
 * ainda não subiu — mostra que o webinar existe e está a caminho, em vez de
 * uma caixa vazia genérica.
 */
function VideoPlaceholder({ title }: { title: string }) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-xl border border-pf-border bg-gradient-to-br from-[#111214] to-[#232427]">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-white/10">
          <svg width="20" height="22" viewBox="0 0 20 22" fill="none" aria-hidden>
            <path
              d="M2 2.5C2 1.19 3.43.39 4.55 1.06l14.2 8.5c1.1.66 1.1 2.28 0 2.94l-14.2 8.5C3.43 21.66 2 20.86 2 19.55V2.5z"
              fill="white"
              fillOpacity="0.85"
            />
          </svg>
        </span>
        <div>
          <p className="text-[13px] font-medium text-white/90">{title}</p>
          <p className="mt-1 text-[12px] text-white/50">
            Vídeo em breve — a gravação está sendo finalizada.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- downloads */

const BUCKET = "follow-along";

function FollowAlong({
  assets,
  lobId,
  lobSlug,
  userId,
}: {
  assets: Asset[];
  lobId: string;
  lobSlug: string;
  userId: string | null;
}) {
  const [zipping, setZipping] = useState(false);

  async function signedUrl(asset: Asset) {
    const { data, error } = await db.storage.from(BUCKET).createSignedUrl(asset.storage_key, 120);
    if (error || !data?.signedUrl) throw new Error(error?.message ?? "URL não gerada");
    return data.signedUrl;
  }

  async function downloadOne(asset: Asset) {
    try {
      const url = await signedUrl(asset);
      void track("download", { userId, lobId, assetId: asset.id });
      const res = await fetch(url);
      if (!res.ok) throw new Error(String(res.status));
      downloadBlob(await res.blob(), asset.filename);
    } catch (err) {
      console.error("[platform] download falhou", err);
      toast.error("Não deu para baixar esse arquivo.");
    }
  }

  async function downloadAll() {
    if (zipping || assets.length === 0) return;
    setZipping(true);
    try {
      const entries: Record<string, Uint8Array> = {};
      for (const asset of assets) {
        const url = await signedUrl(asset);
        const res = await fetch(url);
        if (!res.ok) throw new Error(`${asset.filename}: ${res.status}`);
        entries[asset.filename] = new Uint8Array(await res.arrayBuffer());
        void track("download", { userId, lobId, assetId: asset.id });
      }
      if (Object.keys(entries).length === 0) entries["LEIA-ME.txt"] = strToU8("Sem arquivos.");
      const zipped = zipSync(entries, { level: 6 });
      downloadBlob(
        new Blob([zipped as unknown as BlobPart], { type: "application/zip" }),
        `${lobSlug}-follow-along.zip`,
      );
    } catch (err) {
      console.error("[platform] zip falhou", err);
      toast.error("Não deu para montar o .zip. Tente baixar os arquivos separadamente.");
    } finally {
      setZipping(false);
    }
  }

  if (assets.length === 0) {
    return (
      <Card className="p-5">
        <h2 className="text-[12px] font-medium uppercase tracking-wider text-pf-faint">
          Material follow along
        </h2>
        <p className="mt-3 text-[13px] leading-relaxed text-pf-muted">
          Os arquivos desta área ainda não foram publicados.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <h2 className="text-[12px] font-medium uppercase tracking-wider text-pf-faint">
        Material follow along
      </h2>
      <ul className="mt-3 divide-y divide-pf-border">
        {assets.map((a) => (
          <li key={a.id} className="flex items-center justify-between gap-3 py-2.5">
            <button
              onClick={() => downloadOne(a)}
              className="min-w-0 flex-1 text-left"
              title={a.filename}
            >
              <span className="block truncate text-[13px] text-pf-text hover:underline">
                {a.filename}
              </span>
              <span className="text-[11px] text-pf-faint">
                {fileKind(a.filename)} · {formatBytes(a.size_bytes)}
              </span>
            </button>
            <span aria-hidden className="text-pf-faint">
              ↓
            </span>
          </li>
        ))}
      </ul>
      <Button
        variant="secondary"
        size="sm"
        className="mt-4 w-full"
        onClick={downloadAll}
        disabled={zipping}
      >
        {zipping ? "Montando .zip…" : "Baixar todos (.zip)"}
      </Button>
    </Card>
  );
}
