import { useQuery } from "@tanstack/react-query";
import PerformanceCards from "@/components/trading/performance-cards";
import BalanceChart from "@/components/trading/balance-chart";
import TimeHeatmap from "@/components/trading/time-heatmap";
import RecentTrades from "@/components/trading/recent-trades";
import AIInsights from "@/components/trading/ai-insights";
// import { useWebSocket } from "@/hooks/use-websocket"; // Temporarily disabled
import { useQueryClient } from "@tanstack/react-query";

export default function Dashboard() {
  const queryClient = useQueryClient();

  // WebSocket temporarily disabled to resolve connection issues
  // TODO: Re-enable WebSocket for real-time updates
  // useWebSocket({
  //   onMessage: (data) => {
  //     switch (data.type) {
  //       case 'trade-added':
  //       case 'trade-updated':
  //       case 'trade-deleted':
  //         queryClient.invalidateQueries({ queryKey: ["/api/trades"] });
  //         queryClient.invalidateQueries({ queryKey: ["/api/stats/performance"] });
  //         queryClient.invalidateQueries({ queryKey: ["/api/wallet"] });
  //         break;
  //       case 'session-update':
  //         queryClient.invalidateQueries({ queryKey: ["/api/trading-session"] });
  //         break;
  //       case 'settings-updated':
  //         queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
  //         break;
  //       default:
  //         break;
  //     }
  //   },
  //   onConnect: () => {
  //     console.log('Connected to WebSocket');
  //   },
  //   onDisconnect: () => {
  //     console.log('Disconnected from WebSocket');
  //   }
  // });

  return (
    <div className="space-y-6">
      {/* Performance Overview Cards */}
      <PerformanceCards />

      {/* Charts and Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BalanceChart />
        <TimeHeatmap />
      </div>

      {/* Recent Activity & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTrades />
        </div>
        <AIInsights />
      </div>
    </div>
  );
}
