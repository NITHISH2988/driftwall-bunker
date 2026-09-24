import { addDays, startOfDay, todayKey } from "./utils";
import type { Difficulty, LanguageId, Problem, Status } from "./types";

export type PracticeStats = {
  total: number;
  solved: number;
  inProgress: number;
  todo: number;
  revisited: number;
  totalMinutes: number;
  weekCount: number;
  weekGoal: number;
  streak: number;
  completionRate: number;
  byLanguage: { id: LanguageId; label: string; count: number; solved: number }[];
  byDifficulty: { id: Difficulty; count: number; solved: number }[];
  byStatus: { id: Status; count: number }[];
  weekDays: { key: string; label: string; count: number; minutes: number }[];
  heatmap: { key: string; count: number }[];
  topicCounts: { topic: string; count: number }[];
  avgMinutesByDifficulty: { id: Difficulty; minutes: number }[];
};

const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function activityKey(problem: Problem) {
  return todayKey(new Date(problem.solvedAt ?? problem.updatedAt ?? problem.createdAt));
}

function weekStart(date: Date) {
  const start = startOfDay(date);
  const day = start.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  return addDays(start, mondayOffset);
}

export function computeStats(problems: Problem[], now = new Date()): PracticeStats {
  const total = problems.length;
  const solved = problems.filter((p) => p.status === "solved" || p.status === "revisited").length;
  const inProgress = problems.filter((p) => p.status === "in-progress").length;
  const todo = problems.filter((p) => p.status === "todo").length;
  const revisited = problems.filter((p) => p.status === "revisited").length;
  const totalMinutes = problems.reduce((sum, p) => sum + p.timeSpentMin, 0);

  const start = weekStart(now);
  const weekCount = problems.filter((p) => new Date(p.createdAt) >= start).length;

  const daySet = new Set(problems.map(activityKey));
  let streak = 0;
  let cursor = startOfDay(now);
  if (!daySet.has(todayKey(cursor))) {
    cursor = addDays(cursor, -1);
  }
  while (daySet.has(todayKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  const languageMap = new Map<LanguageId, { count: number; solved: number }>();
  const difficultyMap = new Map<Difficulty, { count: number; solved: number; minutes: number }>();
  const statusMap = new Map<Status, number>();
  const topicMap = new Map<string, number>();

  for (const problem of problems) {
    const lang = languageMap.get(problem.language) ?? { count: 0, solved: 0 };
    lang.count += 1;
    if (problem.status === "solved" || problem.status === "revisited") lang.solved += 1;
    languageMap.set(problem.language, lang);

    const diff = difficultyMap.get(problem.difficulty) ?? { count: 0, solved: 0, minutes: 0 };
    diff.count += 1;
    diff.minutes += problem.timeSpentMin;
    if (problem.status === "solved" || problem.status === "revisited") diff.solved += 1;
    difficultyMap.set(problem.difficulty, diff);

    statusMap.set(problem.status, (statusMap.get(problem.status) ?? 0) + 1);

    for (const topic of problem.topics) {
      topicMap.set(topic, (topicMap.get(topic) ?? 0) + 1);
    }
  }

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(start, i);
    const key = todayKey(date);
    const ofDay = problems.filter((p) => todayKey(new Date(p.createdAt)) === key);
    return {
      key,
      label: WEEKDAY[date.getDay()] ?? "",
      count: ofDay.length,
      minutes: ofDay.reduce((sum, p) => sum + p.timeSpentMin, 0),
    };
  });

  const heatmapStart = addDays(startOfDay(now), -12 * 7 + (7 - ((now.getDay() + 6) % 7)) - 6);
  const countByDay = new Map<string, number>();
  for (const problem of problems) {
    const key = activityKey(problem);
    countByDay.set(key, (countByDay.get(key) ?? 0) + 1);
  }
  const heatmap: { key: string; count: number }[] = [];
  for (let i = 0; i < 12 * 7; i++) {
    const date = addDays(heatmapStart, i);
    const key = todayKey(date);
    heatmap.push({ key, count: countByDay.get(key) ?? 0 });
  }

  return {
    total,
    solved,
    inProgress,
    todo,
    revisited,
    totalMinutes,
    weekCount,
    weekGoal: 5,
    streak,
    completionRate: total ? Math.round((solved / total) * 100) : 0,
    byLanguage: [...languageMap.entries()]
      .map(([id, v]) => ({
        id,
        label:
          id === "html-css"
            ? "HTML & CSS"
            : id === "cpp"
              ? "C++"
              : id.charAt(0).toUpperCase() + id.slice(1),
        ...v,
      }))
      .sort((a, b) => b.count - a.count),
    byDifficulty: (["easy", "medium", "hard"] as Difficulty[]).map((id) => ({
      id,
      count: difficultyMap.get(id)?.count ?? 0,
      solved: difficultyMap.get(id)?.solved ?? 0,
    })),
    byStatus: (["todo", "in-progress", "solved", "revisited"] as Status[]).map((id) => ({
      id,
      count: statusMap.get(id) ?? 0,
    })),
    weekDays,
    heatmap,
    topicCounts: [...topicMap.entries()]
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12),
    avgMinutesByDifficulty: (["easy", "medium", "hard"] as Difficulty[]).map((id) => {
      const row = difficultyMap.get(id);
      return {
        id,
        minutes: row && row.count ? Math.round(row.minutes / row.count) : 0,
      };
    }),
  };
}
