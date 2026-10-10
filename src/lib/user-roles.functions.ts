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
    const { data, error } = await (context.supabase as any).rpc("admin_list_users");
    if (error) throw new Error(error.message);
    const users = ((data ?? []) as any[]).map((u) => ({
      id: u.id as string,
      full_name: (u.full_name as string | null) || null,
      email: (u.email as string) ?? "",
      login_methods: ((u.login_methods as string[] | null) ?? ["email"]).filter(Boolean),
      role: u.role as string,
      created_at: u.created_at as string,
      last_sign_in_at: (u.last_sign_in_at as string | null) ?? null,
      status: u.status as string,
    }));
    users.sort((a, b) => (rank[a.role] ?? 9) - (rank[b.role] ?? 9) || a.email.localeCompare(b.email));
    return { users };
  });

export const setUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ userId: z.string().uuid(), role: z.enum(ROLES) }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await (context.supabase as any).rpc("admin_set_user_role", { _user_id: data.userId, _role: data.role });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const setUserDisabled = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ userId: z.string().uuid(), disabled: z.boolean() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await (context.supabase as any).rpc("admin_set_user_disabled", { _user_id: data.userId, _disabled: data.disabled });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
