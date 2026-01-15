# 🚀 Quick Start - Web App

## Start the Web App (Simplest Method)

**Just run this:**
```powershell
.\start-web.bat
```

Or:
```powershell
.\start.bat web
```

---

## What Happens

1. ✅ Script finds pnpm automatically
2. ✅ Starts Next.js dev server
3. ✅ Server runs on **http://localhost:3000**
4. ✅ Open that URL in your browser

---

## Manual Method (If Scripts Don't Work)

```powershell
# 1. Add pnpm to PATH
$env:PATH += ";C:\Users\agonzalez7\AppData\Roaming\npm"

# 2. Go to web directory
cd apps\web

# 3. Start server
pnpm dev
```

Then open **http://localhost:3000** in your browser.

---

## Verify It's Working

After starting, you should see:
- Terminal shows: `Ready - started server on 0.0.0.0:3000`
- Browser at http://localhost:3000 shows the Pathr homepage

---

## Troubleshooting

### "pnpm not found"
```powershell
npm install -g pnpm
```

### "Port 3000 already in use"
```powershell
# Find and kill the process
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### "Module not found"
```powershell
# Install dependencies
cd C:\Users\agonzalez7\pathr
pnpm install
```

---

That's it! 🎉


