import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { PlatformDatabase } from "@/integrations/supabase/platform-schema";

/**
 * Mesmo cliente do site, reapontado para o schema da plataforma.
 * O cast existe porque `types.ts` é gerado pelo Lovable e ainda não conhece
 * estas tabelas — ver `platform-schema.ts`.
 */
export const db = supabase as unknown as SupabaseClient<PlatformDatabase>;

/** Cliente de auth (compartilhado com o resto do app). */
export const auth = supabase.auth;
