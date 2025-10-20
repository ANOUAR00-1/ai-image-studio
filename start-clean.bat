@echo off
echo Cleaning and starting dev server...
echo.

REM Kill all node processes
echo Stopping any running Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

REM Remove .next folder
echo Removing .next cache folder...
if exist .next (
    rmdir /s /q .next 2>nul
    timeout /t 1 /nobreak >nul
)

REM Start dev server
echo.
echo Starting development server...
echo.
npm run dev
