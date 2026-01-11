# Pathr

**Like Strava for driving** — Record your trips, discover scenic routes, and build a personal map of everywhere you've been. Pathr transforms every drive into a story worth remembering.

---

## 🎯 Key Features

### MVP (v0)
- **Account & Authentication** — Simple email/password or social login
- **Trip Recording** — Start, stop, pause, and resume with background tracking
- **Battery-Aware Location** — Smart sampling to minimize battery drain
- **Live Route Visualization** — Real-time polyline on map as you drive
- **Trip Details** — Distance, duration, average speed, elevation profile
- **Trip Library** — Browse, filter, and search your recorded trips
- **Shareable Links** — Generate public links to share your favorite routes
- **Privacy Controls** — Private by default, granular sharing options
- **Scenic Score** — Heuristic-based route quality indicator

### Next (v1+)
- Social features (followers, kudos, comments)
- Scenic route discovery feed
- Segment leaderboards (safety-first design)
- CarPlay/Android Auto integration
- GPX import/export
- Trip tagging (commute, scenic, errands)
- Photo moments along routes
- Advanced analytics (fuel efficiency, route optimization)
- Weather integration
- Export to other platforms

---

## 🎨 Design System: "Liquid Glass"

Pathr's UI embraces a **liquid glass** aesthetic — frosted surfaces, subtle translucency, and soft gradients create a modern, premium feel.

### Design Principles
- **Map-first layout** — The route is the hero, UI elements float above
- **Thumb-friendly controls** — Minimum 44×44pt touch targets for safe one-handed use
- **Frosted surfaces** — Backdrop blur with 20–30% opacity overlays
- **Subtle gradients** — Soft color transitions, never harsh
- **Glow highlights** — Accent colors with gentle shadow/glow effects
- **Minimal typography** — Clear hierarchy, generous spacing

### Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| **Border Radius** | `12px` (small), `20px` (medium), `32px` (large) | Cards, buttons, modals |
| **Blur Strength** | `20px` (light), `40px` (medium), `60px` (heavy) | Frosted backgrounds |
| **Border Opacity** | `10%` (subtle), `20%` (medium), `30%` (strong) | Dividers, overlays |
| **Shadow** | `0 4px 20px rgba(0,0,0,0.1)` | Elevation, depth |
| **Spacing Scale** | `4px` base (4, 8, 12, 16, 24, 32, 48, 64) | Consistent rhythm |
| **Type Scale** | `12/14/16/18/24/32/48` | Body, labels, headings |

### Color Palette
- **Light Mode**: `#FFFFFF` base, `#F5F5F7` surfaces, `#007AFF` primary
- **Dark Mode**: `#000000` base, `#1C1C1E` surfaces, `#0A84FF` primary
- **Accents**: Gradient from `#667EEA` to `#764BA2` (purple-blue)

