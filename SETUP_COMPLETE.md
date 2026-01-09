# Pathr Setup Complete - Implementation Summary

## 📋 Overview

This document details everything that has been set up for the Pathr project foundation (M0 milestone). It includes the complete monorepo structure, all packages, apps, configurations, and step-by-step instructions for running and testing on Windows.

---

## 🏗 What Has Been Created

### 1. Monorepo Foundation

#### Root Configuration Files

**`package.json`** - Root package configuration
- Defines workspace scripts (`dev`, `dev:web`, `build`, `lint`, `typecheck`, `test`)
- Sets Node.js 20+ and pnpm 8+ requirements
- Configures package manager

**`pnpm-workspace.yaml`** - Workspace configuration
- Defines workspace packages: `apps/*` and `packages/*`
- Enables monorepo dependency management

**`tsconfig.json`** - Root TypeScript configuration
- Strict mode enabled
- ES2022 target
- CommonJS modules
- Shared compiler options for all packages

**`.prettierrc`** - Code formatting rules
- Single quotes, semicolons
- 100 character line width
- 2-space indentation

**`.gitignore`** - Git ignore patterns
- Node modules, build outputs
- Environment files
- IDE and OS-specific files
- Supabase local files

---

### 2. Shared Packages

#### `@pathr/ui` - Design System Tokens

**Purpose**: Centralized design tokens for the "Liquid Glass" design system

**Files Created**:
- `packages/ui/src/tokens/colors.ts` - Light/dark mode color palette
  - Base colors: `#FFFFFF` (light) / `#000000` (dark)
  - Surface colors: `#F5F5F7` (light) / `#1C1C1E` (dark)
  - Primary: `#007AFF` (light) / `#0A84FF` (dark)
  - Accent gradient: `#667EEA` to `#764BA2`

- `packages/ui/src/tokens/spacing.ts` - 4px-based spacing scale
  - Values: 4, 8, 12, 16, 24, 32, 48, 64px

- `packages/ui/src/tokens/typography.ts` - Type scale
  - Sizes: 12, 14, 16, 18, 24, 32, 48px
  - Line heights for each size

- `packages/ui/src/tokens/radius.ts` - Border radius values
  - Small: 12px, Medium: 20px, Large: 32px

- `packages/ui/src/tokens/blur.ts` - Blur strength for frosted glass
  - Light: 20px, Medium: 40px, Heavy: 60px

- `packages/ui/src/tokens/shadow.ts` - Elevation shadows
  - Default, medium, large variants

- `packages/ui/src/tokens/animation.ts` - Animation timing
  - Durations: 200ms (micro), 300ms (standard), 500ms (macro)
  - Easing: `cubic-bezier(0.4, 0, 0.2, 1)`

- `packages/ui/src/tokens/index.ts` - Central export
- `packages/ui/src/index.ts` - Package entry point
- `packages/ui/package.json` - Package configuration
- `packages/ui/tsconfig.json` - TypeScript config

**Usage**: Import design tokens in any app:
```typescript
import { colors, spacing, typography } from '@pathr/ui';
```

---

#### `@pathr/shared` - Shared Types and Utilities

**Purpose**: Shared TypeScript types and utility functions used across mobile and web

**Files Created**:
- `packages/shared/src/types/trip.ts` - Trip-related types
  - `TripPoint` - GPS point with lat/lng, altitude, accuracy, speed, heading, timestamp
  - `Trip` - Complete trip data (id, userId, stats, polyline, privacy settings)
  - `TripStats` - Precomputed aggregates (point counts, bounding box)

- `packages/shared/src/types/index.ts` - Type exports

- `packages/shared/src/utils/distance.ts` - Distance calculation utilities
  - `haversineDistance()` - Calculate distance between two GPS points (meters)
  - `calculateSpeed()` - Calculate speed between two points (km/h)
  - Uses Haversine formula for great-circle distance

- `packages/shared/src/index.ts` - Package entry point
- `packages/shared/package.json` - Package configuration with Jest for testing
- `packages/shared/tsconfig.json` - TypeScript config

