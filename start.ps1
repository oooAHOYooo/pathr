# Simple startup script - bypasses execution policy by using cmd
# Usage: .\start.ps1 [web|mobile|all]

param(
    [string]$Mode = "web"
)

# Add pnpm to PATH
$pnpmPath = "$env:APPDATA\npm"
if (Test-Path "$pnpmPath\pnpm.cmd") {
    $env:PATH = "$env:PATH;$pnpmPath"
    Write-Host "[OK] Found pnpm" -ForegroundColor Green
} else {
    Write-Host "[ERROR] pnpm not found. Please install: npm install -g pnpm" -ForegroundColor Red
    exit 1
}

# Add Node.js to PATH if needed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    $nodePaths = @(
        "C:\Program Files\nodejs",
        "C:\Program Files (x86)\nodejs"
    )
    foreach ($nodePath in $nodePaths) {
        if (Test-Path "$nodePath\node.exe") {
            $env:PATH = "$env:PATH;$nodePath"
            break
        }
    }
}

# Run the appropriate command
switch ($Mode.ToLower()) {
    "web" {
        Write-Host "Starting web app..." -ForegroundColor Cyan
        Write-Host "Open http://localhost:3000 in your browser" -ForegroundColor Yellow
        & cmd /c "pnpm dev:web"
    }
    "mobile" {
        Write-Host "Starting mobile app..." -ForegroundColor Cyan
        Push-Location apps\mobile
        & cmd /c "pnpm dev"
        Pop-Location
    }
    "all" {
        Write-Host "Starting web + mobile apps..." -ForegroundColor Cyan
        & cmd /c "pnpm dev:all"
    }
    default {
        Write-Host "Usage: .\start.ps1 [web|mobile|all]" -ForegroundColor Yellow
        Write-Host "Starting web app by default..." -ForegroundColor Cyan
        & cmd /c "pnpm dev:web"
    }
}

