import { useState } from "react";
import { toast } from "sonner";

/**
 * Bloco escuro com o prompt do workshop e botão de copiar.
 *
 * O ponto do revamp é que o prompt sai do texto corrido e vira algo que a
 * pessoa leva para o ChatGPT em um clique — por isso ele é monoespaçado,
 * selecionável e preserva quebras de linha exatamente como no guia.
 */
export function PromptBlock({ label, prompt }: { label: string; prompt: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Sem permissão de área de transferência o texto continua selecionável.
      toast.error("Não deu para copiar. Selecione o texto e copie manualmente.");
    }
  }

  return (
    <div className="overflow-hidden rounded-xl bg-[#1C1B19]">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/45">
          {label}
        </span>
        <button
          onClick={copy}
          className="rounded-md border border-white/20 px-2.5 py-1 text-[12px] text-white/85 transition hover:bg-white/10"
        >
          {copied ? "Copiado" : "Copiar prompt"}
        </button>
      </div>
      <pre className="overflow-x-auto whitespace-pre-wrap break-words px-4 pb-4 font-mono text-[12.5px] leading-relaxed text-white/90">
        {prompt}
      </pre>
    </div>
  );
}
