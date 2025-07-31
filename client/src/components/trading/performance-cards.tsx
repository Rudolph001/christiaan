import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, DollarSign, PieChart, Wallet } from "lucide-react";
import { formatCurrency, formatPercentage } from "@/lib/trading-utils";

export default function PerformanceCards() {
  const { data: stats } = useQuery({
    queryKey: ["/api/stats/performance"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: wallet } = useQuery({
    queryKey: ["/api/wallet"],
  });

  const cards = [
    {
      title: "Win Rate",
      value: stats ? `${stats.winRate}%` : "0%",
      icon: TrendingUp,
      color: "profit-green",
      bgColor: "bg-green-600 bg-opacity-20",
      description: (
        <div className="flex justify-between text-xs text-gray-400">
          <span>Live: <span className="profit-green">{stats?.liveWinRate || "0"}%</span></span>
          <span>AI: <span className="text-gray-300">{stats?.aiWinRate || "0"}%</span></span>
        </div>
      ),
      progress: parseFloat(stats?.winRate || "0")
    },
    {
      title: "Today's P&L",
      value: formatCurrency(stats?.dailyPnL || "0"),
      icon: DollarSign,
      color: parseFloat(stats?.dailyPnL || "0") >= 0 ? "profit-green" : "loss-red",
      bgColor: parseFloat(stats?.dailyPnL || "0") >= 0 ? "bg-green-600 bg-opacity-20" : "bg-red-600 bg-opacity-20",
      description: (
        <div className="text-xs text-gray-400">
          Net: <span className={parseFloat(stats?.dailyPnL || "0") >= 0 ? "profit-green" : "loss-red"}>
            {formatCurrency((parseFloat(stats?.dailyPnL || "0") * 0.95).toString())}
          </span>
        </div>
      )
    },
    {
      title: "Monthly P&L",
      value: formatCurrency(stats?.monthlyPnL || "0"),
      icon: PieChart,
      color: parseFloat(stats?.monthlyPnL || "0") >= 0 ? "profit-green" : "loss-red",
      bgColor: parseFloat(stats?.monthlyPnL || "0") >= 0 ? "bg-green-600 bg-opacity-20" : "bg-red-600 bg-opacity-20",
      description: (
        <div className="text-xs text-gray-400">
          Target: $5,000 | Progress: {Math.floor((parseFloat(stats?.monthlyPnL || "0") / 5000) * 100)}%
        </div>
      )
    },
    {
      title: "Current Balance",
      value: formatCurrency(wallet?.balance || "0"),
      icon: Wallet,
      color: "trading-text-blue",
      bgColor: "bg-blue-600 bg-opacity-20",
      description: (
        <div className="text-xs text-gray-400">
          Starting: {formatCurrency(wallet?.startingBalance || "0")} | 
          Gain: <span className="profit-green">
            {wallet ? formatPercentage(((parseFloat(wallet.balance) - parseFloat(wallet.startingBalance)) / parseFloat(wallet.startingBalance)) * 100) : "0%"}
          </span>
        </div>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className="trading-bg-slate trading-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{card.title}</p>
                <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
              </div>
              <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
            <div className="mt-4">
              {card.description}
              {card.progress !== undefined && (
                <div className="mt-2">
                  <Progress 
                    value={card.progress} 
                    className="w-full h-2"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
