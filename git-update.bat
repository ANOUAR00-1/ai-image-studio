@echo off
echo ========================================
echo   Update GitHub Repository
echo ========================================
echo.

echo Checking current changes...
git status

echo.
set /p commit_msg="Enter commit message (describe your changes): "

echo.
echo Adding changes...
git add .

echo.
echo Committing changes...
git commit -m "%commit_msg%"

echo.
echo Pushing to GitHub...
git push

echo.
echo ========================================
echo   Success! Changes uploaded to GitHub
echo ========================================
echo.
pause
