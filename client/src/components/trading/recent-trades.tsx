import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { formatCurrency, formatTime } from "@/lib/trading-utils";

export default function RecentTrades() {
  const { data: trades, isLoading } = useQuery({
    queryKey: ["/api/trades"],
    select: (data) => data?.slice(0, 5) || [], // Get latest 5 trades
  });

  if (isLoading) {
    return (
      <Card className="trading-bg-slate trading-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Recent Trades</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse p-3 bg-gray-800 rounded-lg">
                <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="trading-bg-slate trading-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Recent Trades</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/journal">
              <a className="trading-text-blue hover:text-blue-400 text-sm">View All</a>
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {trades && trades.length > 0 ? (
            trades.map((trade: any) => {
              const isProfit = parseFloat(trade.pnl || "0") > 0;
              return (
                <div key={trade.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${isProfit ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div>
                      <div className="font-medium">{trade.symbol}</div>
                      <div className="text-xs text-gray-400">{formatTime(trade.entryTime)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${isProfit ? 'profit-green' : 'loss-red'}`}>
                      {trade.pnl ? formatCurrency(trade.pnl) : 'Pending'}
                    </div>
                    <div className="text-xs text-gray-400">
                      <Badge variant="outline" className="text-xs">
                        {trade.type} • {trade.source === 'ai' ? 'AI' : 'Manual'}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-gray-400 py-8">
              <p>No trades yet</p>
              <p className="text-sm">Start a trading session to begin tracking trades</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
