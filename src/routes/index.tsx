import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { WeekCadence } from "@/components/dashboard/week-cadence";
import { QueueList } from "@/components/dashboard/queue-list";
import { DifficultyBadge } from "@/components/problems/status-badge";
import { useProblemStore } from "@/lib/store";
import { computeStats } from "@/lib/stats";
import { formatDateLong } from "@/lib/utils";
import { LANGUAGE_LABEL } from "@/lib/types";

export const Route = createFileRoute("/")({ component: Desk });

function greeting(date: Date) {
  const h = date.getHours();
  if (h < 12) return "Good morning.";
  if (h < 18) return "Good afternoon.";
  return "Good evening.";
}

function Desk() {
  const problems = useProblemStore((s) => s.problems);
  const stats = useMemo(() => computeStats(problems), [problems]);
  const now = new Date();
  const recent = [...problems]
    .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
    .slice(0, 5);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm tracking-wide text-ember">{formatDateLong(now.toISOString())}</p>
          <h1 className="mt-1 font-display text-4xl font-medium tracking-tight sm:text-5xl">
            {greeting(now)}
            <span className="mt-1 block text-muted">Keep the fire going.</span>
          </h1>
        </div>
        <Button asChild>
          <Link to="/log">
            Log a problem
            <ArrowRight />
          </Link>
        </Button>
      </header>

      <StatsGrid stats={stats} />

      <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
        <WeekCadence stats={stats} />
        <QueueList problems={problems} />
      </div>

      <Card className="p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-display text-xl font-medium tracking-tight">Recently tended</h2>
          <Link to="/problems" className="text-sm text-ember hover:underline">
            All problems
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="mt-6 text-sm text-muted">No problems yet. The desk is empty — start a log.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {recent.map((problem) => (
              <li key={problem.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <Link
                    to="/problems/$id"
                    params={{ id: problem.id }}
                    className="truncate font-medium hover:text-ember"
                  >
                    {problem.title}
                  </Link>
                  <p className="mt-0.5 text-xs text-subtle">
                    {LANGUAGE_LABEL[problem.language]} · {formatDateLong(problem.updatedAt)}
                  </p>
                </div>
                <DifficultyBadge difficulty={problem.difficulty} />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
