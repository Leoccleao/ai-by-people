import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { db } from "@/platform/db";
import { useLobs } from "@/platform/queries";
import { fileKind, formatBytes } from "@/platform/lib";
import { slugify } from "@/platform/markdown";
import { DataTable, Td } from "@/platform/admin-ui";
import { Button, Card, Field, Spinner, Tag, inputClass } from "@/platform/ui";
import type { Asset, ContentStatus, Lob } from "@/integrations/supabase/platform-schema";

export const Route = createFileRoute("/plataforma/admin/conteudo")({
  component: Content,
});

const BUCKET = "follow-along";

type Draft = {
  slug: string;
  title: string;
  subtitle: string;
  status: ContentStatus;
  instructor: string;
  instructor_title: string;
  video_url: string;
  body_md: string;
  event_date: string;
  duration_min: string;
  tags: string;
  sort_order: string;
};

const EMPTY: Draft = {
  slug: "",
  title: "",
  subtitle: "",
  status: "coming_soon",
  instructor: "",
  instructor_title: "",
  video_url: "",
  body_md: "",
  event_date: "",
  duration_min: "",
  tags: "",
  sort_order: "0",
};

function toDraft(lob: Lob): Draft {
  return {
    slug: lob.slug,
    title: lob.title,
    subtitle: lob.subtitle ?? "",
    status: lob.status,
    instructor: lob.instructor ?? "",
    instructor_title: lob.instructor_title ?? "",
    video_url: lob.video_url ?? "",
    body_md: lob.body_md ?? "",
    event_date: lob.event_date ?? "",
    duration_min: lob.duration_min ? String(lob.duration_min) : "",
    tags: lob.tags.join(", "),
    sort_order: String(lob.sort_order),
  };
}

