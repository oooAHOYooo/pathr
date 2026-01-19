import express from "express";
import cors from "cors";
import { Pool } from "pg";
import { z } from "zod";

const PORT = Number(process.env.PORT ?? 3001);
const DATABASE_URL = process.env.DATABASE_URL;
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? "*";

if (!DATABASE_URL) {
  // Render will inject DATABASE_URL when wired to a Render Postgres instance.
  // For local dev, set DATABASE_URL in your shell or .env tooling.
  throw new Error("Missing DATABASE_URL");
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  // Render Postgres requires SSL in many configurations.
  // Locally you can set PGSSLMODE=disable or run without SSL as needed.
  ssl: process.env.PGSSLMODE === "disable" ? false : ({ rejectUnauthorized: false } as any)
});

const UsernameSchema = z
  .string()
  .trim()
  .min(3)
  .max(20)
  .regex(/^[a-z0-9_]+$/);

const SignupBody = z.object({
  username: UsernameSchema
});

const TripBody = z.object({
  trip: z.object({
    // Server will generate an id. (Client ids are local-only for now.)
    startedAt: z.string(),
    endedAt: z.string(),
    durationMs: z.number().int().nonnegative(),
    distanceMiles: z.number().nonnegative(),
    startLabel: z.string().default(""),
    endLabel: z.string().default(""),
    // Path is an array of [lat, lng] pairs.
    path: z.array(z.tuple([z.number(), z.number()])).default([]),
    // Optional "details" from the finish sheet, etc.
    details: z.record(z.any()).optional()
  })
});

async function query<T = any>(text: string, params?: any[]) {
  const res = await pool.query(text, params);
  return res.rows as T[];
}

