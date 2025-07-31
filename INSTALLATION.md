# Windows Installation Guide

## Quick Start

1. **Download Prerequisites** (if not already installed):
   - [Node.js 18+](https://nodejs.org/) (LTS version recommended)
   - [PostgreSQL 13+](https://www.postgresql.org/download/windows/)
   - [Git](https://git-scm.com/download/win) (optional, for updates)

2. **Run Setup**:
   - Right-click `setup.bat` → "Run as administrator"
   - Follow the prompts to configure database
   - Setup will create all necessary files

3. **Start Application**:
   - Double-click `start.bat`
   - Open browser to `http://localhost:5000`

## Detailed Installation Steps

### Step 1: System Requirements

**Minimum Requirements:**
- Windows 10/11 (64-bit)
- 4GB RAM
- 1GB free disk space
- Internet connection for setup

**Software Prerequisites:**

1. **Node.js** (Required)
   ```
   Download: https://nodejs.org/
   Version: 18.0.0 or higher
   ```
   - Choose "Add to PATH" during installation
   - Verify: Open CMD and run `node --version`

2. **PostgreSQL** (Required)
   ```
   Download: https://www.postgresql.org/download/windows/
   Version: 13.0 or higher
   ```
   - Remember the superuser password you set
   - Verify: Open CMD and run `psql --version`

3. **Git** (Optional)
   ```
   Download: https://git-scm.com/download/win
   ```
   - Useful for receiving updates

### Step 2: Application Setup

**Option A: Automated Setup (Recommended)**

1. Extract the application files to your desired folder (e.g., `C:\AI-Trading-Assistant`)

2. Right-click on `setup.bat` and select "Run as administrator"

3. The setup will:
   - Check all prerequisites
   - Install Node.js dependencies
   - Create configuration files
   - Set up the database
   - Build the application
   - Create startup scripts

4. Follow the prompts:
   - Enter your PostgreSQL password when requested
   - Confirm database creation

**Option B: Manual Setup**

1. Open Command Prompt as Administrator

2. Navigate to the project folder:
   ```cmd
   cd C:\path\to\AI-Trading-Assistant
   ```

3. Install dependencies:
   ```cmd
   npm install
   ```

4. Create environment file:
   ```cmd
   copy .env.example .env
   ```

5. Edit `.env` file with your settings:
   ```
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/ai_trading_assistant
   PGPASSWORD=your_password
   ```

6. Create database:
   ```cmd
   psql -U postgres -c "CREATE DATABASE ai_trading_assistant;"
   ```

7. Initialize database schema:
   ```cmd
   npm run db:push
   ```

### Step 3: Starting the Application

**Development Mode** (with hot reload):
```cmd
start.bat
```

**Production Mode** (optimized):
```cmd
start-production.bat
```

The application will be available at: `http://localhost:5000`

### Step 4: Initial Configuration

1. **Access the Application**:
   - Open your web browser
   - Navigate to `http://localhost:5000`

2. **Configure Settings**:
   - Go to Settings page
   - Set your trading parameters:
     - Starting balance
     - Risk percentage per trade
     - Maximum trades per day
     - AI confidence threshold

3. **Optional Discord Integration**:
   - Create a Discord webhook URL
   - Add it to Settings for trading alerts

## File Structure

```
AI-Trading-Assistant/
├── setup.bat                 # Automated setup script
├── start.bat                 # Start development server
├── start-production.bat      # Start production server
├── database-reset.bat        # Reset database (caution!)
├── .env                      # Configuration file
├── .env.example             # Configuration template
├── README.md                # Main documentation
├── INSTALLATION.md          # This file
├── package.json             # Node.js dependencies
├── client/                  # Frontend application
├── server/                  # Backend application
└── shared/                  # Shared code
```

## Configuration

### Environment Variables (.env)

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/ai_trading_assistant
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=your_password
PGDATABASE=ai_trading_assistant

# Application
NODE_ENV=development
PORT=5000
SESSION_SECRET=your_secure_random_string

# Trading
AI_CONFIDENCE_THRESHOLD=70
MAX_TRADES_PER_DAY=10
DEFAULT_RISK_PERCENTAGE=1.0
STARTING_BALANCE=50000

# Discord (optional)
DISCORD_WEBHOOK_URL=your_discord_webhook_url
```

### Trading Configuration

Default settings (configurable in the app):
- **Starting Balance**: $50,000
- **Risk per Trade**: 1%
- **Trading Fee**: 0.075%
- **Max Daily Trades**: 10
- **AI Confidence**: 70% minimum

## Troubleshooting

### Common Issues

**1. "Node.js not found"**
- Solution: Install Node.js from nodejs.org
- Ensure "Add to PATH" was selected during installation
- Restart Command Prompt after installation

**2. "PostgreSQL connection failed"**
- Check if PostgreSQL service is running:
  ```cmd
  sc query postgresql-x64-13
  ```
- Verify password in `.env` file
- Ensure database exists

**3. "Port 5000 already in use"**
- Find what's using the port:
  ```cmd
  netstat -ano | findstr :5000
  ```
- Kill the process or change PORT in `.env`

**4. "Permission denied"**
- Run Command Prompt as Administrator
- Check folder permissions

**5. "Database schema errors"**
- Reset the database:
  ```cmd
  database-reset.bat
  ```
- Or manually drop and recreate

### Getting Help

1. Check the console output for specific error messages
2. Verify all prerequisites are correctly installed
3. Ensure PostgreSQL service is running
4. Check `.env` file configuration
5. Try running `database-reset.bat` if database issues persist

### Performance Tips

1. **For Better Performance**:
   - Use production mode: `start-production.bat`
   - Close unnecessary applications
   - Ensure adequate free disk space

2. **For Development**:
   - Use development mode: `start.bat`
   - Keep browser developer tools open for debugging

## Security Considerations

1. **Environment File**:
   - Keep `.env` file secure
   - Never share database passwords
   - Use strong, unique passwords

2. **Database Security**:
   - Consider changing default PostgreSQL port
   - Use firewall rules if needed
   - Regular backups recommended

3. **Application Access**:
   - Application runs locally only by default
   - To access from other devices, modify HOST settings

## Backup and Updates

### Creating Backups

**Database Backup**:
```cmd
pg_dump -U postgres ai_trading_assistant > backup.sql
```

**Application Data**:
- Copy the entire application folder
- Especially important: `.env` file and any customizations

### Updating the Application

1. Backup your current installation
2. Download new version
3. Copy your `.env` file to new installation
4. Run `setup.bat` in new folder
5. Your data will be preserved in the database

## Support

For issues or questions:
1. Check this installation guide
2. Review README.md for usage instructions
3. Check console logs for error details
4. Ensure all prerequisites are correctly installed