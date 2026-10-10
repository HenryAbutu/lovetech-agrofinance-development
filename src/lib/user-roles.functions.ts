import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const ROLES = ["learner", "facilitator", "admin", "super_admin"] as const;
export type AppRole = (typeof ROLES)[number];

async function assertSuperAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "super_admin" });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: super admin only");
}

/** The signed-in user's email and effective role. */
export const getMyAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("get_my_role");
    if (error) throw new Error(error.message);
    const raw = String(data ?? "learner");
    const role: AppRole = raw === "instructor" ? "facilitator" : (ROLES as readonly string[]).includes(raw) ? (raw as AppRole) : "learner";
    return { email: String(context.claims.email ?? ""), role };
  });

const rank: Record<string, number> = { super_admin: 1, admin: 2, facilitator: 3, instructor: 3, learner: 4 };

export const listUsersAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertSuperAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [{ data: authData, error: authErr }, { data: roles }, { data: profiles }] = await Promise.all([
      supabaseAdmin.auth.admin.listUsers({ perPage: 1000 }),
      supabaseAdmin.from("user_roles").select("user_id, role"),
      supabaseAdmin.from("profiles").select("id, full_name, email"),
    ]);
    if (authErr) throw new Error(authErr.message);
    const roleOf = new Map<string, string>();
    for (const r of roles ?? []) {
      const cur = roleOf.get(r.user_id);
      if (!cur || (rank[r.role] ?? 9) < (rank[cur] ?? 9)) roleOf.set(r.user_id, r.role);
    }
    const profileOf = new Map((profiles ?? []).map((p) => [p.id, p]));
    const users = (authData?.users ?? []).map((u) => {
      const p = profileOf.get(u.id);
      const meta = (u.user_metadata ?? {}) as Record<string, unknown>;
      const banned = !!u.banned_until && new Date(u.banned_until).getTime() > Date.now();
      const r = roleOf.get(u.id) ?? "learner";
      return {
        id: u.id,
        full_name: p?.full_name || String(meta.full_name ?? meta.name ?? "") || null,
        email: u.email ?? p?.email ?? "",
        login_methods: ((u.app_metadata?.providers as string[] | undefined) ?? [u.app_metadata?.provider ?? "email"]).filter(Boolean),
        role: r === "instructor" ? "facilitator" : r,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at ?? null,
        status: banned ? "disabled" : u.email_confirmed_at ? "active" : "unconfirmed",
      };
    });
    users.sort((a, b) => (rank[a.role] ?? 9) - (rank[b.role] ?? 9) || a.email.localeCompare(b.email));
    return { users };
  });

export const setUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ userId: z.string().uuid(), role: z.enum(ROLES) }).parse(d))
  .handler(async ({ data, context }) => {
    await assertSuperAdmin(context.supabase, context.userId);
    if (data.userId === context.userId) throw new Error("You can't change your own role.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error: delErr } = await supabaseAdmin.from("user_roles").delete().eq("user_id", data.userId);
    if (delErr) throw new Error(delErr.message);
    const { error } = await supabaseAdmin.from("user_roles").insert({ user_id: data.userId, role: data.role });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const setUserDisabled = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ userId: z.string().uuid(), disabled: z.boolean() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertSuperAdmin(context.supabase, context.userId);
    if (data.userId === context.userId) throw new Error("You can't disable your own account.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.updateUserById(data.userId, {
      ban_duration: data.disabled ? "876000h" : "none",
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
