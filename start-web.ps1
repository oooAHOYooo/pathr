# PowerShell script to start the web app
# This works better than batch files in PowerShell

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting Pathr Web App" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Add Node.js to PATH first (pnpm needs it)
$nodePaths = @(
    "C:\Program Files\nodejs",
    "C:\Program Files (x86)\nodejs"
)

$nodeFound = $false
foreach ($nodePath in $nodePaths) {
    if (Test-Path "$nodePath\node.exe") {
        $env:PATH = "$nodePath;$env:PATH"
        Write-Host "[OK] Found Node.js at $nodePath" -ForegroundColor Green
        $nodeFound = $true
        break
    }
}

if (-not $nodeFound) {
    # Check if node is already in PATH
    try {
        $null = Get-Command node -ErrorAction Stop
        Write-Host "[OK] Node.js found in PATH" -ForegroundColor Green
        $nodeFound = $true
    } catch {
        Write-Host "[ERROR] Node.js not found. Please install from https://nodejs.org/" -ForegroundColor Red
        exit 1
    }
}

# Add pnpm to PATH
$pnpmPath = "$env:APPDATA\npm"
if (Test-Path "$pnpmPath\pnpm.cmd") {
    $env:PATH = "$env:PATH;$pnpmPath"
    Write-Host "[OK] Found pnpm" -ForegroundColor Green
} else {
    Write-Host "[ERROR] pnpm not found at $pnpmPath" -ForegroundColor Red
    Write-Host "Please install: npm install -g pnpm" -ForegroundColor Yellow
    exit 1
}

# Verify pnpm works
try {
    $version = & pnpm --version 2>&1
    Write-Host "[OK] pnpm version: $version" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] pnpm is not working" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Navigate to web directory
$webPath = Join-Path $PSScriptRoot "apps\web"
Set-Location $webPath

if (-not (Test-Path "package.json")) {
    Write-Host "[ERROR] Could not find package.json in $webPath" -ForegroundColor Red
    exit 1
}

Write-Host "[INFO] Current directory: $(Get-Location)" -ForegroundColor Gray
Write-Host "[INFO] Starting Next.js dev server..." -ForegroundColor Cyan
Write-Host "[INFO] Server will be available at: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start the dev server
& pnpm dev

