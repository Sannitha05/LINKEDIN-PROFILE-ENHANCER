@echo off
title LinkedIn Profile Enhancer — Dev Server

echo.
echo  ============================================
echo    LinkedIn Profile Enhancer - Starting Up
echo  ============================================
echo.

:: Check if node_modules exists, install if not
IF NOT EXIST "node_modules\" (
    echo  [1/2] Installing dependencies...
    call npm install
    echo  Dependencies installed successfully!
    echo.
) ELSE (
    echo  [1/2] Dependencies already installed. Skipping...
    echo.
)

echo  [2/2] Starting Vite dev server...
echo.
echo  App will open at: http://localhost:5173
echo.
echo  Press Ctrl+C to stop the server.
echo.

call npm run dev

pause
