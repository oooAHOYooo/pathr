# CURSOR MEGA-PROMPT — Generate README Master Plan for “Pathr” (Strava for Driving)

You are Cursor acting as a senior mobile product engineer + tech lead.  
Create a **single, polished `README.md`** for a brand-new repo named **Pathr**.

## Product Vision (must match)
Pathr is “**Strava for driving**”: users can record trips/routes while driving (or riding), discover scenic routes, and review a personal map/history of places they’ve been.  
Design vibe: **“Liquid Glass”** (frosted glass, blur, soft gradients, glow highlights), **mobile-first**, later a web dashboard for browsing trips and stats.

## Output Requirements
- Output ONLY the final README markdown content (no commentary).
- Make it feel “shippable” and GitHub-ready.
- Be opinionated and pragmatic: pick a stack and justify it briefly.
- Include: MVP scope, non-goals, architecture, data model, privacy, milestones, repo structure, setup instructions, and implementation plan.

---

# README CONTENT SPEC (what to include)

## 1) Title + One-liner
- “Pathr — Strava for driving”
- 2–3 sentence description.

## 2) Key Features
Split into:
- MVP (v0) — what we ship first
- Next (v1+) — what comes after

MVP MUST include:
- Account/auth (simple)
- Trip recording (start/stop/pause/resume)
- Background location tracking (with battery-aware approach)
- Route polyline on map
- Trip details view (distance, duration, average speed, elevation if available)
- Trip library (list + filters)
- Shareable trip link OR export (choose one for MVP)
- Privacy controls (private by default)
- A simple “scenic score” placeholder (heuristic-based) OR “favorite routes”

## 3) UX / Design System (“Liquid Glass”)
- Describe the “liquid glass” UI system in practical terms:
  - frosted surfaces, translucency, blur, subtle gradients
  - map-first layout
  - large thumb-friendly controls
  - minimal typography scale and spacing rules
- Provide a small design token table in markdown:
  - radius, blur strength, border opacity, shadow, spacing, type scale
- Mention accessibility basics (contrast, reduced motion).

## 4) Stack Choice (be decisive)
Pick a stack optimized for fast MVP:

### Mobile
- **React Native (Expo)** (preferred)  
Include reasoning: speed, maps, background location APIs, OTA updates.

### Backend
Choose ONE:
- **Supabase** (Auth + Postgres + Storage + Edge Functions) for fastest MVP

### Web Dashboard
- **Next.js** (app router) — reads from same backend

### Maps
Choose ONE:
- Mapbox (preferred) or Google Maps
Explain tradeoffs briefly.

### Analytics / Logging
- Sentry (errors)
- PostHog or simple event logging (optional for MVP)

## 5) Architecture Overview
Give a clear diagram in ASCII:
- Mobile app -> API -> Database/Storage
- Web dashboard -> same API
- Trip recording pipeline: samples -> simplify -> store -> render

Also include:
- Offline-first notes (queue + retry)
- Background task strategy (iOS/Android constraints)

## 6) Data Model (Postgres tables)
Provide a compact schema section with:
- users
- trips
- trip_points (or segments)
- trip_stats
- route_summaries (optional)
Include columns and types (uuid, timestamp, numeric, geometry if using PostGIS; if not, store lat/lng).
Mention indexes.

## 7) Recording Algorithm (MVP-level)
Explain:
- sampling interval strategy (time + distance)
- filtering noise (accuracy threshold)
- polyline simplification (Douglas-Peucker) and when to run it
- battery considerations
- what happens if GPS drops out
- speed sanity checks

Include pseudocode in markdown code fences.

## 8) Privacy & Safety (must be prominent)
- Trips private by default
- Redaction options (hide start/end radius)
- No live location sharing in MVP
- “Delete my data” plan
- Clear permissions messaging
- Driving safety note: “No interaction while driving” + large controls

## 9) MVP Milestones (2–4 weeks)
Break into 4 milestones with checklists:
- M0: Repo + CI + baseline app shell
- M1: Auth + map + trip recording
- M2: Trip library + details + backend storage
- M3: Share/export + privacy + polish

## 10) Repo Structure
Provide a clean monorepo layout:
- /apps/mobile (Expo)
- /apps/web (Next.js)
- /packages/ui (shared components + tokens)
- /packages/shared (types, utils)
- /supabase (schema, migrations, edge functions)
- /docs (screens, decisions)

## 11) Local Dev Setup
- Node version
- pnpm
- env vars needed
- commands to run mobile + web
- how to run Supabase locally (or use hosted)

Include:
- `pnpm install`
- `pnpm dev` examples
- Expo run instructions

## 12) CI/CD (simple)
- GitHub Actions: lint, typecheck, tests
- Expo EAS build plan (later)
- Vercel deploy for web dashboard

## 13) Testing Strategy
- unit tests for utils (polyline simplify)
- integration tests for recording state machine
- minimal e2e later

## 14) “Definition of Done” for MVP
Be explicit:
- record and save trip reliably
- view trip on map
- share/export works
- permissions + privacy are correct
- crash-free baseline

## 15) Roadmap After MVP
Include:
- social features (followers, kudos)
- scenic route discovery feed
- leaderboards by segment (careful: driving safety)
- carplay/auto (later)
- imports (GPX)
- tagging trips (commute, scenic, errands)
- “moments” (photos) later

## 16) Contribution / License
- add CONTRIBUTING stub
- choose MIT or Apache-2.0 (pick one)

---

# Tone / Style Constraints
- Crisp, modern, confident.
- Avoid giant walls of text.
- Use headings, checkboxes, short paragraphs.
- Include code blocks where helpful.
- Avoid anything that requires paid services to be mandatory for running locally (offer free path or local path).
- Assume this is a brand-new repo with no stack yet, but a clean starting point.

---

Now generate the complete `README.md` content following the spec above.# pathr
