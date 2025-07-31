@echo off
echo ============================================
echo    AI Trading Assistant - Database Reset
echo ============================================
echo.
echo WARNING: This will delete ALL trading data!
echo This includes:
echo   - All trade records
echo   - Trading sessions
echo   - Wallet history
echo   - AI learning data
echo   - User settings
echo.
set /p confirm="Are you absolutely sure? Type 'YES' to confirm: "

if /i "%confirm%"=="YES" (
    echo.
    echo Resetting database...
    
    REM Check if .env exists
    if not exist .env (
        echo ERROR: .env file not found
        echo Please run setup.bat first
        pause
        exit /b 1
    )
    
    REM Reset the database
    npx drizzle-kit drop
    if %errorLevel% equ 0 (
        npx drizzle-kit push
        if %errorLevel% neq 0 (
            echo ERROR: Database schema recreation failed
        ) else (
            echo.
            echo ✓ Database reset successfully completed
            echo   All data has been cleared and schema recreated
        )
    ) else (
        echo ERROR: Database reset failed
        echo Please check your database connection and try again
    )
) else (
    echo.
    echo Database reset cancelled
)

echo.
pause