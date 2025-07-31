import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const tradingSessions = pgTable("trading_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  isActive: boolean("is_active").default(false),
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  dailyTradeCount: integer("daily_trade_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const trades = pgTable("trades", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  sessionId: varchar("session_id"),
  symbol: text("symbol").notNull(),
  type: text("type").notNull(), // 'long' | 'short'
  source: text("source").notNull(), // 'ai' | 'manual'
  entryPrice: decimal("entry_price", { precision: 10, scale: 5 }).notNull(),
  exitPrice: decimal("exit_price", { precision: 10, scale: 5 }),
  quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull(),
  pnl: decimal("pnl", { precision: 10, scale: 2 }),
  fees: decimal("fees", { precision: 10, scale: 2 }).default("0"),
  status: text("status").default("pending"), // 'pending' | 'open' | 'closed'
  entryTime: timestamp("entry_time").defaultNow(),
  exitTime: timestamp("exit_time"),
  notes: text("notes"),
  aiConfidence: integer("ai_confidence"), // 0-100
  reasoning: text("reasoning"),
});

export const wallet = pgTable("wallet", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  balance: decimal("balance", { precision: 12, scale: 2 }).notNull(),
  startingBalance: decimal("starting_balance", { precision: 12, scale: 2 }).notNull(),
  totalPnL: decimal("total_pnl", { precision: 12, scale: 2 }).default("0"),
  monthlyPnL: decimal("monthly_pnl", { precision: 12, scale: 2 }).default("0"),
  dailyPnL: decimal("daily_pnl", { precision: 12, scale: 2 }).default("0"),
  totalFees: decimal("total_fees", { precision: 10, scale: 2 }).default("0"),
  lastWithdrawal: timestamp("last_withdrawal"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const settings = pgTable("settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  riskPercentage: decimal("risk_percentage", { precision: 3, scale: 1 }).default("1.0"),
  tradingFee: decimal("trading_fee", { precision: 4, scale: 3 }).default("0.075"),
  maxTradesPerDay: integer("max_trades_per_day").default(10),
  discordWebhook: text("discord_webhook"),
  aiConfidenceThreshold: integer("ai_confidence_threshold").default(70),
  weekendTradingEnabled: boolean("weekend_trading_enabled").default(true),
  autoExecuteAI: boolean("auto_execute_ai").default(false),
  theme: text("theme").default("dark"),
  currency: text("currency").default("USD"),
  timezone: text("timezone").default("EST"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const marketAnalysis = pgTable("market_analysis", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: timestamp("date").defaultNow(),
  volatility: integer("volatility"), // 1-10 scale
  newsImpact: integer("news_impact"), // 1-10 scale
  trendStrength: integer("trend_strength"), // 1-10 scale
  overallScore: integer("overall_score"), // 1-10 scale
  summary: text("summary"),
  recommendations: jsonb("recommendations"),
});

export const aiLearning = pgTable("ai_learning", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  pattern: text("pattern").notNull(),
  confidence: decimal("confidence", { precision: 5, scale: 2 }).notNull(),
  successRate: decimal("success_rate", { precision: 5, scale: 2 }),
  timesUsed: integer("times_used").default(0),
  lastUsed: timestamp("last_used"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  symbol: text("symbol").notNull(),
  type: text("type").notNull(), // 'opportunity' | 'warning' | 'update'
  message: text("message").notNull(),
  confidence: integer("confidence"),
  isRead: boolean("is_read").default(false),
  sentToDiscord: boolean("sent_to_discord").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTradingSessionSchema = createInsertSchema(tradingSessions).omit({
  id: true,
  createdAt: true,
});

export const insertTradeSchema = createInsertSchema(trades).omit({
  id: true,
  entryTime: true,
});

export const insertWalletSchema = createInsertSchema(wallet).omit({
  id: true,
  updatedAt: true,
});

export const insertSettingsSchema = createInsertSchema(settings).omit({
  id: true,
  updatedAt: true,
});

export const insertMarketAnalysisSchema = createInsertSchema(marketAnalysis).omit({
  id: true,
  date: true,
});

export const insertAiLearningSchema = createInsertSchema(aiLearning).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertTradingSession = z.infer<typeof insertTradingSessionSchema>;
export type TradingSession = typeof tradingSessions.$inferSelect;

export type InsertTrade = z.infer<typeof insertTradeSchema>;
export type Trade = typeof trades.$inferSelect;

export type InsertWallet = z.infer<typeof insertWalletSchema>;
export type Wallet = typeof wallet.$inferSelect;

export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settings.$inferSelect;

export type InsertMarketAnalysis = z.infer<typeof insertMarketAnalysisSchema>;
export type MarketAnalysis = typeof marketAnalysis.$inferSelect;

export type InsertAiLearning = z.infer<typeof insertAiLearningSchema>;
export type AiLearning = typeof aiLearning.$inferSelect;

export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alerts.$inferSelect;