**Usage**: Import types and utils:
```typescript
import { Trip, TripPoint, haversineDistance } from '@pathr/shared';
```

---

### 3. Mobile App (`@pathr/mobile`)

**Technology**: React Native with Expo

**Files Created**:

**`apps/mobile/package.json`**
- Expo SDK ~50.0.0
- Expo Router ~3.4.0 for file-based routing
- Expo Location ~16.5.0 for GPS tracking
- Zustand for state management
- Dependencies on `@pathr/ui` and `@pathr/shared`

**`apps/mobile/app.json`**
- App configuration
- iOS bundle identifier: `com.pathr.app`
- Android package: `com.pathr.app`
- Location permissions configured:
  - iOS: `NSLocationWhenInUseUsageDescription`
  - iOS: `NSLocationAlwaysAndWhenInUseUsageDescription`
  - Android: `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`, `ACCESS_BACKGROUND_LOCATION`
- Expo Location plugin configured

**`apps/mobile/app/_layout.tsx`**
- Root layout component
- Expo Router Stack navigation
- StatusBar configuration
- Header hidden by default

**`apps/mobile/app/index.tsx`**
- Home screen component
- Uses design tokens from `@pathr/ui`
- Displays "Pathr" title and subtitle
- Basic styling with Liquid Glass colors

**`apps/mobile/tsconfig.json`**
- Extends Expo base config
- Path aliases for `@pathr/ui` and `@pathr/shared`
- Strict TypeScript enabled

**`apps/mobile/babel.config.js`**
- Babel configuration for Expo
- Module resolver for path aliases
- Enables importing `@pathr/ui` and `@pathr/shared`

**App Structure**:
```
apps/mobile/
├── app/
│   ├── _layout.tsx      # Root layout
│   └── index.tsx        # Home screen
├── app.json             # Expo config
├── package.json
├── tsconfig.json
└── babel.config.js
```

---

### 4. Web Dashboard (`@pathr/web`)

**Technology**: Next.js 14 with App Router

**Files Created**:

**`apps/web/package.json`**
- Next.js 14.0.0
- React 18.2.0
- Tailwind CSS 3.3.6
- Supabase client (for future backend integration)
- Dependencies on `@pathr/ui` and `@pathr/shared`

**`apps/web/next.config.js`**
- Transpiles shared packages (`@pathr/ui`, `@pathr/shared`)
- Enables using workspace packages in Next.js

**`apps/web/app/layout.tsx`**
- Root layout with metadata
- Title: "Pathr — Like Strava for driving"
- Imports global CSS

**`apps/web/app/page.tsx`**
- Home page component
- Uses Tailwind CSS classes
- Displays "Pathr" heading and subtitle

**`apps/web/app/globals.css`**
- Tailwind CSS directives
- Base styles

**`apps/web/tailwind.config.js`**
- Tailwind configuration
- Extends theme with Liquid Glass colors
- Matches design tokens from `@pathr/ui`

**`apps/web/postcss.config.js`**
- PostCSS configuration for Tailwind

**`apps/web/tsconfig.json`**
- Next.js TypeScript configuration
- Path aliases for shared packages
- Strict mode enabled

**App Structure**:
```
apps/web/
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── globals.css      # Tailwind styles
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── package.json
```

---

### 5. Supabase Backend

**Files Created**:

**`supabase/config.toml`**
- Local Supabase development configuration
- API port: 54321
- Database port: 54322
- Studio port: 54323
- Inbucket (email testing) ports: 54324-54326
- Auth enabled with signup
- Storage enabled (50MiB limit)

**`supabase/migrations/20240101000000_initial_schema.sql`**
- Complete database schema
- **PostGIS extension** enabled for geospatial queries
- **Tables created**:
  1. `profiles` - User profiles (extends auth.users)
  2. `trips` - Trip records with stats, privacy, share tokens
  3. `trip_points` - Raw GPS samples with spatial index
  4. `trip_stats` - Precomputed aggregates
  5. `sync_queue` - Offline trip upload queue
- **Indexes created**:
  - User trips by created_at (descending)
  - Share tokens (for public trip access)
  - Trip points by trip_id and timestamp
  - Spatial index on trip_points (PostGIS GIST)
  - Sync queue by user_id