### Animation
- **Duration**: `200ms` (micro), `300ms` (standard), `500ms` (macro)
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` (material standard)

### Accessibility
- WCAG AA contrast ratios (4.5:1 minimum)
- Reduced motion support (respects `prefers-reduced-motion`)
- Screen reader labels for all interactive elements
- VoiceOver/TalkBack tested

### Onboarding
First-time users see a brief tutorial covering:
1. Permission requests (location, background location)
2. How to start/stop a trip
3. Privacy settings overview
4. Safety reminder (no interaction while driving)

---

## 🛠 Stack

### Mobile: React Native (Expo)
**Why Expo?** Fast iteration, built-in maps/background location APIs, OTA updates, and zero native code for MVP. Perfect for shipping in 2–4 weeks.

- **State Management**: Zustand (lightweight, no boilerplate)
- **Navigation**: Expo Router (file-based, type-safe)
- **Maps**: React Native Maps with Mapbox tiles
- **Location**: Expo Location API with background task support

### Backend: Supabase
**Why Supabase?** Auth, Postgres, Storage, and Edge Functions in one platform. Free tier covers MVP, scales to production. PostGIS support for geospatial queries.

**Alternative Considered**: Python + Flask
- ✅ More control, familiar stack
- ❌ Requires building auth (weeks), setting up PostGIS, deployment infrastructure
- ❌ Slower to MVP (6–8 weeks vs 2–4 weeks)
- **Verdict**: Great for v2 if we need custom ML/analytics, but Supabase wins for speed

### Web Dashboard: Next.js (App Router)
- **Styling**: Tailwind CSS (matches mobile design tokens)
- **Data Fetching**: Server components + Supabase client
- **Deployment**: Vercel (zero-config)

### Maps: Mapbox
**Why Mapbox?** Better offline support, custom styling (matches liquid glass aesthetic), competitive pricing, excellent React Native SDK.

**Alternative**: Google Maps
- ✅ More familiar to users
- ❌ Less flexible styling, higher cost at scale, weaker offline support

### Analytics & Logging
- **Errors**: Sentry (free tier: 5k events/month)
- **Analytics**: PostHog (privacy-first, self-hostable, optional for MVP)
- **Logging**: Structured JSON logs to Supabase or CloudWatch

---

## 🏗 Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Mobile    │────────▶│   Supabase   │────────▶│  Postgres   │
│   (Expo)    │◀────────│   (API +     │◀────────│  (PostGIS)  │
│             │         │   Edge Fns)  │         │             │
└─────────────┘         └──────────────┘         └─────────────┘
      │                        │                        │
      │                        │                        │
      ▼                        ▼                        ▼
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│  Local      │         │   Storage    │         │   Cache     │
│  Queue      │         │   (R2/S3)    │         │  (Redis)    │
└─────────────┘         └──────────────┘         └─────────────┘

┌─────────────┐
│     Web     │────────▶ Same Supabase API
│  (Next.js)  │
└─────────────┘
```

### Trip Recording Pipeline

```
GPS Samples → Filter Noise → Simplify (Douglas-Peucker) → Store Locally → 
Queue for Sync → Upload to Backend → Process Stats → Render on Map
```

### Key Components

**Offline-First**
- Local SQLite queue for trips
- Retry with exponential backoff
- Conflict resolution (last-write-wins)

**Background Tasks**
- iOS: Background location updates (significant location changes)
- Android: Foreground service with notification
- Battery optimization: Adaptive sampling (slower when stationary)

**API Rate Limiting**
- 100 requests/minute per user (Supabase RLS)
- Trip uploads: 10/minute (prevents abuse)

**Caching**
- Trip list: 5-minute TTL
- Map tiles: CDN cached (Mapbox)
- Static assets: Vercel Edge Network

**Background Sync**
- Supabase Edge Function processes queued trips nightly
- Calculates stats, generates route summaries
- Cleans up orphaned data

---

## 💾 Data Model

### Core Tables

