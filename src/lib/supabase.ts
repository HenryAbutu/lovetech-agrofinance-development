import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/integrations/supabase/types";

export const AUTH_STORAGE_KEY = "sb-auth-token";

function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function cookieSuffix(maxAge: number) {
  const secure = isBrowser() && window.location.protocol === "https:" ? "; Secure" : "";
  return `; path=/; max-age=${maxAge}; SameSite=Lax${secure}`;
}

function readCookie(key: string) {
  if (!isBrowser()) return null;
  const cookies = document.cookie.split("; ").reduce<Record<string, string>>((acc, c) => {
    const eq = c.indexOf("=");
    if (eq === -1) return acc;
    const k = c.slice(0, eq);
    const v = c.slice(eq + 1);
    try {
      acc[k] = decodeURIComponent(v);
    } catch {
      acc[k] = v;
    }
    return acc;
  }, {});
  return cookies[key] ?? null;
}

export function getAuthStorageValue(key = AUTH_STORAGE_KEY) {
  if (!isBrowser()) return null;
  return readCookie(key) || window.localStorage.getItem(key);
}

export function expireAuthCookie(key = AUTH_STORAGE_KEY) {
  if (!isBrowser()) return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${key}=; path=/; max-age=0; SameSite=Lax${secure}`;
  document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax${secure}`;
}

export function clearSupabaseAuthStorage() {
  if (!isBrowser()) return;

  const keys = new Set<string>([AUTH_STORAGE_KEY]);
  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  if (projectId) keys.add(`sb-${projectId}-auth-token`);

  for (let i = 0; i < window.localStorage.length; i += 1) {
    const key = window.localStorage.key(i);
    if (key?.startsWith("sb-") && key.endsWith("-auth-token")) keys.add(key);
  }

  keys.forEach((key) => {
    expireAuthCookie(key);
    window.localStorage.removeItem(key);
  });
}

const cookieBackedStorage = {
  getItem: (key: string) => getAuthStorageValue(key),
  setItem: (key: string, value: string) => {
    if (!isBrowser()) return;
    document.cookie = `${key}=${encodeURIComponent(value)}${cookieSuffix(60 * 60 * 24 * 365)}`;
    window.localStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    if (!isBrowser()) return;
    expireAuthCookie(key);
    window.localStorage.removeItem(key);
  },
};

function createSupabaseClient() {
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    const missing = [
      ...(!SUPABASE_URL ? ["SUPABASE_URL"] : []),
      ...(!SUPABASE_PUBLISHABLE_KEY ? ["SUPABASE_PUBLISHABLE_KEY"] : []),
    ];
    const message = `Missing backend environment variable(s): ${missing.join(", ")}. Connect Lovable Cloud.`;
    console.error(`[Auth] ${message}`);
    throw new Error(message);
  }

  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      flowType: "pkce",
      detectSessionInUrl: true,
      persistSession: true,
      storageKey: AUTH_STORAGE_KEY,
      storage: isBrowser() ? cookieBackedStorage : undefined,
      autoRefreshToken: true,
    },
  });
}

let _supabase: ReturnType<typeof createSupabaseClient> | undefined;

export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  },
});

export async function getActiveSupabaseSession() {
  const { data } = await supabase.auth.getSession();
  if (data.session) return data.session;

  const raw = getAuthStorageValue();
  if (!raw) return null;

  try {
    const stored = JSON.parse(raw) as {
      access_token?: string;
      refresh_token?: string;
      currentSession?: { access_token?: string; refresh_token?: string };
    };
    const access_token = stored.access_token ?? stored.currentSession?.access_token;
    const refresh_token = stored.refresh_token ?? stored.currentSession?.refresh_token;
    if (!access_token || !refresh_token) return null;
    const restored = await supabase.auth.setSession({ access_token, refresh_token });
    return restored.data.session ?? null;
  } catch {
    return null;
  }
}