import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() ?? "";
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? "";

export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const authEnabled = supabaseConfigured;
export const supabase = supabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null;

export const GROK_PROVIDERS = [{ providerId: "google", label: "Google" }] as const;

export async function signIn(
  providerId: string,
  opts: { callbackURL?: string } = {},
): Promise<void> {
  if (!supabase) {
    throw new Error("Google sign-in isn’t configured yet. Add the Supabase URL and anon key to this deployment.");
  }
  if (providerId !== "google") throw new Error("Google is the only sign-in provider.");
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: new URL(opts.callbackURL ?? "/", window.location.origin).toString(),
      queryParams: { access_type: "offline", prompt: "select_account" },
    },
  });
  if (error) throw error;
}

export async function signOut(redirectTo = "/"): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  window.location.assign(redirectTo);
}
