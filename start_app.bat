@echo off
echo Starting Selah Application Environment...
echo ------------------------------------------

:: 1. Start PHP Server in Background (Hidden Window)
echo [1/2] Starting PHP Module on port 8000...
start /B C:\xampp\php\php.exe -S localhost:8000 -t php_module
if %errorlevel% neq 0 (
    echo [ERROR] Failed to start PHP server. Ensure XAMPP PHP is installed.
    pause
    exit /b
)

:: 2. Start Node.js Server (This will stay open)
echo [2/2] Starting Node.js Server on port 3000...
echo ------------------------------------------
echo App will be available at http://localhost:3000
echo Feedack module at http://localhost:8000/feedback.php
echo ------------------------------------------
npm run start
