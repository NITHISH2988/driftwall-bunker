import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DIFFICULTY_LABEL, LANGUAGE_LABEL, STATUS_LABEL } from "@/lib/types";
import type { PracticeStats } from "@/lib/stats";
import { Skeleton } from "@/components/ui/skeleton";

const TICK = { fill: "var(--color-subtle)", fontSize: 12 };
const GRID = "color-mix(in oklab, var(--color-fg) 8%, transparent)";

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export function LanguageChart({ stats }: { stats: PracticeStats }) {
  const mounted = useMounted();
  const data = stats.byLanguage.map((row) => ({
    name: LANGUAGE_LABEL[row.id] ?? row.label,
    count: row.count,
    solved: row.solved,
  }));

  return (
    <Card className="p-5">
      <h2 className="font-display text-xl font-medium tracking-tight">Languages</h2>
      <p className="mt-1 text-sm text-muted">How the log splits across stacks.</p>
      <div className="mt-4 h-64">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid stroke={GRID} horizontal={false} />
              <XAxis type="number" tick={TICK} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={TICK} axisLine={false} tickLine={false} width={88} />
              <Tooltip
                cursor={{ fill: "color-mix(in oklab, var(--color-fg) 6%, transparent)" }}
                contentStyle={{
                  background: "var(--color-surface-2)",
                  border: "1px solid color-mix(in oklab, var(--color-fg) 12%, transparent)",
                  borderRadius: 12,
                  color: "var(--color-fg)",
                }}
              />
              <Bar dataKey="count" radius={[0, 6, 6, 0]} fill="var(--color-primary)" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Skeleton className="h-full" />
        )}
      </div>
    </Card>
  );
}

export function DifficultyChart({ stats }: { stats: PracticeStats }) {
  const mounted = useMounted();
  const data = stats.avgMinutesByDifficulty.map((row) => ({
    name: DIFFICULTY_LABEL[row.id],
    minutes: row.minutes,
  }));
  const fills = ["var(--color-sage)", "var(--color-primary)", "var(--color-danger)"];

  return (
    <Card className="p-5">
      <h2 className="font-display text-xl font-medium tracking-tight">Minutes by difficulty</h2>
      <p className="mt-1 text-sm text-muted">Average time spent per logged problem.</p>
      <div className="mt-4 h-64">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="name" tick={TICK} axisLine={false} tickLine={false} />
              <YAxis tick={TICK} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "var(--color-surface-2)",
                  border: "1px solid color-mix(in oklab, var(--color-fg) 12%, transparent)",
                  borderRadius: 12,
                  color: "var(--color-fg)",
                }}
              />
              <Bar dataKey="minutes" radius={[6, 6, 0, 0]}>
                {data.map((_, i) => (
                  <Cell key={data[i]?.name} fill={fills[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Skeleton className="h-full" />
        )}
      </div>
    </Card>
  );
}

export function MixPanels({ stats }: { stats: PracticeStats }) {
  const maxLang = Math.max(1, ...stats.byLanguage.map((l) => l.count));
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <Card className="p-5">
        <h2 className="font-display text-xl font-medium tracking-tight">Status mix</h2>
        <ul className="mt-4 space-y-3">
          {stats.byStatus.map((row) => (
            <li key={row.id}>
              <div className="mb-1.5 flex justify-between text-sm">
                <span className="text-muted">{STATUS_LABEL[row.id]}</span>
                <span className="tabular-nums text-fg">{row.count}</span>
              </div>
              <Progress value={stats.total ? (row.count / stats.total) * 100 : 0} />
            </li>
          ))}
        </ul>
      </Card>
      <Card className="p-5">
        <h2 className="font-display text-xl font-medium tracking-tight">Topics</h2>
        {stats.topicCounts.length === 0 ? (
          <p className="mt-4 text-sm text-muted">Tag problems as you log them.</p>
        ) : (
          <ul className="mt-4 flex flex-wrap gap-2">
            {stats.topicCounts.map((row) => (
              <li
                key={row.topic}
                className="rounded-full bg-surface-2 px-3 py-1.5 text-sm text-muted"
                style={{ opacity: 0.55 + (row.count / maxLang) * 0.45 }}
              >
                #{row.topic}
                <span className="ml-1.5 tabular-nums text-subtle">{row.count}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
