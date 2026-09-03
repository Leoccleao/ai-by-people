import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { zipSync } from "fflate";
import { toast } from "sonner";
import { usePlatformAuth } from "@/platform/auth";
import { Protected } from "@/platform/guard";
import { db } from "@/platform/db";
import { areaLabel } from "@/platform/shell";
import { useLob, useMyProgress, useOfficeHours } from "@/platform/queries";
import { PromptBlock } from "@/platform/prompt-block";
import { countSteps, type GuideStep, type LobGuide } from "@/platform/guide-schema";
import { renderMarkdown } from "@/platform/markdown";
import {
  downloadBlob,
  fileKind,
  formatBytes,
  formatDate,
  formatDateTime,
  track,
} from "@/platform/lib";
import {
  Chip,
  Eyebrow,
  FileBadge,
  LabeledBox,
  ProgressBar,
  SectionHead,
  areaGradient,
} from "@/platform/revamp-ui";
import { Button, Card, EmptyState, Spinner, buttonClass } from "@/platform/ui";
import { toEmbedUrl } from "@/platform/lib";
import type { Asset, Lob } from "@/integrations/supabase/platform-schema";

export const Route = createFileRoute("/plataforma/lob/$slug")({
  component: () => (
    <Protected chrome="top">
      <LobPage />
    </Protected>
  ),
});

