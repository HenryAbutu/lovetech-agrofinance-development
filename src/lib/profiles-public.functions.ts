import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

function serverAnon() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

// Public directory — anon can call.
export const listPublicLearners = createServerFn({ method: "GET" })
  .handler(async () => {
    const supabase = serverAnon();
    const { data, error } = await supabase
      .from("profiles")
      .select("full_name, headline, location, avatar_url, public_slug")
      .eq("is_public", true)
      .not("public_slug", "is", null)
      .order("full_name", { ascending: true })
      .limit(100);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getPublicProfile = createServerFn({ method: "GET" })
  .inputValidator((input) => z.object({ slug: z.string().min(1).max(120) }).parse(input))
  .handler(async ({ data }) => {
    const supabase = serverAnon();
    const { data: prof, error } = await supabase
      .from("profiles")
      .select("id, full_name, headline, bio, location, avatar_url, website_url, public_slug")
      .eq("public_slug", data.slug)
      .eq("is_public", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!prof) return { profile: null, badges: [], certificates: [] };

    const [{ data: badges }, { data: certs }] = await Promise.all([
      supabase
        .from("academy_learner_badges")
        .select("badge:academy_badges(id, name, description, icon_url)")
        .eq("user_id", prof.id),
      supabase
        .from("academy_certificates")
        .select("id, certificate_id, issued_at, course:academy_courses(title, slug)")
        .eq("user_id", prof.id)
        .eq("status", "issued")
        .order("issued_at", { ascending: false }),
    ]);
    return { profile: prof, badges: badges ?? [], certificates: certs ?? [] };
  });

// Authenticated: my profile + update
export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("profiles")
      .select("id, email, full_name, headline, bio, location, avatar_url, website_url, is_public, public_slug, referral_code")
      .eq("id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  });

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      full_name: z.string().trim().min(1).max(120).optional(),
      headline: z.string().trim().max(160).nullable().optional(),
      bio: z.string().trim().max(2000).nullable().optional(),
      location: z.string().trim().max(120).nullable().optional(),
      avatar_url: z.string().url().max(500).nullable().optional(),
      website_url: z.string().url().max(500).nullable().optional(),
      is_public: z.boolean().optional(),
      public_slug: z
        .string()
        .trim()
        .toLowerCase()
        .regex(/^[a-z0-9][a-z0-9-]{1,60}$/, "Use lowercase letters, numbers and dashes (3–60 chars)")
        .nullable()
        .optional(),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    if (data.is_public && !data.public_slug) {
      // Check the user already has a slug in the row
      const { data: existing } = await supabase.from("profiles").select("public_slug").eq("id", userId).maybeSingle();
      if (!existing?.public_slug) {
        throw new Error("Choose a public username before making your profile public.");
      }
    }
    const { error } = await supabase.from("profiles").update(data).eq("id", userId);
    if (error) {
      if (error.message.toLowerCase().includes("duplicate")) {
        throw new Error("That username is already taken. Try another.");
      }
      throw new Error(error.message);
    }
    return { ok: true };
  });
