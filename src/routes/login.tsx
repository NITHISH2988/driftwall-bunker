import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight, Flame, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { authEnabled, GROK_PROVIDERS, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [busy, setBusy] = useState<string | null>(null);
  useEffect(() => { if (!isPending && user) void navigate({ to: "/", replace: true }); }, [isPending, navigate, user]);

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-brand"><span className="login-mark"><Flame className="size-5" /></span><span>Hearth</span></div>
        <p className="login-eyebrow">Your practice, with a pulse</p>
        <h1>Small steps.<br /><em>Serious momentum.</em></h1>
        <p className="login-copy">A calm, private home for the problems you solve, the ideas you revisit, and the progress you can actually see.</p>
        <div className="login-benefits">
          <div><ShieldCheck /><span>Your log is private to your account</span></div>
          <div><ArrowUpRight /><span>Pick up where you left off on any device</span></div>
        </div>
        {authEnabled ? (
          <div className="login-actions">
            {GROK_PROVIDERS.map((provider) => (
              <Button key={provider.providerId} className="login-provider" disabled={busy !== null} onClick={() => {
                setBusy(provider.providerId);
                void signIn(provider.providerId, { callbackURL: "/" }).catch((error: unknown) => {
                  toast.error(error instanceof Error ? error.message : "Could not start sign-in.");
                  setBusy(null);
                });
              }}>{busy === provider.providerId ? "Connecting…" : `Continue with ${provider.label}`}</Button>
            ))}
          </div>
        ) : (
          <div className="login-actions"><p className="text-sm text-muted">Google sign-in needs this deployment connected to a Supabase project.</p></div>
        )}
        <p className="login-terms">Secure sign-in · Your notes stay yours</p>
        <Link to="/privacy" className="login-privacy">Privacy</Link>
        <Link to="/" className="login-back">Back to Hearth</Link>
      </section>
      <aside className="login-art" aria-label="Study practice overview">
        <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
        <div className="art-spark spark-one" /><div className="art-spark spark-two" />
        <div className="art-note"><span className="art-note-tag">TODAY’S PRACTICE</span><strong>Make the next<br />problem count.</strong><span className="art-note-rule" /><div className="art-note-meta"><span>◌ &nbsp; 4 week streak</span><span>06 / 10</span></div><div className="art-progress"><span /></div></div>
        <p className="art-caption">The work adds up.</p>
      </aside>
    </main>
  );
}
