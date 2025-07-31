import { 
  type User, type InsertUser, type TradingSession, type InsertTradingSession,
  type Trade, type InsertTrade, type Wallet, type InsertWallet,
  type Settings, type InsertSettings, type MarketAnalysis, type InsertMarketAnalysis,
  type AiLearning, type InsertAiLearning, type Alert, type InsertAlert
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Trading session methods
  getTradingSession(userId: string): Promise<TradingSession | undefined>;
  createTradingSession(session: InsertTradingSession): Promise<TradingSession>;
  updateTradingSession(id: string, updates: Partial<TradingSession>): Promise<TradingSession | undefined>;

  // Trade methods
  getTrades(userId: string, filters?: any): Promise<Trade[]>;
  getTrade(id: string): Promise<Trade | undefined>;
  createTrade(trade: InsertTrade): Promise<Trade>;
  updateTrade(id: string, updates: Partial<Trade>): Promise<Trade | undefined>;
  deleteTrade(id: string): Promise<boolean>;

  // Wallet methods
  getWallet(userId: string): Promise<Wallet | undefined>;
  createWallet(wallet: InsertWallet): Promise<Wallet>;
  updateWallet(userId: string, updates: Partial<Wallet>): Promise<Wallet | undefined>;

  // Settings methods
  getSettings(userId: string): Promise<Settings | undefined>;
  createSettings(settings: InsertSettings): Promise<Settings>;
  updateSettings(userId: string, updates: Partial<Settings>): Promise<Settings | undefined>;

  // Market analysis methods
  getLatestMarketAnalysis(): Promise<MarketAnalysis | undefined>;
  createMarketAnalysis(analysis: InsertMarketAnalysis): Promise<MarketAnalysis>;

  // AI learning methods
  getAiLearning(userId: string): Promise<AiLearning[]>;
  createAiLearning(learning: InsertAiLearning): Promise<AiLearning>;
  updateAiLearning(id: string, updates: Partial<AiLearning>): Promise<AiLearning | undefined>;

  // Alert methods
  getAlerts(userId: string, unreadOnly?: boolean): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  markAlertAsRead(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private tradingSessions: Map<string, TradingSession> = new Map();
  private trades: Map<string, Trade> = new Map();
  private wallets: Map<string, Wallet> = new Map();
  private settings: Map<string, Settings> = new Map();
  private marketAnalysis: Map<string, MarketAnalysis> = new Map();
  private aiLearning: Map<string, AiLearning> = new Map();
  private alerts: Map<string, Alert> = new Map();

  constructor() {
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Create default user
    const defaultUser: User = {
      id: "default-user",
      username: "trader",
      password: "password123"
    };
    this.users.set(defaultUser.id, defaultUser);

    // Create default wallet
    const defaultWallet: Wallet = {
      id: randomUUID(),
      userId: defaultUser.id,
      balance: "57432.18",
      startingBalance: "50000.00",
      totalPnL: "7432.18",
      monthlyPnL: "3247.92",
      dailyPnL: "247.85",
      totalFees: "324.50",
      lastWithdrawal: null,
      updatedAt: new Date()
    };
    this.wallets.set(defaultUser.id, defaultWallet);

    // Create default settings
    const defaultSettings: Settings = {
      id: randomUUID(),
      userId: defaultUser.id,
      riskPercentage: "1.0",
      tradingFee: "0.075",
      maxTradesPerDay: 10,
      discordWebhook: null,
      aiConfidenceThreshold: 70,
      weekendTradingEnabled: true,
      autoExecuteAI: false,
      theme: "dark",
      currency: "USD",
      timezone: "EST",
      updatedAt: new Date()
    };
    this.settings.set(defaultUser.id, defaultSettings);

    // Create sample market analysis
    const marketAnalysis: MarketAnalysis = {
      id: randomUUID(),
      date: new Date(),
      volatility: 7,
      newsImpact: 3,
      trendStrength: 8,
      overallScore: 8,
      summary: "High volatility, no major news. Good day to trade.",
      recommendations: {
        trading: "recommended",
        risk: "moderate",
        symbols: ["EURUSD", "GBPJPY"]
      }
    };
    this.marketAnalysis.set("latest", marketAnalysis);
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Trading session methods
  async getTradingSession(userId: string): Promise<TradingSession | undefined> {
    return Array.from(this.tradingSessions.values()).find(session => session.userId === userId);
  }

  async createTradingSession(insertSession: InsertTradingSession): Promise<TradingSession> {
    const id = randomUUID();
    const session: TradingSession = { 
      ...insertSession, 
      id,
      createdAt: new Date()
    };
    this.tradingSessions.set(id, session);
    return session;
  }

  async updateTradingSession(id: string, updates: Partial<TradingSession>): Promise<TradingSession | undefined> {
    const session = this.tradingSessions.get(id);
    if (!session) return undefined;
    
    const updatedSession = { ...session, ...updates };
    this.tradingSessions.set(id, updatedSession);
    return updatedSession;
  }

  // Trade methods
  async getTrades(userId: string, filters?: any): Promise<Trade[]> {
    const userTrades = Array.from(this.trades.values()).filter(trade => trade.userId === userId);
    
    if (!filters) return userTrades;

    return userTrades.filter(trade => {
      if (filters.symbol && trade.symbol !== filters.symbol) return false;
      if (filters.source && trade.source !== filters.source) return false;
      if (filters.startDate && new Date(trade.entryTime) < new Date(filters.startDate)) return false;
      if (filters.endDate && new Date(trade.entryTime) > new Date(filters.endDate)) return false;
      return true;
    });
  }

  async getTrade(id: string): Promise<Trade | undefined> {
    return this.trades.get(id);
  }

  async createTrade(insertTrade: InsertTrade): Promise<Trade> {
    const id = randomUUID();
    const trade: Trade = { 
      ...insertTrade, 
      id,
      entryTime: new Date()
    };
    this.trades.set(id, trade);
    return trade;
  }

  async updateTrade(id: string, updates: Partial<Trade>): Promise<Trade | undefined> {
    const trade = this.trades.get(id);
    if (!trade) return undefined;
    
    const updatedTrade = { ...trade, ...updates };
    this.trades.set(id, updatedTrade);
    return updatedTrade;
  }

  async deleteTrade(id: string): Promise<boolean> {
    return this.trades.delete(id);
  }

  // Wallet methods
  async getWallet(userId: string): Promise<Wallet | undefined> {
    return this.wallets.get(userId);
  }

  async createWallet(insertWallet: InsertWallet): Promise<Wallet> {
    const id = randomUUID();
    const wallet: Wallet = { 
      ...insertWallet, 
      id,
      updatedAt: new Date()
    };
    this.wallets.set(insertWallet.userId, wallet);
    return wallet;
  }

  async updateWallet(userId: string, updates: Partial<Wallet>): Promise<Wallet | undefined> {
    const wallet = this.wallets.get(userId);
    if (!wallet) return undefined;
    
    const updatedWallet = { ...wallet, ...updates, updatedAt: new Date() };
    this.wallets.set(userId, updatedWallet);
    return updatedWallet;
  }

  // Settings methods
  async getSettings(userId: string): Promise<Settings | undefined> {
    return this.settings.get(userId);
  }

  async createSettings(insertSettings: InsertSettings): Promise<Settings> {
    const id = randomUUID();
    const settings: Settings = { 
      ...insertSettings, 
      id,
      updatedAt: new Date()
    };
    this.settings.set(insertSettings.userId, settings);
    return settings;
  }

  async updateSettings(userId: string, updates: Partial<Settings>): Promise<Settings | undefined> {
    const settings = this.settings.get(userId);
    if (!settings) return undefined;
    
    const updatedSettings = { ...settings, ...updates, updatedAt: new Date() };
    this.settings.set(userId, updatedSettings);
    return updatedSettings;
  }

  // Market analysis methods
  async getLatestMarketAnalysis(): Promise<MarketAnalysis | undefined> {
    return this.marketAnalysis.get("latest");
  }

  async createMarketAnalysis(insertAnalysis: InsertMarketAnalysis): Promise<MarketAnalysis> {
    const id = randomUUID();
    const analysis: MarketAnalysis = { 
      ...insertAnalysis, 
      id,
      date: new Date()
    };
    this.marketAnalysis.set("latest", analysis);
    return analysis;
  }

  // AI learning methods
  async getAiLearning(userId: string): Promise<AiLearning[]> {
    return Array.from(this.aiLearning.values()).filter(learning => learning.userId === userId);
  }

  async createAiLearning(insertLearning: InsertAiLearning): Promise<AiLearning> {
    const id = randomUUID();
    const learning: AiLearning = { 
      ...insertLearning, 
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.aiLearning.set(id, learning);
    return learning;
  }

  async updateAiLearning(id: string, updates: Partial<AiLearning>): Promise<AiLearning | undefined> {
    const learning = this.aiLearning.get(id);
    if (!learning) return undefined;
    
    const updatedLearning = { ...learning, ...updates, updatedAt: new Date() };
    this.aiLearning.set(id, updatedLearning);
    return updatedLearning;
  }

  // Alert methods
  async getAlerts(userId: string, unreadOnly: boolean = false): Promise<Alert[]> {
    const userAlerts = Array.from(this.alerts.values()).filter(alert => alert.userId === userId);
    
    if (unreadOnly) {
      return userAlerts.filter(alert => !alert.isRead);
    }
    
    return userAlerts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const id = randomUUID();
    const alert: Alert = { 
      ...insertAlert, 
      id,
      createdAt: new Date()
    };
    this.alerts.set(id, alert);
    return alert;
  }

  async markAlertAsRead(id: string): Promise<boolean> {
    const alert = this.alerts.get(id);
    if (!alert) return false;
    
    alert.isRead = true;
    this.alerts.set(id, alert);
    return true;
  }
}

export const storage = new MemStorage();