function Content() {
  const qc = useQueryClient();
  const { data: lobs, isLoading } = useLobs();
  const [selected, setSelected] = useState<string | null>(null);

  const current = useMemo(
    () => (lobs ?? []).find((l) => l.id === selected) ?? null,
    [lobs, selected],
  );

  if (isLoading) return <Spinner />;

  return (
    <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
      <aside>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wider text-pf-faint">Áreas</h2>
          <Button size="sm" variant="secondary" onClick={() => setSelected("new")}>
            Nova
          </Button>
        </div>
        <ul className="mt-3 divide-y divide-pf-border rounded-xl border border-pf-border">
          {(lobs ?? []).map((l) => (
            <li key={l.id}>
              <button
                onClick={() => setSelected(l.id)}
                className={`flex w-full items-start justify-between gap-3 px-4 py-3 text-left transition hover:bg-pf-surface ${
                  selected === l.id ? "bg-pf-surface" : ""
                }`}
              >
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-medium text-pf-text">
                    {l.title}
                  </span>
                  <span className="text-[12px] text-pf-faint">/{l.slug}</span>
                </span>
                {l.status === "coming_soon" ? <Tag tone="soon">em breve</Tag> : <Tag>no ar</Tag>}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div>
        {selected === "new" ? (
          <LobEditor
            key="new"
            lob={null}
            onSaved={async (id) => {
              await qc.invalidateQueries({ queryKey: ["pf", "lobs"] });
              setSelected(id);
            }}
          />
        ) : current ? (
          <LobEditor
            key={current.id}
            lob={current}
            onSaved={async () => {
              await qc.invalidateQueries({ queryKey: ["pf", "lobs"] });
              await qc.invalidateQueries({ queryKey: ["pf", "lob", current.slug] });
            }}
          />
        ) : (
          <Card className="p-10 text-center text-sm text-pf-muted">
            Selecione uma área à esquerda para editar, ou crie uma nova.
          </Card>
        )}
      </div>
    </div>
  );
}

function LobEditor({ lob, onSaved }: { lob: Lob | null; onSaved: (id: string) => void }) {
  const [draft, setDraft] = useState<Draft>(lob ? toDraft(lob) : EMPTY);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setDraft(lob ? toDraft(lob) : EMPTY);
  }, [lob]);

  function set<K extends keyof Draft>(k: K, v: Draft[K]) {
    setDraft((d) => ({ ...d, [k]: v }));
  }

  async function save() {
    if (busy) return;
    const slug = slugify(draft.slug || draft.title);
    if (!slug || !draft.title.trim()) {
      toast.error("Título e slug são obrigatórios.");
      return;
    }
    setBusy(true);
    const payload = {
      slug,
      title: draft.title.trim(),
      subtitle: draft.subtitle.trim() || null,
      status: draft.status,
      instructor: draft.instructor.trim() || null,
      instructor_title: draft.instructor_title.trim() || null,
      video_url: draft.video_url.trim() || null,
      body_md: draft.body_md || null,
      event_date: draft.event_date || null,
      duration_min: draft.duration_min ? Number(draft.duration_min) : null,
      tags: draft.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      sort_order: Number(draft.sort_order) || 0,
    };

    const res = lob
      ? await db.from("lobs").update(payload).eq("id", lob.id).select("id").maybeSingle()
      : await db.from("lobs").insert(payload).select("id").maybeSingle();

    setBusy(false);
    if (res.error) {
      console.error("[platform] salvar LOB falhou", res.error);
      toast.error(
        res.error.code === "23505" ? "Já existe uma área com esse slug." : "Não deu para salvar.",
      );
      return;
    }
    toast.success("Salvo.");
    onSaved(res.data?.id ?? lob?.id ?? "");
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Título" required>
            <input
              value={draft.title}
              onChange={(e) => set("title", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Slug" required hint="Vira o endereço: /plataforma/lob/slug">
            <input
              value={draft.slug}
              onChange={(e) => set("slug", e.target.value)}
              placeholder={slugify(draft.title)}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="mt-5">
          <Field label="Subtítulo">
            <input
              value={draft.subtitle}
              onChange={(e) => set("subtitle", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Status">
            <select
              value={draft.status}
              onChange={(e) => set("status", e.target.value as ContentStatus)}
              className={inputClass}
            >
              <option value="coming_soon">Em breve</option>
              <option value="published">Publicado</option>
            </select>
          </Field>
          <Field label="Data do webinar">
            <input
              type="date"
              value={draft.event_date}
              onChange={(e) => set("event_date", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Duração (min)">
            <input
              type="number"
              min={0}
              value={draft.duration_min}
              onChange={(e) => set("duration_min", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Ordem">
            <input
              type="number"
              value={draft.sort_order}
              onChange={(e) => set("sort_order", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field label="Instrutor(a)">
            <input
              value={draft.instructor}
              onChange={(e) => set("instructor", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Cargo do instrutor">
            <input
              value={draft.instructor_title}
              onChange={(e) => set("instructor_title", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field
            label="URL do vídeo"
            hint="YouTube não listado ou Vimeo. O embed é montado sozinho."
          >
            <input
              value={draft.video_url}
              onChange={(e) => set("video_url", e.target.value)}
              placeholder="https://youtu.be/..."
              className={inputClass}
            />
          </Field>
          <Field label="Tags" hint="Separadas por vírgula.">
            <input
              value={draft.tags}
              onChange={(e) => set("tags", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="mt-5">
          <Field
            label="Guia do workshop (markdown)"
            hint="Títulos de nível 2 e 3 viram âncoras na navegação lateral da página."
          >
            <textarea
              rows={16}
              value={draft.body_md}
              onChange={(e) => set("body_md", e.target.value)}
              className={`${inputClass} font-mono text-[13px]`}
            />
          </Field>
        </div>

        <Button className="mt-5" onClick={save} disabled={busy}>
          {busy ? "Salvando…" : lob ? "Salvar alterações" : "Criar área"}
        </Button>
      </Card>

      {lob && <AssetManager lob={lob} />}
    </div>
  );
}

function AssetManager({ lob }: { lob: Lob }) {
  const qc = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const assets = useQuery({
    queryKey: ["pf", "admin", "assets", lob.id],
    queryFn: async (): Promise<Asset[]> => {
      const { data, error } = await db
        .from("assets")
        .select("*")
        .eq("lob_id", lob.id)
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as Asset[];
    },
  });

  async function refresh() {
    await qc.invalidateQueries({ queryKey: ["pf", "admin", "assets", lob.id] });
    await qc.invalidateQueries({ queryKey: ["pf", "lob", lob.slug] });
  }

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    let ok = 0;
    for (const [i, file] of Array.from(files).entries()) {
      const key = `${lob.slug}/${Date.now()}-${i}-${file.name}`;
      const { error: upErr } = await db.storage.from(BUCKET).upload(key, file, { upsert: false });
      if (upErr) {
        console.error("[platform] upload falhou", upErr);
        toast.error(`Falhou: ${file.name}`);
        continue;
      }
      const { error } = await db.from("assets").insert({
        lob_id: lob.id,
        filename: file.name,
        content_type: file.type || null,
        size_bytes: file.size,
        storage_key: key,
        sort_order: (assets.data?.length ?? 0) + i,
      });
      if (error) {
        console.error("[platform] registro do arquivo falhou", error);
        await db.storage.from(BUCKET).remove([key]);
        toast.error(`Falhou: ${file.name}`);
        continue;
      }
      ok += 1;
    }
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
    if (ok > 0) {
      toast.success(`${ok} arquivo(s) adicionados.`);
      await refresh();
    }
  }

  async function remove(asset: Asset) {
    setBusy(true);
    const { error } = await db.from("assets").delete().eq("id", asset.id);
    if (error) toast.error("Não deu para remover.");
    else {
      await db.storage.from(BUCKET).remove([asset.storage_key]);
      toast.success("Arquivo removido.");
      await refresh();
    }
    setBusy(false);
  }

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-semibold text-pf-text">Material follow along</h2>
          <p className="mt-1 text-[13px] text-pf-muted">
            Os arquivos ficam privados e são servidos por URL assinada só a quem está logado.
          </p>
        </div>
        <label className="cursor-pointer">
          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => void upload(e.target.files)}
          />
          <span className="inline-flex h-9 items-center rounded-lg border border-pf-border px-3 text-[13px] font-medium text-pf-text hover:bg-pf-surface">
            {busy ? "Enviando…" : "Adicionar arquivos"}
          </span>
        </label>
      </div>

      <div className="mt-4">
        <DataTable
          head={["Arquivo", "Tipo", "Tamanho", ""]}
          empty={(assets.data ?? []).length === 0}
        >
          {(assets.data ?? []).map((a) => (
            <tr key={a.id} className="hover:bg-pf-surface">
              <Td className="font-medium">{a.filename}</Td>
              <Td>{fileKind(a.filename)}</Td>
              <Td>{formatBytes(a.size_bytes)}</Td>
              <Td>
                <Button variant="danger" size="sm" disabled={busy} onClick={() => remove(a)}>
                  Remover
                </Button>
              </Td>
            </tr>
          ))}
        </DataTable>
      </div>
    </Card>
  );
}
