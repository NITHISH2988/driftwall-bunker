import { Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { DifficultyBadge, StatusBadge } from "@/components/problems/status-badge";
import type { Problem } from "@/lib/types";
import { LANGUAGE_LABEL } from "@/lib/types";

export function QueueList({ problems }: { problems: Problem[] }) {
  const queue = problems.filter((p) => p.status === "in-progress" || p.status === "todo").slice(0, 4);
  return (
    <Card className="p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-xl font-medium tracking-tight">On the desk</h2>
        <Link to="/problems" search={{ status: "in-progress" }} className="text-sm text-ember hover:underline">
          See queue
        </Link>
      </div>
      {queue.length === 0 ? (
        <p className="mt-6 text-sm text-muted">Nothing waiting. Log a problem to fill the desk.</p>
      ) : (
        <ul className="mt-4 divide-y divide-border">
          {queue.map((problem) => (
            <li key={problem.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <Link
                  to="/problems/$id"
                  params={{ id: problem.id }}
                  className="block truncate font-medium hover:text-ember"
                >
                  {problem.title}
                </Link>
                <p className="mt-0.5 text-xs text-subtle">
                  {problem.platform} · {LANGUAGE_LABEL[problem.language]}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center">
                <DifficultyBadge difficulty={problem.difficulty} />
                <StatusBadge status={problem.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
