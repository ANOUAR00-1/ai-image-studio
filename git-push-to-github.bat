@echo off
echo ========================================
echo   Push to GitHub - First Time
echo ========================================
echo.

set /p username="Enter your GitHub username: "
echo.

echo Connecting to GitHub repository...
git remote add origin https://github.com/%username%/pixfusion-ai-studio.git

echo.
echo Setting main branch...
git branch -M main

echo.
echo Pushing to GitHub...
git push -u origin main

echo.
echo ========================================
echo   Success! Your project is on GitHub!
echo ========================================
echo.
echo View it at: https://github.com/%username%/pixfusion-ai-studio
echo.
pause
