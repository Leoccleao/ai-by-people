import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { I18nProvider } from "../i18n/I18nProvider";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-7xl text-ink">404</h1>
        <h2 className="mt-4 font-serif text-2xl text-ink">Página não encontrada</h2>
        <p className="mt-3 text-sm text-ink-muted">
          A página que você procura não existe ou foi movida.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-block border border-ink px-6 py-3 text-sm uppercase tracking-widest hover:bg-ink hover:text-paper transition"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-2xl text-ink">Esta página não carregou</h1>
        <p className="mt-3 text-sm text-ink-muted">Algo saiu do trilho. Tente recarregar ou volte ao início.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="border border-ink px-6 py-3 text-sm uppercase tracking-widest hover:bg-ink hover:text-paper transition"
          >
            Tentar de novo
          </button>
          <a href="/" className="border border-rule px-6 py-3 text-sm uppercase tracking-widest hover:border-ink transition">
            Início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "AI by People — IA feita por pessoas" },
      {
        name: "description",
        content:
          "Organização sem fins lucrativos que desenvolve pessoas num mundo em que a IA está redesenhando o trabalho e a educação. Não com conteúdo — com trabalho real.",
      },
      { name: "author", content: "AI by People" },
      { property: "og:site_name", content: "AI by People" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "AI by People — IA feita por pessoas" },
      {
        property: "og:description",
        content: "Formamos pessoas capazes de construir com IA — não de apenas assistir.",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <Outlet />
        <Toaster position="bottom-center" toastOptions={{ style: { fontFamily: "Inter, sans-serif" } }} />
      </I18nProvider>
    </QueryClientProvider>
  );
}
