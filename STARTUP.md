# 🚀 Pathr Startup Script

The `startup` script automates the entire development environment setup and startup process.

## Quick Start

Simply run:

```bash
pnpm startup
```

That's it! The script will:
1. ✅ Check and setup Node.js/pnpm environment (adds to PATH if needed)
2. ✅ Check for package updates
3. ✅ Install dependencies if needed
4. ✅ Start development servers (web + mobile)
5. ✅ Open your browser automatically

## Usage

### Basic Commands

```bash
# Full startup (recommended)
pnpm startup

# Start only web app
pnpm startup --web-only

# Start only mobile app
pnpm startup --mobile-only

# Skip dependency installation
pnpm startup --skip-install

# Skip update check (faster startup)
pnpm startup --skip-update-check

# Skip Supabase
pnpm startup --no-supabase

# Quiet mode (less output)
pnpm startup --quiet
```

## What It Does

### 1. Environment Setup
- Checks if Node.js is installed and in PATH
- If not found, searches common installation locations
- Adds Node.js to PATH for current session (if needed)
- Checks for pnpm, installs if missing
- Provides instructions for permanent PATH setup

### 2. Update Check
- Checks current Node.js and pnpm versions
- Checks for outdated packages
- Suggests updates if available

### 3. Dependency Installation
- Checks if `node_modules` exist
- Runs `pnpm install` if dependencies are missing
- Skips if already installed (unless `--skip-install` is used)

### 4. Supabase (Optional)
- Checks if Supabase CLI is installed
- Starts local Supabase if available
- Skips gracefully if not installed

### 5. Development Servers
- Starts web app on http://localhost:3000
- Starts mobile app (Expo dev server)
- Opens browser automatically
- Keeps servers running until you stop them (Ctrl+C)

## Troubleshooting

### "pnpm is not recognized"
The script will automatically:
- Find pnpm installation
- Add it to PATH for the session
- Install pnpm if it's missing

If issues persist, manually add to PATH:
- Node.js: `C:\Program Files\nodejs`
- pnpm: `C:\Users\<your-username>\AppData\Roaming\npm`

### "Node.js not found"
Install Node.js from https://nodejs.org/ (LTS version recommended)

### Port Already in Use
If port 3000 or 8081 is already in use:
- Stop the existing process
- Or use `--web-only` or `--mobile-only` to run one app

### Dependencies Won't Install
Try:
```bash
pnpm install --force
```

## Options Reference

| Option | Description |
|--------|-------------|
| `--skip-install` | Skip dependency installation |
| `--skip-update-check` | Skip checking for updates (faster) |
| `--no-supabase` | Don't start local Supabase |
| `--web-only` | Run only the web dashboard |
| `--mobile-only` | Run only the mobile app |
| `--quiet` | Reduce output verbosity |
| `-h, --help` | Show help message |

## Examples

```bash
# First time setup
pnpm startup

# Quick start (skip updates)
pnpm startup --skip-update-check

# Web only (faster)
pnpm startup --web-only

# Mobile only
pnpm startup --mobile-only

# Full control
pnpm startup --skip-install --no-supabase --web-only
```

## After Startup

Once running:
- **Web**: http://localhost:3000 (opens automatically)
- **Mobile**: Scan QR code with Expo Go app
- **Stop**: Press `Ctrl+C` in the terminal

Enjoy the liquid glass theme! 🚗✨


