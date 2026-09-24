import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy | Hearth" },
      { name: "description", content: "How Hearth handles account and practice-log data." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <main className="policy-page">
      <article className="policy-card">
        <Link to="/login" className="policy-brand">Hearth</Link>
        <p className="policy-eyebrow">Last updated September 24, 2026</p>
        <h1>Privacy</h1>
        <p>Hearth is a private coding-practice journal. This page explains what information is used to provide the service.</p>

        <h2>Information you provide</h2>
        <p>When you sign in with Google, Hearth receives the account identifier and basic profile information needed to identify your account, such as your email address. Practice entries you create may include problem titles, links, programming languages, difficulty, status, topics, time spent, and notes.</p>

        <h2>How information is used</h2>
        <p>Hearth uses this information to authenticate you, save and display your practice log across sessions, and protect the service. Each account can access only its own practice entries.</p>

        <h2>Service providers</h2>
        <p>Google provides sign-in. Supabase provides authentication and database hosting, and Vercel hosts the website. These providers process information as needed to operate Hearth. Hearth does not sell personal information or use it for advertising.</p>

        <h2>Retention and deletion</h2>
        <p>Your practice entries remain in your account until you delete them. To request deletion of your account information, contact <a href="mailto:nithishsadineni@gmail.com">nithishsadineni@gmail.com</a>.</p>

        <h2>Contact</h2>
        <p>For privacy questions, contact <a href="mailto:nithishsadineni@gmail.com">nithishsadineni@gmail.com</a>.</p>

        <Link to="/login" className="policy-back">Back to Hearth</Link>
      </article>
    </main>
  );
}
