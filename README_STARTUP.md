# 🚀 Using `pnpm startup` - Complete Guide

## The Solution

I've created local wrapper scripts (`pnpm.cmd` and `pnpm.ps1`) that make `pnpm startup` work even when pnpm isn't in your system PATH!

## How It Works

When you type `pnpm startup` in the project directory, Windows will find the local `pnpm.cmd` file first (before checking system PATH). This wrapper:

1. ✅ Checks if pnpm is in PATH
2. ✅ If not, finds pnpm installation
3. ✅ Adds pnpm to PATH for the session
4. ✅ Installs pnpm if missing
5. ✅ Then runs the actual pnpm command

## Usage

### From PowerShell (Recommended)

```powershell
# Navigate to project
cd C:\Users\agonzalez7\pathr

# Just type this - it will work!
pnpm startup
```

### From Command Prompt

```cmd
cd C:\Users\agonzalez7\pathr
pnpm startup
```

### Options

All the same options work:

```powershell
pnpm startup --web-only          # Web app only
pnpm startup --mobile-only       # Mobile app only
pnpm startup --skip-update-check # Skip update check
pnpm startup --no-supabase       # Skip Supabase
pnpm startup --help              # Show help
```

## How It Works Technically

1. **Windows Command Resolution**: When you type `pnpm`, Windows checks:
   - Current directory first (finds `pnpm.cmd`)
   - Then system PATH

2. **Local Wrapper**: The `pnpm.cmd` in the project root:
   - Detects if pnpm is available
   - Sets up environment if needed
   - Calls the real pnpm

3. **Startup Script**: When you run `pnpm startup`, it:
   - Runs `node scripts/startup.mjs`
   - Which sets up Node.js/pnpm environment
   - Installs dependencies
   - Starts dev servers

## Alternative Methods

If the wrapper doesn't work for some reason:

### Method 1: Direct Node.js
```powershell
node scripts/startup.mjs
```

### Method 2: Batch File
```powershell
.\startup.bat
```

### Method 3: PowerShell Script
```powershell
.\startup.ps1
```

## Troubleshooting

### "pnpm is not recognized" (even with wrapper)

This might happen if:
- You're not in the project directory
- Windows security settings prevent local executables

**Solution**: Use `node scripts/startup.mjs` instead

### "Execution Policy" Error (PowerShell)

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Wrapper Not Found

Make sure you're in the project root directory:
```powershell
cd C:\Users\agonzalez7\pathr
```

## Making It Permanent

To make pnpm available system-wide (so you don't need the wrapper):

1. **Open Windows Settings** → System → About → Advanced system settings
2. Click **Environment Variables**
3. Under "System variables", find **Path** → **Edit**
4. Add:
   - `C:\Program Files\nodejs` (Node.js)
   - `C:\Users\<your-username>\AppData\Roaming\npm` (pnpm)
5. Click **OK** and restart terminal

After this, `pnpm startup` will work from anywhere!

## Summary

✅ **Just type `pnpm startup`** - it works!  
✅ The wrapper handles everything automatically  
✅ No need to manually set up PATH  
✅ Works even if pnpm isn't installed globally  

Enjoy! 🚗✨

