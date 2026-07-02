import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listLessonDiscussions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ lesson_id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: posts, error } = await supabase
      .from("academy_lesson_discussions")
      .select("id, lesson_id, course_id, user_id, parent_id, body, is_pinned, is_deleted, created_at, updated_at")
      .eq("lesson_id", data.lesson_id)
      .eq("is_deleted", false)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: true })
      .limit(500);
    if (error) throw new Error(error.message);

    const userIds = Array.from(new Set((posts ?? []).map((p) => p.user_id)));
    let authors: Record<string, { full_name: string | null; avatar_url: string | null; public_slug: string | null; is_public: boolean }> = {};
    if (userIds.length) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, public_slug, is_public")
        .in("id", userIds);
      for (const p of profs ?? []) {
        authors[p.id] = {
          full_name: p.full_name,
          avatar_url: p.avatar_url,
          public_slug: p.public_slug,
          is_public: p.is_public,
        };
      }
    }
    return { posts: posts ?? [], authors };
  });

export const postLessonDiscussion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      lesson_id: z.string().uuid(),
      course_id: z.string().uuid(),
      parent_id: z.string().uuid().nullable().optional(),
      body: z.string().trim().min(1).max(4000),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("academy_lesson_discussions")
      .insert({
        lesson_id: data.lesson_id,
        course_id: data.course_id,
        user_id: userId,
        parent_id: data.parent_id ?? null,
        body: data.body,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const deleteLessonDiscussion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("academy_lesson_discussions")
      .update({ is_deleted: true, body: "[deleted]" })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
