# 🚀 Pathr - Running Locally

## One command (recommended)

From the repo root:

```bash
pnpm local
```

This will:
- install dependencies (unless you pass `--skip-install`)
- start local Supabase if the `supabase` CLI is available (skip with `--no-supabase`)
- start **both** web + mobile dev servers

Common options:

```bash
pnpm local --no-supabase
pnpm local --web-only
pnpm local --mobile-only
pnpm local --skip-install
```

## Status

✅ **Node.js v24.12.0** - Installed  
✅ **pnpm 8.15.0** - Installed  
✅ **Dependencies** - All installed (1247 packages)  
✅ **Web Dashboard** - Running on http://localhost:3000  
🔄 **Mobile App** - Starting (Expo dev server)

---

## 🌐 Web Dashboard

**Status**: ✅ Running  
**URL**: http://localhost:3000  
**Process**: Running in background

**To View**:
1. Open your web browser
2. Navigate to: **http://localhost:3000**
3. You should see:
   - "Pathr" heading (large, bold)
   - "Like Strava for driving" subtitle
   - Centered on white background

**To Stop**:
```powershell
# Find the process
netstat -ano | findstr :3000
# Kill it (replace <PID> with the process ID)
taskkill /PID <PID> /F
```

**To Restart**:
```powershell
cd apps/web
pnpm dev
```

---

## 📱 Mobile App (Expo)

**Status**: 🔄 Starting  
**Expected**: Expo dev server on port 8081

**To View**:

### Option 1: Expo Go App (Recommended for Testing)
1. Install **Expo Go** from:
   - Google Play Store (Android): https://play.google.com/store/apps/details?id=host.exp.exponent
   - App Store (iOS): https://apps.apple.com/app/expo-go/id982107779
2. Look for QR code in terminal or check: http://localhost:8081
3. Scan QR code with:
   - **Android**: Open Expo Go app → Scan QR code
   - **iOS**: Open Camera app → Scan QR code (opens Expo Go)

### Option 2: Web Browser
```powershell
# In the mobile app terminal, press 'w'
# Or open: http://localhost:8081
```

### Option 3: Android Emulator
1. Install Android Studio
2. Create/Start an Android Virtual Device
3. In Expo terminal, press 'a' or run:
```powershell
cd apps/mobile
pnpm android
```

**To Check Status**:
```powershell
# Check if Expo is running
netstat -ano | findstr :8081

# Or open in browser
Start-Process "http://localhost:8081"
```

**To Stop**:
```powershell
# Find the process
netstat -ano | findstr :8081
# Kill it
taskkill /PID <PID> /F
```

**To Restart**:
```powershell
cd apps/mobile
pnpm dev
```

---

## 🔍 Troubleshooting

### Web Dashboard Not Loading?

1. **Check if it's running**:
   ```powershell
   netstat -ano | findstr :3000
   ```

2. **Check for errors**:
   - Look at the terminal where you ran `pnpm dev`
   - Check browser console (F12)

3. **Port conflict?**:
   ```powershell
   # Kill process on port 3000
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

4. **Restart**:
   ```powershell
   cd apps/web
   pnpm dev
   ```

### Mobile App Not Starting?

1. **Check Expo CLI**:
   ```powershell
   npm install -g expo-cli
   ```

2. **Clear cache**:
   ```powershell
   cd apps/mobile
   pnpm expo start --clear
   ```

3. **Check for errors**:
   - Look at the terminal output
   - Check if port 8081 is available

4. **Install missing dependencies**:
   ```powershell
   cd apps/mobile
   pnpm install
   ```

---

## 📊 What's Installed

- **Node.js**: v24.12.0
- **pnpm**: 8.15.0
- **Packages**: 1247 installed
- **Workspace Packages**:
  - `@pathr/mobile` - Expo React Native app
  - `@pathr/web` - Next.js dashboard
  - `@pathr/ui` - Design system tokens
  - `@pathr/shared` - Shared types & utils

---

## 🎯 Next Steps

1. **Open Web Dashboard**: http://localhost:3000
2. **Test Mobile App**: Use Expo Go app to scan QR code
3. **Check Both Apps**: Verify they display "Pathr" correctly
4. **Review Code**: Check `apps/web/app/page.tsx` and `apps/mobile/app/index.tsx`

---

## 📝 Quick Commands

```powershell
# Start web dashboard
cd apps/web
pnpm dev

# Start mobile app
cd apps/mobile
pnpm dev

# Install dependencies (if needed)
pnpm install

# Type check
pnpm typecheck

# Lint
pnpm lint
```

---

**Last Updated**: Just now  
**Status**: Web running ✅ | Mobile starting 🔄