- **Row Level Security (RLS)** enabled on all tables
- **RLS Policies**:
  - Users can view/update own profile
  - Users can manage own trips
  - Users can view public trips via share_token
  - Users can manage own trip points
  - Users can manage own sync queue items

**Database Schema Highlights**:
- UUID primary keys
- Timestamps with timezone
- Soft deletes (`deleted_at` column)
- Privacy controls (`is_private` boolean)
- Share tokens for public links
- PostGIS geometry support
- JSONB for flexible data (sync_queue)

---

### 6. CI/CD Pipeline

**`.github/workflows/ci.yml`**
- GitHub Actions workflow
- **Triggers**: Pull requests and pushes to `main`
- **Jobs**:
  1. `lint-and-typecheck` - Runs ESLint and TypeScript checks
  2. `test` - Runs Jest tests
  3. `build` - Builds mobile and web apps
- **Environment**: Ubuntu latest
- **Node.js**: Version 20
- **Package Manager**: pnpm 8
- **Caching**: pnpm cache enabled

**Workflow Steps**:
1. Checkout code
2. Setup pnpm
3. Setup Node.js with cache
4. Install dependencies (`pnpm install --frozen-lockfile`)
5. Run lint, typecheck, test, or build

---

### 7. Documentation

**`CONTRIBUTING.md`**
- Contribution guidelines
- Development workflow
- Code style requirements
- Testing instructions
- PR process
- Issue reporting templates

**`LICENSE`**
- MIT License
- Full license text

**`SETUP.md`**
- Quick setup guide
- What's been completed
- Next steps
- Missing pieces checklist

**`docs/decisions/0001-stack-choice.md`**
- Architecture Decision Record (ADR)
- Documents why React Native, Supabase, Next.js, Mapbox were chosen
- Rationale and consequences

---

## 🪟 Windows-Specific Setup Instructions

### Prerequisites Installation

#### 1. Install Node.js

**Option A: Using nvm-windows (Recommended)**
```powershell
# Download and install nvm-windows from:
# https://github.com/coreybutler/nvm-windows/releases

# After installation, open PowerShell as Administrator and run:
nvm install 20
nvm use 20
```

**Option B: Direct Install**
1. Download Node.js 20 LTS from https://nodejs.org/
2. Run installer (choose "Add to PATH")
3. Verify installation:
```powershell
node --version  # Should show v20.x.x
npm --version
```

#### 2. Install pnpm

```powershell
# Using npm (comes with Node.js)
npm install -g pnpm

# Verify installation
pnpm --version  # Should show 8.x.x or higher
```

#### 3. Install Git (if not already installed)

Download from https://git-scm.com/download/win
- Choose "Git from the command line and also from 3rd-party software"
- Use OpenSSL library
- Checkout Windows-style, commit Unix-style line endings

#### 4. Install Expo CLI (Optional, but helpful)

```powershell
npm install -g expo-cli
```

#### 5. Install Android Studio (for Android development)

1. Download from https://developer.android.com/studio
2. Install with:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device
3. Set environment variable:
```powershell
# Open System Properties > Environment Variables
# Add new System Variable:
# ANDROID_HOME = C:\Users\YourUsername\AppData\Local\Android\Sdk
```

4. Add to PATH:
```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
```

#### 6. Install Supabase CLI (for local database)

```powershell
# Using Scoop (recommended)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Or using npm
npm install -g supabase
```

**Note**: Supabase CLI requires Docker Desktop on Windows. Install from https://www.docker.com/products/docker-desktop/

---

### Project Setup Steps

#### Step 1: Clone/Navigate to Project

```powershell
# If you haven't cloned yet:
git clone https://github.com/yourusername/pathr.git
cd pathr

# Or if already in the project:
cd C:\Users\agonzalez7\pathr
```

#### Step 2: Install Dependencies

```powershell
# Install all dependencies for all packages
pnpm install

# This will:
# - Install root dependencies
# - Install dependencies for apps/mobile
# - Install dependencies for apps/web
# - Install dependencies for packages/ui
# - Install dependencies for packages/shared
# - Link workspace packages
```

