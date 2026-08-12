import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { BlogPost } from "@/lib/blog.types";

export const listPublishedPosts = createServerFn({ method: "GET" }).handler(async () => {
  const { publicClient, POST_LIST_COLS } = await import("@/lib/blog.server");
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(POST_LIST_COLS)
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(60);
  if (error) return { posts: [] as BlogPost[], error: error.message };
  return { posts: (data ?? []) as unknown as BlogPost[], error: null as string | null };
});

export const getPublishedPost = createServerFn({ method: "GET" })
  .inputValidator(async (input: unknown) => (await import("@/lib/blog.server")).SlugSchema.parse(input))
  .handler(async ({ data }) => {
    const { publicClient, POST_FULL_COLS } = await import("@/lib/blog.server");
    const supabase = publicClient();
    const { data: row } = await supabase
      .from("blog_posts")
      .select(POST_FULL_COLS)
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    return { post: (row ?? null) as unknown as BlogPost | null };
  });

export const listAllPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { assertAdmin, POST_FULL_COLS } = await import("@/lib/blog.server");
    await assertAdmin(context.supabase as never, context.userId);
    const { data, error } = await context.supabase
      .from("blog_posts")
      .select(POST_FULL_COLS)
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return { posts: (data ?? []) as unknown as BlogPost[] };
  });

export const savePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(async (input: unknown) => (await import("@/lib/blog.server")).PostSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { assertAdmin } = await import("@/lib/blog.server");
    await assertAdmin(context.supabase as never, context.userId);
    const payload: Record<string, unknown> = {
      title: data.title,
      slug: data.slug,
      category: data.category || null,
      excerpt: data.excerpt || null,
      body: data.body || null,
      featured_image: data.featured_image || null,
      status: data.status,
      published_at: data.status === "published" ? new Date().toISOString() : null,
    };

    if (data.id) {
      const existing = await context.supabase.from("blog_posts").select("published_at").eq("id", data.id).maybeSingle();
      if (data.status === "published" && existing.data?.published_at) payload.published_at = existing.data.published_at;
      const { error } = await context.supabase.from("blog_posts").update(payload as never).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { ok: true, id: data.id };
    }

    const { data: inserted, error } = await context.supabase.from("blog_posts").insert(payload as never).select("id").single();
    if (error) throw new Error(error.message);
    return { ok: true, id: (inserted as { id: string }).id };
  });

export const deletePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(async (input: unknown) => (await import("@/lib/blog.server")).IdSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { assertAdmin } = await import("@/lib/blog.server");
    await assertAdmin(context.supabase as never, context.userId);
    const { error } = await context.supabase.from("blog_posts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
