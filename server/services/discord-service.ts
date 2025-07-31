interface DiscordAlert {
  webhook: string;
  symbol: string;
  type: 'opportunity' | 'warning' | 'update';
  message: string;
  confidence?: number;
  entryPrice?: string;
  stopLoss?: string;
  takeProfit?: string;
}

class DiscordService {
  async sendAlert(alert: DiscordAlert): Promise<boolean> {
    try {
      const embed = {
        title: `🤖 AI Trading Alert - ${alert.symbol}`,
        description: alert.message,
        color: this.getColorByType(alert.type),
        fields: [
          {
            name: "Type",
            value: alert.type.charAt(0).toUpperCase() + alert.type.slice(1),
            inline: true
          }
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: "AI Trading Assistant"
        }
      };

      if (alert.confidence) {
        embed.fields.push({
          name: "Confidence",
          value: `${alert.confidence}%`,
          inline: true
        });
      }

      if (alert.entryPrice) {
        embed.fields.push({
          name: "Entry Price",
          value: alert.entryPrice,
          inline: true
        });
      }

      if (alert.stopLoss) {
        embed.fields.push({
          name: "Stop Loss",
          value: alert.stopLoss,
          inline: true
        });
      }

      if (alert.takeProfit) {
        embed.fields.push({
          name: "Take Profit",
          value: alert.takeProfit,
          inline: true
        });
      }

      const payload = {
        embeds: [embed]
      };

      const response = await fetch(alert.webhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to send Discord alert:', error);
      return false;
    }
  }

  private getColorByType(type: string): number {
    switch (type) {
      case 'opportunity':
        return 0x10B981; // Green
      case 'warning':
        return 0xF59E0B; // Amber
      case 'update':
        return 0x3B82F6; // Blue
      default:
        return 0x6B7280; // Gray
    }
  }

  async sendTradeUpdate(webhook: string, trade: any): Promise<boolean> {
    const profit = parseFloat(trade.pnl || "0") > 0;
    const emoji = profit ? "📈" : "📉";
    const color = profit ? 0x10B981 : 0xEF4444;

    return this.sendAlert({
      webhook,
      symbol: trade.symbol,
      type: 'update',
      message: `${emoji} Trade ${profit ? 'Profit' : 'Loss'}: ${trade.pnl} USD`,
      entryPrice: trade.entryPrice,
      ...trade.exitPrice && { stopLoss: trade.exitPrice }
    });
  }
}

export const discordService = new DiscordService();
