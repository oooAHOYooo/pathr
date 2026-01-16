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
  userId: z.string().uuid(),
  trip: z.object({
    id: z.string().uuid().optional(),
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
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);
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
    // Username-only MVP: create or fetch existing.
    const rows = await query<{ id: string; username: string }>(
      `
        INSERT INTO users (username)
        VALUES ($1)
        ON CONFLICT (username) DO UPDATE SET username = EXCLUDED.username
        RETURNING id::text AS id, username;
      `,
      [username]
    );
    const user = rows[0];
    return res.json({ userId: user.id, username: user.username });
  } catch (err: any) {
    const msg = err?.issues ? "Invalid signup payload" : err?.message ?? "Signup failed";
    return res.status(400).json({ error: msg });
  }
});

app.get("/v1/trips", async (req, res) => {
  try {
    const userId = z.string().uuid().parse(req.query.userId);
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
      [userId]
    );
    return res.json({ trips: rows });
  } catch (err: any) {
    return res.status(400).json({ error: err?.message ?? "Invalid request" });
  }
});

app.post("/v1/trips", async (req, res) => {
  try {
    const { userId, trip } = TripBody.parse(req.body);

    // Ensure user exists (simple foreign key requirement).
    await query(`INSERT INTO users (id, username) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING;`, [userId, `u_${userId.slice(0, 8)}`]);

    const rows = await query<{ id: string }>(
      `
        INSERT INTO trips (
          id, user_id, started_at, ended_at, duration_ms, distance_miles, start_label, end_label, path, details
        )
        VALUES (
          COALESCE($1::uuid, gen_random_uuid()),
          $2::uuid,
          $3::timestamptz,
          $4::timestamptz,
          $5::integer,
          $6::double precision,
          $7::text,
          $8::text,
          $9::jsonb,
          $10::jsonb
        )
        RETURNING id::text AS id;
      `,
      [
        trip.id ?? null,
        userId,
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

