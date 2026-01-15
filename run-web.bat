@echo off
REM Super simple web app launcher - no PowerShell needed!
REM Just double-click this file or run: run-web.bat

cd /d "%~dp0apps\web"

REM Use pnpm.cmd from project root (avoids PowerShell execution policy)
call "%~dp0pnpm.cmd" install
call "%~dp0pnpm.cmd" dev
