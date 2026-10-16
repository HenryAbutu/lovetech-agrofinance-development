import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { EnrolSchema } from "@/lib/enrolment.functions";

// Payments host endpoint: same checks as the in-app enrolment, for hosts without the privileged key.
export const Route = createFileRoute("/api/public/enrol")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const fail = (error: string, status: number) => Response.json({ error }, { status });
        const token = (request.headers.get("authorization") ?? "").replace(/^Bearer /, "");
        if (!token) return fail("Please sign in again.", 401);
        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return fail("Payments are unavailable here.", 503);
        const supabase = createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
          global: { headers: { Authorization: `Bearer ${token}` } },
          auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
        });
        const { data: claims } = await supabase.auth.getClaims(token);
        const userId = claims?.claims?.sub;
        if (!userId) return fail("Please sign in again.", 401);
        const parsed = EnrolSchema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return fail("Please check the form and try again.", 400);
        const { runEnrolment, safeReturnOrigin } = await import("@/lib/enrolment.server");
        const origin = new URL(request.url).origin;
        try {
          return Response.json(await runEnrolment(parsed.data, userId, supabase, origin,
            safeReturnOrigin(request.headers.get("x-return-origin"), origin)));
        } catch (e) {
          return fail(e instanceof Error ? e.message : "We couldn't start your payment.", 400);
        }
      },
    },
  },
});
