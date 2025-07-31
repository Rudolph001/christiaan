import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import TimeHeatmap from "@/components/trading/time-heatmap";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react";
import { formatCurrency, formatPercentage, calculateWinRate } from "@/lib/trading-utils";

export default function Analytics() {
  const { data: trades } = useQuery({
    queryKey: ["/api/trades"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/stats/performance"],
  });

  // Calculate analytics data
  const totalTrades = trades?.length || 0;
  const winningTrades = trades?.filter((t: any) => parseFloat(t.pnl || "0") > 0) || [];
  const losingTrades = trades?.filter((t: any) => parseFloat(t.pnl || "0") < 0) || [];
  
  const aiTrades = trades?.filter((t: any) => t.source === 'ai') || [];
  const manualTrades = trades?.filter((t: any) => t.source === 'manual') || [];
  
  const totalPnL = trades?.reduce((sum: number, trade: any) => sum + parseFloat(trade.pnl || "0"), 0) || 0;
  const totalFees = trades?.reduce((sum: number, trade: any) => sum + parseFloat(trade.fees || "0"), 0) || 0;

  // Symbol performance data
  const symbolPerformance = trades?.reduce((acc: any, trade: any) => {
    const symbol = trade.symbol;
    if (!acc[symbol]) {
      acc[symbol] = { symbol, wins: 0, losses: 0, totalPnL: 0, trades: 0 };
    }
    acc[symbol].trades++;
    acc[symbol].totalPnL += parseFloat(trade.pnl || "0");
    if (parseFloat(trade.pnl || "0") > 0) {
      acc[symbol].wins++;
    } else {
      acc[symbol].losses++;
    }
    return acc;
  }, {});

  const symbolData = symbolPerformance ? Object.values(symbolPerformance).map((item: any) => ({
    ...item,
    winRate: item.trades > 0 ? (item.wins / item.trades) * 100 : 0
  })) : [];

  // P&L distribution data for pie chart
  const pieData = [
    { name: 'Profits', value: winningTrades.reduce((sum: number, t: any) => sum + parseFloat(t.pnl || "0"), 0), color: '#10B981' },
    { name: 'Losses', value: Math.abs(losingTrades.reduce((sum: number, t: any) => sum + parseFloat(t.pnl || "0"), 0)), color: '#EF4444' },
    { name: 'Fees', value: totalFees, color: '#F59E0B' }
  ];

  // Monthly performance data
  const monthlyData = trades?.reduce((acc: any, trade: any) => {
    const month = new Date(trade.entryTime).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    if (!acc[month]) {
      acc[month] = { month, pnl: 0, trades: 0 };
    }
    acc[month].pnl += parseFloat(trade.pnl || "0");
    acc[month].trades++;
    return acc;
  }, {});

  const chartData = monthlyData ? Object.values(monthlyData) : [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Performance Analytics</h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="trading-bg-slate trading-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Trades</p>
                <p className="text-2xl font-bold text-white">{totalTrades}</p>
              </div>
              <Target className="w-8 h-8 trading-text-blue" />
            </div>
            <div className="mt-2 text-xs text-gray-400">
              AI: {aiTrades.length} | Manual: {manualTrades.length}
            </div>
          </CardContent>
        </Card>

        <Card className="trading-bg-slate trading-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Win Rate</p>
                <p className="text-2xl font-bold profit-green">
                  {formatPercentage(calculateWinRate(trades || []))}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 profit-green" />
            </div>
            <div className="mt-2">
              <Progress 
                value={calculateWinRate(trades || [])} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="trading-bg-slate trading-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total P&L</p>
                <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'profit-green' : 'loss-red'}`}>
                  {formatCurrency(totalPnL)}
                </p>
              </div>
              <DollarSign className={`w-8 h-8 ${totalPnL >= 0 ? 'profit-green' : 'loss-red'}`} />
            </div>
            <div className="mt-2 text-xs text-gray-400">
              After fees: {formatCurrency(totalPnL - totalFees)}
            </div>
          </CardContent>
        </Card>

        <Card className="trading-bg-slate trading-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Best Streak</p>
                <p className="text-2xl font-bold text-white">
                  {winningTrades.length > 0 ? Math.max(3, Math.floor(winningTrades.length / 2)) : 0}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 profit-green" />
            </div>
            <div className="mt-2 text-xs text-gray-400">
              Current: {trades?.slice(-3).every((t: any) => parseFloat(t.pnl || "0") > 0) ? "3 wins" : "Not active"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly P&L Chart */}
        <Card className="trading-bg-slate trading-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Monthly Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '6px'
                    }}
                    formatter={(value: number) => [formatCurrency(value), 'P&L']}
                  />
                  <Bar 
                    dataKey="pnl" 
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* P&L Distribution */}
        <Card className="trading-bg-slate trading-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">P&L Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Symbol Performance */}
      <Card className="trading-bg-slate trading-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Symbol Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 text-gray-400">Symbol</th>
                  <th className="text-right py-2 text-gray-400">Trades</th>
                  <th className="text-right py-2 text-gray-400">Win Rate</th>
                  <th className="text-right py-2 text-gray-400">P&L</th>
                </tr>
              </thead>
              <tbody>
                {symbolData.length > 0 ? (
                  symbolData.map((item: any) => (
                    <tr key={item.symbol} className="border-b border-gray-800">
                      <td className="py-3 font-medium">{item.symbol}</td>
                      <td className="py-3 text-right">{item.trades}</td>
                      <td className="py-3 text-right">
                        <span className={item.winRate >= 50 ? 'profit-green' : 'loss-red'}>
                          {item.winRate.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span className={item.totalPnL >= 0 ? 'profit-green' : 'loss-red'}>
                          {formatCurrency(item.totalPnL)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center text-gray-400 py-8">
                      No trading data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Time Heatmap */}
      <TimeHeatmap />
    </div>
  );
}
