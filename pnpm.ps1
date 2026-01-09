# Local pnpm wrapper - makes pnpm available even if not in system PATH
# This file allows "pnpm startup" to work without pnpm in PATH

param(
    [Parameter(ValueFromRemainingArguments=$true)]
    [string[]]$Arguments
)

# Function to check if command exists
function Test-Command {
    param([string]$Command)
    $null = Get-Command $Command -ErrorAction SilentlyContinue
    return $?
}

# Check if pnpm is already in PATH
if (Test-Command "pnpm") {
    & pnpm $Arguments
    exit $LASTEXITCODE
}

# pnpm not in PATH, try to find it
$pnpmFound = $false

# Check common pnpm locations
$pnpmPaths = @(
    "$env:APPDATA\npm\pnpm.cmd",
    "$env:LOCALAPPDATA\pnpm\pnpm.exe"
)

foreach ($pnpmPath in $pnpmPaths) {
    if (Test-Path $pnpmPath) {
        $pnpmDir = Split-Path $pnpmPath
        $env:PATH = "$env:PATH;$pnpmDir"
        $pnpmFound = $true
        break
    }
}

if ($pnpmFound) {
    & pnpm $Arguments
    exit $LASTEXITCODE
}

# pnpm not found, try to install it
Write-Host "[INFO] pnpm not found. Checking for Node.js..." -ForegroundColor Yellow

# Check if Node.js is available
if (-not (Test-Command "node")) {
    # Try to find Node.js
    $nodePaths = @(
        "C:\Program Files\nodejs\node.exe",
        "C:\Program Files (x86)\nodejs\node.exe",
        "$env:LOCALAPPDATA\Programs\nodejs\node.exe"
    )
    
    $nodeFound = $false
    foreach ($nodePath in $nodePaths) {
        if (Test-Path $nodePath) {
            $nodeDir = Split-Path $nodePath
            $env:PATH = "$env:PATH;$nodeDir"
            $nodeFound = $true
            break
        }
    }
    
    if (-not $nodeFound) {
        Write-Host "[ERROR] Node.js not found. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
        exit 1
    }
}

# Try to install pnpm
Write-Host "[INFO] Installing pnpm globally..." -ForegroundColor Yellow
try {
    npm install -g pnpm
    $env:PATH = "$env:PATH;$env:APPDATA\npm"
} catch {
    Write-Host "[ERROR] Failed to install pnpm. Please run: npm install -g pnpm" -ForegroundColor Red
    exit 1
}

# Now try pnpm again
& pnpm $Arguments
exit $LASTEXITCODE