```sql
-- Users (handled by Supabase Auth, extended with profile)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trips
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  distance_meters NUMERIC(10,2),
  duration_seconds INTEGER,
  avg_speed_kmh NUMERIC(5,2),
  max_speed_kmh NUMERIC(5,2),
  elevation_gain_meters NUMERIC(7,2),
  scenic_score INTEGER CHECK (scenic_score BETWEEN 0 AND 100),
  is_private BOOLEAN DEFAULT TRUE,
  share_token TEXT UNIQUE, -- For public links
  polyline_simplified TEXT, -- Encoded polyline
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ -- Soft delete
);

-- Trip Points (raw GPS samples)
CREATE TABLE trip_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  latitude NUMERIC(10,8) NOT NULL,
  longitude NUMERIC(11,8) NOT NULL,
  altitude NUMERIC(7,2),
  accuracy_meters NUMERIC(5,2),
  speed_ms NUMERIC(5,2),
  heading_degrees NUMERIC(5,2),
  timestamp TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
) PARTITION BY RANGE (created_at); -- Partition by month for large datasets

-- Trip Stats (precomputed aggregates)
CREATE TABLE trip_stats (
  trip_id UUID PRIMARY KEY REFERENCES trips(id) ON DELETE CASCADE,
  total_points INTEGER,
  simplified_points INTEGER,
  bounding_box BOX, -- PostGIS bounding box
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sync Queue (offline trip uploads)
CREATE TABLE sync_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  trip_data JSONB NOT NULL, -- Serialized trip + points
  retry_count INTEGER DEFAULT 0,
  last_attempt_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Indexes

```sql
CREATE INDEX idx_trips_user_created ON trips(user_id, created_at DESC);
CREATE INDEX idx_trips_share_token ON trips(share_token) WHERE share_token IS NOT NULL;
CREATE INDEX idx_trip_points_trip_timestamp ON trip_points(trip_id, timestamp);
CREATE INDEX idx_trip_points_location ON trip_points USING GIST(
  ST_MakePoint(longitude, latitude)
); -- PostGIS spatial index
CREATE INDEX idx_sync_queue_user ON sync_queue(user_id, created_at);
```

### PostGIS vs Lat/Lng
Using PostGIS `POINT` geometry for spatial queries (distance, bounding box, route matching). Falls back to `NUMERIC` lat/lng if PostGIS unavailable (with performance tradeoff).

---

## 📍 Recording Algorithm

### Sampling Strategy

**Adaptive Interval**
- **Moving**: Sample every 5 seconds OR 50 meters (whichever comes first)
- **Stationary**: Sample every 30 seconds (battery optimization)
- **High Speed** (>80 km/h): Sample every 3 seconds (capture highway curves)

**Noise Filtering**
```javascript
function shouldRecordPoint(newPoint, lastPoint) {
  // Reject if accuracy is poor
  if (newPoint.accuracy > 50) return false; // >50m accuracy = skip
  
  // Reject if speed is implausible
  const speedKmh = calculateSpeed(lastPoint, newPoint);
  if (speedKmh > 200) return false; // Sanity check
  
  // Reject if distance change is too small (likely noise)
  const distance = haversineDistance(lastPoint, newPoint);
  if (distance < 5) return false; // <5m movement = skip
  
  return true;
}
```

**Polyline Simplification**
- Run Douglas-Peucker algorithm on trip completion
- Tolerance: 10 meters (removes 80–90% of points, preserves shape)
- Store both raw points (for accuracy) and simplified polyline (for rendering)

**Battery Considerations**
- Reduce sampling frequency when battery < 20%
- Pause recording if battery < 10% (save trip, prompt user)
- Use "significant location changes" on iOS when app backgrounded

**GPS Dropout Handling**
- If no GPS for >60 seconds: pause recording, show warning
- Interpolate missing segments (straight line) if gap <5 minutes
- Mark trip as "incomplete" if gap >5 minutes

**Recovery from Crash**
- Save trip state to SQLite every 10 seconds
- On app launch: Check for incomplete trips, offer to resume
- Auto-save last 5 minutes of points even if trip not "started"

**Minimum Thresholds**
- Trip must be >100 meters and >30 seconds to save
- Prevents accidental recordings

### Pseudocode

```javascript
class TripRecorder {
  constructor() {
    this.points = [];
    this.lastPoint = null;
    this.isMoving = false;
    this.samplingInterval = 5000; // 5s default
  }
  
  async startRecording() {
    await requestLocationPermissions();
    this.watchId = Location.watchPositionAsync(
      { accuracy: Location.Accuracy.Balanced },
      this.onLocationUpdate.bind(this)
    );
  }
  
  onLocationUpdate(location) {
    const point = {
      lat: location.coords.latitude,
      lng: location.coords.longitude,
      accuracy: location.coords.accuracy,
      timestamp: location.timestamp,
      speed: location.coords.speed
    };
    
    if (!this.shouldRecordPoint(point)) return;
    
    this.points.push(point);
    this.updateSamplingInterval(point);
    this.saveToLocalStorage(); // Every 10s
    this.updateMapPolyline();
  }
  
