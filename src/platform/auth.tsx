import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { db, auth } from "./db";
import type { Profile } from "@/integrations/supabase/platform-schema";

type PlatformAuth = {
  loading: boolean;
  session: Session | null;
  profile: Profile | null;
  isAdmin: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<PlatformAuth | null>(null);

export function PlatformAuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const load = useCallback(async (s: Session | null) => {
    if (!s?.user) {
      setProfile(null);
      setIsAdmin(false);
      return;
    }
    const [{ data: prof }, { data: roles }] = await Promise.all([
      db.from("profiles").select("*").eq("id", s.user.id).maybeSingle(),
      db.from("user_roles").select("role").eq("user_id", s.user.id),
    ]);
    setProfile((prof as Profile | null) ?? null);
    setIsAdmin((roles ?? []).some((r) => r.role === "admin"));
  }, []);

  useEffect(() => {
    let alive = true;

    // O listener precisa existir antes do getSession para não perder o
    // SIGNED_IN que o magic link dispara ao trocar o code por sessão.
    const { data: sub } = auth.onAuthStateChange((_event, s) => {
      if (!alive) return;
      setSession(s);
      // Chamadas ao Supabase dentro do callback podem travar; sai da pilha antes.
      setTimeout(() => {
        if (alive) void load(s);
      }, 0);
    });

    void auth.getSession().then(async ({ data }) => {
      if (!alive) return;
      setSession(data.session);
      await load(data.session);
      if (alive) setLoading(false);
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, [load]);

  const value = useMemo<PlatformAuth>(
    () => ({
      loading,
      session,
      profile,
      isAdmin,
      refresh: () => load(session),
      signOut: async () => {
        await auth.signOut();
        setProfile(null);
        setIsAdmin(false);
      },
    }),
    [loading, session, profile, isAdmin, load],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePlatformAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePlatformAuth precisa estar dentro de PlatformAuthProvider");
  return ctx;
}
