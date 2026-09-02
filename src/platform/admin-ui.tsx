import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Tabela do admin: rolagem horizontal própria, cabeçalho grudado. */
export function DataTable({
  head,
  children,
  empty,
}: {
  head: ReactNode[];
  children: ReactNode;
  empty?: boolean;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-pf-border">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead>
          <tr className="border-b border-pf-border bg-pf-surface">
            {head.map((h, i) => (
              <th
                key={i}
                className="whitespace-nowrap px-4 py-2.5 text-[12px] font-medium uppercase tracking-wide text-pf-faint"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-pf-border">
          {empty ? (
            <tr>
              <td colSpan={head.length} className="px-4 py-10 text-center text-sm text-pf-muted">
                Nada por aqui ainda.
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
}

export function Td({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <td className={cn("px-4 py-3 align-top text-[13px] text-pf-text", className)}>{children}</td>
  );
}

export function StatCard({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-xl border border-pf-border px-5 py-4">
      <div className="text-[12px] uppercase tracking-wide text-pf-faint">{label}</div>
      <div className="mt-1.5 text-2xl font-semibold text-pf-text">{value}</div>
    </div>
  );
}

export function StatusSelect<T extends string>({
  value,
  options,
  onChange,
  disabled,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  disabled?: boolean;
}) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as T)}
      className="rounded-lg border border-pf-border bg-pf-bg px-2.5 py-1.5 text-[13px] text-pf-text disabled:opacity-50"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
