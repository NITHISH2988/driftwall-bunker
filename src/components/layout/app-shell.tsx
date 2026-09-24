import { Link, useRouterState } from "@tanstack/react-router";
import { BarChart3, BookOpen, Flame, PenLine } from "lucide-react";
import { HearthWordmark } from "@/components/brand/logo";
import { UserButton } from "@/lib/auth/gates";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Desk", icon: Flame },
  { to: "/log", label: "Log", icon: PenLine },
  { to: "/problems", label: "Problems", icon: BookOpen },
  { to: "/insights", label: "Insights", icon: BarChart3 },
] as const;

function isActive(pathname: string, to: string) {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(`${to}/`);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="hidden border-r border-border bg-elevated/80 lg:flex lg:flex-col lg:px-5 lg:py-6">
        <Link to="/" className="px-1">
          <HearthWordmark />
        </Link>
        <nav className="mt-10 flex flex-col gap-1">
          {NAV.map((item) => {
            const active = isActive(pathname, item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors duration-150",
                  active
                    ? "bg-surface-2 text-fg shadow-border"
                    : "text-muted hover:bg-surface/80 hover:text-fg",
                )}
              >
                <Icon className={cn("size-4", active ? "text-ember" : "text-subtle")} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto space-y-5"><p className="px-3 text-xs leading-relaxed text-subtle">Log the work. Watch the streak. Keep the fire going.</p><div className="border-t border-border pt-4"><UserButton /></div></div>
      </aside>

      <div className="flex min-h-dvh flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-bg/85 px-4 py-3 backdrop-blur-md lg:hidden">
          <Link to="/"><HearthWordmark compact /></Link>
          <UserButton />
        </header>

        <main className="flex-1 px-4 pt-6 pb-24 lg:px-10 lg:pt-10 lg:pb-12">{children}</main>

        <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-border bg-elevated/95 px-1 pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-1 backdrop-blur-md lg:hidden">
          {NAV.map((item) => {
            const active = isActive(pathname, item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex min-h-12 flex-col items-center justify-center gap-1 rounded-md text-[11px] font-medium",
                  active ? "text-ember" : "text-subtle",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
