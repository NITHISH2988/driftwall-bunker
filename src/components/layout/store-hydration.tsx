import { useEffect, useState, type ReactNode } from "react";
import { ensureStoreSeeded, useProblemStore } from "@/lib/store";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { listProblems, saveProblem } from "@/lib/problems.server-fns";
import { toast } from "sonner";

export function StoreHydration({ children }: { children: ReactNode }) {
  const user = useCurrentUser();
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!user) return;
    let active = true;
    const hydrate = async () => {
      useProblemStore.persist.setOptions({ name: `hearth-practice:${user.id}` });
      await useProblemStore.persist.rehydrate();
      if (!active) return;
      ensureStoreSeeded();
      try {
        const remote = await listProblems();
        if (!active) return;
        if (remote.length) {
          useProblemStore.setState({ problems: remote, seeded: true });
        } else {
          const local = useProblemStore.getState().problems;
          await Promise.all(local.map((problem) => saveProblem({ data: problem })));
        }
      } catch {
        if (active) {
          setLoadError(true);
          toast.error("Could not reach your saved study log. Showing this device’s copy.");
        }
      }
      if (active) setReady(true);
    };
    void hydrate();
    return () => { active = false; };
  }, [user?.id]);

  if (!ready) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-6xl flex-col gap-6 px-4 py-8 lg:px-8">
        <Skeleton className="h-10 w-40" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return <>{loadError ? <div role="status" className="mx-auto max-w-6xl px-4 pt-3 text-sm text-ember">Backend unavailable · showing the saved copy from this device.</div> : null}{children}</>;
}
