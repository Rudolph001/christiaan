import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertTradeSchema, insertSettingsSchema } from "@shared/schema";
import { aiEngine } from "./services/ai-engine";
import { discordService } from "./services/discord-service";
import { marketAnalyzer } from "./services/market-analyzer";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket setup for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected to WebSocket');
    
    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message);
        console.log('Received WebSocket message:', data);
      } catch (error) {
        console.error('Invalid WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });
  });

  // Broadcast function for real-time updates
  const broadcast = (data: any) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  };

  // Trading session routes
  app.get("/api/trading-session", async (req, res) => {
    try {
      const userId = "default-user"; // In real app, get from session
      const session = await storage.getTradingSession(userId);
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to get trading session" });
    }
  });

  app.post("/api/trading-session/toggle", async (req, res) => {
    try {
      const userId = "default-user"; // In real app, get from session
      let session = await storage.getTradingSession(userId);

      if (!session) {
        // Create new session
        session = await storage.createTradingSession({
          userId,
          isActive: true,
          startTime: new Date(),
          dailyTradeCount: 0
        });
      } else {
        // Toggle existing session
        const updates = {
          isActive: !session.isActive,
          startTime: session.isActive ? session.startTime : new Date(),
          endTime: session.isActive ? new Date() : null
        };
        session = await storage.updateTradingSession(session.id, updates);
      }

      broadcast({ type: 'session-update', data: session });
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to toggle trading session" });
    }
  });

  // Trade routes
  app.get("/api/trades", async (req, res) => {
    try {
      const userId = "default-user"; // In real app, get from session
      const { symbol, source, startDate, endDate } = req.query;
      
      const filters = {
        symbol: symbol as string,
        source: source as string,
        startDate: startDate as string,
        endDate: endDate as string
      };

      const trades = await storage.getTrades(userId, filters);
      res.json(trades);
    } catch (error) {
      res.status(500).json({ message: "Failed to get trades" });
    }
  });

  app.post("/api/trades", async (req, res) => {
    try {
      const userId = "default-user"; // In real app, get from session
      const validated = insertTradeSchema.parse({ ...req.body, userId });
      
      const trade = await storage.createTrade(validated);
      
      // Update wallet balance
      const wallet = await storage.getWallet(userId);
      if (wallet && trade.pnl) {
        const newBalance = parseFloat(wallet.balance) + parseFloat(trade.pnl);
        const newDailyPnL = parseFloat(wallet.dailyPnL || "0") + parseFloat(trade.pnl);
        const newMonthlyPnL = parseFloat(wallet.monthlyPnL || "0") + parseFloat(trade.pnl);
        const newTotalPnL = parseFloat(wallet.totalPnL || "0") + parseFloat(trade.pnl);
        
        await storage.updateWallet(userId, {
          balance: newBalance.toString(),
          dailyPnL: newDailyPnL.toString(),
          monthlyPnL: newMonthlyPnL.toString(),
          totalPnL: newTotalPnL.toString()
        });
      }

      broadcast({ type: 'trade-added', data: trade });
      res.json(trade);
    } catch (error) {
      res.status(400).json({ message: "Invalid trade data" });
    }
  });

  app.put("/api/trades/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const trade = await storage.updateTrade(id, req.body);
      
      if (!trade) {
        return res.status(404).json({ message: "Trade not found" });
      }

      broadcast({ type: 'trade-updated', data: trade });
      res.json(trade);
    } catch (error) {
      res.status(500).json({ message: "Failed to update trade" });
    }
  });

  app.delete("/api/trades/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteTrade(id);
      
      if (!success) {
        return res.status(404).json({ message: "Trade not found" });
      }

      broadcast({ type: 'trade-deleted', data: { id } });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete trade" });
    }
  });

  // Wallet routes
  app.get("/api/wallet", async (req, res) => {
    try {
      const userId = "default-user"; // In real app, get from session
      const wallet = await storage.getWallet(userId);
      res.json(wallet);
    } catch (error) {
      res.status(500).json({ message: "Failed to get wallet" });
    }
  });

  // Settings routes
  app.get("/api/settings", async (req, res) => {
    try {
      const userId = "default-user"; // In real app, get from session
      const settings = await storage.getSettings(userId);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to get settings" });
    }
  });

  app.put("/api/settings", async (req, res) => {
    try {
      const userId = "default-user"; // In real app, get from session
      const validated = insertSettingsSchema.parse({ ...req.body, userId });
      
      const settings = await storage.updateSettings(userId, validated);
      
      if (!settings) {
        return res.status(404).json({ message: "Settings not found" });
      }

      broadcast({ type: 'settings-updated', data: settings });
      res.json(settings);
    } catch (error) {
      res.status(400).json({ message: "Invalid settings data" });
    }
  });

  // Market analysis routes
  app.get("/api/market-analysis", async (req, res) => {
    try {
      const analysis = await storage.getLatestMarketAnalysis();
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: "Failed to get market analysis" });
    }
  });

  // AI alerts routes
  app.get("/api/alerts", async (req, res) => {
    try {
      const userId = "default-user"; // In real app, get from session
      const { unread } = req.query;
      const alerts = await storage.getAlerts(userId, unread === "true");
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to get alerts" });
    }
  });

  app.post("/api/alerts/:id/read", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.markAlertAsRead(id);
      
      if (!success) {
        return res.status(404).json({ message: "Alert not found" });
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to mark alert as read" });
    }
  });

  // AI strategy routes
  app.post("/api/ai/analyze", async (req, res) => {
    try {
      const { symbol, timeframe } = req.body;
      const analysis = await aiEngine.analyzeSymbol(symbol, timeframe);
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: "Failed to analyze symbol" });
    }
  });

  // Discord webhook test
  app.post("/api/discord/test", async (req, res) => {
    try {
      const userId = "default-user"; // In real app, get from session
      const settings = await storage.getSettings(userId);
      
      if (!settings?.discordWebhook) {
        return res.status(400).json({ message: "Discord webhook not configured" });
      }

      const success = await discordService.sendAlert({
        webhook: settings.discordWebhook,
        symbol: "EURUSD",
        type: "opportunity",
        message: "Test alert from AI Trading Assistant",
        confidence: 85
      });

      res.json({ success });
    } catch (error) {
      res.status(500).json({ message: "Failed to send Discord alert" });
    }
  });

  // Export routes
  app.get("/api/export/trades", async (req, res) => {
    try {
      const userId = "default-user"; // In real app, get from session
      const trades = await storage.getTrades(userId);
      
      // Convert to CSV format
      const csvHeader = "Date,Symbol,Type,Source,Entry Price,Exit Price,P&L,Fees,Notes\n";
      const csvData = trades.map(trade => {
        const date = trade.entryTime.toISOString().split('T')[0];
        return `${date},${trade.symbol},${trade.type},${trade.source},${trade.entryPrice},${trade.exitPrice || ''},${trade.pnl || ''},${trade.fees},${trade.notes || ''}`;
      }).join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=trades.csv');
      res.send(csvHeader + csvData);
    } catch (error) {
      res.status(500).json({ message: "Failed to export trades" });
    }
  });

  // Statistics routes
  app.get("/api/stats/performance", async (req, res) => {
    try {
      const userId = "default-user"; // In real app, get from session
      const trades = await storage.getTrades(userId);
      const wallet = await storage.getWallet(userId);

      const totalTrades = trades.length;
      const winningTrades = trades.filter(t => parseFloat(t.pnl || "0") > 0).length;
      const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

      const liveTrades = trades.filter(t => t.source === 'manual');
      const aiTrades = trades.filter(t => t.source === 'ai');

      const liveWinRate = liveTrades.length > 0 ? 
        (liveTrades.filter(t => parseFloat(t.pnl || "0") > 0).length / liveTrades.length) * 100 : 0;
      
      const aiWinRate = aiTrades.length > 0 ? 
        (aiTrades.filter(t => parseFloat(t.pnl || "0") > 0).length / aiTrades.length) * 100 : 0;

      const stats = {
        totalTrades,
        winRate: winRate.toFixed(1),
        liveWinRate: liveWinRate.toFixed(1),
        aiWinRate: aiWinRate.toFixed(1),
        currentBalance: wallet?.balance || "0",
        dailyPnL: wallet?.dailyPnL || "0",
        monthlyPnL: wallet?.monthlyPnL || "0",
        totalPnL: wallet?.totalPnL || "0"
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to get performance statistics" });
    }
  });

  // Time analysis routes
  app.get("/api/stats/time-analysis", async (req, res) => {
    try {
      const userId = "default-user"; // In real app, get from session
      const trades = await storage.getTrades(userId);

      const timeAnalysis: { [key: string]: { [key: string]: { wins: number; total: number } } } = {};

      trades.forEach(trade => {
        const date = new Date(trade.entryTime);
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
        const hour = date.getHours();
        const hourKey = `${hour}:00`;

        if (!timeAnalysis[hourKey]) {
          timeAnalysis[hourKey] = {};
        }
        if (!timeAnalysis[hourKey][dayOfWeek]) {
          timeAnalysis[hourKey][dayOfWeek] = { wins: 0, total: 0 };
        }

        timeAnalysis[hourKey][dayOfWeek].total++;
        if (parseFloat(trade.pnl || "0") > 0) {
          timeAnalysis[hourKey][dayOfWeek].wins++;
        }
      });

      // Calculate win rates
      const heatmapData = Object.entries(timeAnalysis).map(([hour, days]) => ({
        hour,
        days: Object.entries(days).map(([day, data]) => ({
          day,
          winRate: data.total > 0 ? (data.wins / data.total) * 100 : 0,
          trades: data.total
        }))
      }));

      res.json(heatmapData);
    } catch (error) {
      res.status(500).json({ message: "Failed to get time analysis" });
    }
  });

  return httpServer;
}
