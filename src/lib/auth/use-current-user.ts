import { useEffect, useState } from "react";
import { authEnabled, supabase } from "./client";

export type AppUser = {
  id: string;
  displayName: string | null;
  primaryEmail: string | null;
  profileImageUrl: string | null;
  isDevFallback: boolean;
};

export type CurrentUserState = { user: AppUser | null; isPending: boolean };

export const DEV_USER: AppUser = {
  id: "dev-user",
  displayName: "Dev User",
  primaryEmail: "dev@example.com",
  profileImageUrl: null,
  isDevFallback: true,
};

function toAppUser(user: {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
}): AppUser {
  const metadata = user.user_metadata ?? {};
  return {
    id: user.id,
    displayName: typeof metadata.full_name === "string" ? metadata.full_name : user.email?.split("@")[0] ?? null,
    primaryEmail: user.email ?? null,
    profileImageUrl: typeof metadata.avatar_url === "string" ? metadata.avatar_url : null,
    isDevFallback: false,
  };
}

export function useCurrentUserState(): CurrentUserState {
  const localFallback = !authEnabled && import.meta.env.DEV;
  const [user, setUser] = useState<AppUser | null>(localFallback ? DEV_USER : null);
  const [isPending, setIsPending] = useState(Boolean(authEnabled));

  useEffect(() => {
    if (!supabase) {
      setUser(localFallback ? DEV_USER : null);
      setIsPending(false);
      return;
    }

    let active = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setUser(session?.user ? toAppUser(session.user) : null);
      setIsPending(false);
    });
    void supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      setUser(!error && data.session?.user ? toAppUser(data.session.user) : null);
      setIsPending(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [localFallback]);

  return { user, isPending };
}

export function useCurrentUser(): AppUser | null {
  return useCurrentUserState().user;
}
