import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { useI18n } from "@/i18n/I18nProvider";
import { PROGRAM_ROUTES } from "@/i18n/translations";

const EMPTY = { name: "", email: "", org: "", program: "", message: "" };

export function ContactSection() {
  const { t } = useI18n();
  const [form, setForm] = useState(EMPTY);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    console.log("[contact]", form);
    toast.success(t.common.toastSent);
    setForm(EMPTY);
  }

  const inputCls =
    "mt-1 w-full border-0 border-b border-rule bg-transparent py-2 text-ink placeholder:text-ink-muted/60 focus:border-ink focus:outline-none";
  const labelCls = "text-[11px] uppercase tracking-[0.2em] text-ink-muted";

  return (
    <section id="contato" className="border-t border-rule">
      <div className="mx-auto max-w-6xl px-6 py-14 grid md:grid-cols-12 gap-12">
        <div className="md:col-span-5">
          <div className="text-[11px] uppercase tracking-[0.3em] text-accent font-mono mb-6">
            {t.contact.kicker}
          </div>
          <h2 className="font-serif text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05] tracking-tight text-ink">
            {t.contact.title}
          </h2>
          <p className="text-ink-muted mt-6 max-w-md leading-relaxed">{t.contact.sub}</p>
          <a
            href="mailto:contato@aibypeople.org"
            className="mt-8 inline-block text-sm text-ink hover:text-accent border-b border-rule hover:border-accent pb-0.5"
          >
            contato@aibypeople.org
          </a>
        </div>

        <form onSubmit={onSubmit} className="md:col-span-7 grid gap-6 md:grid-cols-2">
          <label className="block">
            <span className={labelCls}>{t.common.name}</span>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputCls}
            />
          </label>
          <label className="block">
            <span className={labelCls}>{t.common.email}</span>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputCls}
            />
          </label>
          <label className="block">
            <span className={labelCls}>{t.common.organization}</span>
            <input
              value={form.org}
              onChange={(e) => setForm({ ...form, org: e.target.value })}
              className={inputCls}
            />
          </label>
          <label className="block">
            <span className={labelCls}>{t.common.programOfInterest}</span>
            <select
              value={form.program}
              onChange={(e) => setForm({ ...form, program: e.target.value })}
              className={`${inputCls} appearance-none pr-8`}
            >
              <option value="">{t.common.selectPlaceholder}</option>
              {PROGRAM_ROUTES.map((p) => (
                <option key={p.key} value={p.key}>
                  {t.nav[p.key]}
                </option>
              ))}
            </select>
          </label>
          <label className="block md:col-span-2">
            <span className={labelCls}>{t.common.message}</span>
            <textarea
              required
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className={`${inputCls} resize-none`}
            />
          </label>
          <div className="md:col-span-2 pt-2">
            <button
              type="submit"
              className="border border-ink px-8 py-3 text-sm uppercase tracking-[0.2em] hover:bg-ink hover:text-paper transition"
            >
              {t.common.send}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
