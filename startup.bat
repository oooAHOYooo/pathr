@echo off
REM Pathr Startup Script - Windows Batch Wrapper
REM This script can be run directly without pnpm in PATH

echo.
echo ========================================
echo   Pathr Startup Script
echo ========================================
echo.

REM Check if Node.js is available
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [WARN] Node.js not found in PATH, searching...
    
    REM Try common Node.js locations
    if exist "C:\Program Files\nodejs\node.exe" (
        set "PATH=%PATH%;C:\Program Files\nodejs"
        echo [OK] Found Node.js at C:\Program Files\nodejs
    ) else if exist "C:\Program Files (x86)\nodejs\node.exe" (
        set "PATH=%PATH%;C:\Program Files (x86)\nodejs"
        echo [OK] Found Node.js at C:\Program Files (x86)\nodejs
    ) else (
        echo [ERROR] Node.js not found. Please install Node.js from https://nodejs.org/
        pause
        exit /b 1
    )
)

REM Check if pnpm is available
where pnpm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [WARN] pnpm not found in PATH, searching...
    
    REM Try common pnpm locations
    if exist "%APPDATA%\npm\pnpm.cmd" (
        set "PATH=%PATH%;%APPDATA%\npm"
        echo [OK] Found pnpm at %APPDATA%\npm
    ) else if exist "%LOCALAPPDATA%\pnpm\pnpm.exe" (
        set "PATH=%PATH%;%LOCALAPPDATA%\pnpm"
        echo [OK] Found pnpm at %LOCALAPPDATA%\pnpm
    ) else (
        echo [INFO] pnpm not found. Attempting to install...
        call npm install -g pnpm
        if %ERRORLEVEL% NEQ 0 (
            echo [ERROR] Failed to install pnpm. Please run: npm install -g pnpm
            pause
            exit /b 1
        )
        set "PATH=%PATH%;%APPDATA%\npm"
        echo [OK] pnpm installed successfully
    )
)

REM Verify Node.js and pnpm
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not working properly
    pause
    exit /b 1
)

pnpm --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] pnpm is not working properly
    pause
    exit /b 1
)

echo.
echo [OK] Environment ready!
echo.

REM Run the actual startup script
node scripts/startup.mjs %*

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Startup script failed
    pause
    exit /b %ERRORLEVEL%
)

pause


