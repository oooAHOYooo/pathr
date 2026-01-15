# ⚡ Super Quick Start (No PowerShell Issues!)

## Just Run This:

### Windows (Easiest)

**Double-click**: `run-web.bat`

Or from PowerShell:
```powershell
.\run-web.bat
```

Or from Command Prompt (CMD):
```cmd
run-web.bat
```

That's it! The app will be at **http://localhost:3000**

---

## Alternative Methods

### Method 1: Use Batch Files (No PowerShell)

```cmd
start-web.bat
```

or

```cmd
start.bat web
```

### Method 2: Use pnpm.cmd (Avoids PowerShell)

```cmd
cd apps\web
pnpm.cmd install
pnpm.cmd dev
```

### Method 3: Fix PowerShell (One-Time Setup)

If you want to use `pnpm` directly in PowerShell:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then you can use:
```powershell
cd apps\web
pnpm install
pnpm dev
```

---

## Why This Happens

Windows PowerShell has a security feature that blocks scripts by default. The `pnpm` command is a PowerShell script (`.ps1`), so it gets blocked.

**Solutions**:
- ✅ Use batch files (`.bat`) - they don't have this issue
- ✅ Use `pnpm.cmd` - it's a batch file wrapper
- ✅ Change execution policy (one-time setup)

---

## What You'll See

After running, open: **http://localhost:3000**

You'll see a beautiful landing page with:
- "Pathr" heading
- "Like Strava for driving" subtitle
- Frosted glass design effects
- Gradient backgrounds

---

## Need Help?

- See `LOCAL_RUN.md` for detailed instructions
- See `MVP_SIMPLIFICATION.md` for MVP recommendations
