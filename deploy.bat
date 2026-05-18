@echo off
title LinkedIn Profile Enhancer — Deploy
color 0A

echo.
echo  =====================================================
echo    LinkedIn Profile Enhancer — Deployment Helper
echo  =====================================================
echo.
echo  Choose a deployment option:
echo.
echo  [1] Deploy to VERCEL  (recommended — free, instant)
echo  [2] Deploy to NETLIFY (free, drag-and-drop ready)
echo  [3] Build only        (creates dist\ folder)
echo  [4] Push to GitHub    (git init + commit + push)
echo  [5] Exit
echo.
set /p CHOICE=  Enter your choice (1-5): 

echo.

IF "%CHOICE%"=="1" GOTO VERCEL
IF "%CHOICE%"=="2" GOTO NETLIFY
IF "%CHOICE%"=="3" GOTO BUILD_ONLY
IF "%CHOICE%"=="4" GOTO GITHUB
IF "%CHOICE%"=="5" GOTO END
GOTO INVALID

:: ─────────────────────────────────────────
:VERCEL
echo  [Vercel] Installing Vercel CLI...
call npm install -g vercel
echo.
echo  [Vercel] Building project...
call npm install
call npm run build
echo.
echo  [Vercel] Deploying...
call vercel --prod
echo.
echo  Done! Your app is live on Vercel.
GOTO END

:: ─────────────────────────────────────────
:NETLIFY
echo  [Netlify] Building project...
call npm install
call npm run build
echo.
echo  Build complete! The dist\ folder is ready.
echo.
echo  ─────────────────────────────────────────────────────
echo   DRAG AND DROP to deploy on Netlify:
echo.
echo   1. Go to: https://app.netlify.com/drop
echo   2. Drag the  dist\  folder into the browser
echo   3. Your site goes live instantly — no login needed!
echo  ─────────────────────────────────────────────────────
echo.
echo  Opening Netlify Drop in your browser...
start https://app.netlify.com/drop
GOTO END

:: ─────────────────────────────────────────
:BUILD_ONLY
echo  [Build] Installing dependencies...
call npm install
echo.
echo  [Build] Building for production...
call npm run build
echo.
echo  Build complete! Output is in the  dist\  folder.
echo  You can upload this folder to any static host.
GOTO END

:: ─────────────────────────────────────────
:GITHUB
echo  [GitHub] Setting up git repository...
echo.

IF NOT EXIST ".git\" (
    call git init
    echo  Git initialized.
) ELSE (
    echo  Git already initialized. Skipping init.
)

call git add .
call git commit -m "feat: LinkedIn Profile Enhancer - initial commit"

echo.
set /p REPO_URL=  Paste your GitHub repo URL (e.g. https://github.com/user/repo.git): 
echo.

call git remote remove origin 2>nul
call git remote add origin %REPO_URL%
call git branch -M main
call git push -u origin main

echo.
echo  Code pushed to GitHub successfully!
echo.
echo  To deploy from GitHub:
echo   - Vercel:  https://vercel.com/new  (import your repo)
echo   - Netlify: https://app.netlify.com (import your repo)
GOTO END

:: ─────────────────────────────────────────
:INVALID
echo  Invalid choice. Please run again and enter 1-5.
GOTO END

:: ─────────────────────────────────────────
:END
echo.
pause
