import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const nav = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data, error }) => {
      if (!active) return;
      if (error || !data.user) nav({ to: "/login", replace: true });
      else setReady(true);
    });
    return () => { active = false; };
  }, [nav]);

  if (!ready) {
    return <main className="grid min-h-[60vh] place-items-center text-sm text-foreground/60">Loading…</main>;
  }
  return <Outlet />;
}
