@echo off
echo ============================================
echo    AI Trading Assistant - Windows Setup
echo ============================================
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% == 0 (
    echo Running as Administrator... Good!
) else (
    echo ERROR: This script requires Administrator privileges.
    echo Please right-click and select "Run as administrator"
    pause
    exit /b 1
)

echo.
echo [1/8] Checking prerequisites...

REM Check Node.js
node --version >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please download and install Node.js from: https://nodejs.org/
    pause
    exit /b 1
) else (
    echo ✓ Node.js found
)

REM Check npm
npm --version >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: npm is not available
    echo Please reinstall Node.js from: https://nodejs.org/
    pause
    exit /b 1
) else (
    echo ✓ npm found
)

REM Check PostgreSQL
psql --version >nul 2>&1
if %errorLevel% neq 0 (
    echo WARNING: PostgreSQL not found in PATH
    echo Please ensure PostgreSQL is installed and added to PATH
    echo Download from: https://www.postgresql.org/download/windows/
    echo.
    set /p continue="Continue anyway? (y/n): "
    if /i "%continue%" neq "y" exit /b 1
) else (
    echo ✓ PostgreSQL found
)

echo.
echo [2/8] Installing Node.js dependencies...
call npm install
if %errorLevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [3/8] Creating environment configuration...
if not exist .env (
    copy .env.example .env >nul 2>&1
    if not exist .env.example (
        echo Creating .env file...
        (
            echo # Database Configuration
            echo DATABASE_URL=postgresql://postgres:password@localhost:5432/ai_trading_assistant
            echo PGHOST=localhost
            echo PGPORT=5432
            echo PGUSER=postgres
            echo PGPASSWORD=password
            echo PGDATABASE=ai_trading_assistant
            echo.
            echo # Application Settings
            echo NODE_ENV=development
            echo PORT=5000
            echo.
            echo # Security
            echo SESSION_SECRET=your_secure_session_secret_change_this_in_production
            echo.
            echo # Discord Integration ^(optional^)
            echo # DISCORD_WEBHOOK_URL=your_discord_webhook_url
            echo.
            echo # AI Configuration
            echo AI_CONFIDENCE_THRESHOLD=70
            echo MAX_TRADES_PER_DAY=10
            echo DEFAULT_RISK_PERCENTAGE=1.0
        ) > .env
    ) else (
        copy .env.example .env
    )
    echo ✓ Environment file created (.env)
    echo   Please edit .env with your database credentials
) else (
    echo ✓ Environment file already exists
)

echo.
echo [4/8] Database Configuration
echo.
echo Please ensure PostgreSQL is running and accessible.
echo Default connection will use:
echo   Host: localhost
echo   Port: 5432
echo   Database: ai_trading_assistant
echo   User: postgres
echo.

set /p db_setup="Do you want to create the database now? (y/n): "
if /i "%db_setup%"=="y" (
    set /p db_password="Enter PostgreSQL superuser password: "
    
    echo Creating database...
    set PGPASSWORD=%db_password%
    
    REM Create database
    psql -U postgres -h localhost -c "CREATE DATABASE ai_trading_assistant;" 2>nul
    if %errorLevel% == 0 (
        echo ✓ Database created successfully
    ) else (
        echo Database may already exist or there was an error
    )
    
    REM Update .env with provided password
    powershell -Command "(Get-Content .env) -replace 'PGPASSWORD=password', 'PGPASSWORD=%db_password%' | Set-Content .env"
    powershell -Command "(Get-Content .env) -replace 'postgresql://postgres:password@', 'postgresql://postgres:%db_password%@' | Set-Content .env"
)

echo.
echo [5/8] Setting up database schema...
call db-setup.bat >nul 2>&1
if %errorLevel% neq 0 (
    echo WARNING: Database setup may have failed
    echo You may need to run 'db-setup.bat' manually after fixing database connection
) else (
    echo ✓ Database schema initialized
)

echo.
echo [6/8] Building the application...
call npm run build >nul 2>&1
if %errorLevel% neq 0 (
    echo WARNING: Build failed, but you can still run in development mode
) else (
    echo ✓ Application built successfully
)

echo.
echo [7/8] Creating startup scripts...

REM Create start.bat
(
    echo @echo off
    echo echo Starting AI Trading Assistant...
    echo echo.
    echo echo Dashboard will be available at: http://localhost:5000
    echo echo Press Ctrl+C to stop the server
    echo echo.
    echo call npm run dev
    echo pause
) > start.bat

REM Create start-production.bat
(
    echo @echo off
    echo echo Starting AI Trading Assistant ^(Production Mode^)...
    echo echo.
    echo echo Dashboard will be available at: http://localhost:5000
    echo echo Press Ctrl+C to stop the server
    echo echo.
    echo call npm run start
    echo pause
) > start-production.bat

REM Create database-reset.bat
(
    echo @echo off
    echo echo WARNING: This will delete ALL trading data!
    echo set /p confirm="Are you sure? Type 'YES' to confirm: "
    echo if /i "%%confirm%%"=="YES" ^(
    echo     echo Resetting database...
    echo     call npm run db:reset
    echo     echo Database reset complete
    echo ^) else ^(
    echo     echo Database reset cancelled
    echo ^)
    echo pause
) > database-reset.bat

echo ✓ Startup scripts created

echo.
echo [8/8] Final setup...

REM Set permissions for batch files
icacls start.bat /grant Everyone:F >nul 2>&1
icacls start-production.bat /grant Everyone:F >nul 2>&1
icacls database-reset.bat /grant Everyone:F >nul 2>&1

echo.
echo ============================================
echo          Setup Complete!
echo ============================================
echo.
echo To start the application:
echo   1. Double-click 'start.bat' for development mode
echo   2. Or run 'start-production.bat' for production mode
echo.
echo The application will be available at:
echo   http://localhost:5000
echo.
echo Configuration files created:
echo   - .env (environment variables)
echo   - start.bat (development server)
echo   - start-production.bat (production server)
echo   - database-reset.bat (reset database)
echo.
echo Important:
echo   - Edit .env file to configure your database and settings
echo   - Ensure PostgreSQL service is running before starting
echo   - Check README.md for detailed usage instructions
echo.
echo Press any key to start the application now...
pause >nul

echo Starting the application...
start.bat