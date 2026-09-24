import { createMiddleware } from "@tanstack/react-start";

export const authMiddleware = createMiddleware({ type: "function" })
  .client(async ({ next }) => {
    const { supabase } = await import("./client");
    const { data } = supabase ? await supabase.auth.getSession() : { data: { session: null } };
    return next({ sendContext: { accessToken: data.session?.access_token } });
  })
  .server(async ({ next, context }) => {
    const { assertSameSiteRequest } = await import("./isolation.server");
    const { getSupabaseUserId } = await import("./supabase-auth.server");
    assertSameSiteRequest();
    const userId = await getSupabaseUserId(context.accessToken);
    return next({ context: { userId, accessToken: context.accessToken } });
  });
