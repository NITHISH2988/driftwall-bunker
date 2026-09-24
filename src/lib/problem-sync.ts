import { toast } from "sonner";
import { deleteProblem as deleteRemoteProblem, saveProblem } from "./problems.server-fns";
import type { Problem } from "./types";

export function saveProblemInBackground(problem: Problem) {
  void saveProblem({ data: problem }).catch(() => {
    toast.error("Could not save to your account. The saved copy on this device is intact.");
  });
}

export function deleteProblemInBackground(id: string) {
  void deleteRemoteProblem({ data: id }).catch(() => {
    toast.error("Could not remove this log from your account. Check your connection.");
  });
}
