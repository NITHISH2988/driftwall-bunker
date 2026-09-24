import { supabaseAnonKey, supabaseUrl } from "./client";

export class SupabaseUnauthorizedError extends Error {
  readonly status = 401;
  constructor() {
    super("Unauthorized");
    this.name = "SupabaseUnauthorizedError";
  }
}

export async function getSupabaseUserId(accessToken: string | undefined): Promise<string> {
  if (import.meta.env.DEV && !supabaseUrl) return "dev-user";
  if (!accessToken || !supabaseUrl || !supabaseAnonKey) throw new SupabaseUnauthorizedError();

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: supabaseAnonKey,
      authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) throw new SupabaseUnauthorizedError();
  const user = await response.json() as { id?: unknown };
  if (typeof user.id !== "string" || !user.id) throw new SupabaseUnauthorizedError();
  return user.id;
}
