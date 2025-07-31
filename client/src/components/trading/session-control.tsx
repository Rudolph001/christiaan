import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, calculateRiskAmount } from "@/lib/trading-utils";

export default function SessionControl() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: session, isLoading } = useQuery({
    queryKey: ["/api/trading-session"],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const { data: wallet } = useQuery({
    queryKey: ["/api/wallet"],
  });

  const { data: settings } = useQuery({
    queryKey: ["/api/settings"],
  });

  const toggleSession = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/trading-session/toggle");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trading-session"] });
      toast({
        title: session?.isActive ? "Trading session stopped" : "Trading session started",
        description: session?.isActive 
          ? "Trade tracking has been disabled" 
          : "Trade tracking is now active",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to toggle trading session",
        variant: "destructive",
      });
    },
  });

  const isSessionActive = session?.isActive || false;
  const dailyTradeCount = session?.dailyTradeCount || 0;
  const maxTrades = settings?.maxTradesPerDay || 10;
  
  const riskAmount = wallet && settings 
    ? calculateRiskAmount(wallet.balance, settings.riskPercentage)
    : 0;

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
          <div className="h-10 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Trading Session</span>
        <div className={isSessionActive ? "status-active" : "status-inactive"}></div>
      </div>
      
      <Button
        onClick={() => toggleSession.mutate()}
        disabled={toggleSession.isPending}
        className={
          isSessionActive 
            ? "w-full btn-loss" 
            : "w-full btn-profit"
        }
      >
        {toggleSession.isPending
          ? "Loading..."
          : isSessionActive
          ? "Stop Trading Session"
          : "Start Trading Session"
        }
      </Button>
      
      <div className="text-xs text-gray-400 space-y-1">
        <div>
          Trades today: <span className="text-white">{dailyTradeCount}</span>/{maxTrades}
        </div>
        <div>
          Risk per trade: <span className="profit-green">{formatCurrency(riskAmount)}</span>
        </div>
      </div>
    </div>
  );
}
