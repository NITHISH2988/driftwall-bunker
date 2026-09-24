import { Link } from "@tanstack/react-router";
import { Clock3, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DifficultyBadge, StatusBadge } from "@/components/problems/status-badge";
import { LANGUAGE_LABEL, type Problem } from "@/lib/types";
import { formatDate, formatMinutes } from "@/lib/utils";

export function ProblemCard({
  problem,
  onEdit,
  onDelete,
  onSolve,
}: {
  problem: Problem;
  onEdit: () => void;
  onDelete: () => void;
  onSolve: () => void;
}) {
  return (
    <article className="flex flex-col rounded-xl bg-surface p-4 shadow-border transition-[box-shadow] duration-150 hover:shadow-border-hover">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs tracking-wide text-subtle uppercase">
            {problem.platform}
            <span className="mx-1.5 text-border">·</span>
            {LANGUAGE_LABEL[problem.language]}
          </p>
          <h3 className="mt-1 font-display text-lg leading-snug font-medium tracking-tight">
            <Link to="/problems/$id" params={{ id: problem.id }} className="hover:text-ember">
              {problem.title}
            </Link>
          </h3>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-10 shrink-0" aria-label="Problem actions">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {problem.status !== "solved" ? (
              <DropdownMenuItem onSelect={onSolve}>Mark solved</DropdownMenuItem>
            ) : null}
            <DropdownMenuItem onSelect={onEdit}>
              <Pencil className="size-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-danger" onSelect={onDelete}>
              <Trash2 className="size-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <DifficultyBadge difficulty={problem.difficulty} />
        <StatusBadge status={problem.status} />
        {problem.topics.slice(0, 3).map((topic) => (
          <span key={topic} className="text-xs text-subtle">
            #{topic}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-subtle">
        <span className="inline-flex items-center gap-1">
          <Clock3 className="size-3.5" />
          {formatMinutes(problem.timeSpentMin)}
        </span>
        <time dateTime={problem.updatedAt}>{formatDate(problem.updatedAt)}</time>
      </div>
    </article>
  );
}
