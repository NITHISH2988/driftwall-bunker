import { z } from "zod";
import { DIFFICULTIES, LANGUAGES, STATUSES } from "./types";

const languageIds = LANGUAGES.map((l) => l.id) as [string, ...string[]];
const difficulties = [...DIFFICULTIES] as [string, ...string[]];
const statuses = [...STATUSES] as [string, ...string[]];

export const problemFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Name the problem — at least 3 characters.")
    .max(120, "Keep the title under 120 characters."),
  platform: z.string().trim().min(1, "Choose a platform."),
  url: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || /^https?:\/\/\S+\.\S+/.test(value),
      "Use a full URL starting with http:// or https://.",
    ),
  language: z.enum(languageIds, { message: "Pick a language." }),
  difficulty: z.enum(difficulties, { message: "Pick a difficulty." }),
  status: z.enum(statuses, { message: "Pick a status." }),
  topicsText: z.string(),
  notes: z.string().max(2000, "Notes must stay under 2,000 characters."),
  timeSpentMin: z.coerce
    .number({ message: "Time spent must be a number." })
    .min(0, "Time cannot be negative.")
    .max(24 * 60, "Cap a single log at 24 hours."),
});

export type ProblemFormValues = z.infer<typeof problemFormSchema>;

export const emptyProblemForm = (): ProblemFormValues => ({
  title: "",
  platform: "",
  url: "",
  language: "javascript",
  difficulty: "easy",
  status: "todo",
  topicsText: "",
  notes: "",
  timeSpentMin: 0,
});

export function parseTopics(text: string): string[] {
  const seen = new Set<string>();
  const topics: string[] = [];
  for (const raw of text.split(/[,#\n]/)) {
    const topic = raw.trim().toLowerCase().replace(/\s+/g, "-");
    if (!topic || seen.has(topic)) continue;
    seen.add(topic);
    topics.push(topic);
    if (topics.length >= 8) break;
  }
  return topics;
}
