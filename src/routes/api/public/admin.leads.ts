import { createFileRoute } from "@tanstack/react-router";

function unauthorized() {
  return new Response(JSON.stringify({ error: "unauthorized" }), {
    status: 401,
    headers: { "content-type": "application/json" },
  });
}

export const Route = createFileRoute("/api/public/admin/leads")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expected = process.env.ADMIN_LEADS_TOKEN;
        if (!expected) {
          return new Response(JSON.stringify({ error: "not_configured" }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }
        const auth = request.headers.get("authorization") ?? "";
        const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
        if (!token || token !== expected) return unauthorized();

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin
          .from("leads")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5000);
        if (error) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }
        return Response.json({ leads: data ?? [] });
      },
    },
  },
});
