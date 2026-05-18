@echo off
echo ========================================
echo  JobMatcher MVP - Production Deployment
echo ========================================
echo.

echo [1/3] Installing dependencies...
cd /d "%~dp0server"
call npm install --production
cd /d "%~dp0client"
call npm install
cd /d "%~dp0"
call npm install

echo.
echo [2/3] Building...
call npm run build

echo.
echo [3/3] Starting production server...
echo.
echo Open http://localhost:3000 in your browser
echo Press Ctrl+C to stop
echo.
cd /d "%~dp0"
call npm run start
