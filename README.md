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

## 3) UX / Design System ("Liquid Glass")
- Describe the "liquid glass" UI system in practical terms:
  - frosted surfaces, translucency, blur, subtle gradients
  - map-first layout
  - large thumb-friendly controls (minimum 44x44pt touch targets)
  - minimal typography scale and spacing rules
- Provide a small design token table in markdown:
  - radius, blur strength, border opacity, shadow, spacing, type scale
  - color palette (light/dark mode support)
  - animation durations and easing curves
- Mention accessibility basics (contrast, reduced motion, screen reader support).
- Onboarding flow: first-time user experience (permissions, tutorial)

## 4) Stack Choice (be decisive)
Pick a stack optimized for fast MVP:

### Mobile
- **React Native (Expo)** (preferred)  
Include reasoning: speed, maps, background location APIs, OTA updates.
- State management: Zustand or Jotai (lightweight, no boilerplate)
- Navigation: Expo Router (file-based routing)

### Backend
Choose ONE:
- **Supabase** (Auth + Postgres + Storage + Edge Functions) for fastest MVP
- Consider free tier limits and when to upgrade

### Web Dashboard
- **Next.js** (app router) — reads from same backend
- Styling: Tailwind CSS (matches mobile design tokens)

### Maps
Choose ONE:
- Mapbox (preferred) or Google Maps
Explain tradeoffs briefly (cost, features, offline support).

### Analytics / Logging
- Sentry (errors)
- PostHog or simple event logging (optional for MVP)
- Consider privacy-first analytics (no PII)

## 5) Architecture Overview
Give a clear diagram in ASCII:
- Mobile app -> API -> Database/Storage
- Web dashboard -> same API
- Trip recording pipeline: samples -> simplify -> store -> render

Also include:
- Offline-first notes (queue + retry)
- Background task strategy (iOS/Android constraints)
- API rate limiting strategy
- Caching layer (trip list, map tiles)
- CDN for static assets (web dashboard)
- Background sync job (process queued trips)

## 6) Data Model (Postgres tables)
Provide a compact schema section with:
- users
- trips
- trip_points (or segments)
- trip_stats
- route_summaries (optional)
- sync_queue (for offline trip uploads)
Include columns and types (uuid, timestamp, numeric, geometry if using PostGIS; if not, store lat/lng).
Mention indexes (especially on user_id, trip_id, created_at for queries).
Include soft delete strategy (deleted_at column).
Consider partitioning for trip_points if expecting large datasets.

## 7) Recording Algorithm (MVP-level)
Explain:
- sampling interval strategy (time + distance)
- filtering noise (accuracy threshold)
- polyline simplification (Douglas-Peucker) and when to run it
- battery considerations
- what happens if GPS drops out
- speed sanity checks
- handling rapid location changes (tunnels, bridges)
- data validation (invalid coordinates, timestamps)
- recovery from app crash during recording
- minimum trip duration/distance thresholds

Include pseudocode in markdown code fences.

## 8) Privacy & Safety (must be prominent)
- Trips private by default
- Redaction options (hide start/end radius)
- No live location sharing in MVP
- "Delete my data" plan (GDPR compliance)
- Clear permissions messaging
- Driving safety note: "No interaction while driving" + large controls
- Data retention policy (how long trips are stored)
- Encryption at rest and in transit
- No third-party location data sharing
- User data export functionality (JSON/GPX)

## 9) MVP Milestones (2–4 weeks)
Break into 4 milestones with checklists, dependencies, and acceptance criteria:
- M0: Repo + CI + baseline app shell
  - Dependencies: None
  - Acceptance: App runs, CI passes, basic navigation works
- M1: Auth + map + trip recording
  - Dependencies: M0 complete
  - Acceptance: Can record trip, see route on map, save to local storage
- M2: Trip library + details + backend storage
  - Dependencies: M1 complete
  - Acceptance: Trips sync to backend, can view list and details, offline queue works
- M3: Share/export + privacy + polish
  - Dependencies: M2 complete
  - Acceptance: Share links work, privacy controls functional, no critical bugs

## 10) Repo Structure
Provide a clean monorepo layout:
- /apps/mobile (Expo)
- /apps/web (Next.js)
- /packages/ui (shared components + tokens)
- /packages/shared (types, utils)
- /supabase (schema, migrations, edge functions)
- /docs (screens, decisions)

## 11) Local Dev Setup
- Node version (specify LTS version)
- pnpm
- env vars needed (with .env.example template)
- commands to run mobile + web
- how to run Supabase locally (or use hosted)
- iOS/Android simulator setup
- Troubleshooting common issues (metro bundler, permissions, etc.)

Include:
- `pnpm install`
- `pnpm dev` examples
- Expo run instructions
- Database seed script (sample trips for testing)
- How to reset local environment

## 12) CI/CD (simple)
- GitHub Actions: lint, typecheck, tests
- Expo EAS build plan (later)
- Vercel deploy for web dashboard
- Environment variable management (secrets)
- Database migration strategy (Supabase migrations)
- Rollback plan for deployments

## 13) Testing Strategy
- unit tests for utils (polyline simplify, data validation)
- integration tests for recording state machine
- API endpoint tests (auth, CRUD operations)
- error scenario tests (network failures, GPS loss, app backgrounding)
- performance tests (large trip datasets, polyline simplification benchmarks)
- minimal e2e later (critical user flows only)

## 14) "Definition of Done" for MVP
Be explicit:
- record and save trip reliably (99%+ success rate)
- view trip on map (smooth rendering, no lag)
- share/export works (links accessible, exports valid)
- permissions + privacy are correct (tested on iOS/Android)
- crash-free baseline (< 0.1% crash rate)
- Performance targets: app launch < 2s, trip save < 3s, map render < 1s
- Battery impact: < 5% per hour of recording
- Offline functionality: queue works, syncs when online

## 15) Roadmap After MVP
Include:
- social features (followers, kudos)
- scenic route discovery feed
- leaderboards by segment (careful: driving safety)
- carplay/auto (later)
- imports (GPX)
- tagging trips (commute, scenic, errands)
- "moments" (photos) later
- Advanced analytics (fuel efficiency estimates, route optimization)
- Weather integration (record weather conditions during trip)
- Export to other platforms (Strava, Google Timeline)

## 16) Contribution / License
- add CONTRIBUTING stub
- choose MIT or Apache-2.0 (pick one)
- Code of Conduct (optional but recommended)
- Issue templates (bug, feature, question)

## 17) Monitoring & Observability (post-MVP but plan early)
- Key metrics to track:
  - Trip recording success rate
  - API response times
  - Error rates by type
  - Battery usage patterns
  - Storage growth trends
- Alert thresholds (when to page on-call)
- Log aggregation strategy (structured logging)

## 18) Cost Considerations
- Free tier limits for each service
- Expected costs at 100/1000/10k users
- Cost optimization strategies (caching, data retention policies)
- When to consider self-hosting alternatives

---

# Tone / Style Constraints
- Crisp, modern, confident.
- Avoid giant walls of text.
- Use headings, checkboxes, short paragraphs.
- Include code blocks where helpful.
- Avoid anything that requires paid services to be mandatory for running locally (offer free path or local path).
- Assume this is a brand-new repo with no stack yet, but a clean starting point.

---

Now generate the complete `README.md` content following the spec above.
