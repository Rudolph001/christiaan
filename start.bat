@echo off
echo ============================================
echo      AI Trading Assistant - Starting...
echo ============================================
echo.
echo Dashboard will be available at: http://localhost:5000
echo Press Ctrl+C to stop the server
echo.

REM Check if Node.js is available
node --version >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist node_modules (
    echo Installing dependencies...
    call npm install
    if %errorLevel% neq 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Check if .env exists
if not exist .env (
    echo WARNING: .env file not found
    echo Creating default .env from .env.example...
    if exist .env.example (
        copy .env.example .env
        echo Please edit .env with your database credentials
    ) else (
        echo ERROR: .env.example not found. Please create .env manually.
        pause
        exit /b 1
    )
)

echo Starting development server...
call npm run dev