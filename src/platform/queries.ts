import { useQuery } from "@tanstack/react-query";
import { db } from "./db";
import type { Asset, Lob, LobProgress, OfficeHour } from "@/integrations/supabase/platform-schema";

export function useLobs(enabled = true) {
  return useQuery({
    queryKey: ["pf", "lobs"],
    enabled,
    queryFn: async (): Promise<Lob[]> => {
      const { data, error } = await db.from("lobs").select("*").order("sort_order");
      if (error) throw error;
      return (data ?? []) as Lob[];
    },
  });
}

export function useLob(slug: string) {
  return useQuery({
    queryKey: ["pf", "lob", slug],
    queryFn: async (): Promise<{ lob: Lob | null; assets: Asset[] }> => {
      const { data: lob, error } = await db.from("lobs").select("*").eq("slug", slug).maybeSingle();
      if (error) throw error;
      if (!lob) return { lob: null, assets: [] };
      const { data: assets, error: aErr } = await db
        .from("assets")
        .select("*")
        .eq("lob_id", (lob as Lob).id)
        .order("sort_order");
      if (aErr) throw aErr;
      return { lob: lob as Lob, assets: (assets ?? []) as Asset[] };
    },
  });
}

export function useOfficeHours() {
  return useQuery({
    queryKey: ["pf", "office-hours"],
    queryFn: async (): Promise<{ sessions: OfficeHour[]; signedUp: string[] }> => {
      const [{ data: sessions, error }, { data: signups }] = await Promise.all([
        db.from("office_hours").select("*").order("starts_at"),
        db.from("office_hours_signups").select("office_hour_id"),
      ]);
      if (error) throw error;
      return {
        sessions: (sessions ?? []) as OfficeHour[],
        signedUp: (signups ?? []).map((s) => s.office_hour_id),
      };
    },
  });
}

/** Progresso do usuário por área, indexado por lob_id. */
export function useMyProgress() {
  return useQuery({
    queryKey: ["pf", "progress"],
    queryFn: async (): Promise<Record<string, LobProgress>> => {
      const { data, error } = await db.from("lob_progress").select("*");
      if (error) throw error;
      const out: Record<string, LobProgress> = {};
      for (const row of (data ?? []) as LobProgress[]) out[row.lob_id] = row;
      return out;
    },
  });
}
