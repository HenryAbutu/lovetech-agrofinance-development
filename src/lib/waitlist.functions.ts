import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

// Public: the DB function only claims a fresh (<15 min) row that hasn't been emailed yet,
// so this can't be abused to spam.
export const sendWaitlistConfirmation = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const url = process.env["SUPABASE_URL"]!;
    const key = (process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["SUPABASE_ANON_KEY"])!;
    const sb = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });
    const { data: rows, error } = await sb.rpc("claim_waitlist_for_email", { _id: data.id });
    if (error) {
      console.error("[waitlist] claim failed", error.message);
      return { ok: false };
    }
    const w = rows?.[0];
    if (!w) return { ok: false };
    const { sendWaitlistEmails } = await import("@/lib/emails.server");
    const r = await sendWaitlistEmails(w as any);
    return { ok: r.learner };
  });
