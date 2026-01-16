# 🚀 Deploying Pathr to Render (Vite Web + Render Postgres + Tiny API)

This repo supports a **Render-native** persistence setup:
- **Frontend**: `apps/pathr-web` (Vite static site)
- **Backend**: `apps/api` (Node web service)
- **Database**: Render Postgres

## Option A (recommended): Use `render.yaml` blueprint

1. In Render, click **New → Blueprint**
2. Point it at this repo and keep `render.yaml` in the root
3. Render will create:
   - `pathr-web` (static)
   - `pathr-api` (node web service)
   - `pathr-db` (postgres)

## What gets stored
- **Users**: `username` + generated `userId` (UUID)
- **Trips**: per-user trip rows including path points (stored as JSON for MVP)

## Environment variables

### `pathr-api`
- `DATABASE_URL` (wired automatically from `pathr-db`)
- `CORS_ORIGIN` (defaults to `*` for MVP; tighten later)

### `pathr-web`
- `VITE_API_URL` (points to the API base URL)

## Notes
- The API will bootstrap its schema on boot (and `apps/api/sql/001_init.sql` exists if you prefer manual migrations).
- TODO: move to real migrations + add auth sessions later.
