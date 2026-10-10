import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { getActiveSupabaseSession, supabase } from "@/lib/supabase";

type OAuthResult = { data: any; error: { message: string } | null };
type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<OAuthResult>;
  approveAuthorization: (id: string) => Promise<OAuthResult>;
  denyAuthorization: (id: string) => Promise<OAuthResult>;
};
const oauth = () => (supabase.auth as unknown as { oauth: OAuthApi }).oauth;

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Approve connection — LoveTech" },
      { name: "description", content: "Approve or deny an app connecting to your LoveTech account." },
      { property: "og:title", content: "Approve connection — LoveTech" },
      { property: "og:description", content: "Approve or deny an app connecting to your LoveTech account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
    const session = await getActiveSupabaseSession();
    if (!session) throw redirect({ to: "/login", search: { redirect: location.pathname + location.searchStr } });
  },
  loader: async ({ location }) => {
    const id = new URLSearchParams(location.searchStr).get("authorization_id")!;
    const { data, error } = await oauth().getAuthorizationDetails(id);
    if (error) throw new Error(error.message);
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate });
    return data;
  },
  component: Consent,
  errorComponent: ({ error }) => (
    <main className="mx-auto max-w-md px-6 py-20 text-center">
      <h1 className="mb-2 text-2xl font-semibold text-foreground">This request can't be completed</h1>
      <p className="text-sm text-muted-foreground">{String((error as Error)?.message ?? error)}. Please start the connection again from your app.</p>
    </main>
  ),
});

function Consent() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const name = details?.client?.name ?? details?.client?.client_name ?? "An app";

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    try {
      const { data, error } = approve
        ? await oauth().approveAuthorization(authorization_id)
        : await oauth().denyAuthorization(authorization_id);
      if (error) throw new Error(error.message);
      const target = data?.redirect_url ?? data?.redirect_to;
      if (!target) throw new Error("No redirect was returned.");
      window.location.href = target;
    } catch (e) {
      setBusy(false);
      setError(e instanceof Error ? e.message : "Something went wrong.");
    }
  }

  return (
    <main className="px-6 py-20">
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8">
        <h1 className="mb-2 text-2xl font-semibold text-foreground">Connect {name} to your LoveTech account</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          {name} will be able to see academy courses, your enrolments and your waitlist entries, acting as you.
        </p>
        {error && <p role="alert" className="mb-4 text-sm text-destructive">{error}</p>}
        <div className="flex gap-3">
          <button disabled={busy} onClick={() => decide(true)} className="flex-1 rounded-sm bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">Approve</button>
          <button disabled={busy} onClick={() => decide(false)} className="flex-1 rounded-sm border border-border py-2.5 text-sm font-medium disabled:opacity-60">Deny</button>
        </div>
      </div>
    </main>
  );
}
