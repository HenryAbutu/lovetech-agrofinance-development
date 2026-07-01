// Server-side Supabase client.
// Prefers the service role key when available (bypasses RLS for privileged ops).
// Falls back to the publishable/anon key when SUPABASE_SERVICE_ROLE_KEY is not
// present in the deployment environment (e.g. Netlify without the secret
// configured). In that mode, RLS applies — ensure your policies permit the
// anon role for the operations invoked from server routes / server fns.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

function createSupabaseAdminClient() {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const SUPABASE_PUBLISHABLE_KEY =
    process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY;

  if (!SUPABASE_URL) {
    const message = 'Missing Supabase environment variable: SUPABASE_URL.';
    console.error(`[Supabase] ${message}`);
    throw new Error(message);
  }

  const key = SUPABASE_SERVICE_ROLE_KEY ?? SUPABASE_PUBLISHABLE_KEY;
  if (!key) {
    const message =
      'Missing Supabase credentials: set SUPABASE_SERVICE_ROLE_KEY (preferred) or SUPABASE_PUBLISHABLE_KEY.';
    console.error(`[Supabase] ${message}`);
    throw new Error(message);
  }

  if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.warn(
      '[Supabase] SUPABASE_SERVICE_ROLE_KEY not set — falling back to publishable key. RLS policies will apply to all server-side operations.',
    );
  }

  return createClient<Database>(SUPABASE_URL, key, {
    auth: {
      storage: undefined,
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

let _supabaseAdmin: ReturnType<typeof createSupabaseAdminClient> | undefined;

export const supabaseAdmin = new Proxy({} as ReturnType<typeof createSupabaseAdminClient>, {
  get(_, prop, receiver) {
    if (!_supabaseAdmin) _supabaseAdmin = createSupabaseAdminClient();
    return Reflect.get(_supabaseAdmin, prop, receiver);
  },
});
