import { useEffect, useState } from "react";
import { getActiveSupabaseSession, supabase } from "@/lib/supabase";

export type SessionIdentity = { full_name: string; email: string } | null;

/** Signed-in user's name and email (profile first, then account details). */
export function useSessionIdentity() {
  const [identity, setIdentity] = useState<SessionIdentity>(null);
  useEffect(() => {
    let active = true;
    async function load() {
      const session = await getActiveSupabaseSession();
      const user = session?.user;
      if (!user) { if (active) setIdentity(null); return; }
      const { data } = await supabase.from("profiles").select("full_name, email").eq("id", user.id).maybeSingle();
      const email = data?.email || user.email || "";
      const meta = user.user_metadata ?? {};
      const full_name = data?.full_name || String(meta.full_name ?? meta.name ?? "") || email.split("@")[0];
      if (active) setIdentity({ full_name, email });
    }
    load();
    const { data: sub } = supabase.auth.onAuthStateChange(() => { load(); });
    return () => { active = false; sub.subscription.unsubscribe(); };
  }, []);
  return identity;
}
