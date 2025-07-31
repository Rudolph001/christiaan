@echo off
echo Setting up database...

REM Check if drizzle-kit is available
npx drizzle-kit --version >nul 2>&1
if %errorLevel% neq 0 (
    echo Installing drizzle-kit...
    npm install -g drizzle-kit
)

echo Pushing database schema...
npx drizzle-kit push

echo Database setup complete!