  shouldRecordPoint(point) {
    if (point.accuracy > 50) return false;
    if (!this.lastPoint) return true;
    
    const distance = haversine(this.lastPoint, point);
    const speed = calculateSpeed(this.lastPoint, point);
    
    if (distance < 5) return false; // Too close
    if (speed > 200) return false; // Implausible
    
    return true;
  }
  
  async stopRecording() {
    if (this.points.length < 10) {
      // Too short, discard
      return;
    }
    
    const simplified = douglasPeucker(this.points, 10); // 10m tolerance
    const stats = this.calculateStats(this.points);
    
    const trip = {
      points: this.points, // Keep raw for accuracy
      polyline: encodePolyline(simplified), // Simplified for rendering
      stats,
      startedAt: this.points[0].timestamp,
      endedAt: this.points[this.points.length - 1].timestamp
    };
    
    await this.saveTrip(trip);
    await this.queueForSync(trip);
  }
}
```

---

## 🔒 Privacy & Safety

### Privacy First
- **Trips private by default** — Only you can see them
- **Redaction options** — Hide start/end locations (500m radius blur)
- **No live location sharing** — MVP only supports sharing completed trips
- **GDPR compliant** — "Delete my data" button removes all user data within 30 days
- **Data export** — Download all trips as JSON/GPX
- **Encryption** — At rest (Supabase) and in transit (TLS)
- **No third-party sharing** — Location data never sold or shared

### Data Retention
- Active users: Trips stored indefinitely
- Deleted accounts: Data purged within 30 days
- Inactive accounts (>2 years): Optional archival

### Driving Safety
- **Large controls** — 60×60pt buttons, high contrast
- **Voice prompts** — "Trip started" / "Trip stopped" (optional)
- **No interaction required** — Start trip before driving, stop after parking
- **Safety reminder** — Shown on first recording: "Never interact with phone while driving"

### Permissions
Clear messaging for each permission:
- **Location (Always)**: "Required to record trips in background. We only track when you start a trip."
- **Background Location**: "Lets Pathr record your route even when the app is minimized."

---

## 🚀 MVP Milestones

### M0: Foundation (Week 1)
**Dependencies**: None

**Tasks**:
- [ ] Monorepo setup (pnpm workspaces)
- [ ] Expo app shell with navigation
- [ ] Basic "Liquid Glass" UI components
- [ ] CI/CD (GitHub Actions: lint, typecheck)
- [ ] Supabase project + local setup
- [ ] Database schema + migrations

**Acceptance Criteria**:
- ✅ App runs on iOS/Android simulators
- ✅ CI passes on all PRs
- ✅ Basic navigation between screens works
- ✅ Design tokens applied consistently

---

### M1: Core Recording (Week 1–2)
**Dependencies**: M0 complete

**Tasks**:
- [ ] Supabase Auth integration
- [ ] Mapbox map integration
- [ ] Location permissions flow
- [ ] Trip recording state machine (start/stop/pause/resume)
- [ ] GPS sampling + filtering
- [ ] Local SQLite storage
- [ ] Real-time polyline rendering

**Acceptance Criteria**:
- ✅ Can record a trip and see route on map
- ✅ Trip saves to local storage
- ✅ Works in background (tested for 10+ minutes)
- ✅ Battery usage <5% per hour

---

### M2: Backend & Library (Week 2–3)
**Dependencies**: M1 complete

**Tasks**:
- [ ] Trip sync to Supabase
- [ ] Offline queue + retry logic
- [ ] Trip library screen (list + filters)
- [ ] Trip details screen (stats, map, elevation)
- [ ] Polyline simplification on upload
- [ ] PostGIS spatial queries (bounding box, distance)

**Acceptance Criteria**:
- ✅ Trips sync to backend reliably
- ✅ Can view trip list and details
- ✅ Offline queue works (airplane mode test)
- ✅ No data loss on app restart

---

### M3: Share & Polish (Week 3–4)
**Dependencies**: M2 complete

**Tasks**:
- [ ] Shareable link generation
- [ ] Privacy controls UI
- [ ] Scenic score calculation (heuristic)
- [ ] Error handling + user feedback
- [ ] Performance optimization
- [ ] iOS/Android testing + fixes

**Acceptance Criteria**:
- ✅ Share links work (public trips viewable)
- ✅ Privacy controls functional
- ✅ No critical bugs (crash rate <0.1%)
- ✅ Meets performance targets (see Definition of Done)

---

## 📁 Repo Structure

```
pathr/
├── apps/
│   ├── mobile/          # Expo React Native app
│   │   ├── app/         # Expo Router pages
│   │   ├── components/  # Mobile-specific components
│   │   ├── lib/         # Utils, hooks, services
│   │   └── app.json
│   └── web/             # Next.js dashboard
│       ├── app/         # App Router pages
│       ├── components/
│       └── lib/
├── packages/
│   ├── ui/              # Shared design system
│   │   ├── components/ # Reusable UI components
│   │   └── tokens/      # Design tokens (colors, spacing)
│   └── shared/          # Shared logic
│       ├── types/       # TypeScript types
│       └── utils/       # Polyline, distance, etc.
├── supabase/
│   ├── migrations/      # SQL migrations
│   ├── functions/       # Edge Functions
│   └── seed.sql         # Test data
├── docs/
│   ├── screens/         # UI mockups
│   └── decisions/       # ADRs
├── .github/
│   └── workflows/       # CI/CD
├── pnpm-workspace.yaml
└── README.md
```

---

## 🛠 Local Dev Setup

### Prerequisites
- **Node.js**: v20 LTS (via nvm: `nvm install 20`)
- **pnpm**: `npm install -g pnpm`
- **Expo CLI**: `npm install -g expo-cli`
- **iOS**: Xcode 15+ (Mac only)
- **Android**: Android Studio + emulator

### Quick Start

**🚀 Recommended: Use the startup script (handles everything automatically)**

```bash
# Clone the repo
git clone https://github.com/yourusername/pathr.git
cd pathr

