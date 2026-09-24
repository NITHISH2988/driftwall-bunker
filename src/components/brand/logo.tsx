import { cn } from "@/lib/utils";

export function HearthMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("text-ember", className)}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 22.5c0-1.8 3.4-3 8-3s8 1.2 8 3c0 2.2-3.4 3.8-8 3.8s-8-1.6-8-3.8Z"
        fill="currentColor"
        opacity="0.35"
      />
      <path
        d="M16 6.5c1.4 3.2-1.2 4.6.2 8.2 2.8-1.8 4.8-5.2 3.2-8.6 3.4 2.4 5.6 6 5.6 9.6 0 4.4-3.8 7.4-9 7.4s-9-3-9-7.4c0-4.2 3.6-8 9-9.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function HearthWordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-md bg-surface-2 shadow-border">
        <HearthMark className="size-5" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-medium tracking-tight text-fg">Hearth</span>
        {!compact ? (
          <span className="mt-0.5 text-[11px] tracking-wide text-subtle">Practice tracker</span>
        ) : null}
      </span>
    </span>
  );
}
