import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getCourseLeaderboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ slug: z.string().min(1).max(120), limit: z.number().int().min(1).max(100).default(25) }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: course } = await supabase
      .from("academy_courses")
      .select("id, title, slug")
      .eq("slug", data.slug)
      .maybeSingle();
    if (!course) throw new Error("Course not found");

    // Use admin client so we can join opted-in learner display names without exposing PII broadly
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows } = await supabaseAdmin
      .from("academy_learner_points")
      .select("user_id, total_points, quiz_points, assign_points, badge_count")
      .eq("course_id", course.id)
      .order("total_points", { ascending: false })
      .limit(data.limit);

    const ids = (rows ?? []).map((r) => r.user_id).filter((v): v is string => !!v);
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("id, display_name, full_name, leaderboard_opt_in")
      .in("id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);
    const profMap = new Map((profiles ?? []).map((p) => [p.id, p]));

    const entries = (rows ?? []).map((r, idx) => {
      const p = r.user_id ? profMap.get(r.user_id) : undefined;
      const isMe = r.user_id === userId;
      const optIn = p?.leaderboard_opt_in !== false;
      const label = isMe ? "You" : optIn ? (p?.display_name || p?.full_name || "Learner") : "Anonymous learner";
      return {
        rank: idx + 1,
        is_me: isMe,
        display_name: label,
        total_points: Number(r.total_points ?? 0),
        quiz_points: Number(r.quiz_points ?? 0),
        assign_points: Number(r.assign_points ?? 0),
        badge_count: Number(r.badge_count ?? 0),
      };
    });

    return { course, entries };
  });

export const updateLeaderboardPrefs = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({
    leaderboard_opt_in: z.boolean().optional(),
    display_name: z.string().trim().min(1).max(60).optional(),
  }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const patch: { leaderboard_opt_in?: boolean; display_name?: string } = {};
    if (typeof data.leaderboard_opt_in === "boolean") patch.leaderboard_opt_in = data.leaderboard_opt_in;
    if (data.display_name) patch.display_name = data.display_name;
    const { error } = await supabase.from("profiles").update(patch).eq("id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getMyBadgesAndPrefs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const [{ data: badges }, { data: myAwards }, { data: profile }] = await Promise.all([
      supabase.from("academy_badges").select("id, code, name, description, icon, color, sort_order").order("sort_order"),
      supabase.from("academy_learner_badges").select("badge_id, course_id, awarded_at").eq("user_id", userId),
      supabase.from("profiles").select("display_name, leaderboard_opt_in, full_name").eq("id", userId).maybeSingle(),
    ]);
    return { badges: badges ?? [], awards: myAwards ?? [], profile: profile ?? null };
  });
