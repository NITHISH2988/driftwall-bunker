# Hearth

Hearth is a private coding-practice journal. Log problems, track status and focus time, revisit notes, and review your practice patterns.

## Run locally

Install the dependencies with `npm install`, then start the app with `npm run dev`. The development database uses an embedded PostgreSQL-compatible store. It is intended for preview; its data is reset when the local server process restarts.

## Backend and deployment

The app uses authenticated server functions for problem reads and writes. Every query is scoped to the signed-in account. The included SQL migration creates the practice-log table and enables account-level row security in Supabase.

Google sign-in uses Supabase Auth. Configure `DATABASE_URL`, `VITE_SUPABASE_URL`, and `VITE_SUPABASE_ANON_KEY` in the deployment environment. In Supabase Auth, enable Google and allow the site's HTTPS origin as a redirect URL. Add the Supabase Auth callback URL shown in its Google provider settings to the Google OAuth client's authorized redirect URIs. Keep the Google client secret in Supabase; it does not belong in the source code or browser environment.

## Data notes

The first account receives a starter set of sample coding logs when its server-side log is empty. Each account has its own database rows and its own browser cache. The sample set can be edited or removed in the app.
