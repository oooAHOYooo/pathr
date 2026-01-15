# 🚀 Quick Start for Windows

## The Problem

If you see `pnpm is not recognized`, it means pnpm isn't in your PATH yet. Don't worry - we have solutions!

## Solution 1: Use the Wrapper Scripts (Easiest)

### Option A: Batch File (Double-click or run in terminal)

```powershell
.\startup.bat
```

Or just double-click `startup.bat` in Windows Explorer!

### Option B: PowerShell Script

```powershell
.\startup.ps1
```

If you get an execution policy error, run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\startup.ps1
```

## Solution 2: Run with Node.js Directly

Since Node.js is installed, you can run the startup script directly:

```powershell
node scripts/startup.mjs
```

This will:
1. Set up pnpm in PATH
2. Install dependencies
3. Start everything

**After the first run**, `pnpm` will be available and you can use `pnpm startup` normally.

## Solution 3: Add to PATH Permanently

To make pnpm available permanently:

1. **Open Windows Settings** → System → About → Advanced system settings
2. Click **Environment Variables**
3. Under "System variables", find and select **Path**, then click **Edit**
4. Click **New** and add:
   - `C:\Program Files\nodejs` (for Node.js)
   - `C:\Users\<your-username>\AppData\Roaming\npm` (for pnpm)
5. Click **OK** on all dialogs
6. **Restart your terminal/PowerShell**

After restarting, `pnpm startup` will work!

## Recommended Workflow

1. **First time**: Run `.\startup.bat` or `node scripts/startup.mjs`
2. **After PATH is set**: Use `pnpm startup` (faster)

## Troubleshooting

### "Execution Policy" Error (PowerShell)

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### "Node.js not found"

Install Node.js from https://nodejs.org/ (LTS version)

### Still having issues?

Run this to see what's available:
```powershell
node --version
npm --version
```

If both work, the startup script will handle pnpm automatically!



