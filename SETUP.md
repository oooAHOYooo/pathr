# Pathr Setup Guide

## ✅ M0: Foundation - Complete!

The foundation has been set up. Here's what's ready:

### Monorepo Structure
- ✅ pnpm workspaces configured
- ✅ Shared packages (`@pathr/ui`, `@pathr/shared`)
- ✅ Design tokens (colors, spacing, typography, etc.)

### Mobile App (Expo)
- ✅ Expo Router setup
- ✅ Basic app shell with home screen
- ✅ TypeScript configuration
- ✅ Path aliases for shared packages

### Web Dashboard (Next.js)
- ✅ Next.js 14 with App Router
- ✅ Tailwind CSS configured
- ✅ TypeScript setup
- ✅ Basic home page

### Supabase
- ✅ Local config (`supabase/config.toml`)
- ✅ Initial migration with schema
- ✅ RLS policies configured

### CI/CD
- ✅ GitHub Actions workflow
- ✅ Lint, typecheck, test, build checks

## 🚀 Next Steps

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Set Up Environment Variables
```bash
cp .env.example .env.local
# Edit .env.local with your keys
```

### 3. Start Supabase (if using local)
```bash
# Install Supabase CLI first: https://supabase.com/docs/guides/cli
pnpm supabase start
```

### 4. Run Database Migrations
```bash
pnpm supabase db reset
```

### 5. Start Development
```bash
# Mobile app
cd apps/mobile
pnpm dev

# Web dashboard (new terminal)
cd apps/web
pnpm dev
```

## 📝 Missing Pieces (for M0 completion)

1. **Mobile App Assets**
   - Add `apps/mobile/assets/icon.png` (1024x1024)
   - Add `apps/mobile/assets/splash.png` (1242x2436)
   - Add `apps/mobile/assets/adaptive-icon.png` (1024x1024)
   - Add `apps/mobile/assets/favicon.png` (48x48)

2. **Basic UI Components** (M0-5)
   - Create Liquid Glass button component
   - Create frosted card component
   - Create basic navigation components

3. **ESLint Configuration**
   - Add ESLint configs to each package
   - Add shared ESLint config

## 🎯 Ready for M1

Once M0 is complete, you can move to M1: Core Recording:
- Supabase Auth integration
- Mapbox map integration
- Location permissions
- Trip recording state machine

See README.md for full milestone details.