# Option 1: If pnpm is in PATH (after first run)
pnpm startup

# Option 2: Windows - Use wrapper script (works even if pnpm not in PATH)
.\startup.bat
# or
.\startup.ps1

# Option 3: Run directly with Node.js (works if pnpm not in PATH)
node scripts/startup.mjs
```

The startup script will:
- ✅ Check and setup Node.js/pnpm environment
- ✅ Install dependencies if needed
- ✅ Check for updates
- ✅ Start development servers
- ✅ Open browser automatically

**Note for Windows users**: If you see "pnpm is not recognized", use `.\startup.bat` or `node scripts/startup.mjs` instead. See [QUICK_START_WINDOWS.md](./QUICK_START_WINDOWS.md) for details.

**Manual setup (if you prefer):**

```bash
# Clone and install
git clone https://github.com/yourusername/pathr.git
cd pathr
pnpm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your Supabase keys

# Start Supabase locally (or use hosted)
pnpm supabase start

# Run mobile app
cd apps/mobile
pnpm expo start

# Run web dashboard (new terminal)
cd apps/web
pnpm dev
```

See [STARTUP.md](./STARTUP.md) for more details on the startup script.

### Deploy on Render (Vite Web MVP)

The Vite web MVP lives in `apps/pathr-web` and depends on workspace packages (notably `@pathr/shared`), so Render should build from the **repo root** using **pnpm**.

- **Build command**: `pnpm install --frozen-lockfile && pnpm --filter @pathr/pathr-web build`
- **Publish directory**: `apps/pathr-web/dist`
- **Env var**: `VITE_MAPBOX_TOKEN` (Mapbox access token for Mapbox GL JS)

Optional: this repo includes a `render.yaml` you can use to create the service.

### Environment Variables

`.env.example`:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Mapbox
EXPO_PUBLIC_MAPBOX_TOKEN=xxx

# Sentry (optional)
SENTRY_DSN=xxx
```

