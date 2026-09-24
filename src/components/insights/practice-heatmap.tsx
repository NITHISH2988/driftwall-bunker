import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
import type { PracticeStats } from "@/lib/stats";
import { cn } from "@/lib/utils";

function heatClass(count: number) {
  if (count <= 0) return "bg-surface-2";
  if (count === 1) return "bg-primary/35";
  if (count === 2) return "bg-primary/60";
  return "bg-primary";
}

export function PracticeHeatmap({ stats }: { stats: PracticeStats }) {
  const weeks = [];
  for (let i = 0; i < stats.heatmap.length; i += 7) {
    weeks.push(stats.heatmap.slice(i, i + 7));
  }

  return (
    <Card className="p-5">
      <h2 className="font-display text-xl font-medium tracking-tight">Twelve weeks of practice</h2>
      <p className="mt-1 text-sm text-muted">Each cell is a day. Darker ember means more logs.</p>
      <div className="mt-5 overflow-x-auto">
        <div className="flex min-w-full justify-start gap-1.5">
          {weeks.map((week, wi) => (
            <div key={week[0]?.key ?? wi} className="flex flex-col gap-1.5">
              {week.map((day) => (
                <Tooltip key={day.key}>
                  <TooltipTrigger asChild>
                    <div
                      className={cn("size-3.5 rounded-xs sm:size-4", heatClass(day.count))}
                      aria-label={`${day.key}: ${day.count} logs`}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    {day.key} · {day.count} {day.count === 1 ? "log" : "logs"}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-subtle">
        Less
        <span className="size-3 rounded-xs bg-surface-2" />
        <span className="size-3 rounded-xs bg-primary/35" />
        <span className="size-3 rounded-xs bg-primary/60" />
        <span className="size-3 rounded-xs bg-primary" />
        More
      </div>
    </Card>
  );
}
