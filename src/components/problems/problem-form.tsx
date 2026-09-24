import { useEffect, useMemo, useState } from "react";
import { Pause, Play, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  emptyProblemForm,
  parseTopics,
  problemFormSchema,
  type ProblemFormValues,
} from "@/lib/validation";
import {
  DIFFICULTIES,
  DIFFICULTY_LABEL,
  LANGUAGES,
  PLATFORMS,
  STATUSES,
  STATUS_LABEL,
  type Problem,
} from "@/lib/types";

function problemToForm(problem: Problem): ProblemFormValues {
  return {
    title: problem.title,
    platform: problem.platform,
    url: problem.url,
    language: problem.language,
    difficulty: problem.difficulty,
    status: problem.status,
    topicsText: problem.topics.join(", "),
    notes: problem.notes,
    timeSpentMin: problem.timeSpentMin,
  };
}

type FieldErrors = Partial<Record<keyof ProblemFormValues, string>>;

function validate(values: ProblemFormValues): FieldErrors {
  const result = problemFormSchema.safeParse(values);
  if (result.success) return {};
  const errors: FieldErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !(key in errors)) {
      errors[key as keyof ProblemFormValues] = issue.message;
    }
  }
  return errors;
}

export function ProblemForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: Problem;
  submitLabel: string;
  onSubmit: (values: ProblemFormValues, topics: string[]) => void;
  onCancel?: () => void;
}) {
  const [values, setValues] = useState<ProblemFormValues>(
    initial ? problemToForm(initial) : emptyProblemForm(),
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ProblemFormValues, boolean>>>({});
  const [topicDraft, setTopicDraft] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [running]);

  const topics = useMemo(
    () => parseTopics([values.topicsText, topicDraft].filter(Boolean).join(",")),
    [values.topicsText, topicDraft],
  );

  function setField<K extends keyof ProblemFormValues>(key: K, value: ProblemFormValues[K]) {
    setValues((prev) => {
      const next = { ...prev, [key]: value };
      if (touched[key]) {
        const nextErrors = validate(next);
        setErrors((prevErrors) => ({ ...prevErrors, [key]: nextErrors[key] }));
      }
      return next;
    });
  }

  function blur(key: keyof ProblemFormValues) {
    setTouched((prev) => ({ ...prev, [key]: true }));
    const nextErrors = validate(values);
    setErrors((prev) => ({ ...prev, [key]: nextErrors[key] }));
  }

  function addTopic() {
    const next = parseTopics(`${values.topicsText},${topicDraft}`);
    setValues((prev) => ({ ...prev, topicsText: next.join(", ") }));
    setTopicDraft("");
  }

  function removeTopic(topic: string) {
    const next = parseTopics(values.topicsText).filter((t) => t !== topic);
    setValues((prev) => ({ ...prev, topicsText: next.join(", ") }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const withTimer =
      values.timeSpentMin === 0 && seconds > 0
        ? { ...values, timeSpentMin: Math.max(1, Math.ceil(seconds / 60)) }
        : values;
    const nextErrors = validate(withTimer);
    setErrors(nextErrors);
    setTouched({
      title: true,
      platform: true,
      url: true,
      language: true,
      difficulty: true,
      status: true,
      topicsText: true,
      notes: true,
      timeSpentMin: true,
    });
    if (Object.keys(nextErrors).length) return;
    onSubmit(withTimer, parseTopics(withTimer.topicsText));
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <Field label="Problem title" htmlFor="title" error={touched.title ? errors.title : undefined}>
        <Input
          id="title"
          name="title"
          value={values.title}
          placeholder="Two Sum, REST notes API…"
          onChange={(e) => setField("title", e.target.value)}
          onBlur={() => blur("title")}
          aria-invalid={Boolean(touched.title && errors.title)}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Platform" htmlFor="platform" error={touched.platform ? errors.platform : undefined}>
          <Select value={values.platform} onValueChange={(v) => setField("platform", v)}>
            <SelectTrigger id="platform" className="w-full">
              <SelectValue placeholder="Choose a platform" />
            </SelectTrigger>
            <SelectContent>
              {PLATFORMS.map((platform) => (
                <SelectItem key={platform} value={platform}>
                  {platform}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Language" htmlFor="language" error={touched.language ? errors.language : undefined}>
          <Select value={values.language} onValueChange={(v) => setField("language", v)}>
            <SelectTrigger id="language" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((language) => (
                <SelectItem key={language.id} value={language.id}>
                  {language.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field
        label="Problem URL"
        htmlFor="url"
        hint="Optional"
        error={touched.url ? errors.url : undefined}
      >
        <Input
          id="url"
          name="url"
          type="url"
          inputMode="url"
          placeholder="https://leetcode.com/problems/…"
          value={values.url}
          onChange={(e) => setField("url", e.target.value)}
          onBlur={() => blur("url")}
        />
      </Field>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-muted">Difficulty</legend>
        <div className="grid grid-cols-3 gap-2">
          {DIFFICULTIES.map((diff) => (
            <button
              key={diff}
              type="button"
              onClick={() => setField("difficulty", diff)}
              className={cn(
                "h-11 rounded-md text-sm font-medium shadow-border transition-colors duration-150",
                values.difficulty === diff
                  ? diff === "easy"
                    ? "bg-sage/20 text-sage"
                    : diff === "medium"
                      ? "bg-primary/20 text-ember"
                      : "bg-danger/20 text-danger"
                  : "bg-elevated text-muted hover:text-fg",
              )}
            >
              {DIFFICULTY_LABEL[diff]}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-muted">Status</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {STATUSES.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setField("status", status)}
              className={cn(
                "h-11 rounded-md px-2 text-sm font-medium shadow-border transition-colors duration-150",
                values.status === status ? "bg-primary/20 text-ember" : "bg-elevated text-muted hover:text-fg",
              )}
            >
              {STATUS_LABEL[status]}
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <Label htmlFor="topics">Topics</Label>
        <div className="mt-2 flex gap-2">
          <Input
            id="topics"
            value={topicDraft}
            placeholder="arrays, hashing — press Enter"
            onChange={(e) => setTopicDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addTopic();
              }
            }}
            onBlur={() => {
              if (topicDraft.trim()) addTopic();
            }}
          />
        </div>
        {topics.length ? (
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {topics.map((topic) => (
              <li key={topic}>
                <button
                  type="button"
                  onClick={() => removeTopic(topic)}
                  className="inline-flex h-8 items-center gap-1 rounded-full bg-surface-2 px-2.5 text-xs text-muted hover:text-fg"
                >
                  {topic}
                  <X className="size-3" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-xs text-subtle">Up to eight topics. Comma or Enter to add.</p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-[1fr_auto]">
        <Field
          label="Time spent (minutes)"
          htmlFor="time"
          error={touched.timeSpentMin ? errors.timeSpentMin : undefined}
        >
          <Input
            id="time"
            name="timeSpentMin"
            type="number"
            min={0}
            max={1440}
            value={values.timeSpentMin}
            onChange={(e) => setField("timeSpentMin", Number(e.target.value))}
            onBlur={() => blur("timeSpentMin")}
          />
        </Field>
        <div>
          <p className="mb-2 text-sm font-medium text-muted">Session timer</p>
          <div className="flex h-11 items-center gap-2 rounded-md bg-elevated px-2 shadow-border">
            <span className="min-w-14 px-2 font-medium tabular-nums text-fg">
              {mm}:{ss}
            </span>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-9"
              onClick={() => setRunning((v) => !v)}
              aria-label={running ? "Pause timer" : "Start timer"}
            >
              {running ? <Pause /> : <Play />}
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-9"
              onClick={() => {
                setRunning(false);
                setSeconds(0);
              }}
              aria-label="Reset timer"
            >
              <RotateCcw />
            </Button>
          </div>
        </div>
      </div>

      <Field
        label="Notes"
        htmlFor="notes"
        hint="Optional"
        error={touched.notes ? errors.notes : undefined}
      >
        <Textarea
          id="notes"
          name="notes"
          value={values.notes}
          placeholder="What clicked. What to revisit."
          onChange={(e) => setField("notes", e.target.value)}
        />
      </Field>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor={htmlFor}>{label}</Label>
        {hint ? <span className="text-xs text-subtle">{hint}</span> : null}
      </div>
      {children}
      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  );
}
