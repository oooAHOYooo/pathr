# Installing Node.js and pnpm

## Quick Fix: Refresh Your Terminal

If Node.js was recently installed, try:
1. **Close and reopen your terminal/PowerShell**
2. Or run: `refreshenv` (if using Chocolatey)
3. Or restart your IDE/editor

## Option 1: Install Node.js (Recommended)

### Using the Official Installer
1. Go to: https://nodejs.org/
2. Download the **LTS version** (v20.x or v22.x)
3. Run the installer
4. **Important**: Check "Add to PATH" during installation
5. Restart your terminal/PowerShell

### Using Chocolatey (if you have it)
```powershell
choco install nodejs-lts
```

### Using Winget (Windows 10/11)
```powershell
winget install OpenJS.NodeJS.LTS
```

## Option 2: Install pnpm

After Node.js is installed, install pnpm globally:

```powershell
npm install -g pnpm
```

Or using standalone installer:
```powershell
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

## Verify Installation

After installing, close and reopen your terminal, then run:

```powershell
node --version
npm --version
pnpm --version
```

You should see version numbers for all three.

## Alternative: Use nvm-windows (Node Version Manager)

If you want to manage multiple Node.js versions:

1. Download nvm-windows: https://github.com/coreybutler/nvm-windows/releases
2. Install it
3. Then run:
```powershell
nvm install 20
nvm use 20
npm install -g pnpm
```

## After Installation

Once Node.js and pnpm are installed:

1. **Navigate to the project**:
   ```powershell
   cd C:\Users\agonzalez7\pathr
   ```

2. **Install dependencies**:
   ```powershell
   pnpm install
   ```

3. **Start the web app**:
   ```powershell
   cd apps/web
   pnpm dev
   ```

4. **Or start both apps** (in a new terminal):
   ```powershell
   pnpm local
   ```

## Troubleshooting

### If pnpm still not found after installation:
1. Check if pnpm is in your PATH:
   ```powershell
   $env:PATH -split ';' | Select-String pnpm
   ```

2. Manually add to PATH (if needed):
   - Find where pnpm is installed (usually `%APPDATA%\npm` or `%LOCALAPPDATA%\pnpm`)
   - Add it to your system PATH in Windows Settings

### If you get permission errors:
Run PowerShell as Administrator and try again.



