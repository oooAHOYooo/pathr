-- Pathr API (Render Postgres) schema
-- Run this against your Render Postgres database (optional; the API also bootstraps this schema on boot).

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  started_at timestamptz NOT NULL,
  ended_at timestamptz NOT NULL,
  duration_ms integer NOT NULL,
  distance_miles double precision NOT NULL,
  start_label text NOT NULL DEFAULT '',
  end_label text NOT NULL DEFAULT '',
  path jsonb NOT NULL DEFAULT '[]'::jsonb,
  details jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS trips_user_started_idx ON trips(user_id, started_at DESC);

-- TODO: follows/friends graph for activity feed
-- TODO: public profile pages
-- TODO: heatmap overlays (PostGIS + aggregation)

