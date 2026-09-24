import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createSeed } from "./seed";
import type { Problem, ProblemDraft } from "./types";

type ProblemStore = {
  problems: Problem[];
  seeded: boolean;
  addProblem: (draft: ProblemDraft) => Problem;
  updateProblem: (id: string, patch: Partial<ProblemDraft> & { status?: Problem["status"] }) => void;
  deleteProblem: (id: string) => void;
  getProblem: (id: string) => Problem | undefined;
};

function stampSolved(status: Problem["status"], previous?: string) {
  if (status === "solved" || status === "revisited") {
    return previous ?? new Date().toISOString();
  }
  return undefined;
}

export const useProblemStore = create<ProblemStore>()(
  persist(
    (set, get) => ({
      problems: [],
      seeded: false,
      addProblem: (draft) => {
        const now = new Date().toISOString();
        const problem: Problem = {
          ...draft,
          id: crypto.randomUUID(),
          createdAt: now,
          updatedAt: now,
          solvedAt: stampSolved(draft.status),
        };
        set({ problems: [problem, ...get().problems] });
        return problem;
      },
      updateProblem: (id, patch) => {
        set({
          problems: get().problems.map((problem) => {
            if (problem.id !== id) return problem;
            const status = patch.status ?? problem.status;
            return {
              ...problem,
              ...patch,
              status,
              updatedAt: new Date().toISOString(),
              solvedAt: stampSolved(status, problem.solvedAt),
            };
          }),
        });
      },
      deleteProblem: (id) => {
        set({ problems: get().problems.filter((problem) => problem.id !== id) });
      },
      getProblem: (id) => get().problems.find((problem) => problem.id === id),
    }),
    { name: "hearth-practice", skipHydration: true },
  ),
);

export function ensureStoreSeeded() {
  const state = useProblemStore.getState();
  if (!state.seeded) {
    useProblemStore.setState({
      problems: state.problems.length ? state.problems : createSeed(),
      seeded: true,
    });
  }
}
