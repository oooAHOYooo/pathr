# 🚀 Running Pathr Locally

## Quick Start (Simplest Method)

### Option 1: Easiest - Just Double-Click! ⭐

**Windows**: Double-click `run-web.bat` in the project root

Or from PowerShell:
```powershell
.\run-web.bat
```

Or from Command Prompt (CMD):
```cmd
run-web.bat
```

This will:
- Install dependencies (if needed)
- Start the web app
- Open http://localhost:3000 in your browser

**What you'll see**: A beautiful landing page with "Liquid Glass" design (frosted glass effects, gradients)

### Option 2: Use Existing Batch Files

```cmd
# From project root
start-web.bat
```

Or:
```cmd
start.bat web
```

### Option 3: Manual (If PowerShell Execution Policy Blocks pnpm)

**Problem**: PowerShell execution policy blocks `pnpm` command

**Solution**: Use `pnpm.cmd` instead of `pnpm`:

```cmd
# From project root
cd apps\web
pnpm.cmd install
pnpm.cmd dev
```

Or use the wrapper from project root:
```cmd
# From project root
pnpm.cmd --filter web dev
```

### Option 2: Use the Local Dev Script

```powershell
# From project root
pnpm install
pnpm local --web-only
```

This will:
- Install dependencies
- Start the web app
- Open browser automatically

### Option 3: Mobile App (Expo)

```powershell
# From project root
cd apps\mobile
pnpm install
pnpm dev
```

Then scan QR code with Expo Go app on your phone.

---

## Current Status

### ✅ What's Working
- **Web Dashboard**: Landing page with "Liquid Glass" UI design
- **Mobile App**: Basic shell with home screen
- **Monorepo Structure**: Workspace packages configured
- **Design System**: UI tokens (colors, spacing, typography) ready

### ❌ What's NOT Implemented Yet
- **No Authentication**: Supabase auth not integrated
- **No Maps**: Mapbox not integrated
- **No Trip Recording**: Core feature not built
- **No Database Connection**: Supabase client not set up
- **No Backend Logic**: All features are placeholders

**Current State**: This is a **UI shell** - beautiful design, but no functionality yet.

---

## Environment Variables (Optional for Now)

The app currently works **without** environment variables (just shows the landing page).

When you're ready to add functionality, create `.env.local` in the project root:

```bash
# Supabase (optional - not needed for UI shell)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx

# Mapbox (optional - not needed for UI shell)
EXPO_PUBLIC_MAPBOX_TOKEN=xxx
```

**Note**: The README mentions `.env.example`, but it doesn't exist yet. You can create `.env.local` when needed.

---

## Supabase Setup (Optional)

### Option A: Use Hosted Supabase (Easier)
1. Go to https://supabase.com
2. Create a new project
3. Copy API URL and anon key to `.env.local`
4. Run migrations in SQL Editor (see `supabase/migrations/`)

### Option B: Local Supabase (More Control)
```powershell
# Install Supabase CLI first: https://supabase.com/docs/guides/cli
# Make sure Docker Desktop is running

supabase start
# This starts local PostgreSQL + Supabase API
# Note the connection details from output

# Run migrations
supabase db reset
```

**Note**: Supabase is only needed when you implement authentication and database features.

---

## Troubleshooting

### "pnpm not found" or PowerShell Execution Policy Error

**Quick Fix**: Use `pnpm.cmd` instead of `pnpm`:
```cmd
pnpm.cmd install
pnpm.cmd dev
```

**Or use the batch files**:
```powershell
.\run-web.bat
```

**Or install pnpm globally**:
```cmd
npm install -g pnpm
```

**Or fix PowerShell execution policy** (if you want to use `pnpm` directly):
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### "Port 3000 already in use"
```powershell
# Find the process
netstat -ano | findstr :3000
# Kill it (replace <PID> with the process ID)
taskkill /PID <PID> /F
```

### "Cannot find module" errors
```powershell
# Reinstall dependencies
pnpm install --force
```

### Metro bundler cache issues (mobile)
```powershell
cd apps/mobile
pnpm expo start --clear
```

---

## What's Next?

To make this a working MVP, you need to implement:

1. **M1: Core Recording** (Week 1-2)
   - Supabase Auth integration
   - Mapbox map integration
   - Location permissions
   - Trip recording (start/stop)
   - Local storage

2. **M2: Backend & Library** (Week 2-3)
   - Trip sync to Supabase
   - Trip library screen
   - Trip details screen

3. **M3: Share & Polish** (Week 3-4)
   - Shareable links
   - Privacy controls
   - Error handling

See `README.md` for full MVP roadmap.
