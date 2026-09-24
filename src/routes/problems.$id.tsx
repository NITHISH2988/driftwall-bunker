import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Clock3, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
import { DifficultyBadge, StatusBadge } from "@/components/problems/status-badge";
import { ProblemForm } from "@/components/problems/problem-form";
import { useProblemStore } from "@/lib/store";
import { LANGUAGE_LABEL, type Difficulty, type LanguageId, type Status } from "@/lib/types";
import type { ProblemFormValues } from "@/lib/validation";
import { formatDateLong, formatMinutes } from "@/lib/utils";
import { deleteProblemInBackground, saveProblemInBackground } from "@/lib/problem-sync";

export const Route = createFileRoute("/problems/$id")({ component: ProblemDetail });

function ProblemDetail() {
  const { id } = Route.useParams();
  const problem = useProblemStore((s) => s.problems.find((p) => p.id === id));
  const updateProblem = useProblemStore((s) => s.updateProblem);
  const deleteProblem = useProblemStore((s) => s.deleteProblem);
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const related = useProblemStore((s) => s.problems);
  const siblings = useMemo(() => {
    if (!problem) return [];
    return related
      .filter((p) => p.id !== problem.id && p.topics.some((t) => problem.topics.includes(t)))
      .slice(0, 3);
  }, [related, problem]);

  if (!problem) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <h1 className="font-display text-3xl font-medium">That log is gone</h1>
        <p className="mt-2 text-sm text-muted">It may have been deleted from this device.</p>
        <Button asChild className="mt-6">
          <Link to="/problems">Back to problems</Link>
        </Button>
      </div>
    );
  }

  function save(values: ProblemFormValues, topics: string[]) {
    updateProblem(id, {
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
    const updated = useProblemStore.getState().getProblem(id);
    if (updated) saveProblemInBackground(updated);
    setEditing(false);
    toast("Problem updated.");
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <Link to="/problems" className="inline-flex w-fit items-center gap-2 text-sm text-muted hover:text-fg">
        <ArrowLeft className="size-4" />
        All problems
      </Link>

      <header>
        <p className="text-sm tracking-wide text-ember">
          {problem.platform}
          <span className="mx-1.5 text-subtle">·</span>
          {LANGUAGE_LABEL[problem.language]}
        </p>
        <h1 className="mt-2 font-display text-4xl font-medium tracking-tight">{problem.title}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <DifficultyBadge difficulty={problem.difficulty} />
          <StatusBadge status={problem.status} />
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        {problem.status !== "solved" ? (
          <Button
            onClick={() => {
              updateProblem(problem.id, { status: "solved" });
              const updated = useProblemStore.getState().getProblem(problem.id);
              if (updated) saveProblemInBackground(updated);
              toast("Marked solved.");
            }}
          >
            Mark solved
          </Button>
        ) : null}
        <Button variant="secondary" onClick={() => setEditing(true)}>
          <Pencil /> Edit
        </Button>
        {problem.url ? (
          <Button variant="outline" asChild>
            <a href={problem.url} target="_blank" rel="noreferrer">
              Open source <ExternalLink />
            </a>
          </Button>
        ) : null}
        <Button variant="ghost" className="text-danger" onClick={() => setConfirm(true)}>
          <Trash2 /> Delete
        </Button>
      </div>

      <Card className="grid gap-4 p-5 sm:grid-cols-3">
        <Meta label="Logged" value={formatDateLong(problem.createdAt)} />
        <Meta label="Updated" value={formatDateLong(problem.updatedAt)} />
        <Meta
          label="Time"
          value={formatMinutes(problem.timeSpentMin)}
          icon={<Clock3 className="size-3.5" />}
        />
      </Card>

      <section>
        <h2 className="font-display text-xl font-medium">Notes</h2>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted">
          {problem.notes || "No notes yet. Edit this log to capture what clicked."}
        </p>
      </section>

      {problem.topics.length ? (
        <section>
          <h2 className="font-display text-xl font-medium">Topics</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {problem.topics.map((topic) => (
              <li key={topic}>
                <Link
                  to="/problems"
                  search={{ q: topic }}
                  className="inline-flex h-8 items-center rounded-full bg-surface px-3 text-sm text-muted shadow-border hover:text-fg"
                >
                  #{topic}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {siblings.length ? (
        <section>
          <Separator className="mb-5" />
          <h2 className="font-display text-xl font-medium">Nearby on the desk</h2>
          <ul className="mt-3 space-y-2">
            {siblings.map((item) => (
              <li key={item.id}>
                <Link to="/problems/$id" params={{ id: item.id }} className="text-sm hover:text-ember">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <Sheet open={editing} onOpenChange={setEditing}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit problem</SheetTitle>
          </SheetHeader>
          <div className="px-5 pb-8">
            <ProblemForm
              initial={problem}
              submitLabel="Save changes"
              onSubmit={save}
              onCancel={() => setEditing(false)}
            />
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this log?</AlertDialogTitle>
            <AlertDialogDescription>
              “{problem.title}” will be removed from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction
              className="bg-danger text-fg"
              onClick={() => {
                deleteProblem(problem.id);
                deleteProblemInBackground(problem.id);
                toast("Removed from the log.");
                void navigate({ to: "/problems" });
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

function Meta({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs tracking-widest text-subtle uppercase">{label}</p>
      <p className="mt-1 inline-flex items-center gap-1.5 font-medium">
        {icon}
        {value}
      </p>
    </div>
  );
}
