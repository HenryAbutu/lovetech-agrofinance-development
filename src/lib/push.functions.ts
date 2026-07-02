import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const subSchema = z.object({
  endpoint: z.string().url().max(2000),
  p256dh: z.string().min(1).max(500),
  auth: z.string().min(1).max(500),
  user_agent: z.string().max(500).optional(),
});

export const savePushSubscription = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => subSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("push_subscriptions").upsert(
      {
        user_id: userId,
        endpoint: data.endpoint,
        p256dh: data.p256dh,
        auth: data.auth,
        user_agent: data.user_agent ?? null,
        last_used_at: new Date().toISOString(),
      },
      { onConflict: "endpoint" },
    );
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const removePushSubscription = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ endpoint: z.string().url() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("push_subscriptions")
      .delete()
      .eq("endpoint", data.endpoint)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listMyPushSubscriptions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("push_subscriptions")
      .select("id, endpoint, user_agent, created_at")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

// Admin: broadcast a push notification to enrolled learners of a course (or all).
export const adminSendPush = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      title: z.string().min(1).max(120),
      body: z.string().min(1).max(300),
      url: z.string().min(1).max(500).optional(),
      course_id: z.string().uuid().optional(),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { sendWebPush } = await import("@/lib/web-push.server");

    let targetUserIds: string[] | null = null;
    if (data.course_id) {
      const { data: enrols } = await supabaseAdmin
        .from("academy_enrolments")
        .select("user_id")
        .eq("course_id", data.course_id)
        .eq("access_status", "active");
      targetUserIds = Array.from(new Set((enrols ?? []).map((e) => e.user_id).filter(Boolean) as string[]));
      if (targetUserIds.length === 0) return { sent: 0, failed: 0 };
    }

    let subsQuery = supabaseAdmin.from("push_subscriptions").select("id, endpoint, p256dh, auth, user_id");
    if (targetUserIds) subsQuery = subsQuery.in("user_id", targetUserIds);
    const { data: subs, error } = await subsQuery;
    if (error) throw new Error(error.message);
    if (!subs?.length) return { sent: 0, failed: 0 };

    const payload = JSON.stringify({ title: data.title, body: data.body, url: data.url ?? "/academy/dashboard" });
    let sent = 0, failed = 0;
    const stale: string[] = [];
    for (const s of subs) {
      try {
        await sendWebPush({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload);
        sent++;
      } catch (e: unknown) {
        failed++;
        const err = e as { statusCode?: number };
        if (err.statusCode === 404 || err.statusCode === 410) stale.push(s.endpoint);
      }
    }
    if (stale.length) {
      await supabaseAdmin.from("push_subscriptions").delete().in("endpoint", stale);
    }
    return { sent, failed };
  });