**Expected Output**: Should see packages being installed. May take 2-5 minutes.

**Troubleshooting**:
- If you get "pnpm: command not found", make sure pnpm is installed globally
- If you get permission errors, run PowerShell as Administrator
- If you get network errors, check your internet connection or try: `pnpm install --network-timeout 60000`

#### Step 3: Create Environment File

```powershell
# Create .env.local file (you'll need to get these values from Supabase dashboard)
New-Item -ItemType File -Path .env.local

# Or manually create .env.local with:
```

**`.env.local` content** (get values from https://supabase.com/dashboard):
```bash
# Supabase (get from your project settings)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Mapbox (get from https://account.mapbox.com/access-tokens/)
EXPO_PUBLIC_MAPBOX_TOKEN=pk.eyJ1Ijo...

# Sentry (optional, for error tracking)
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

**Note**: For local development, you can use Supabase local instance (see Step 6).

#### Step 4: Set Up Supabase (Choose One Option)

**Option A: Use Hosted Supabase (Easier for MVP)**

1. Go to https://supabase.com
2. Create a new project
3. Wait for database to provision (2-3 minutes)
4. Go to Settings > API
5. Copy `URL` and `anon` `public` key to `.env.local`
6. Go to SQL Editor
7. Run the migration file: `supabase/migrations/20240101000000_initial_schema.sql`

**Option B: Use Local Supabase (More Control)**

```powershell
# Make sure Docker Desktop is running

# Initialize Supabase (first time only)
supabase init

# Start Supabase locally
supabase start

# This will:
# - Start PostgreSQL database
# - Start Supabase API
# - Start Supabase Studio (web UI)
# - Print connection details

# Note the output - you'll see:
# API URL: http://localhost:54321
# GraphQL URL: http://localhost:54321/graphql/v1
# DB URL: postgresql://postgres:postgres@localhost:54322/postgres
# Studio URL: http://localhost:54323
# Inbucket URL: http://localhost:54324

# Update .env.local with local URLs:
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from supabase start output>
SUPABASE_SERVICE_ROLE_KEY=<from supabase start output>
```

**Apply Migrations** (if using local):
```powershell
# Migrations are automatically applied when you run supabase start
# Or manually:
supabase db reset
```

---

### Running the Applications

#### Running Mobile App (Expo)

**Terminal 1 - Start Expo Dev Server**:
```powershell
cd apps/mobile
pnpm dev

# Or from root:
pnpm --filter mobile dev
```

**What Happens**:
- Expo dev server starts
- QR code appears in terminal
- Metro bundler starts
- You'll see: "Metro waiting on exp://192.168.x.x:8081"

**Testing Options**:

**Option 1: Expo Go App (Easiest)**
1. Install "Expo Go" from Google Play Store (Android) or App Store (iOS)
2. Scan QR code with:
   - **Android**: Expo Go app
   - **iOS**: Camera app (opens Expo Go)
3. App loads on your phone

**Option 2: Android Emulator**
```powershell
# Make sure Android Studio is installed and emulator is running
# In Android Studio: Tools > Device Manager > Create/Start Virtual Device

# Then in terminal:
pnpm --filter mobile android

# Or press 'a' in Expo dev server
```

**Option 3: iOS Simulator (Mac only)**
```powershell
# Press 'i' in Expo dev server
# Or:
pnpm --filter mobile ios
```

**Option 4: Web Browser**
```powershell
# Press 'w' in Expo dev server
# Or:
pnpm --filter mobile web
```

**Expected Result**:
- App opens showing "Pathr" title and "Like Strava for driving" subtitle
- White background (light mode)
- No errors in terminal

**Troubleshooting**:
- **"Cannot find module"**: Run `pnpm install` again
- **"Metro bundler error"**: Run `pnpm expo start --clear`
- **"Port already in use"**: Kill process on port 8081 or use different port: `pnpm expo start --port 8082`
- **Android emulator not found**: Start emulator in Android Studio first

---

#### Running Web Dashboard (Next.js)

**Terminal 2 - Start Next.js Dev Server**:
```powershell
cd apps/web
pnpm dev

# Or from root:
pnpm dev:web
```

**What Happens**:
- Next.js dev server starts
- Compiles pages
- You'll see: "Ready - started server on 0.0.0.0:3000"
- "Local: http://localhost:3000"

**Testing**:
1. Open browser: http://localhost:3000
2. You should see:
   - "Pathr" heading (large, bold)
   - "Like Strava for driving" subtitle
   - Centered on page

**Hot Reload**: 
- Edit `apps/web/app/page.tsx`
- Save file
- Browser automatically refreshes

**Troubleshooting**:
- **"Port 3000 already in use"**: 
  ```powershell
  # Kill process on port 3000
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  
  # Or use different port:
  $env:PORT=3001; pnpm dev
  ```
- **"Module not found"**: Run `pnpm install` in `apps/web`
- **Tailwind not working**: Check `tailwind.config.js` and `postcss.config.js` exist

---

### Running Both Apps Simultaneously

**Option 1: Two Terminals**
```powershell
# Terminal 1
cd apps/mobile
pnpm dev

# Terminal 2
cd apps/web
pnpm dev
```

**Option 2: Root Script (if configured)**
```powershell
# From root directory
pnpm dev:all  # Runs both (if script exists)
```

---

### Testing the Setup

#### 1. Verify Monorepo Structure

```powershell
# Check workspace packages are linked
pnpm list --depth=0

# Should show:
# @pathr/mobile
# @pathr/web
# @pathr/ui
# @pathr/shared
```

#### 2. Verify TypeScript Compilation

```powershell
# From root
pnpm typecheck

# Should complete with no errors
```

#### 3. Verify Linting

```powershell
# From root
pnpm lint

# Should complete with no errors (or warnings only)
```

#### 4. Test Shared Packages

**Test Design Tokens**:
```powershell
# Create test file: packages/ui/test.ts
# Import and use tokens
# Should compile without errors
```

**Test Distance Utils**:
```powershell
cd packages/shared
pnpm test

# Should run Jest tests (if tests exist)
```

#### 5. Test Mobile App

1. Start Expo dev server
2. Open in Expo Go or emulator
3. Verify home screen displays
4. Check console for errors

#### 6. Test Web Dashboard

1. Start Next.js dev server
2. Open http://localhost:3000
3. Verify page loads
4. Check browser console (F12) for errors

#### 7. Test Supabase Connection (if configured)

```powershell
# If using local Supabase
# Open http://localhost:54323 (Supabase Studio)
# Login with credentials from supabase start output
# Verify tables exist: profiles, trips, trip_points, trip_stats, sync_queue
```

---

### Common Windows Issues & Solutions

#### Issue 1: PowerShell Execution Policy

**Error**: "cannot be loaded because running scripts is disabled"

**Solution**:
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### Issue 2: Long Path Names

**Error**: "Path too long" during `pnpm install`

**Solution**:
```powershell
# Enable long paths in Git
git config --global core.longpaths true

# Or enable in Windows (requires admin):
# Run: gpedit.msc
# Navigate: Computer Configuration > Administrative Templates > System > Filesystem
# Enable: "Enable Win32 long paths"
```

#### Issue 3: Node Modules Permission Errors

**Error**: "EACCES: permission denied"

**Solution**:
```powershell
# Run PowerShell as Administrator
# Or change npm/pnpm cache location:
pnpm config set store-dir D:\pnpm-store
```

#### Issue 4: Metro Bundler Cache Issues

**Error**: "Unable to resolve module" or stale code

**Solution**:
```powershell
cd apps/mobile
pnpm expo start --clear
# Or:
Remove-Item -Recurse -Force .expo
pnpm expo start
```

#### Issue 5: Android Emulator Not Starting

**Error**: "No Android devices found"

**Solution**:
1. Open Android Studio
2. Tools > Device Manager
3. Create Virtual Device (if none)
4. Start emulator
5. Verify: `adb devices` shows device
6. Then run: `pnpm expo start --android`

#### Issue 6: Port Conflicts

**Error**: "Port XXXX is already in use"

**Solution**:
```powershell
# Find process using port
netstat -ano | findstr :3000

# Kill process (replace <PID> with actual process ID)
taskkill /PID <PID> /F

# Or use different port (for Next.js):
$env:PORT=3001; pnpm dev
```

#### Issue 7: Supabase CLI Not Found

**Error**: "supabase: command not found"

**Solution**:
```powershell
# Install via npm
npm install -g supabase

# Or add to PATH if installed via Scoop
# Scoop installs to: C:\Users\YourUsername\scoop\apps\supabase\current
```

#### Issue 8: Docker Not Running (for Local Supabase)

**Error**: "Cannot connect to Docker daemon"

**Solution**:
1. Install Docker Desktop from https://www.docker.com/products/docker-desktop/
2. Start Docker Desktop
3. Wait for "Docker is running" status
4. Then run: `supabase start`

---

### Next Steps After Setup

Once everything is running:

1. **Verify M0 Completion**:
   - ✅ Monorepo works
   - ✅ Mobile app runs
   - ✅ Web dashboard runs
   - ✅ Shared packages compile
   - ✅ Supabase schema applied

2. **Start M1: Core Recording**:
   - Integrate Supabase Auth
   - Add Mapbox map
   - Implement location permissions
   - Build trip recording state machine

3. **Add Missing Assets** (for mobile):
   - Create app icon (1024x1024 PNG)
   - Create splash screen (1242x2436 PNG)
   - Create adaptive icon (1024x1024 PNG)

4. **Create Basic UI Components**:
   - Liquid Glass button
   - Frosted card component
   - Navigation components

See `README.md` for full milestone details.

---

## 📊 Project Structure Summary

```
pathr/
├── apps/
│   ├── mobile/              # Expo React Native app
│   │   ├── app/            # Expo Router pages
│   │   ├── app.json        # Expo configuration
│   │   └── package.json
│   └── web/                # Next.js dashboard
│       ├── app/            # Next.js App Router
│       ├── next.config.js
│       └── package.json
├── packages/
│   ├── ui/                 # Design system tokens
│   │   └── src/tokens/    # Colors, spacing, typography, etc.
│   └── shared/             # Shared types & utils
│       ├── src/types/      # TypeScript types
│       └── src/utils/      # Utility functions
├── supabase/
│   ├── config.toml         # Local Supabase config
│   └── migrations/         # Database migrations
├── .github/
│   └── workflows/          # CI/CD pipelines
├── docs/
│   └── decisions/          # Architecture Decision Records
├── package.json            # Root package config
├── pnpm-workspace.yaml     # Workspace configuration
├── tsconfig.json           # Root TypeScript config
├── .prettierrc             # Code formatting
├── .gitignore              # Git ignore rules
├── README.md               # Main documentation
├── SETUP.md                # Quick setup guide
├── SETUP_COMPLETE.md       # This file
├── CONTRIBUTING.md         # Contribution guidelines
└── LICENSE                 # MIT License
```

---

## ✅ Verification Checklist

Use this checklist to verify your setup:

- [ ] Node.js 20+ installed (`node --version`)
- [ ] pnpm 8+ installed (`pnpm --version`)
- [ ] Git installed (`git --version`)
- [ ] Dependencies installed (`pnpm install` completed)
- [ ] Environment file created (`.env.local` with Supabase keys)
- [ ] Supabase configured (hosted or local)
- [ ] Mobile app runs (`pnpm --filter mobile dev`)
- [ ] Web dashboard runs (`pnpm dev:web`)
- [ ] TypeScript compiles (`pnpm typecheck`)
- [ ] No linting errors (`pnpm lint`)
- [ ] Shared packages work (imports succeed)
- [ ] Database schema applied (tables exist in Supabase)

---

## 🎉 You're Ready!

Your Pathr foundation is complete and ready for development. The monorepo is set up, all packages are configured, and both apps can run. You can now proceed to M1: Core Recording or add any remaining M0 polish items.

For questions or issues, refer to:
- `README.md` - Full project documentation
- `SETUP.md` - Quick reference
- `CONTRIBUTING.md` - Development guidelines

Happy coding! 🚗✨

