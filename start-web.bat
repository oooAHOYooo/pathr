@echo off
REM Simple web server startup - guaranteed to work
REM This script starts the Next.js dev server on http://localhost:3000

echo.
echo ========================================
echo   Starting Pathr Web App
echo ========================================
echo.

REM Ensure we're in project root
cd /d "%~dp0"

REM Add pnpm to PATH
set "PATH=%PATH%;%APPDATA%\npm"

REM Verify pnpm
pnpm --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] pnpm not found. Please install: npm install -g pnpm
    echo.
    echo Trying to find pnpm in other locations...
    if exist "%LOCALAPPDATA%\pnpm\pnpm.exe" (
        set "PATH=%PATH%;%LOCALAPPDATA%\pnpm"
        echo [OK] Found pnpm at %LOCALAPPDATA%\pnpm
    ) else (
        pause
        exit /b 1
    )
)

echo [OK] pnpm found
echo.

REM Navigate to web app directory
cd /d "%~dp0apps\web"

if not exist "package.json" (
    echo [ERROR] Could not find apps\web\package.json
    echo Current directory: %CD%
    pause
    exit /b 1
)

echo [INFO] Current directory: %CD%
echo [INFO] Starting Next.js dev server...
echo [INFO] Server will be available at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

REM Start the dev server - IMPORTANT: Don't use 'call', just run it directly
REM This keeps the process running in this window
pnpm dev

REM If we get here, the server stopped
echo.
echo Server stopped.
pause
