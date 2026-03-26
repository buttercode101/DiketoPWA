@echo off
REM Morabaraba - Quick Deploy to Vercel
REM This script builds and deploys to Vercel

echo ============================================
echo   MORABARABA - Vercel Deployment
echo ============================================
echo.

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [!] Vercel CLI not found. Installing...
    npm install -g vercel
    echo.
)

REM Clean and install
echo [1/4] Cleaning and installing dependencies...
if exist node_modules (
    rmdir /s /q node_modules
)
if exist package-lock.json (
    del package-lock.json
)
npm install --silent
echo [OK] Dependencies installed
echo.

REM Build test
echo [2/4] Building project...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Build failed! Please fix errors before deploying.
    pause
    exit /b 1
)
echo [OK] Build successful
echo.

REM Vercel login check
echo [3/4] Checking Vercel login...
vercel whoami >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [!] Please login to Vercel...
    vercel login
)
echo [OK] Vercel authenticated
echo.

REM Deploy
echo [4/4] Deploying to Vercel...
echo.
vercel --prod

echo.
echo ============================================
echo   Deployment Complete!
echo ============================================
echo.
echo Next steps:
echo 1. Open the deployment URL in your browser
echo 2. Test the game functionality
echo 3. Check PWA features (install prompt, offline)
echo 4. Run Lighthouse audit for performance
echo.
pause
