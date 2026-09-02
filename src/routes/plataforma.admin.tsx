import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Protected } from "@/platform/guard";
import { PageHeader, Tabs } from "@/platform/ui";

export const Route = createFileRoute("/plataforma/admin")({
  component: AdminLayout,
});

const TABS = [
  { to: "/plataforma/admin", label: "Engajamento", exact: true },
  { to: "/plataforma/admin/usuarios", label: "Usuários" },
  { to: "/plataforma/admin/conteudo", label: "Conteúdo" },
  { to: "/plataforma/admin/office-hours", label: "Office Hours" },
  { to: "/plataforma/admin/solicitacoes", label: "Solicitações" },
  { to: "/plataforma/admin/historias", label: "Histórias" },
];

function AdminLayout() {
  return (
    <Protected admin wide>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Administração"
          title="Roadshow IA"
          sub="Convidados, conteúdo, sessões e o engajamento agregado por empresa."
        />
        <Tabs items={TABS} />
        <div className="pt-2">
          <Outlet />
        </div>
      </div>
    </Protected>
  );
}
