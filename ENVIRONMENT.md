# Environment and Deployment Guide

This document explains the exact environment variables, commands, and steps required to run the app locally and on Render. Use it as a checklist when changing env or deploying.

## Overview

- Stack: Next.js (App Router), NextAuth (Google), Prisma + Postgres, Tailwind.
- Local dev: runs on your machine, uses the EXTERNAL Postgres URL.
- Render prod: Web Service uses the INTERNAL Postgres URL, plus build/start commands that generate Prisma client and apply migrations.

## Environment Variables

Set locally in `.env.local` (for the app) and `.env` (for Prisma CLI), and in Render → Web Service → Settings → Environment.

Required:

- `GOOGLE_ID` — Google OAuth Client ID
- `GOOGLE_SECRET` — Google OAuth Client Secret
- `NEXTAUTH_SECRET` — Long random string (e.g., `openssl rand -base64 32`)
- `NEXTAUTH_URL` — Local: `http://localhost:3000` | Prod: your domain (e.g., `https://klymb.work`)
- `DATABASE_URL` — Postgres connection string

Database URL rules:

- Local (EXTERNAL URL):
  - `postgresql://USER:PASSWORD@HOST:PORT/DB?sslmode=require&schema=klymb`
  - Use the EXTERNAL Postgres URL from Render. Keep `sslmode=require`. Appends `&schema=klymb` to isolate our tables.
- Render (INTERNAL URL):
  - `postgresql://…internal…/DB?sslmode=require&schema=klymb`
  - Use the INTERNAL URL from the Postgres resource in Render. Appends `&schema=klymb`.

## Database Schema Setup (one-time)

Run in psql against your database (you already did this):

```
CREATE SCHEMA IF NOT EXISTS klymb;
GRANT USAGE, CREATE ON SCHEMA klymb TO "<db_user>";
-- Optional but handy:
ALTER ROLE "<db_user>" IN DATABASE "<db_name>" SET search_path = klymb, public;
```

Replace `<db_user>` and `<db_name>` with your values (e.g., `nextchapter_db_z713_user`, `nextchapter_db_z713`).

## Prisma

Local (project terminal):

```
npm install
npx prisma generate
npx prisma migrate dev --name init_user_settings
```

Render (automated via Start command):

- `npx prisma migrate deploy` runs on boot to apply pending migrations.

## Commands

Local:

- Start dev: `npm run dev` (http://localhost:3000)

Render Web Service:

- Build Command: `npm ci && npx prisma generate && npm run build`
- Start Command: `npx prisma migrate deploy && npm run start`

## Deployment Checklist

1) Update `.env.local` (local app) and `.env` (Prisma CLI) when env changes.
2) Mirror changes in Render → Web Service → Settings → Environment.
3) Confirm Build/Start commands (above) are set on Render.
4) Push to `main` (or PR → merge) to trigger deploy.
5) Verify:
   - Guest default US/en at `/`.
   - Flag selector changes cookies/URL and updates flag immediately.
   - Sign-in with a user having DB locale (e.g., DE/de) → page+flag auto-switch; URL = `/`.
   - Changing locale while signed-in → POST `/api/user/settings` 200; refresh remains localized.

## Troubleshooting

- 500 on POST `/api/user/settings`:
  - Cause: `DATABASE_URL` missing/wrong on Render, or migrations not applied.
  - Fix: Set INTERNAL `DATABASE_URL` with `&schema=klymb`. Ensure Start command runs `prisma migrate deploy`. Redeploy.

- Hydration mismatch in header (flag):
  - Cause: SSR default vs client locale differ.
  - Fix: Header now renders a placeholder before mount and updates after hydration. Expected placeholder on first paint.

- `useSearchParams()` CSR bailout warning:
  - Fix: Header is wrapped in `<Suspense fallback={null}>` in `src/app/layout.tsx`.

- Prisma `no-explicit-any` lints:
  - Fixes are in place (typed payload parsing, typed deep merge). Keep new code type-safe.

- NextAuth setup:
  - Ensure `NEXTAUTH_URL` and `NEXTAUTH_SECRET` are set in both envs.
  - Google OAuth redirect must include your prod URL: `https://<domain>/api/auth/callback/google`.

## Notes

- Guests: audience = query (?cc/lang) → cookies → default US/en.
- Signed-in: audience = DB (`UserSettings`) → query → cookies → default US/en.
- Header always mirrors DB locale to cookies on sign-in so the UI matches the server.

## Security

- `.env.local` / `.env` are gitignored; never commit secrets.
- Use Render’s INTERNAL DB URL in production; EXTERNAL URL only for local dev.
- Limit DB user permissions if sharing a database; prefer schema isolation (`klymb`).

