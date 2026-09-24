import { Card } from "@/components/ui/card";
import type { PracticeStats } from "@/lib/stats";
import { cn } from "@/lib/utils";

export function WeekCadence({ stats }: { stats: PracticeStats }) {
  const max = Math.max(1, ...stats.weekDays.map((d) => d.count));
  return (
    <Card className="p-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-medium tracking-tight">This week’s cadence</h2>
          <p className="mt-1 text-sm text-muted">Problems logged, Monday through Sunday.</p>
        </div>
        <p className="font-display text-2xl tabular-nums text-ember">{stats.weekCount}</p>
      </div>
      <div className="mt-6 flex h-36 items-end gap-2">
        {stats.weekDays.map((day) => {
          const h = Math.max(day.count ? 18 : 6, Math.round((day.count / max) * 120));
          return (
            <div key={day.key} className="flex flex-1 flex-col items-center gap-2">
              <div
                className={cn(
                  "w-full max-w-10 rounded-sm transition-[height] duration-300",
                  day.count ? "bg-primary" : "bg-surface-2",
                )}
                style={{ height: h }}
                title={`${day.label}: ${day.count}`}
              />
              <span className="text-[11px] text-subtle">{day.label}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
