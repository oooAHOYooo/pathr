@echo off
REM Debug version - shows what's happening
echo.
echo ========================================
echo   Starting Pathr Web App (Debug Mode)
echo ========================================
echo.

REM Ensure we're in project root
cd /d "%~dp0"
echo [DEBUG] Project root: %CD%
echo.

REM Add pnpm to PATH
set "PATH=%PATH%;%APPDATA%\npm"
echo [DEBUG] PATH includes: %APPDATA%\npm
echo.

REM Verify pnpm
echo [DEBUG] Checking pnpm...
pnpm --version
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] pnpm not found
    pause
    exit /b 1
)
echo [OK] pnpm found
echo.

REM Navigate to web app directory
cd apps\web
echo [DEBUG] Changed to: %CD%
echo.

if not exist "package.json" (
    echo [ERROR] package.json not found in %CD%
    pause
    exit /b 1
)
echo [OK] Found package.json
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo [WARN] node_modules not found - dependencies may not be installed
    echo [INFO] Run: pnpm install
    echo.
)

echo [INFO] Starting Next.js dev server...
echo [INFO] Server will be available at: http://localhost:3000
echo.
echo ========================================
echo.

REM Start the dev server - don't use call, just run it directly
echo [DEBUG] Executing: pnpm dev
echo.
pnpm dev

echo.
echo [DEBUG] pnpm dev exited with code: %ERRORLEVEL%
pause

