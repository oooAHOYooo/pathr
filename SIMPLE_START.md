# 🚀 Simple Startup Guide

## Quick Start (Easiest Method)

### Option 1: Use the Simple Batch File (Recommended)

Just double-click or run:
```powershell
.\start.bat
```

Or specify what to run:
```powershell
.\start.bat web      # Web app only
.\start.bat mobile   # Mobile app only
```

**No execution policy issues!** Works immediately.

---

### Option 2: Add pnpm to PATH (One-time setup)

Run this once in PowerShell:
```powershell
$env:PATH += ";C:\Users\agonzalez7\AppData\Roaming\npm"
```

Then you can use pnpm normally:
```powershell
pnpm dev:web    # Web app
pnpm dev        # Mobile app  
pnpm dev:all    # Both
```

---

### Option 3: Use Node.js Directly

```powershell
node scripts/startup.mjs --web-only
```

---

## What Each Command Does

- **`.\start.bat`** → Starts web app at http://localhost:3000
- **`.\start.bat web`** → Web app only
- **`.\start.bat mobile`** → Mobile app only
- **`pnpm dev:web`** → Web app (after adding to PATH)
- **`pnpm dev`** → Mobile app (after adding to PATH)

---

## Troubleshooting

### "pnpm not found"
Run: `npm install -g pnpm`

### "Execution policy error"  
Use `.\start.bat` instead (no PowerShell needed)

### "Port 3000 already in use"
Kill the process:
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

That's it! 🎉


