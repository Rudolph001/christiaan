import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Wallet as WalletIcon, AlertCircle } from "lucide-react";
import BalanceChart from "@/components/trading/balance-chart";
import { formatCurrency, formatPercentage, calculateRiskAmount } from "@/lib/trading-utils";

export default function Wallet() {
  const { data: wallet, isLoading: walletLoading } = useQuery({
    queryKey: ["/api/wallet"],
  });

  const { data: settings } = useQuery({
    queryKey: ["/api/settings"],
  });

  const { data: trades } = useQuery({
    queryKey: ["/api/trades"],
  });

  const monthlyTrades = trades?.filter((trade: any) => {
    const tradeDate = new Date(trade.entryTime);
    const now = new Date();
    return tradeDate.getMonth() === now.getMonth() && tradeDate.getFullYear() === now.getFullYear();
  }) || [];

  const monthlyFees = monthlyTrades.reduce((sum: number, trade: any) => 
    sum + parseFloat(trade.fees || "0"), 0
  );

  const monthlyWinRate = monthlyTrades.length > 0 
    ? (monthlyTrades.filter((t: any) => parseFloat(t.pnl || "0") > 0).length / monthlyTrades.length) * 100
    : 0;

  const riskAmount = wallet && settings 
    ? calculateRiskAmount(wallet.balance, settings.riskPercentage)
    : 0;

  const targetGain = riskAmount * 3; // 1:3 risk reward ratio

  if (walletLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Wallet & P&L Management</h2>
      
      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="trading-bg-slate trading-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Current Balance</h3>
              <WalletIcon className="w-6 h-6 trading-text-blue" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {wallet ? formatCurrency(wallet.balance) : formatCurrency("0")}
            </div>
            <div className="text-sm text-gray-400 space-y-1">
              <div>
                Starting: {wallet ? formatCurrency(wallet.startingBalance) : formatCurrency("0")}
              </div>
              <div>
                Total Gain: <span className="profit-green">
                  {wallet ? `${formatCurrency(wallet.totalPnL)} (${formatPercentage(((parseFloat(wallet.balance) - parseFloat(wallet.startingBalance)) / parseFloat(wallet.startingBalance)) * 100)})` : "$0 (0%)"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="trading-bg-slate trading-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">This Month</h3>
              <TrendingUp className="w-6 h-6 profit-green" />
            </div>
            <div className="text-3xl font-bold profit-green mb-2">
              {wallet ? formatCurrency(wallet.monthlyPnL) : formatCurrency("0")}
            </div>
            <div className="text-sm text-gray-400 space-y-1">
              <div>
                Trades: {monthlyTrades.length} | Fees: <span className="loss-red">{formatCurrency(monthlyFees)}</span>
              </div>
              <div>
                Win Rate: <span className="profit-green">{monthlyWinRate.toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="trading-bg-slate trading-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Risk Settings</h3>
              <AlertCircle className="w-6 h-6 warning-amber" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Risk per trade:</span>
                <span className="text-white font-medium">
                  {formatCurrency(riskAmount)} ({settings?.riskPercentage || "1"}%)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Target gain (1:3):</span>
                <span className="profit-green font-medium">{formatCurrency(targetGain)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Stop loss:</span>
                <span className="loss-red font-medium">{formatCurrency(riskAmount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Balance Chart */}
      <BalanceChart />

      {/* Transaction History */}
      <Card className="trading-bg-slate trading-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {trades && trades.length > 0 ? (
              trades.slice(0, 10).map((trade: any) => {
                const isProfit = parseFloat(trade.pnl || "0") > 0;
                return (
                  <div key={trade.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isProfit ? 'bg-green-600 bg-opacity-20' : 'bg-red-600 bg-opacity-20'
                      }`}>
                        {isProfit ? (
                          <TrendingUp className="w-5 h-5 profit-green" />
                        ) : (
                          <DollarSign className="w-5 h-5 loss-red" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">
                          Trade {isProfit ? 'Profit' : 'Loss'} - {trade.symbol}
                        </div>
                        <div className="text-sm text-gray-400">
                          {new Date(trade.entryTime).toLocaleDateString()} {new Date(trade.entryTime).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${isProfit ? 'profit-green' : 'loss-red'}`}>
                        {trade.pnl ? formatCurrency(trade.pnl) : 'Pending'}
                      </div>
                      <div className="text-sm text-gray-400">Trade P&L</div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-gray-400 py-8">
                <WalletIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No transactions yet</p>
                <p className="text-sm">Start trading to see your transaction history</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
