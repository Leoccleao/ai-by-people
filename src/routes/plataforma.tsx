import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PlatformAuthProvider } from "@/platform/auth";

export const Route = createFileRoute("/plataforma")({
  head: () => ({
    meta: [
      { title: "IA no Trabalho" },
      {
        name: "description",
        content:
          "Webinars gravados e material follow along por área: marketing, vendas, finanças, estratégia e operações, dados e jurídico.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PlatformLayout,
});

function PlatformLayout() {
  return (
    <PlatformAuthProvider>
      <Outlet />
    </PlatformAuthProvider>
  );
}
