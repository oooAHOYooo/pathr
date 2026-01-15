# Pathr Startup Script - PowerShell Wrapper
# This script can be run directly without pnpm in PATH

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Pathr Startup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if command exists
function Test-Command {
    param([string]$Command)
    $null = Get-Command $Command -ErrorAction SilentlyContinue
    return $?
}

# Check if Node.js is available
if (-not (Test-Command "node")) {
    Write-Host "[WARN] Node.js not found in PATH, searching..." -ForegroundColor Yellow
    
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
            Write-Host "[OK] Found Node.js at $nodeDir" -ForegroundColor Green
            $nodeFound = $true
            break
        }
    }
    
    if (-not $nodeFound) {
        Write-Host "[ERROR] Node.js not found. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# Check if pnpm is available
if (-not (Test-Command "pnpm")) {
    Write-Host "[WARN] pnpm not found in PATH, searching..." -ForegroundColor Yellow
    
    $pnpmPaths = @(
        "$env:APPDATA\npm\pnpm.cmd",
        "$env:LOCALAPPDATA\pnpm\pnpm.exe"
    )
    
    $pnpmFound = $false
    foreach ($pnpmPath in $pnpmPaths) {
        if (Test-Path $pnpmPath) {
            $pnpmDir = Split-Path $pnpmPath
            $env:PATH = "$env:PATH;$pnpmDir"
            Write-Host "[OK] Found pnpm at $pnpmDir" -ForegroundColor Green
            $pnpmFound = $true
            break
        }
    }
    
    if (-not $pnpmFound) {
        Write-Host "[INFO] pnpm not found. Attempting to install..." -ForegroundColor Yellow
        try {
            npm install -g pnpm
            $env:PATH = "$env:PATH;$env:APPDATA\npm"
            Write-Host "[OK] pnpm installed successfully" -ForegroundColor Green
        } catch {
            Write-Host "[ERROR] Failed to install pnpm. Please run: npm install -g pnpm" -ForegroundColor Red
            Read-Host "Press Enter to exit"
            exit 1
        }
    }
}

# Verify Node.js and pnpm
try {
    $nodeVersion = node --version 2>&1
    $pnpmVersion = pnpm --version 2>&1
    Write-Host "[OK] Environment ready!" -ForegroundColor Green
    Write-Host "  Node.js: $nodeVersion" -ForegroundColor Gray
    Write-Host "  pnpm: $pnpmVersion" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "[ERROR] Environment verification failed" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Run the actual startup script
$scriptPath = Join-Path $PSScriptRoot "scripts\startup.mjs"
$argsString = $args -join " "

try {
    node $scriptPath $argsString
    $exitCode = $LASTEXITCODE
    if ($exitCode -ne 0) {
        Write-Host ""
        Write-Host "[ERROR] Startup script failed with exit code $exitCode" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit $exitCode
    }
} catch {
    Write-Host ""
    Write-Host "[ERROR] Failed to run startup script: $_" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}



