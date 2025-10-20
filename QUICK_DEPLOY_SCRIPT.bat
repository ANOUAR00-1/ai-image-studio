@echo off
echo ========================================
echo   PIXFUSION AI STUDIO - DEPLOYMENT
echo ========================================
echo.

REM Check if git is initialized
echo [1/5] Checking Git status...
git status >nul 2>&1
if errorlevel 1 (
    echo Git not initialized. Initializing...
    git init
    git add .
    git commit -m "Initial commit - Complete SaaS platform"
)

REM Add all changes
echo [2/5] Adding all changes...
git add .

REM Commit
echo [3/5] Creating commit...
git commit -m "Production ready - Deploy to Vercel"

REM Push to GitHub (if remote exists)
echo [4/5] Checking remote...
git remote -v | find "origin" >nul
if errorlevel 1 (
    echo.
    echo ========================================
    echo SETUP GITHUB REPOSITORY
    echo ========================================
    echo.
    echo Please create a GitHub repository first:
    echo 1. Go to: https://github.com/new
    echo 2. Name: pixfusion-ai-studio
    echo 3. Create repository
    echo 4. Copy the repository URL
    echo.
    set /p REPO_URL="Enter your GitHub repository URL: "
    git remote add origin %REPO_URL%
    git branch -M main
    git push -u origin main
) else (
    echo Pushing to GitHub...
    git push
)

REM Instructions for Vercel
echo.
echo ========================================
echo [5/5] READY FOR VERCEL DEPLOYMENT
echo ========================================
echo.
echo Code is committed and pushed to GitHub!
echo.
echo NEXT STEPS:
echo 1. Go to: https://vercel.com/new
echo 2. Import your GitHub repository
echo 3. Add environment variables from .env.local
echo 4. Click "Deploy"
echo 5. Wait 2-3 minutes
echo 6. Visit your live site!
echo.
echo ========================================
echo.
echo Or deploy using Vercel CLI:
echo   vercel --prod
echo.
pause
