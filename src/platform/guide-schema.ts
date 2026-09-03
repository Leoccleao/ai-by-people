/**
 * Guia estruturado de um workshop (`lobs.guide`, jsonb).
 *
 * O markdown (`lobs.body_md`) continua sendo a fonte original e o fallback de
 * exibição. Este formato existe porque o revamp trata as partes do guia como
 * objetos — prompt que se copia, etapa que se marca, arquivo que se baixa —
 * e não como texto corrido.
 */

/** Onde o prompt é usado. Muda o rótulo e a cor da etiqueta na etapa. */
export type StepKind = "chat" | "work";

export type GuideStep = {
  /** Estável: é a chave gravada em `lob_progress.steps_done`. */
  id: string;
  title: string;
  kind: StepKind;
  description?: string;
  /** Rótulo do bloco escuro, ex.: "PERGUNTA NO CHAT", "VERSÃO CURTA". */
  promptLabel: string;
  prompt: string;
  /** Nome do arquivo do follow along que a etapa usa, quando houver. */
  file?: string;
  /** O que sai da etapa, mostrado abaixo do prompt. */
  result?: string;
  /** "Versão completa: …" — variação longa que não cabe no bloco principal. */
  note?: string;
};

export type GuideDemo = {
  id: string;
  /** "DEMO 1" — vai no rótulo mono à esquerda do título. */
  label: string;
  title: string;
  prerequisites: string[];
  steps: GuideStep[];
};

export type GuideConcept = {
  /** Rótulo mono do card, ex.: "CHAT VS. WORK". */
  label: string;
  /** Parágrafos com **negrito** simples — ver `renderInline` em concept-text.ts. */
  paragraphs: string[];
};

export type GuideResource = {
  title: string;
  url: string;
};

export type GuideChecklistItem = {
  /** Estável: é a chave gravada em `lob_progress.checklist_done`. */
  id: string;
  text: string;
};

export type LobGuide = {
  /** Parágrafo de abertura, abaixo do título do workshop. */
  lead?: string;
  concepts: GuideConcept[];
  demos: GuideDemo[];
  checklist: GuideChecklistItem[];
  resources: GuideResource[];
  howToStart?: string;
};

/** Quantas etapas o guia tem no total — usado no progresso e nos metadados. */
export function countSteps(guide: LobGuide | null | undefined): number {
  return (guide?.demos ?? []).reduce((n, d) => n + d.steps.length, 0);
}

/** Todos os ids de etapa, na ordem em que aparecem. */
export function allStepIds(guide: LobGuide | null | undefined): string[] {
  return (guide?.demos ?? []).flatMap((d) => d.steps.map((s) => s.id));
}