async function ensureSchema() {
  // Keep schema bootstrap tiny; for production we should migrate using SQL files.
  await query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      username text UNIQUE NOT NULL,
      auth_token text UNIQUE NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);
  // If the table already existed before auth_token was added, backfill it.
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_token text;`);
  await query(`UPDATE users SET auth_token = encode(gen_random_bytes(24), 'hex') WHERE auth_token IS NULL;`);
  await query(`ALTER TABLE users ALTER COLUMN auth_token SET NOT NULL;`);
  await query(`CREATE UNIQUE INDEX IF NOT EXISTS users_auth_token_idx ON users(auth_token);`);
  await query(`
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
  `);
  await query(`CREATE INDEX IF NOT EXISTS trips_user_started_idx ON trips(user_id, started_at DESC);`);
}

function getBearerToken(req: express.Request): string | null {
  const h = req.header("authorization") ?? req.header("Authorization");
  if (!h) return null;
  const m = /^Bearer\s+(.+)$/.exec(h);
  return m?.[1]?.trim() ?? null;
}

async function requireUser(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    const token = getBearerToken(req);
    if (!token) return res.status(401).json({ error: "Missing Authorization bearer token" });
    const rows = await query<{ id: string; username: string }>(
      `SELECT id::text AS id, username FROM users WHERE auth_token = $1 LIMIT 1;`,
      [token]
    );
    const user = rows[0];
    if (!user) return res.status(401).json({ error: "Invalid token" });
    (req as any).user = { userId: user.id, username: user.username, token };
    return next();
  } catch (err: any) {
    return res.status(500).json({ error: err?.message ?? "Auth failed" });
  }
}

function parseOrigin(origin: string) {
  if (origin === "*") return true;
  const allowed = origin.split(",").map((s) => s.trim()).filter(Boolean);
  return allowed;
}

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
app.use(
  cors({
    origin: parseOrigin(CORS_ORIGIN),
    credentials: false
  })
);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.post("/v1/signup", async (req, res) => {
  try {
    const body = SignupBody.parse(req.body);
    const username = body.username.toLowerCase();
    // Username-only MVP:
    // - create user if new
    // - if username already exists, treat as "login" (returns the same token)
    const rows = await query<{ id: string; username: string; token: string }>(
      `
        INSERT INTO users (username, auth_token)
        VALUES ($1, encode(gen_random_bytes(24), 'hex'))
        ON CONFLICT (username) DO UPDATE SET username = EXCLUDED.username
        RETURNING id::text AS id, username, auth_token AS token;
      `,
      [username]
    );
    const user = rows[0];
    return res.json({ userId: user.id, username: user.username, token: user.token });
  } catch (err: any) {
    const msg = err?.issues ? "Invalid signup payload" : err?.message ?? "Signup failed";
    return res.status(400).json({ error: msg });
  }
});

app.get("/v1/me", requireUser, async (req, res) => {
  const user = (req as any).user as { userId: string; username: string };
  return res.json({ userId: user.userId, username: user.username });
});

app.get("/v1/trips", requireUser, async (req, res) => {
  try {
    const user = (req as any).user as { userId: string };
    const rows = await query(
      `
        SELECT
          id::text AS id,
          user_id::text AS "userId",
          started_at AS "startedAt",
          ended_at AS "endedAt",
          duration_ms AS "durationMs",
          distance_miles AS "distanceMiles",
          start_label AS "startLabel",
          end_label AS "endLabel",
          path,
          details
        FROM trips
        WHERE user_id = $1
        ORDER BY started_at DESC
        LIMIT 200;
      `,
      [user.userId]
    );
    return res.json({ trips: rows });
  } catch (err: any) {
    return res.status(400).json({ error: err?.message ?? "Invalid request" });
  }
});

app.post("/v1/trips", requireUser, async (req, res) => {
  try {
    const { trip } = TripBody.parse(req.body);
    const user = (req as any).user as { userId: string };

    const rows = await query<{ id: string }>(
      `
        INSERT INTO trips (
          user_id, started_at, ended_at, duration_ms, distance_miles, start_label, end_label, path, details
        )
        VALUES (
          $1::uuid,
          $2::timestamptz,
          $3::timestamptz,
          $4::integer,
          $5::double precision,
          $6::text,
          $7::text,
          $8::jsonb,
          $9::jsonb
        )
        RETURNING id::text AS id;
      `,
      [
        user.userId,
        trip.startedAt,
        trip.endedAt,
        trip.durationMs,
        trip.distanceMiles,
        trip.startLabel ?? "",
        trip.endLabel ?? "",
        JSON.stringify(trip.path ?? []),
        trip.details ? JSON.stringify(trip.details) : null
      ]
    );

    return res.json({ ok: true, tripId: rows[0]?.id });
  } catch (err: any) {
    const msg = err?.issues ? "Invalid trip payload" : err?.message ?? "Trip save failed";
    return res.status(400).json({ error: msg });
  }
});

app.get("/v1/stats", requireUser, async (req, res) => {
  try {
    const user = (req as any).user as { userId: string };
    const rows = await query<{
      total_trips: string;
      total_miles: string | null;
      total_duration_ms: string | null;
      last7_trips: string;
      last7_miles: string | null;
      last7_duration_ms: string | null;
    }>(
      `
        SELECT
          COUNT(*)::text AS total_trips,
          COALESCE(SUM(distance_miles), 0)::text AS total_miles,
          COALESCE(SUM(duration_ms), 0)::text AS total_duration_ms,
          COALESCE(SUM(CASE WHEN started_at >= (now() - interval '7 days') THEN 1 ELSE 0 END), 0)::text AS last7_trips,
          COALESCE(SUM(CASE WHEN started_at >= (now() - interval '7 days') THEN distance_miles ELSE 0 END), 0)::text AS last7_miles,
          COALESCE(SUM(CASE WHEN started_at >= (now() - interval '7 days') THEN duration_ms ELSE 0 END), 0)::text AS last7_duration_ms
        FROM trips
        WHERE user_id = $1;
      `,
      [user.userId]
    );
    const r = rows[0];
    return res.json({
      totalTrips: Number(r?.total_trips ?? 0),
      totalMiles: Number(r?.total_miles ?? 0),
      totalDurationMs: Number(r?.total_duration_ms ?? 0),
      last7dTrips: Number(r?.last7_trips ?? 0),
      last7dMiles: Number(r?.last7_miles ?? 0),
      last7dDurationMs: Number(r?.last7_duration_ms ?? 0)
    });
  } catch (err: any) {
    return res.status(400).json({ error: err?.message ?? "Stats failed" });
  }
});

// TODO: auth sessions (email/password upgrade)
// TODO: friends/follows + feed endpoints
// TODO: heatmap aggregation endpoints

async function main() {
  await ensureSchema();
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`[pathr-api] listening on :${PORT}`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

