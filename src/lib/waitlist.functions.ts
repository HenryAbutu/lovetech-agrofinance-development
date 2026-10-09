import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Public: only sends for a fresh row that hasn't been emailed yet, so it can't be abused to spam.
export const sendWaitlistConfirmation = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: w } = await supabaseAdmin
      .from("academy_waitlist")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (!w || w.emails_sent_at) return { ok: false };
    if (Date.now() - new Date(w.created_at).getTime() > 15 * 60 * 1000) return { ok: false };
    const { data: claimed } = await supabaseAdmin
      .from("academy_waitlist")
      .update({ emails_sent_at: new Date().toISOString() })
      .eq("id", data.id)
      .is("emails_sent_at", null)
      .select("id");
    if (!claimed?.length) return { ok: false };
    const { sendWaitlistEmails } = await import("@/lib/emails.server");
    const r = await sendWaitlistEmails(w as any);
    return { ok: r.learner };
  });
