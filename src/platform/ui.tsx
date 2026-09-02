import { type ReactNode, type ButtonHTMLAttributes } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------- botões */

const BTN_BASE =
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pf-text";

const BTN_VARIANT = {
  primary: "bg-pf-text text-white hover:bg-pf-text/85",
  secondary: "border border-pf-border bg-pf-bg text-pf-text hover:bg-pf-surface",
  ghost: "text-pf-muted hover:text-pf-text hover:bg-pf-surface",
  danger: "border border-pf-border text-[#B4432E] hover:bg-[#B4432E]/5",
} as const;

const BTN_SIZE = {
  sm: "h-8 px-3 text-[13px]",
  md: "h-10 px-4",
  lg: "h-11 px-5",
} as const;

type BtnProps = {
  variant?: keyof typeof BTN_VARIANT;
  size?: keyof typeof BTN_SIZE;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & BtnProps) {
  return (
    <button {...props} className={cn(BTN_BASE, BTN_VARIANT[variant], BTN_SIZE[size], className)} />
  );
}

export function buttonClass(
  variant: keyof typeof BTN_VARIANT = "primary",
  size: keyof typeof BTN_SIZE = "md",
) {
  return cn(BTN_BASE, BTN_VARIANT[variant], BTN_SIZE[size]);
}

/* ---------------------------------------------------------------- superfícies */

export function Card({
  className,
  children,
  as: As = "div",
}: {
  className?: string;
  children: ReactNode;
  as?: "div" | "article" | "section" | "li";
}) {
  return (
    <As className={cn("rounded-xl border border-pf-border bg-pf-bg", className)}>{children}</As>
  );
}

export function Tag({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "soon";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
        tone === "soon" ? "bg-pf-surface-2 text-pf-faint" : "bg-pf-surface text-pf-muted",
      )}
    >
      {children}
    </span>
  );
}

export function PageHeader({
  eyebrow,
  title,
  sub,
  actions,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-pf-border pb-6">
      <div className="min-w-0">
        {eyebrow && (
          <div className="text-[12px] font-medium uppercase tracking-wider text-pf-faint">
            {eyebrow}
          </div>
        )}
        <h1 className="mt-1 text-[clamp(1.5rem,3vw,2rem)] font-semibold text-pf-text">{title}</h1>
        {sub && <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-pf-muted">{sub}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-pf-border bg-pf-surface px-6 py-12 text-center">
      <p className="text-[15px] font-medium text-pf-text">{title}</p>
      {body && (
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-pf-muted">{body}</p>
      )}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}

export function Spinner({ label = "Carregando…" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 py-16 text-sm text-pf-muted">
      <span
        aria-hidden
        className="h-4 w-4 animate-spin rounded-full border-2 border-pf-border border-t-pf-text"
      />
      {label}
    </div>
  );
}

/* ---------------------------------------------------------------- formulário */

export const inputClass =
  "w-full rounded-lg border border-pf-border bg-pf-bg px-3 py-2 text-[15px] text-pf-text placeholder:text-pf-faint focus:border-pf-text focus:outline-none";

export function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[13px] font-medium text-pf-text">
        {label}
        {required && <span className="text-pf-faint"> *</span>}
      </span>
      <div className="mt-1.5">{children}</div>
      {hint && (
        <span className="mt-1.5 block text-[12px] leading-relaxed text-pf-faint">{hint}</span>
      )}
    </label>
  );
}

export function Checkbox({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-[color:var(--pf-text)]"
      />
      <span className="text-[13px] leading-relaxed text-pf-muted">{children}</span>
    </label>
  );
}

/* ---------------------------------------------------------------- navegação */

export function Tabs({
  items,
}: {
  items: { to: string; label: string; params?: Record<string, string>; exact?: boolean }[];
}) {
  return (
    <div className="-mb-px flex gap-6 overflow-x-auto border-b border-pf-border">
      {items.map((it) => (
        <Link
          key={it.to + JSON.stringify(it.params ?? {})}
          to={it.to}
          params={it.params}
          activeOptions={{ exact: it.exact ?? false }}
          className="whitespace-nowrap border-b-2 border-transparent py-3 text-sm text-pf-muted transition hover:text-pf-text"
          activeProps={{ className: "border-pf-text text-pf-text font-medium" }}
        >
          {it.label}
        </Link>
      ))}
    </div>
  );
}
