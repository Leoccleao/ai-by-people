import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Primitivas introduzidas pelo revamp. Ficam separadas de `ui.tsx` porque
 * pertencem à nova linguagem visual — rótulo mono, capa em gradiente por área,
 * bloco de prompt copiável — enquanto `ui.tsx` segue com botões, campos e
 * tabelas que as duas telas compartilham.
 */

/* ---------------------------------------------------------------- rótulos */

/** Rótulo mono em caixa alta. O marcador tipográfico do revamp. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("pf-eyebrow", className)}>{children}</div>;
}

/** Cabeçalho de seção: título à esquerda, nota discreta à direita. */
export function SectionHead({
  title,
  meta,
  action,
}: {
  title: string;
  meta?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-3">
      <h2 className="text-[19px] font-semibold tracking-[-0.02em] text-pf-text">{title}</h2>
      {action ?? (meta ? <span className="text-[12.5px] text-pf-faint">{meta}</span> : null)}
    </div>
  );
}

/** Pílula de status/etiqueta. `tone` escolhe o peso visual. */
export function Chip({
  children,
  tone = "default",
  className,
}: {
  children: ReactNode;
  tone?: "default" | "outline" | "accent" | "muted";
  className?: string;
}) {
  const tones = {
    default: "bg-pf-surface text-pf-muted",
    outline: "border border-pf-border text-pf-muted",
    accent: "bg-[#EDE9FB] text-[#5B4BC4]",
    muted: "bg-pf-surface-2 text-pf-fainter",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[12px] leading-none",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ---------------------------------------------------------------- área */

/** As duas cores da área viram o gradiente da capa. */
export function areaGradient(accent?: string | null, accent2?: string | null) {
  const a = accent || "#7C6BD0";
  const b = accent2 || a;
  return `linear-gradient(135deg, ${a} 0%, ${b} 100%)`;
}

/** Ponto colorido que identifica a área na navegação. */
export function AreaDot({ color, className }: { color?: string | null; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("inline-block h-2 w-2 shrink-0 rounded-full", className)}
      style={{ background: color || "#A8A49C" }}
    />
  );
}

/* ---------------------------------------------------------------- progresso */

export function ProgressBar({ done, total }: { done: number; total: number }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div
      className="h-1.5 w-full overflow-hidden rounded-full bg-pf-surface-2"
      role="progressbar"
      aria-valuenow={done}
      aria-valuemin={0}
      aria-valuemax={total}
    >
      <div
        className="h-full rounded-full bg-[#2C6BE8] transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/* ---------------------------------------------------------------- arquivos */

const KIND_TONE: Record<string, string> = {
  DOCX: "bg-[#E3EDFB] text-[#2C5AA8]",
  PDF: "bg-[#FBE3E3] text-[#A83C3C]",
  XLSX: "bg-[#E1F3E6] text-[#2A7346]",
  CSV: "bg-[#E1F3E6] text-[#2A7346]",
  PPTX: "bg-[#FBEAE0] text-[#A85C2C]",
  PNG: "bg-[#EFE8FB] text-[#5B4BC4]",
  SVG: "bg-[#EFE8FB] text-[#5B4BC4]",
};

/** Selo quadrado com a extensão do arquivo, colorido por tipo. */
export function FileBadge({ kind, className }: { kind: string; className?: string }) {
  return (
    <span
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-mono text-[9.5px] font-medium",
        KIND_TONE[kind] ?? "bg-pf-surface-2 text-pf-muted",
        className,
      )}
    >
      {kind}
    </span>
  );
}

/* ---------------------------------------------------------------- caixas */

/** Caixa clara com rótulo mono — usada em pré-requisitos e "como começar". */
export function LabeledBox({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-pf-border bg-pf-surface p-5", className)}>
      <Eyebrow>{label}</Eyebrow>
      <div className="mt-3">{children}</div>
    </div>
  );
}
