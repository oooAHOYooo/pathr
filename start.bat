@echo off
REM Simple startup script - no execution policy issues
REM Just adds pnpm to PATH and runs the dev server

echo.
echo ========================================
echo   Starting Pathr Development Server
echo ========================================
echo.

REM Make sure we're in the project root
cd /d "%~dp0"

REM Add pnpm to PATH if not already there
set "PNPM_PATH=%APPDATA%\npm"
if exist "%PNPM_PATH%\pnpm.cmd" (
    set "PATH=%PATH%;%PNPM_PATH%"
    echo [OK] Found pnpm
) else (
    echo [ERROR] pnpm not found at %PNPM_PATH%
    echo Please install pnpm: npm install -g pnpm
    pause
    exit /b 1
)

REM Add Node.js to PATH if not already there
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    if exist "C:\Program Files\nodejs\node.exe" (
        set "PATH=%PATH%;C:\Program Files\nodejs"
        echo [OK] Found Node.js
    ) else if exist "C:\Program Files (x86)\nodejs\node.exe" (
        set "PATH=%PATH%;C:\Program Files (x86)\nodejs"
        echo [OK] Found Node.js
    ) else (
        echo [ERROR] Node.js not found
        pause
        exit /b 1
    )
)

REM Verify pnpm works
pnpm --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] pnpm is not working
    pause
    exit /b 1
)

REM Check what to run (default to web)
if "%1"=="web" goto :web
if "%1"=="mobile" goto :mobile
goto :web

:web
echo.
echo ========================================
echo   Starting Web App
echo ========================================
echo.
echo Server will be available at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

REM Navigate to web directory and run directly
cd /d "%~dp0apps\web"
if not exist "package.json" (
    echo [ERROR] Could not find apps\web\package.json
    echo Current directory: %CD%
    pause
    exit /b 1
)

echo [INFO] Current directory: %CD%
echo [INFO] Running: pnpm dev
echo.

REM Start the server (use call to ensure it runs properly)
call pnpm dev
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Failed to start server. Error code: %ERRORLEVEL%
    pause
    exit /b %ERRORLEVEL%
)

REM If we get here, server stopped
goto :end

:mobile
echo.
echo ========================================
echo   Starting Mobile App
echo ========================================
echo.
cd /d "%~dp0apps\mobile"
if not exist "package.json" (
    echo [ERROR] Could not find apps\mobile\package.json
    pause
    exit /b 1
)
call pnpm dev
goto :end

:end
echo.
echo Server stopped.
pause
