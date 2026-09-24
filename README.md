# Hearth

Hearth is a private coding-practice journal. Log problems, track status and focus time, revisit notes, and review your practice patterns.

## Run locally

Install the dependencies with `npm install`, then start the app with `npm run dev`. The development database uses an embedded PostgreSQL-compatible store. It is intended for preview; its data is reset when the local server process restarts.

## Backend and deployment

The app uses authenticated server functions for problem reads and writes. Every query is scoped to the signed-in account. The included SQL migration creates the practice-log table and enables account-level row security in Supabase.

Google sign-in and persistent practice logs use Supabase. Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the deployment environment. Apply `migrations/0001_problems.sql` once in the Supabase SQL Editor; it creates the practice-log table and restricts each account to its own rows with row-level security. In Supabase Auth, enable Google and allow the site's HTTPS URLs as redirects. Add the callback URL shown in the Google provider settings to the Google OAuth client's authorized redirect URIs. Keep the Google client secret in Supabase; it does not belong in the source code or browser environment.

## Data notes

The first account receives a starter set of sample coding logs when its server-side log is empty. Each account has its own database rows and its own browser cache. The sample set can be edited or removed in the app.
