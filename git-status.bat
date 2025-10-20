@echo off
echo ========================================
echo   Git Status & Information
echo ========================================
echo.

echo Current Branch:
git branch --show-current

echo.
echo Recent Commits:
git log --oneline -5

echo.
echo Modified Files:
git status --short

echo.
echo Remote Repository:
git remote -v

echo.
echo ========================================
pause
