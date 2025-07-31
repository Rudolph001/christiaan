class MarketAnalyzer {
  async analyzeDayConditions(): Promise<{
    score: number;
    summary: string;
    volatility: number;
    newsImpact: number;
    trendStrength: number;
    badge: 'good' | 'moderate' | 'poor';
  }> {
    // Simulate market analysis - in real implementation this would fetch real data
    const volatility = Math.floor(Math.random() * 5) + 5; // 5-10
    const newsImpact = Math.floor(Math.random() * 5) + 1; // 1-5
    const trendStrength = Math.floor(Math.random() * 5) + 5; // 5-10
    
    const score = Math.floor((volatility + (10 - newsImpact) + trendStrength) / 3);
    
    let badge: 'good' | 'moderate' | 'poor';
    let summary: string;

    if (score >= 8) {
      badge = 'good';
      summary = 'Excellent trading conditions. High volatility with clear trends.';
    } else if (score >= 6) {
      badge = 'moderate';
      summary = 'Moderate trading conditions. Some volatility present.';
    } else {
      badge = 'poor';
      summary = 'Poor trading conditions. Low volatility or high news impact.';
    }

    return {
      score,
      summary,
      volatility,
      newsImpact,
      trendStrength,
      badge
    };
  }

  getMarketHours(): {
    isMarketOpen: boolean;
    nextOpen: Date | null;
    session: 'asian' | 'london' | 'newyork' | 'closed';
  } {
    const now = new Date();
    const utcHour = now.getUTCHours();

    // Simplified market hours (UTC)
    if (utcHour >= 0 && utcHour < 8) {
      return { isMarketOpen: true, nextOpen: null, session: 'asian' };
    } else if (utcHour >= 8 && utcHour < 16) {
      return { isMarketOpen: true, nextOpen: null, session: 'london' };
    } else if (utcHour >= 16 && utcHour < 22) {
      return { isMarketOpen: true, nextOpen: null, session: 'newyork' };
    } else {
      const nextOpen = new Date(now);
      nextOpen.setUTCHours(0, 0, 0, 0);
      nextOpen.setUTCDate(nextOpen.getUTCDate() + 1);
      return { isMarketOpen: false, nextOpen, session: 'closed' };
    }
  }

  async getEconomicEvents(): Promise<Array<{
    time: string;
    event: string;
    impact: 'high' | 'medium' | 'low';
    currency: string;
  }>> {
    // Simulate economic calendar - in real implementation fetch from economic calendar API
    const events = [
      {
        time: '08:30',
        event: 'Non-Farm Payrolls',
        impact: 'high' as const,
        currency: 'USD'
      },
      {
        time: '10:00',
        event: 'Consumer Confidence',
        impact: 'medium' as const,
        currency: 'USD'
      },
      {
        time: '14:00',
        event: 'ECB Interest Rate Decision',
        impact: 'high' as const,
        currency: 'EUR'
      }
    ];

    return events;
  }
}

export const marketAnalyzer = new MarketAnalyzer();
