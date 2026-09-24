import { createClient } from "@supabase/supabase-js";
import { supabaseAnonKey, supabaseUrl } from "./auth/client";

/** Use the signed-in user's JWT so Supabase applies row-level security. */
export function createProblemsDb(accessToken: string | undefined) {
  if (!accessToken || !supabaseUrl || !supabaseAnonKey) return null;
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}
