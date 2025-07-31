# AI Trading Assistant

An advanced AI-powered trading assistant platform that learns market patterns, provides real-time alerts, and tracks trading performance with comprehensive analytics.

## Features

- **AI-Powered Analysis**: Smart market analysis with confidence scoring and pattern recognition
- **Real-time Trading Dashboard**: Live performance metrics, charts, and trading session management
- **Trade Journal**: Comprehensive trade tracking with manual entry and AI insights
- **Wallet Management**: Balance tracking with P&L calculations and risk management
- **Advanced Analytics**: Performance breakdowns, time-based heatmaps, and symbol analysis
- **Discord Integration**: Real-time trading alerts and notifications
- **Risk Management**: Configurable risk parameters and daily trade limits
- **Dark Theme**: Professional trading interface optimized for extended use

## Prerequisites

Before installing, ensure you have the following installed on your Windows system:

1. **Node.js** (version 18 or higher)
   - Download from: https://nodejs.org/
   - Choose the LTS version
   - Verify installation: `node --version` and `npm --version`

2. **Git** (for version control)
   - Download from: https://git-scm.com/download/win
   - Verify installation: `git --version`

3. **PostgreSQL** (version 13 or higher)
   - Download from: https://www.postgresql.org/download/windows/
   - During installation, remember your superuser password
   - Verify installation: `psql --version`

## Installation

### Option 1: Quick Setup (Recommended)

1. **Download and extract** the project files to your desired directory
2. **Run the setup script** as Administrator:
   ```cmd
   setup.bat
   ```
3. **Follow the prompts** to configure your database and environment
4. **Start the application**:
   ```cmd
   start.bat
   ```

### Option 2: Manual Installation

1. **Open Command Prompt as Administrator** and navigate to the project directory

2. **Install dependencies**:
   ```cmd
   npm install
   ```

3. **Set up the database**:
   ```cmd
   # Connect to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE ai_trading_assistant;
   
   # Create user (optional)
   CREATE USER trader WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE ai_trading_assistant TO trader;
   
   # Exit PostgreSQL
   \q
   ```

4. **Configure environment variables**:
   - Copy `.env.example` to `.env`
   - Edit `.env` with your database credentials and other settings

5. **Run database migrations**:
   ```cmd
   npm run db:migrate
   ```

6. **Start the application**:
   ```cmd
   npm run dev
   ```

## Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/ai_trading_assistant
PGHOST=localhost
PGPORT=5432
PGUSER=your_username
PGPASSWORD=your_password
PGDATABASE=ai_trading_assistant

# Application Settings
NODE_ENV=development
PORT=5000

# Security (generate secure random strings)
SESSION_SECRET=your_secure_session_secret_here

# Discord Integration (optional)
DISCORD_WEBHOOK_URL=your_discord_webhook_url

# AI Configuration
AI_CONFIDENCE_THRESHOLD=70
MAX_TRADES_PER_DAY=10
DEFAULT_RISK_PERCENTAGE=1.0
```

### Trading Configuration

The application includes default trading parameters that can be modified in the Settings page:

- **Starting Balance**: $50,000 (configurable)
- **Risk per Trade**: 1% (configurable)
- **Trading Fee**: 0.075% (configurable)
- **Max Trades per Day**: 10 (configurable)
- **AI Confidence Threshold**: 70% (configurable)

## Usage

1. **Access the application** at `http://localhost:5000`
2. **Start a trading session** from the dashboard
3. **Monitor AI insights** and market analysis
4. **Add trades** manually or let AI suggest opportunities
5. **Track performance** in the analytics section
6. **Configure settings** for your trading style

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:migrate` - Run database migrations
- `npm run db:reset` - Reset database (caution: deletes all data)

## Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Verify PostgreSQL is running: `sc query postgresql-x64-13`
   - Check your `.env` database credentials
   - Ensure the database exists

2. **Port Already in Use**:
   - Change the PORT in `.env` file
   - Or stop the process using port 5000: `netstat -ano | findstr :5000`

3. **Permission Errors**:
   - Run Command Prompt as Administrator
   - Check file permissions in the project directory

4. **Node.js Version Issues**:
   - Ensure you're using Node.js 18 or higher
   - Update npm: `npm install -g npm@latest`

### Getting Help

If you encounter issues:

1. Check the console logs for error messages
2. Verify all prerequisites are installed correctly
3. Ensure your `.env` file is configured properly
4. Check that PostgreSQL service is running

## Security Notes

- Keep your `.env` file secure and never commit it to version control
- Use strong passwords for your database
- Consider using environment-specific configurations for production
- Regularly backup your trading data

## License

This project is for educational and personal use. Please ensure compliance with your local trading regulations.