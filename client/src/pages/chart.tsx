import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

export default function Chart() {
  const [selectedSymbol, setSelectedSymbol] = useState("EURUSD");
  const [selectedTimeframe, setSelectedTimeframe] = useState("15m");

  const { data: analysis, isLoading: analysisLoading } = useQuery({
    queryKey: ["/api/ai/analyze", selectedSymbol, selectedTimeframe],
    queryFn: async () => {
      const response = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol: selectedSymbol, timeframe: selectedTimeframe })
      });
      return response.json();
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const symbols = ["EURUSD", "GBPJPY", "BTCUSD", "ETHUSD", "XAUUSD"];
  const timeframes = ["1m", "5m", "15m", "1h", "4h", "1d"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Live Chart Analysis</h2>
        <div className="flex space-x-4">
          <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
            <SelectTrigger className="w-32 trading-input">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {symbols.map(symbol => (
                <SelectItem key={symbol} value={symbol}>{symbol}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-20 trading-input">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeframes.map(tf => (
                <SelectItem key={tf} value={tf}>{tf}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Chart Container */}
      <Card className="trading-bg-slate trading-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">{selectedSymbol} - {selectedTimeframe}</CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                <Activity className="w-3 h-3 mr-1" />
                Live
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-96 chart-container">
            <div className="text-center text-gray-400">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">TradingView Chart</p>
              <p className="text-sm">
                Integrate TradingView widget or chart library here
              </p>
              <p className="text-xs mt-2 text-gray-500">
                Chart would display real-time {selectedSymbol} data with AI overlays
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="trading-bg-slate trading-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">AI Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              {analysisLoading ? (
                <div className="space-y-4">
                  <div className="animate-pulse h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="animate-pulse h-4 bg-gray-700 rounded w-1/2"></div>
                  <div className="animate-pulse h-4 bg-gray-700 rounded w-2/3"></div>
                </div>
              ) : analysis ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {analysis.action === 'buy' ? (
                        <TrendingUp className="w-6 h-6 profit-green" />
                      ) : (
                        <TrendingDown className="w-6 h-6 loss-red" />
                      )}
                      <div>
                        <div className="font-medium text-lg">
                          {analysis.action === 'buy' ? 'BUY' : 'SELL'} Signal
                        </div>
                        <div className="text-sm text-gray-400">
                          Confidence: {analysis.confidence}%
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant={analysis.confidence >= 80 ? 'default' : analysis.confidence >= 60 ? 'secondary' : 'destructive'}
                      className={
                        analysis.confidence >= 80 ? 'badge-good' : 
                        analysis.confidence >= 60 ? 'badge-moderate' : 'badge-poor'
                      }
                    >
                      {analysis.confidence >= 80 ? 'High' : analysis.confidence >= 60 ? 'Medium' : 'Low'} Confidence
                    </Badge>
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="text-sm font-medium mb-2">Reasoning:</div>
                    <div className="text-sm text-gray-300">{analysis.reasoning}</div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400">Entry Price</div>
                      <div className="font-medium">{analysis.entryPrice}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Stop Loss</div>
                      <div className="font-medium loss-red">{analysis.stopLoss}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Take Profit</div>
                      <div className="font-medium profit-green">{analysis.takeProfit}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  <p>No analysis available</p>
                  <p className="text-sm">Select a symbol and timeframe to get AI insights</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="trading-bg-slate trading-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full btn-profit"
                disabled={!analysis || analysisLoading}
              >
                Execute AI Trade
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                disabled={!analysis || analysisLoading}
              >
                Add to Watchlist
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                disabled={!analysis || analysisLoading}
              >
                Set Alert
              </Button>

              <div className="pt-4 border-t border-gray-700">
                <div className="text-sm text-gray-400 mb-2">Market Status</div>
                <Badge variant="default" className="badge-good">
                  <div className="w-2 h-2 bg-current rounded-full mr-1"></div>
                  Market Open
                </Badge>
              </div>
              
              <div className="text-xs text-gray-400 space-y-1">
                <div>London Session: 08:00 - 17:00</div>
                <div>New York Session: 13:00 - 22:00</div>
                <div>Next: Asian Session in 6h 23m</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
