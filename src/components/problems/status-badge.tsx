import { Badge } from "@/components/ui/badge";
import { DIFFICULTY_LABEL, STATUS_LABEL, type Difficulty, type Status } from "@/lib/types";

export function StatusBadge({ status }: { status: Status }) {
  const variant =
    status === "solved" ? "sage" : status === "in-progress" ? "ember" : status === "revisited" ? "outline" : "default";
  return <Badge variant={variant}>{STATUS_LABEL[status]}</Badge>;
}

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const variant = difficulty === "easy" ? "sage" : difficulty === "medium" ? "ember" : "danger";
  return <Badge variant={variant}>{DIFFICULTY_LABEL[difficulty]}</Badge>;
}
