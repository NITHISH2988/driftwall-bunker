import { Link } from "@tanstack/react-router";
import { Flame } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { PracticeStats } from "@/lib/stats";
import { formatMinutes } from "@/lib/utils";

export function StatsGrid({ stats }: { stats: PracticeStats }) {
  const weekPct = Math.min(100, Math.round((stats.weekCount / stats.weekGoal) * 100));
  return (
    <div className="stagger-in grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Card className="relative overflow-hidden p-5">
        <p className="text-xs tracking-widest text-subtle uppercase">Streak</p>
        <p className="mt-3 font-display text-4xl font-medium tabular-nums tracking-tight">
          {stats.streak}
          <span className="ml-1 text-lg text-muted">days</span>
        </p>
        <Flame className="absolute top-5 right-5 size-5 text-ember ember-dot" />
        <p className="mt-3 text-sm text-muted">
          {stats.streak ? "Logged on consecutive days." : "Log something today to light it."}
        </p>
      </Card>

      <Card className="p-5">
        <p className="text-xs tracking-widest text-subtle uppercase">This week</p>
        <p className="mt-3 font-display text-4xl font-medium tabular-nums tracking-tight">
          {stats.weekCount}
          <span className="ml-1 text-lg text-muted">/ {stats.weekGoal}</span>
        </p>
        <Progress value={weekPct} className="mt-4" />
        <p className="mt-3 text-sm text-muted">Weekly cadence of five logs.</p>
      </Card>

      <Link to="/problems" search={{ status: "solved" }}>
        <Card className="h-full p-5 transition-[box-shadow] duration-150 hover:shadow-border-hover">
          <p className="text-xs tracking-widest text-subtle uppercase">Solved</p>
          <p className="mt-3 font-display text-4xl font-medium tabular-nums tracking-tight">
            {stats.solved}
          </p>
          <p className="mt-3 text-sm text-muted">
            {stats.completionRate}% of {stats.total} logged.
          </p>
        </Card>
      </Link>

      <Card className="p-5">
        <p className="text-xs tracking-widest text-subtle uppercase">Time on problems</p>
        <p className="mt-3 font-display text-4xl font-medium tabular-nums tracking-tight">
          {formatMinutes(stats.totalMinutes)}
        </p>
        <p className="mt-3 text-sm text-muted">
          {stats.inProgress} still in progress.
        </p>
      </Card>
    </div>
  );
}
