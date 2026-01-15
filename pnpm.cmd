@echo off
REM Local pnpm wrapper - makes pnpm available even if not in system PATH
REM This file allows "pnpm startup" to work without pnpm in PATH

REM Check if pnpm is already in PATH
where pnpm >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    REM pnpm is in PATH, use it directly
    pnpm %*
    exit /b %ERRORLEVEL%
)

REM pnpm not in PATH, try to find it
set "PNPM_FOUND=0"

REM Check common pnpm locations
if exist "%APPDATA%\npm\pnpm.cmd" (
    set "PATH=%PATH%;%APPDATA%\npm"
    set "PNPM_FOUND=1"
) else if exist "%LOCALAPPDATA%\pnpm\pnpm.exe" (
    set "PATH=%PATH%;%LOCALAPPDATA%\pnpm"
    set "PNPM_FOUND=1"
)

if %PNPM_FOUND% EQU 1 (
    REM Found pnpm, use it
    pnpm %*
    exit /b %ERRORLEVEL%
)

REM pnpm not found, try to install it
echo [INFO] pnpm not found. Checking for Node.js...
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    REM Node.js not in PATH either, try to find it
    if exist "C:\Program Files\nodejs\node.exe" (
        set "PATH=%PATH%;C:\Program Files\nodejs"
    ) else if exist "C:\Program Files (x86)\nodejs\node.exe" (
        set "PATH=%PATH%;C:\Program Files (x86)\nodejs"
    ) else (
        echo [ERROR] Node.js not found. Please install Node.js from https://nodejs.org/
        exit /b 1
    )
)

REM Try to install pnpm
echo [INFO] Installing pnpm globally...
call npm install -g pnpm
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install pnpm. Please run: npm install -g pnpm
    exit /b 1
)

REM Add npm global bin to PATH
set "PATH=%PATH%;%APPDATA%\npm"

REM Now try pnpm again
pnpm %*
exit /b %ERRORLEVEL%



