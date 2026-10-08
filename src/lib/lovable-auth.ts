// Direct Supabase Auth OAuth (no Lovable broker) — works on Netlify-hosted custom domains.
import { supabase } from "@/lib/supabase";

type SignInOptions = {
  redirect_uri?: string;
  extraParams?: Record<string, string>;
};

export const lovable = {
  auth: {
    signInWithOAuth: async (provider: "google" | "apple", opts?: SignInOptions) => {
      const redirectTo = opts?.redirect_uri ?? `${window.location.origin}/auth/callback`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo, queryParams: opts?.extraParams },
      });
      if (error) return { error, redirected: false as const };
      return { error: null, redirected: true as const };
    },
  },
};
