## Quickstart

- Install: `npm i`
- Configure env: copy `.env.example` to `.env.local` and fill values
- Run dev: `npm run dev` then open `http://localhost:3000`

## Local Environment

- Copy env: `cp .env.example .env.local`
- Set `NEXTAUTH_URL`: `http://localhost:3000` for local dev
- Generate `NEXTAUTH_SECRET`: `openssl rand -base64 32`
- Create Google OAuth credentials:
  - In Google Cloud Console, create OAuth Client (Web application)
  - Authorized redirect URI: `${NEXTAUTH_URL}/api/auth/callback/google` (e.g., `http://localhost:3000/api/auth/callback/google`)
  - Set `GOOGLE_ID` and `GOOGLE_SECRET` in `.env.local`
- Optional DB: set `DATABASE_URL` if using a database (e.g., Postgres)

Required env vars:

- `GOOGLE_ID`: Google OAuth Client ID
- `GOOGLE_SECRET`: Google OAuth Client Secret
- `NEXTAUTH_SECRET`: long random string for NextAuth
- `NEXTAUTH_URL`: public URL of the app (local or production)
- `DATABASE_URL`: database connection string (if using a DB)

## Deploy on Render

Create a new Web Service from this repository.

- Build command: `npm ci && npm run build`
- Start command: `npm run start`
- Environment: Node (18+ recommended)
- Set env vars in Render:
  - `GOOGLE_ID`
  - `GOOGLE_SECRET`
  - `NEXTAUTH_SECRET`
  - `NEXTAUTH_URL` = `https://<your-service>.onrender.com`
  - `DATABASE_URL` (if using a DB)
- In Google Cloud Console, add the production redirect URI:
  - `https://<your-service>.onrender.com/api/auth/callback/google`

After deploy, visit your Render URL to verify sign-in works.
