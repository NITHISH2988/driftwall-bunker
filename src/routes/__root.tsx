import { createRootRoute, HeadContent, Outlet, Scripts, useRouterState } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { AppShell } from "@/components/layout/app-shell";
import { StoreHydration } from "@/components/layout/store-hydration";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { Skeleton } from "@/components/ui/skeleton";
import appCss from "../styles.css?url";

const APP_NAME = "Hearth";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      { name: "theme-color", content: "#130e0b" },
      {
        name: "description",
        content: "Log coding problems, languages, difficulty, and completion — keep the fire going.",
      },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Outfit:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  component: RootDocument,
});

function RootDocument() {
  return (
    <html lang="en" suppressHydrationWarning className="antialiased">
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <TooltipProvider delayDuration={200}>
            <div id="app-root"><ProtectedApp /></div>
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}

function ProtectedApp() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { user, isPending } = useCurrentUserState();
  // The sign-in page must remain reachable while all study data stays private.
  const isLogin = pathname === "/login";
  if (isPending && !isLogin) {
    return <div className="mx-auto grid min-h-dvh max-w-6xl content-start gap-5 px-6 py-10"><Skeleton className="h-10 w-48" /><Skeleton className="h-52" /><Skeleton className="h-48" /></div>;
  }
  if (!user && !isLogin) return <RedirectToSignIn />;
  if (isLogin) return <Outlet />;
  return <StoreHydration><AppShell><Outlet /></AppShell></StoreHydration>;
}
