import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { ProblemForm } from "@/components/problems/problem-form";
import { DifficultyBadge, StatusBadge } from "@/components/problems/status-badge";
import { useProblemStore } from "@/lib/store";
import { LANGUAGE_LABEL, type LanguageId, type Difficulty, type Status } from "@/lib/types";
import type { ProblemFormValues } from "@/lib/validation";
import { saveProblemInBackground } from "@/lib/problem-sync";

export const Route = createFileRoute("/log")({ component: LogPage });

function LogPage() {
  const addProblem = useProblemStore((s) => s.addProblem);
  const navigate = useNavigate();

  function handleSubmit(values: ProblemFormValues, topics: string[]) {
    const problem = addProblem({
      title: values.title,
      platform: values.platform,
      url: values.url,
      language: values.language as LanguageId,
      difficulty: values.difficulty as Difficulty,
      status: values.status as Status,
      topics,
      notes: values.notes,
      timeSpentMin: values.timeSpentMin,
    });
    saveProblemInBackground(problem);
    toast("Logged to the hearth.");
    void navigate({ to: "/problems" });
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div>
        <header className="mb-6">
          <p className="text-sm tracking-wide text-ember">New log</p>
          <h1 className="mt-1 font-display text-4xl font-medium tracking-tight">Add a problem</h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Title, language, difficulty, and status are required. Start the timer if you want minutes
            filled in for you.
          </p>
        </header>
        <Card className="p-5 sm:p-6">
          <ProblemForm submitLabel="Save to hearth" onSubmit={handleSubmit} />
        </Card>
      </div>
      <aside className="hidden lg:block">
        <p className="mb-3 text-xs tracking-widest text-subtle uppercase">How a card looks</p>
        <Card className="sticky top-10 p-5">
          <p className="text-xs tracking-wide text-subtle uppercase">LeetCode</p>
          <h2 className="mt-2 font-display text-2xl leading-snug font-medium tracking-tight">
            Two Sum
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <DifficultyBadge difficulty="easy" />
            <StatusBadge status="solved" />
          </div>
          <p className="mt-4 text-sm text-muted">{LANGUAGE_LABEL.javascript}</p>
          <p className="mt-3 text-xs text-subtle">#arrays  #hashing</p>
        </Card>
      </aside>
    </div>
  );
}
