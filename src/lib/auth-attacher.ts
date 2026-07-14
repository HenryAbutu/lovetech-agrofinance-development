import { createMiddleware } from "@tanstack/react-start";

import { getActiveSupabaseSession } from "@/lib/supabase";

export const attachCookieSupabaseAuth = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    const session = await getActiveSupabaseSession();
    const token = session?.access_token;
    return next({
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
);