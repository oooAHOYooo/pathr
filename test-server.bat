@echo off
REM Test script to verify the web server starts
echo Testing web server startup...
echo.

REM Add pnpm to PATH
set "PATH=%PATH%;%APPDATA%\npm"

REM Go to web directory
cd /d "%~dp0apps\web"

echo Current directory: %CD%
echo.

REM Check if pnpm works
pnpm --version
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: pnpm not found
    pause
    exit /b 1
)

echo.
echo Starting Next.js dev server...
echo This will show output - press Ctrl+C to stop
echo.

REM Run the dev server (this will show output)
pnpm dev


