import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LanguageChart, DifficultyChart, MixPanels } from "@/components/insights/charts";
import { PracticeHeatmap } from "@/components/insights/practice-heatmap";
import { useProblemStore } from "@/lib/store";
import { computeStats } from "@/lib/stats";
import { formatMinutes } from "@/lib/utils";

export const Route = createFileRoute("/insights")({ component: InsightsPage });

function InsightsPage() {
  const problems = useProblemStore((s) => s.problems);
  const stats = useMemo(() => computeStats(problems), [problems]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm tracking-wide text-ember">Patterns</p>
          <h1 className="mt-1 font-display text-4xl font-medium tracking-tight">Insights</h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Completion, language mix, and the days you actually sat down.
          </p>
        </div>
        <Button asChild variant="secondary">
          <Link to="/log">Log a problem</Link>
        </Button>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Completion" value={`${stats.completionRate}%`} hint={`${stats.solved} solved`} />
        <Stat label="In progress" value={String(stats.inProgress)} hint={`${stats.todo} still to do`} />
        <Stat label="Focus time" value={formatMinutes(stats.totalMinutes)} hint="Across every log" />
      </div>

      <PracticeHeatmap stats={stats} />

      <div className="grid gap-3 lg:grid-cols-2">
        <LanguageChart stats={stats} />
        <DifficultyChart stats={stats} />
      </div>

      <MixPanels stats={stats} />
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <Card className="p-5">
      <p className="text-xs tracking-widest text-subtle uppercase">{label}</p>
      <p className="mt-3 font-display text-4xl font-medium tabular-nums tracking-tight">{value}</p>
      <p className="mt-2 text-sm text-muted">{hint}</p>
    </Card>
  );
}
