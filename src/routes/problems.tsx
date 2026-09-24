import { useMemo, useState } from "react";
import { createFileRoute, Link, Outlet, useMatch, useNavigate } from "@tanstack/react-router";

import { Search, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ProblemCard } from "@/components/problems/problem-card";
import { ProblemForm } from "@/components/problems/problem-form";
import { useProblemStore } from "@/lib/store";
import {
  DIFFICULTIES,
  DIFFICULTY_LABEL,
  LANGUAGES,
  STATUSES,
  STATUS_LABEL,
  isDifficulty,
  isLanguageId,
  isStatus,
  type Difficulty,
  type LanguageId,
  type Problem,
  type Status,
} from "@/lib/types";
import type { ProblemFormValues } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { deleteProblemInBackground, saveProblemInBackground } from "@/lib/problem-sync";

export type ProblemsSearch = {
  q?: string;
  difficulty?: Difficulty;
  status?: Status;
  language?: LanguageId;
};

export const Route = createFileRoute("/problems")({
  validateSearch: (raw: Record<string, unknown>): ProblemsSearch => ({
    q: typeof raw.q === "string" ? raw.q : undefined,
    difficulty: isDifficulty(raw.difficulty) ? raw.difficulty : undefined,
    status: isStatus(raw.status) ? raw.status : undefined,
    language: isLanguageId(raw.language) ? raw.language : undefined,
  }),
  component: ProblemsLayout,
});

function ProblemsLayout() {
  const child = useMatch({ from: "/problems/$id", shouldThrow: false });
  if (child) return <Outlet />;
  return <ProblemsPage />;
}

function ProblemsPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/problems" });
  const problems = useProblemStore((s) => s.problems);
  const updateProblem = useProblemStore((s) => s.updateProblem);
  const deleteProblem = useProblemStore((s) => s.deleteProblem);

  const [editing, setEditing] = useState<Problem | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Problem | null>(null);
  const [query, setQuery] = useState(search.q ?? "");

  const filtered = useMemo(() => {
    const q = (search.q ?? "").trim().toLowerCase();
    return problems.filter((problem) => {
      if (search.difficulty && problem.difficulty !== search.difficulty) return false;
      if (search.status && problem.status !== search.status) return false;
      if (search.language && problem.language !== search.language) return false;
      if (!q) return true;
      const hay = [problem.title, problem.platform, problem.notes, ...problem.topics]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [problems, search]);

  function patchSearch(next: {
    q?: string;
    difficulty?: Difficulty | "all";
    status?: Status | "all";
    language?: LanguageId | "all";
  }) {
    void navigate({
      search: {
        q: next.q !== undefined ? next.q || undefined : search.q,
        difficulty:
          next.difficulty === "all"
            ? undefined
            : next.difficulty !== undefined
              ? next.difficulty
              : search.difficulty,
        status:
          next.status === "all"
            ? undefined
            : next.status !== undefined
              ? next.status
              : search.status,
        language:
          next.language === "all"
            ? undefined
            : next.language !== undefined
              ? next.language
              : search.language,
      },
    });
  }

  function saveEdit(values: ProblemFormValues, topics: string[]) {
    if (!editing) return;
    updateProblem(editing.id, {
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
    const updated = useProblemStore.getState().getProblem(editing.id);
    if (updated) saveProblemInBackground(updated);
    setEditing(null);
    toast("Problem updated.");
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm tracking-wide text-ember">The log</p>
          <h1 className="mt-1 font-display text-4xl font-medium tracking-tight">Problems</h1>
          <p className="mt-2 text-sm text-muted">
            {filtered.length} of {problems.length} shown.
          </p>
        </div>
        <Button asChild>
          <Link to="/log">Log a problem</Link>
        </Button>
      </header>

      <div className="flex flex-col gap-3 lg:flex-row">
        <form
          className="relative flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            patchSearch({ q: query });
          }}
        >
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              patchSearch({ q: e.target.value });
            }}
            placeholder="Search title, topic, platform…"
            className="pl-10"
            aria-label="Search problems"
          />
        </form>
        <div className="hidden gap-2 lg:flex">
          <FilterSelect
            label="Difficulty"
            value={search.difficulty ?? "all"}
            onChange={(v) =>
              patchSearch({ difficulty: v === "all" ? "all" : (v as Difficulty) })
            }
            options={[
              { value: "all", label: "All difficulties" },
              ...DIFFICULTIES.map((d) => ({ value: d, label: DIFFICULTY_LABEL[d] })),
            ]}
          />
          <FilterSelect
            label="Status"
            value={search.status ?? "all"}
            onChange={(v) => patchSearch({ status: v === "all" ? "all" : (v as Status) })}
            options={[
              { value: "all", label: "All statuses" },
              ...STATUSES.map((s) => ({ value: s, label: STATUS_LABEL[s] })),
            ]}
          />
          <FilterSelect
            label="Language"
            value={search.language ?? "all"}
            onChange={(v) =>
              patchSearch({ language: v === "all" ? "all" : (v as LanguageId) })
            }
            options={[
              { value: "all", label: "All languages" },
              ...LANGUAGES.map((l) => ({ value: l.id, label: l.label })),
            ]}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 lg:hidden">
        {DIFFICULTIES.map((d) => (
          <Chip
            key={d}
            active={search.difficulty === d}
            onClick={() =>
              patchSearch({ difficulty: search.difficulty === d ? "all" : d })
            }
          >
            {DIFFICULTY_LABEL[d]}
          </Chip>
        ))}
        {STATUSES.map((s) => (
          <Chip
            key={s}
            active={search.status === s}
            onClick={() => patchSearch({ status: search.status === s ? "all" : s })}
          >
            {STATUS_LABEL[s]}
          </Chip>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <SlidersHorizontal className="size-6 text-subtle" />
          <h2 className="font-display text-2xl font-medium">Nothing matches</h2>
          <p className="max-w-sm text-sm text-muted">
            Clear filters or log a new problem — the hearth is waiting.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setQuery("");
              void navigate({ search: {} });
            }}
          >
            Clear filters
          </Button>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((problem) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              onEdit={() => setEditing(problem)}
              onDelete={() => setPendingDelete(problem)}
              onSolve={() => {
                updateProblem(problem.id, { status: "solved" });
                const updated = useProblemStore.getState().getProblem(problem.id);
                if (updated) saveProblemInBackground(updated);
                toast("Marked solved.");
              }}
            />
          ))}
        </div>
      )}

      <Sheet open={Boolean(editing)} onOpenChange={(open) => !open && setEditing(null)}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit problem</SheetTitle>
          </SheetHeader>
          <div className="px-5 pb-8">
            {editing ? (
              <ProblemForm
                key={editing.id}
                initial={editing}
                submitLabel="Save changes"
                onSubmit={saveEdit}
                onCancel={() => setEditing(null)}
              />
            ) : null}
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={Boolean(pendingDelete)} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this log?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete
                ? `"${pendingDelete.title}" will be removed from your account. This cannot be undone.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction
              className="bg-danger text-fg hover:opacity-90"
              onClick={() => {
                if (pendingDelete) {
                  deleteProblem(pendingDelete.id);
                  deleteProblemInBackground(pendingDelete.id);
                  toast("Removed from the log.");
                }
                setPendingDelete(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 rounded-full px-3 text-xs font-medium shadow-border",
        active ? "bg-primary/20 text-ember" : "bg-surface text-muted",
      )}
    >
      {children}
    </button>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-44" aria-label={label}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
