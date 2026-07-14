import { type ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink font-sans">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export function Kicker({ children }: { children: ReactNode }) {
  return (
    <div className="text-xs uppercase tracking-[0.2em] text-accent font-mono mb-6">{children}</div>
  );
}

export function Rule() {
  return <hr className="border-0 border-t border-rule my-24" />;
}

export function Section({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`mx-auto max-w-6xl px-6 ${className}`}>
      {children}
    </section>
  );
}
