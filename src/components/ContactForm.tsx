import { useState, type FormEvent } from "react";
import { useI18n } from "@/i18n/I18nProvider";

export function ContactForm({ subject }: { subject?: string }) {
  const { t } = useI18n();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", org: "", message: "" });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    // Front-end only — could integrate with a real endpoint later.
    setSent(true);
    console.log("[contact]", { subject, ...form });
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
      <label className="block">
        <span className="text-xs uppercase tracking-widest text-ink/50">{t.common.name}</span>
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="mt-1 w-full border-0 border-b border-rule bg-transparent py-2 focus:border-ink focus:outline-none"
        />
      </label>
      <label className="block">
        <span className="text-xs uppercase tracking-widest text-ink/50">{t.common.email}</span>
        <input
          required
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="mt-1 w-full border-0 border-b border-rule bg-transparent py-2 focus:border-ink focus:outline-none"
        />
      </label>
      <label className="block md:col-span-2">
        <span className="text-xs uppercase tracking-widest text-ink/50">{t.common.organization}</span>
        <input
          value={form.org}
          onChange={(e) => setForm({ ...form, org: e.target.value })}
          className="mt-1 w-full border-0 border-b border-rule bg-transparent py-2 focus:border-ink focus:outline-none"
        />
      </label>
      <label className="block md:col-span-2">
        <span className="text-xs uppercase tracking-widest text-ink/50">{t.common.message}</span>
        <textarea
          required
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="mt-1 w-full border-0 border-b border-rule bg-transparent py-2 focus:border-ink focus:outline-none resize-none"
        />
      </label>
      <div className="md:col-span-2 flex items-center gap-4">
        <button
          type="submit"
          className="border border-ink px-6 py-3 text-sm uppercase tracking-widest hover:bg-ink hover:text-paper transition"
        >
          {t.common.send}
        </button>
        {sent && <span className="text-sm text-accent">{t.common.sent}</span>}
      </div>
    </form>
  );
}

export function ContactSection() {
  const { t } = useI18n();
  return (
    <section id="contato" className="mx-auto max-w-6xl px-6 py-24 border-t border-rule">
      <div className="grid md:grid-cols-12 gap-12">
        <div className="md:col-span-5">
          <div className="text-xs uppercase tracking-[0.2em] text-accent font-mono mb-6">{t.contact.kicker}</div>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight text-ink">{t.contact.title}</h2>
          <p className="text-ink/70 mt-4 max-w-md">{t.contact.sub}</p>
          <p className="text-ink/60 mt-6 text-sm">
            contato@aibypeople.org
          </p>
        </div>
        <div className="md:col-span-7">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
