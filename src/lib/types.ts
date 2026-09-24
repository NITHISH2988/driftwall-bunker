export const LANGUAGES = [
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "python", label: "Python" },
  { id: "java", label: "Java" },
  { id: "cpp", label: "C++" },
  { id: "sql", label: "SQL" },
  { id: "html-css", label: "HTML & CSS" },
  { id: "go", label: "Go" },
] as const;

export type LanguageId = (typeof LANGUAGES)[number]["id"];

export const PLATFORMS = [
  "LeetCode",
  "HackerRank",
  "GeeksforGeeks",
  "Frontend Mentor",
  "Codewars",
  "Codeforces",
  "Project",
  "Other",
] as const;

export type Platform = (typeof PLATFORMS)[number];

export const DIFFICULTIES = ["easy", "medium", "hard"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export const STATUSES = ["todo", "in-progress", "solved", "revisited"] as const;
export type Status = (typeof STATUSES)[number];

export type Problem = {
  id: string;
  title: string;
  platform: Platform | string;
  url: string;
  language: LanguageId;
  difficulty: Difficulty;
  status: Status;
  topics: string[];
  notes: string;
  timeSpentMin: number;
  createdAt: string;
  updatedAt: string;
  solvedAt?: string;
};

export type ProblemDraft = Omit<Problem, "id" | "createdAt" | "updatedAt" | "solvedAt"> & {
  solvedAt?: string;
};

export const LANGUAGE_LABEL: Record<LanguageId, string> = Object.fromEntries(
  LANGUAGES.map((l) => [l.id, l.label]),
) as Record<LanguageId, string>;

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export const STATUS_LABEL: Record<Status, string> = {
  todo: "To do",
  "in-progress": "In progress",
  solved: "Solved",
  revisited: "Revisit",
};

export function isLanguageId(value: unknown): value is LanguageId {
  return LANGUAGES.some((l) => l.id === value);
}

export function isDifficulty(value: unknown): value is Difficulty {
  return DIFFICULTIES.includes(value as Difficulty);
}

export function isStatus(value: unknown): value is Status {
  return STATUSES.includes(value as Status);
}
