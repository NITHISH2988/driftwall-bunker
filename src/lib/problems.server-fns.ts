import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/supabase-middleware";
import { createProblemsDb } from "@/lib/problems-db.server";
import { DIFFICULTIES, LANGUAGES, STATUSES } from "@/lib/types";
import type { Problem } from "@/lib/types";

const problemSchema = z.object({
  id: z.string().min(1).max(80),
  title: z.string().trim().min(3).max(120),
  platform: z.string().trim().min(1).max(80),
  url: z.string().max(2048).refine((value) => value === "" || /^https?:\/\/\S+\.\S+/.test(value)),
  language: z.enum(LANGUAGES.map((item) => item.id) as [string, ...string[]]),
  difficulty: z.enum([...DIFFICULTIES] as [string, ...string[]]),
  status: z.enum([...STATUSES] as [string, ...string[]]),
  topics: z.array(z.string().trim().min(1).max(60)).max(8),
  notes: z.string().max(2000),
  timeSpentMin: z.number().int().min(0).max(1440),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  solvedAt: z.string().datetime().optional(),
});

export const listProblems = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const db = createProblemsDb(context.accessToken);
    if (db) {
      const { data, error } = await db
        .from("practice_problems")
        .select("id,title,platform,url,language,difficulty,status,topics,notes,time_spent_min,created_at,updated_at,solved_at")
        .eq("user_id", context.userId)
        .order("updated_at", { ascending: false });
      if (error) throw new Error(`Could not load practice log: ${error.message}`);
      return (data ?? []).map((row): Problem => ({
        id: row.id, title: row.title, platform: row.platform, url: row.url,
        language: row.language as Problem["language"], difficulty: row.difficulty as Problem["difficulty"], status: row.status as Problem["status"],
        topics: row.topics, notes: row.notes, timeSpentMin: row.time_spent_min,
        createdAt: new Date(row.created_at).toISOString(),
        updatedAt: new Date(row.updated_at).toISOString(),
        solvedAt: row.solved_at ? new Date(row.solved_at).toISOString() : undefined,
      }));
    }
    const sql = await getSql();
    const rows = await sql<{
      id: string; title: string; platform: string; url: string; language: string;
      difficulty: string; status: string; topics: string[]; notes: string;
      time_spent_min: number; created_at: string; updated_at: string; solved_at: string | null;
    }>`select id, title, platform, url, language, difficulty, status, topics, notes,
        time_spent_min, created_at, updated_at, solved_at
      from practice_problems where user_id = ${context.userId}
      order by updated_at desc`;
    return rows.map((row): Problem => ({
      id: row.id, title: row.title, platform: row.platform, url: row.url,
      language: row.language as Problem["language"], difficulty: row.difficulty as Problem["difficulty"], status: row.status as Problem["status"],
      topics: row.topics, notes: row.notes, timeSpentMin: row.time_spent_min,
      createdAt: new Date(row.created_at).toISOString(),
      updatedAt: new Date(row.updated_at).toISOString(),
      solvedAt: row.solved_at ? new Date(row.solved_at).toISOString() : undefined,
    }));
  });

export const saveProblem = createServerFn({ method: "POST" })
  .validator((input: unknown) => problemSchema.parse(input))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const db = createProblemsDb(context.accessToken);
    if (db) {
      const { error } = await db.from("practice_problems").upsert({
        id: data.id, user_id: context.userId, title: data.title,
        platform: data.platform, url: data.url, language: data.language,
        difficulty: data.difficulty, status: data.status, topics: data.topics,
        notes: data.notes, time_spent_min: data.timeSpentMin,
        created_at: data.createdAt, updated_at: data.updatedAt,
        solved_at: data.solvedAt ?? null,
      }, { onConflict: "id" });
      if (error) throw new Error(`Could not save practice log: ${error.message}`);
      return { saved: true };
    }
    const sql = await getSql();
    await sql`insert into practice_problems
      (id, user_id, title, platform, url, language, difficulty, status, topics, notes,
       time_spent_min, created_at, updated_at, solved_at)
      values (${data.id}, ${context.userId}, ${data.title}, ${data.platform}, ${data.url},
       ${data.language}, ${data.difficulty}, ${data.status}, ${JSON.stringify(data.topics)}::jsonb,
       ${data.notes}, ${data.timeSpentMin}, ${data.createdAt}, ${data.updatedAt}, ${data.solvedAt ?? null})
      on conflict (id) do update set title = excluded.title, platform = excluded.platform,
       url = excluded.url, language = excluded.language, difficulty = excluded.difficulty,
       status = excluded.status, topics = excluded.topics, notes = excluded.notes,
       time_spent_min = excluded.time_spent_min, updated_at = excluded.updated_at,
       solved_at = excluded.solved_at
      where practice_problems.user_id = ${context.userId}`;
    return { saved: true };
  });

export const deleteProblem = createServerFn({ method: "POST" })
  .validator((id: string) => z.string().min(1).max(80).parse(id))
  .middleware([authMiddleware])
  .handler(async ({ context, data: id }) => {
    const db = createProblemsDb(context.accessToken);
    if (db) {
      const { error } = await db.from("practice_problems").delete()
        .eq("id", id).eq("user_id", context.userId);
      if (error) throw new Error(`Could not delete practice log: ${error.message}`);
      return { deleted: true };
    }
    const sql = await getSql();
    await sql`delete from practice_problems where id = ${id} and user_id = ${context.userId}`;
    return { deleted: true };
  });