const BUCKET = "follow-along";

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
  const guide = lob?.guide ?? null;

  const row = lob ? progress?.[lob.id] : undefined;
  const stepsDone = useMemo(() => new Set(row?.steps_done ?? []), [row?.steps_done]);
  const checkDone = useMemo(() => new Set(row?.checklist_done ?? []), [row?.checklist_done]);
  const totalSteps = countSteps(guide);

  const nextOh = useMemo(
    () =>
      (oh?.sessions ?? [])
        .filter((s) => s.lob_id === lob?.id && new Date(s.starts_at) > new Date())
        .sort((a, b) => a.starts_at.localeCompare(b.starts_at))[0] ?? null,
    [oh?.sessions, lob?.id],
  );

  useEffect(() => {
    if (!lob || !userId || viewLogged.current === lob.id) return;
    viewLogged.current = lob.id;
    void track("page_view", { userId, lobId: lob.id });
  }, [lob, userId]);

  /**
   * Grava a lista inteira porque `lob_progress` guarda arrays: ler-modificar-
   * escrever é o custo de não ter uma linha por etapa, e aqui é irrelevante
   * (poucos itens, um usuário por vez).
   */
  const toggle = useCallback(
    async (field: "steps_done" | "checklist_done", id: string, on: boolean) => {
      if (!lob || !userId) return;
      const current = (field === "steps_done" ? row?.steps_done : row?.checklist_done) ?? [];
      const next = on ? [...new Set([...current, id])] : current.filter((x) => x !== id);
      const { error } = await db.from("lob_progress").upsert({
        user_id: userId,
        lob_id: lob.id,
        ...(field === "steps_done" ? { steps_done: next } : { checklist_done: next }),
      });
      if (error) {
        toast.error("Não deu para salvar o progresso.");
        return;
      }
      if (field === "steps_done" && on) void track("video_complete", { userId, lobId: lob.id });
      await qc.invalidateQueries({ queryKey: ["pf", "progress"] });
    },
    [lob, userId, row, qc],
  );

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
  const done = Math.min(stepsDone.size, totalSteps);

  return (
    <div>
      <nav className="text-[13px] text-pf-faint">
        <Link to="/plataforma/inicio" className="hover:text-pf-text">
          Áreas
        </Link>
        <span className="px-2">/</span>
        <span>{areaLabel(lob.slug)}</span>
        <span className="px-2">/</span>
        <span className="text-pf-muted">Workshop</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <Header lob={lob} guide={guide} totalSteps={totalSteps} />

          {soon ? (
            <div className="mt-8">
              <EmptyState
                title="Conteúdo em produção"
                body="Esta área ainda não tem workshop publicado. Assim que sair, o roteiro completo aparece aqui."
                action={
                  <Link to="/plataforma/inicio" className={buttonClass("secondary")}>
                    Ver as áreas publicadas
                  </Link>
                }
              />
            </div>
          ) : (
            <>
              <VideoBlock lob={lob} guide={guide} userId={userId} />

              {guide ? (
                <>
                  {guide.concepts.length > 0 && (
                    <section className="mt-12">
                      <SectionHead title="Conceitos-chave" meta="Antes de abrir o roteiro" />
                      <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        {guide.concepts.map((c) => (
                          <Card key={c.label} className="p-5">
                            <Eyebrow>{c.label}</Eyebrow>
                            <div className="mt-3 space-y-3">
                              {c.paragraphs.map((p, i) => (
                                <p
                                  key={i}
                                  className="text-[13.5px] leading-relaxed text-pf-muted"
                                  dangerouslySetInnerHTML={{ __html: bold(p) }}
                                />
                              ))}
                            </div>
                          </Card>
                        ))}
                      </div>
                    </section>
                  )}

                  <section className="mt-12" id="roteiro">
                    <SectionHead
                      title="Follow along"
                      meta={`${done} de ${totalSteps} etapas concluídas`}
                    />
                    {guide.demos.map((demo) => (
                      <div key={demo.id} className="mt-8">
                        <div className="flex flex-wrap items-baseline gap-3">
                          <Eyebrow className="text-pf-link">{demo.label}</Eyebrow>
                          <h3 className="text-[17px] font-semibold tracking-[-0.02em] text-pf-text">
                            {demo.title}
                          </h3>
                        </div>

                        {demo.prerequisites.length > 0 && (
                          <LabeledBox label="Pré-requisitos" className="mt-4">
                            <div className="flex flex-wrap gap-2">
                              {demo.prerequisites.map((p) => (
                                <span
                                  key={p}
                                  className="rounded-full border border-pf-border bg-pf-bg px-3 py-1.5 text-[12.5px] text-pf-muted"
                                >
                                  {p}
                                </span>
                              ))}
                            </div>
                          </LabeledBox>
                        )}

                        <div className="mt-4 space-y-4">
                          {demo.steps.map((step, i) => (
                            <StepCard
                              key={step.id}
                              step={step}
                              index={globalIndex(guide, demo.id, i)}
                              done={stepsDone.has(step.id)}
                              onToggle={(on) => void toggle("steps_done", step.id, on)}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </section>
                </>
              ) : (
                <GuideFallback bodyMd={lob.body_md} />
              )}

              <section className="mt-12" id="materiais">
                <SectionHead
                  title="Arquivos da demo"
                  action={<DownloadAll assets={assets} lob={lob} userId={userId} />}
                />
                {assets.length === 0 ? (
                  <p className="mt-4 text-[13.5px] text-pf-muted">
                    Os arquivos desta área ainda não foram publicados.
                  </p>
                ) : (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {assets.map((a) => (
                      <FileCard key={a.id} asset={a} lobId={lob.id} userId={userId} />
                    ))}
                  </div>
                )}
              </section>

              {guide && guide.checklist.length > 0 && (
                <section className="mt-12">
                  <SectionHead
                    title="Checklist crítico de revisão"
                    meta="Antes de implementar, verifique"
                  />
                  <div className="mt-5 grid overflow-hidden rounded-xl border border-pf-border sm:grid-cols-2">
                    {guide.checklist.map((item) => (
                      <label
                        key={item.id}
                        className="flex cursor-pointer items-start gap-3 border-b border-pf-border px-5 py-3.5 last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0"
                      >
                        <input
                          type="checkbox"
                          checked={checkDone.has(item.id)}
                          onChange={(e) => void toggle("checklist_done", item.id, e.target.checked)}
                          className="mt-0.5 h-4 w-4 shrink-0 accent-[color:var(--pf-text)]"
                        />
                        <span className="text-[13.5px] leading-relaxed text-pf-muted">
                          {item.text}
                        </span>
                      </label>
                    ))}
                  </div>
                </section>
              )}

              {guide && guide.resources.length > 0 && (
                <section className="mt-12">
                  <SectionHead title="Recursos para salvar" meta="Links oficiais OpenAI" />
                  <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {guide.resources.map((r) => (
                      <a
                        key={r.url}
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl border border-pf-border bg-pf-bg p-4 transition hover:border-pf-text/20"
                      >
                        <span className="block text-[13.5px] font-medium text-pf-text">
                          {r.title}
                        </span>
                        <span className="mt-1 block font-mono text-[10.5px] text-pf-fainter">
                          {hostOf(r.url)}
                        </span>
                      </a>
                    ))}
                  </div>
                </section>
              )}

              {guide?.howToStart && (
                <LabeledBox label="Como começar" className="mt-12">
                  <p className="max-w-3xl text-[13.5px] leading-relaxed text-pf-muted">
                    {guide.howToStart}
                  </p>
                </LabeledBox>
              )}
            </>
          )}
        </div>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="space-y-4">
            {!soon && totalSteps > 0 && (
              <Card className="p-5">
                <Eyebrow>Seu progresso</Eyebrow>
                <p className="mt-2 text-[13px] text-pf-muted">
                  <span className="text-[22px] font-semibold text-pf-text">{done}</span> de{" "}
                  {totalSteps} etapas
                </p>
                <div className="mt-3">
                  <ProgressBar done={done} total={totalSteps} />
                </div>
                <ol className="mt-4 space-y-1.5">
                  {(guide?.demos ?? []).flatMap((d) =>
                    d.steps.map((s) => {
                      const isDone = stepsDone.has(s.id);
                      return (
                        <li key={s.id} className="flex items-baseline gap-2.5">
                          <span className="font-mono text-[10px] text-pf-fainter">
                            {String(globalIndex(guide, d.id, d.steps.indexOf(s))).padStart(2, "0")}
                          </span>
                          <span
                            className={`text-[13px] leading-snug ${
                              isDone ? "text-pf-fainter line-through" : "text-pf-strong"
                            }`}
                          >
                            {d.label} · {s.title}
                          </span>
                        </li>
                      );
                    }),
                  )}
                </ol>
              </Card>
            )}

            {nextOh && (
              <Card className="p-5">
                <Eyebrow>Office hours de {areaLabel(lob.slug)}</Eyebrow>
                <p className="mt-2 text-[14px] font-medium text-pf-text">{nextOh.title}</p>
                <p className="mt-1 text-[12.5px] text-pf-muted">
                  {formatDateTime(nextOh.starts_at)} · horário de Brasília
                </p>
                <Link
                  to="/plataforma/office-hours"
                  className={`${buttonClass("primary", "sm")} mt-4`}
                >
                  {oh?.signedUp.includes(nextOh.id) ? "Ver inscrição" : "Inscrever-se"}
                </Link>
              </Card>
            )}

            <Card className="p-5">
              <p className="text-[14px] font-medium text-pf-text">Fez algo com o que aprendeu?</p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-pf-muted">
                Uma gravação de tela já serve. As melhores histórias entram na plataforma.
              </p>
              <Link
                to="/plataforma/historias/nova"
                className="mt-3 inline-block text-[13px] text-pf-link underline underline-offset-2"
              >
                Conte sua história →
              </Link>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- cabeçalho */

function Header({
  lob,
  guide,
  totalSteps,
}: {
  lob: Lob;
  guide: LobGuide | null;
  totalSteps: number;
}) {
  return (
    <header>
      <div className="flex flex-wrap items-center gap-2">
        <span
          className="rounded-md px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white"
          style={{ background: lob.accent ?? "#7C6BD0" }}
        >
          Workshop · {areaLabel(lob.slug)}
        </span>
        {totalSteps > 0 && (
          <Chip>
            {guide?.demos.length} demos · {totalSteps} etapas
          </Chip>
        )}
        {lob.tags.map((t) => (
          <Chip key={t} tone="outline">
            {t}
          </Chip>
        ))}
      </div>

      <h1 className="mt-4 max-w-3xl text-[clamp(1.75rem,3.4vw,2.25rem)] font-semibold leading-tight tracking-[-0.025em] text-pf-text">
        {lob.title}
      </h1>

      {(guide?.lead || lob.subtitle) && (
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-pf-muted">
          {guide?.lead || lob.subtitle}
        </p>
      )}

      {(lob.instructor || lob.event_date) && (
        <div className="mt-5 flex items-center gap-2.5 text-[13px] text-pf-muted">
          <span className="h-7 w-7 rounded-full bg-pf-surface-2" aria-hidden />
          <span>
            {[lob.instructor, lob.event_date ? formatDate(lob.event_date) : null]
              .filter(Boolean)
              .join(" · ")}
          </span>
        </div>
      )}
    </header>
  );
}

/* ---------------------------------------------------------------- vídeo */

function VideoBlock({
  lob,
  guide,
  userId,
}: {
  lob: Lob;
  guide: LobGuide | null;
  userId: string | null;
}) {
  const embed = toEmbedUrl(lob.video_url);

  if (embed) {
    return (
      <div className="mt-7 overflow-hidden rounded-2xl border border-pf-border bg-black">
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
    );
  }

  // Publicado sem gravação: a capa da área ocupa o lugar do player.
  return (
    <div
      className="relative mt-7 flex aspect-video flex-col justify-between overflow-hidden rounded-2xl p-6"
      style={{ background: areaGradient(lob.accent, lob.accent_2) }}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/75">
          Gravação do webinar
        </span>
        <span className="rounded-full bg-black/25 px-3 py-1 text-[11.5px] text-white/90">
          Vídeo em finalização
        </span>
      </div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <span className="max-w-md text-[19px] font-semibold leading-snug text-white">
          {guide?.demos.map((d) => d.title).join(" e ") || lob.title}
        </span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- etapa */

function StepCard({
  step,
  index,
  done,
  onToggle,
}: {
  step: GuideStep;
  index: number;
  done: boolean;
  onToggle: (on: boolean) => void;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="p-5">
        <div className="flex items-start gap-3.5">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-pf-surface-2 font-mono text-[10.5px] text-pf-muted">
            {String(index).padStart(2, "0")}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-[15px] font-semibold text-pf-text">{step.title}</h4>
              <Chip tone={step.kind === "work" ? "accent" : "default"}>
                <span className="font-mono text-[9.5px] uppercase tracking-[0.08em]">
                  {step.kind === "work" ? "ChatGPT Work" : "Chat"}
                </span>
              </Chip>
            </div>
            {step.description && (
              <p className="mt-2 text-[13.5px] leading-relaxed text-pf-muted">{step.description}</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <PromptBlock label={step.promptLabel} prompt={step.prompt} />
        </div>

        {(step.file || step.result) && (
          <div className="mt-3 flex flex-wrap items-center gap-3 text-[12.5px] text-pf-faint">
            {step.file && (
              <span className="inline-flex items-center gap-2 rounded-md bg-pf-surface px-2 py-1">
                <span className="font-mono text-[9.5px] text-pf-muted">{fileKind(step.file)}</span>
                <span className="text-pf-muted">{step.file}</span>
              </span>
            )}
            {step.result && <span>Resultado: {step.result}</span>}
          </div>
        )}

        {step.note && (
          <p className="mt-3 border-l-2 border-pf-border pl-3 text-[12.5px] leading-relaxed text-pf-faint">
            {step.note}
          </p>
        )}
      </div>

      <label
        className={`flex cursor-pointer items-center gap-2.5 border-t border-pf-border px-5 py-3 transition ${
          done ? "bg-[#2C6BE8]/6" : "bg-pf-bg hover:bg-pf-surface"
        }`}
      >
        <input
          type="checkbox"
          checked={done}
          onChange={(e) => onToggle(e.target.checked)}
          className="h-4 w-4 accent-[#2C6BE8]"
        />
        <span className={`text-[13px] ${done ? "font-medium text-[#2C6BE8]" : "text-pf-muted"}`}>
          {done ? "Etapa concluída" : "Marcar etapa como concluída"}
        </span>
      </label>
    </Card>
  );
}

/* ---------------------------------------------------------------- arquivos */

async function signedUrl(asset: Asset) {
  const { data, error } = await db.storage.from(BUCKET).createSignedUrl(asset.storage_key, 120);
  if (error || !data?.signedUrl) throw new Error(error?.message ?? "URL não gerada");
  return data.signedUrl;
}

function FileCard({
  asset,
  lobId,
  userId,
}: {
  asset: Asset;
  lobId: string;
  userId: string | null;
}) {
  const [busy, setBusy] = useState(false);

  async function download() {
    if (busy) return;
    setBusy(true);
    try {
      const url = await signedUrl(asset);
      void track("download", { userId, lobId, assetId: asset.id });
      const res = await fetch(url);
      if (!res.ok) throw new Error(String(res.status));
      downloadBlob(await res.blob(), asset.filename);
    } catch (err) {
      console.error("[platform] download falhou", err);
      toast.error("Não deu para baixar esse arquivo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={download}
      disabled={busy}
      className="group flex items-center gap-3.5 rounded-xl border border-pf-border bg-pf-bg p-4 text-left transition hover:border-pf-text/20 disabled:opacity-60"
    >
      <FileBadge kind={fileKind(asset.filename)} />
      <span className="min-w-0 flex-1">
        <span className="block break-words text-[13.5px] font-medium leading-snug text-pf-text">
          {asset.filename}
        </span>
        <span className="mt-0.5 block text-[12px] text-pf-faint">
          {[asset.demo_label, asset.hint].filter(Boolean).join(" · ") ||
            formatBytes(asset.size_bytes)}
        </span>
      </span>
      <span aria-hidden className="shrink-0 text-pf-fainter transition group-hover:text-pf-text">
        ↓
      </span>
    </button>
  );
}

function DownloadAll({
  assets,
  lob,
  userId,
}: {
  assets: Asset[];
  lob: Lob;
  userId: string | null;
}) {
  const [zipping, setZipping] = useState(false);
  if (assets.length === 0) return null;

  async function run() {
    if (zipping) return;
    setZipping(true);
    try {
      const entries: Record<string, Uint8Array> = {};
      for (const asset of assets) {
        const url = await signedUrl(asset);
        const res = await fetch(url);
        if (!res.ok) throw new Error(`${asset.filename}: ${res.status}`);
        entries[asset.filename] = new Uint8Array(await res.arrayBuffer());
        void track("download", { userId, lobId: lob.id, assetId: asset.id });
      }
      const zipped = zipSync(entries, { level: 6 });
      downloadBlob(
        new Blob([zipped as unknown as BlobPart], { type: "application/zip" }),
        `${lob.slug}-follow-along.zip`,
      );
    } catch (err) {
      console.error("[platform] zip falhou", err);
      toast.error("Não deu para montar o .zip. Baixe os arquivos separadamente.");
    } finally {
      setZipping(false);
    }
  }

  return (
    <Button variant="secondary" size="sm" onClick={run} disabled={zipping}>
      {zipping ? "Montando .zip…" : "Baixar todos (.zip)"}
    </Button>
  );
}

/* ---------------------------------------------------------------- auxiliares */

/** Numeração contínua das etapas entre demos: 01…08, não 01…04 duas vezes. */
function globalIndex(guide: LobGuide | null, demoId: string, stepIndex: number) {
  if (!guide) return stepIndex + 1;
  let n = 0;
  for (const d of guide.demos) {
    if (d.id === demoId) return n + stepIndex + 1;
    n += d.steps.length;
  }
  return stepIndex + 1;
}

/** Só **negrito** — o texto dos conceitos vem do admin, não do usuário. */
function bold(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong class='font-semibold text-pf-text'>$1</strong>");
}

function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** Área publicada antes de ter guia estruturado: mostra o markdown antigo. */
function GuideFallback({ bodyMd }: { bodyMd: string | null }) {
  const html = useMemo(() => renderMarkdown(bodyMd), [bodyMd]);
  if (!html) {
    return (
      <p className="mt-10 text-[13.5px] text-pf-muted">
        O guia deste workshop ainda não foi publicado.
      </p>
    );
  }
  return (
    <article
      className="pf-prose mt-10 max-w-none"
      // Conteúdo do guia é escrito só por admins (RLS em `lobs`).
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