### Database Setup

```bash
# Run migrations
pnpm supabase db reset

# Seed test data
pnpm supabase db seed
```

### Troubleshooting

**Metro bundler cache issues**:
```bash
pnpm expo start --clear
```

**iOS Simulator not launching**:
```bash
cd ios && pod install && cd ..
```

**Android permissions**:
- Enable "Location" and "Background Location" in AndroidManifest.xml
- Test on physical device for accurate GPS

**Reset local environment**:
```bash
pnpm supabase db reset
rm -rf apps/mobile/.expo
pnpm install --force
```

---

## 🔄 CI/CD

### GitHub Actions

**On PR**:
- Lint (ESLint)
- Typecheck (TypeScript)
- Unit tests (Jest)
- Build check (mobile + web)

**On merge to main**:
- All above +
- Deploy web dashboard to Vercel (preview)
- Run database migrations (dry-run)

**On tag (v*)**:
- Build Expo app (EAS Build)
- Deploy web to production
- Run migrations (production)

### Environment Variables
Managed via GitHub Secrets:
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`
- `MAPBOX_TOKEN`
- `SENTRY_DSN`
- `VERCEL_TOKEN`

### Database Migrations
- Supabase CLI for local development
- GitHub Action runs `supabase db push` on deploy
- Rollback: `supabase db reset --db-url $PROD_URL` (manual)

### Rollback Plan
1. **Web**: Vercel instant rollback (previous deployment)
2. **Database**: Restore from backup (Supabase dashboard)
3. **Mobile**: Hot-fix via Expo OTA update (if no native changes)

---

## 🧪 Testing Strategy

### Unit Tests
- **Utils**: Polyline simplification, distance calculations, data validation
- **State Management**: Zustand stores (trip recording state machine)
- **Coverage Target**: 80% for utils, 60% for components

### Integration Tests
- **Recording Flow**: Start → Record → Stop → Save
- **Offline Queue**: Queue trip → Go offline → Come online → Sync
- **API**: Supabase client methods (mocked)

### Error Scenarios
- Network failures (trip save fails, retry works)
- GPS loss (handling, recovery)
- App backgrounding (recording continues)
- Low battery (sampling reduces)
- Invalid data (malformed coordinates)

### Performance Tests
- **Polyline Simplification**: Benchmark on 10k point trip (<100ms target)
- **Map Rendering**: Smooth 60fps with 1k point polyline
- **Database Queries**: Trip list loads <500ms with 1000 trips

### E2E (Post-MVP)
- Critical flows only: Record trip → View → Share
- Tools: Detox (React Native) or Maestro

---

## ✅ Definition of Done (MVP)

### Functional
- [ ] Record and save trip reliably (99%+ success rate)
- [ ] View trip on map (smooth rendering, no lag)
- [ ] Share/export works (links accessible, exports valid GPX/JSON)
- [ ] Permissions + privacy correct (tested on iOS 17+ and Android 13+)

### Performance
- [ ] App launch <2 seconds (cold start)
- [ ] Trip save <3 seconds (including sync)
- [ ] Map render <1 second (initial load)
- [ ] Battery impact <5% per hour of recording

### Quality
- [ ] Crash rate <0.1% (Sentry tracking)
- [ ] Offline functionality works (queue + sync)
- [ ] No memory leaks (tested 1-hour recording session)
- [ ] Accessibility: VoiceOver/TalkBack tested

### Security
- [ ] All API calls authenticated
- [ ] Private trips not accessible via share token
- [ ] Location data encrypted at rest
- [ ] No PII in logs/analytics

---

## 🗺 Roadmap After MVP

### v1.1: Social Foundation
- User profiles (bio, avatar)
- Follow/unfollow
- Public trip feed
- Basic kudos (like trips)

### v1.2: Discovery
- Scenic route discovery feed (algorithm-based)
- Route recommendations ("Similar to your trip to...")
- Popular routes by region
- Search by location/tags

### v1.3: Advanced Features
- Segment leaderboards (speed/time, safety disclaimers)
- Trip tagging (commute, scenic, errands, road trip)
- Photo moments (attach photos to trip points)
- Weather integration (record conditions during trip)

### v2.0: Platform Integration
- CarPlay/Android Auto (voice-only, no touch)
- GPX import (from other apps)
- Export to Strava, Google Timeline
- Apple Watch companion (start/stop trips)

### v2.1: Analytics
- Fuel efficiency estimates (if car data available)
- Route optimization suggestions
- Personal stats dashboard (total distance, favorite routes)
- Monthly/yearly summaries

### Future Considerations
- Real-time location sharing (opt-in, for family)
- Group trips (record together)
- Route planning (plan before you drive)
- Offline maps (download regions)

---

## 📊 Monitoring & Observability

### Key Metrics
- **Trip Recording Success Rate** (target: >99%)
- **API Response Times** (p50 <200ms, p95 <500ms)
- **Error Rates** (by type: GPS, network, auth)
- **Battery Usage** (average % per hour)
- **Storage Growth** (GB per user per month)

### Alerts
- **Critical**: API error rate >5%, trip save failure >10%
- **Warning**: Response time p95 >1s, battery usage >10%/hour
- **Info**: Storage growth spike, new error type

### Logging
- Structured JSON logs (Supabase Edge Functions)
- Log levels: ERROR, WARN, INFO, DEBUG
- No PII in logs (user IDs only, no locations)
- Retention: 30 days

### Tools
- **Errors**: Sentry (alerts on new issues)
- **Analytics**: PostHog (optional, privacy-first)
- **APM**: Supabase built-in (or Datadog if needed)

---

## 💰 Cost Considerations

### Free Tier Limits (MVP)
- **Supabase**: 500MB database, 1GB storage, 2GB bandwidth
- **Mapbox**: 50k map loads/month
- **Vercel**: Unlimited (hobby plan)
- **Sentry**: 5k events/month

### Expected Costs

**100 Users**:
- Supabase: Free
- Mapbox: Free
- **Total: $0/month**

**1,000 Users**:
- Supabase: $25/month (Pro)
- Mapbox: ~$50/month (50k loads)
- **Total: ~$75/month**

**10,000 Users**:
- Supabase: $25/month
- Mapbox: ~$500/month (500k loads)
- **Total: ~$525/month**

### Optimization Strategies
- **Caching**: Reduce Mapbox calls (cache tiles, trip polylines)
- **Data Retention**: Archive old trips (>1 year) to cold storage
- **CDN**: Use Vercel Edge for static assets (free)
- **Database**: Partition `trip_points` table (reduce query cost)

### Self-Hosting Alternative
At 10k+ users, consider:
- Self-hosted Postgres + PostGIS
- Self-hosted Mapbox (MapTiler or OpenStreetMap)
- **Break-even**: ~$300/month (vs $525 cloud)

---

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

**Quick Start**:
1. Fork the repo
2. Create a feature branch
3. Make changes (follow code style)
4. Write/update tests
5. Submit PR with description

**Issue Templates**:
- 🐛 Bug report
- ✨ Feature request
- ❓ Question

---

## 📄 License

MIT License — see [LICENSE](./LICENSE) file.

---

## 🙏 Acknowledgments

- Inspired by Strava's approach to activity tracking
- Built with [Expo](https://expo.dev), [Supabase](https://supabase.com), and [Next.js](https://nextjs.org)
- Maps powered by [Mapbox](https://mapbox.com)

---

**Ready to build?** Start with [M0: Foundation](#-mvp-milestones) and ship your first trip in 2–4 weeks. 🚗✨
