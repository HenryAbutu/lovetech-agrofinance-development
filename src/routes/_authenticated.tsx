import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    // Prefer getUser() — it revalidates with the auth server and avoids
    // race conditions where getSession() returns null immediately after
    // signInWithPassword resolves on some browsers/hosts.
    const { data: userData } = await supabase.auth.getUser();
    if (userData.user) return { user: userData.user };
    // Fallback: check the persisted session (covers offline/reload cases).
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData.session?.user) return { user: sessionData.session.user };
    throw redirect({ to: "/login", search: { redirect: location.href } });
  },
  component: () => <Outlet />,
});
