# AI Trading Assistant - User Manual

## Getting Started

### First Launch
1. Run `start.bat` to launch the application
2. Open your browser to `http://localhost:5000`
3. The dashboard will load with default settings

### Initial Setup
1. **Configure Trading Parameters**:
   - Go to Settings page
   - Set starting balance (default: $50,000)
   - Adjust risk per trade (default: 1%)
   - Set maximum trades per day (default: 10)

2. **Optional Discord Integration**:
   - Create a Discord webhook in your server
   - Add the webhook URL in Settings
   - Test the connection using the test button

## Dashboard Overview

### Performance Cards
- **Current Balance**: Your total account balance
- **Today's P&L**: Profit/loss for the current day
- **Win Rate**: Percentage of profitable trades
- **Total Trades**: Number of trades executed

### Charts
- **Balance Chart**: Historical balance over time
- **Time Heatmap**: Shows optimal trading hours based on performance

### Trading Session Control
- **Start Session**: Begin trading for the day
- **Stop Session**: End trading session
- **Trade Counter**: Shows trades used vs. daily limit

### AI Insights Panel
- **Market Analysis**: Current market conditions
- **Trading Opportunities**: AI-suggested trades
- **Confidence Scores**: AI confidence levels

## Features Guide

### 1. Trading Sessions

**Starting a Session**:
- Click "Start Trading Session" on dashboard
- Session tracks daily trade count and P&L
- Automatically stops at daily trade limit

**Managing Sessions**:
- View active session status
- Monitor trade count vs. limit
- Track session duration

### 2. Trade Journal

**Adding Manual Trades**:
1. Go to Journal page
2. Click "Add Trade" button
3. Fill in trade details:
   - Symbol (EURUSD, GBPJPY, etc.)
   - Type (Long/Short)
   - Entry/Exit prices
   - Quantity
   - P&L
   - Notes

**Viewing Trades**:
- Filter by date range
- Sort by different columns
- Search by symbol or notes
- Export to CSV

### 3. Wallet Management

**Balance Tracking**:
- View current balance
- Track daily/monthly P&L
- Monitor risk exposure

**Transaction History**:
- All trades affect wallet balance
- View transaction timestamps
- Track P&L calculations

### 4. Analytics

**Performance Metrics**:
- Win rate breakdown (Live vs AI trades)
- Symbol performance analysis
- Time-based performance

**Charts and Visualizations**:
- Balance trends over time
- Trading frequency heatmaps
- Profit/loss distributions

### 5. AI Features

**Market Analysis**:
- Real-time market condition assessment
- Volatility and trend analysis
- News impact evaluation

**Trading Opportunities**:
- AI-suggested trade setups
- Confidence scoring
- Reasoning explanations

**Auto-execution** (Optional):
- Enable in Settings
- AI executes high-confidence trades
- Respects risk parameters

### 6. Settings Configuration

**Trading Parameters**:
- Starting balance
- Risk percentage per trade
- Trading fees
- Maximum daily trades

**AI Configuration**:
- Confidence threshold
- Weekend trading enable
- Auto-execution settings

**Display Settings**:
- Theme (Light/Dark)
- Currency display
- Time zone

**Data Management**:
- Export all data
- Import data
- Reset AI learning
- Clear all data

## Trading Workflow

### Typical Daily Routine

1. **Morning Setup**:
   - Start trading session
   - Review AI market analysis
   - Check overnight alerts

2. **During Trading**:
   - Monitor AI opportunities
   - Add manual trades as executed
   - Track session progress

3. **End of Day**:
   - Stop trading session
   - Review performance in Analytics
   - Plan for next session

### Risk Management

**Built-in Protections**:
- Daily trade limits
- Risk percentage caps
- Session-based tracking

**Best Practices**:
- Stick to 1% risk per trade
- Don't exceed daily limits
- Review performance regularly

## AI System

### How It Works
- Analyzes market conditions
- Identifies trading patterns
- Learns from your trading history
- Provides confidence-scored recommendations

### Market Analysis Components
- **Volatility**: Market movement intensity
- **Trend Strength**: Direction clarity
- **News Impact**: Economic event influence
- **Overall Score**: Combined assessment

### Using AI Insights
- Review AI recommendations daily
- Consider confidence scores
- Use reasoning to validate trades
- Enable auto-execution for high-confidence signals

## Troubleshooting

### Common Issues

**Application Won't Start**:
- Check if Node.js is installed
- Verify PostgreSQL is running
- Check port 5000 availability

**Database Errors**:
- Verify PostgreSQL service
- Check .env credentials
- Run database-reset.bat if needed

**Performance Issues**:
- Close unnecessary applications
- Use production mode
- Check available disk space

**Data Loss Prevention**:
- Regular database backups
- Export trade data frequently
- Keep .env file secure

### Getting Help

1. Check console logs for errors
2. Verify system requirements
3. Review installation guide
4. Check database connectivity

## Advanced Features

### Discord Integration
- Real-time trade alerts
- Session start/stop notifications
- AI opportunity alerts
- Performance summaries

### Data Export/Import
- Export all trading data
- Import historical trades
- Backup configurations
- Transfer between systems

### Customization
- Modify risk parameters
- Adjust AI thresholds
- Configure alert types
- Set trading hours

## Security and Privacy

### Data Protection
- All data stored locally
- No external data transmission
- Secure database storage
- Password-protected access

### Best Practices
- Use strong database passwords
- Regular security updates
- Backup important data
- Monitor system access

## Tips for Success

### Effective Trading
1. Follow your risk management rules
2. Review AI insights before trading
3. Keep detailed trade notes
4. Analyze performance regularly

### Using Analytics
1. Identify your best trading times
2. Focus on profitable symbols
3. Learn from losing trades
4. Track improvement over time

### AI Optimization
1. Let AI learn from your trades
2. Adjust confidence thresholds
3. Review AI reasoning
4. Provide feedback through notes

## Keyboard Shortcuts

- **Ctrl+R**: Refresh dashboard
- **Ctrl+N**: Add new trade
- **Ctrl+S**: Save current settings
- **Ctrl+E**: Export data
- **F5**: Refresh current page

## Support and Updates

### Getting Support
- Check this manual first
- Review installation guide
- Check application logs
- Contact support if needed

### Staying Updated
- Check for application updates
- Review change logs
- Update Node.js and PostgreSQL
- Backup before updates

Remember: This application is for educational and personal use. Always comply with your local trading regulations and never risk more than you can afford to lose.