import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  excerpt: string | null;
  body: string | null;
  featured_image: string | null;
  status: "draft" | "published" | "archived";
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export const POST_LIST_COLS = "id,title,slug,category,excerpt,featured_image,status,published_at,created_at,updated_at";
export const POST_FULL_COLS = "id,title,slug,category,excerpt,body,featured_image,status,published_at,created_at,updated_at";

export function publicClient() {
  return createClient(process.env["SUPABASE_URL"]!, process.env["SUPABASE_PUBLISHABLE_KEY"]!, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

export async function assertAdmin(
  supabase: { rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown }> },
  userId: string,
) {
  const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (data !== true) throw new Error("Admins only");
}

export const PostSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  title: z.string().min(3).max(300),
  slug: z.string().min(3).max(200).regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and dashes only"),
  category: z.string().max(120).optional().nullable(),
  excerpt: z.string().max(600).optional().nullable(),
  body: z.string().max(80000).optional().nullable(),
  featured_image: z.string().max(1000).optional().nullable(),
  status: z.enum(["draft", "published", "archived"]),
});

export const SlugSchema = z.object({ slug: z.string().min(1).max(200) });
export const IdSchema = z.object({ id: z.string().uuid() });
