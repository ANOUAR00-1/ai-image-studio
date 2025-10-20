@echo off
echo ========================================
echo Starting PixFusion AI Studio Dev Server
echo ========================================
echo.

REM Step 1: Kill all node processes
echo [1/5] Stopping Node processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 3 /nobreak >nul

REM Step 2: Remove .next and trace files
echo [2/5] Clearing cache...
if exist .next\trace del /f /q .next\trace >nul 2>&1
if exist .next rmdir /s /q .next >nul 2>&1
timeout /t 2 /nobreak >nul

REM Step 3: Disable Windows Defender real-time scanning on .next folder temporarily
echo [3/5] Setting up folder...
if not exist .next mkdir .next >nul 2>&1

REM Step 4: Set environment variable to disable telemetry
echo [4/5] Configuring environment...
set NEXT_TELEMETRY_DISABLED=1
set NODE_OPTIONS=--no-warnings

REM Step 5: Start server
echo [5/5] Starting server...
echo.
echo ========================================
echo Server will start at http://localhost:3000
echo ========================================
echo.

npm run dev
