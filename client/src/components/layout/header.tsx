import { useQuery } from "@tanstack/react-query";
import { Bell, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDateTime } from "@/lib/trading-utils";

export default function Header() {
  const { data: marketAnalysis } = useQuery({
    queryKey: ["/api/market-analysis"],
    refetchInterval: 60000, // Refresh every minute
  });

  const { data: alerts } = useQuery({
    queryKey: ["/api/alerts"],
    select: (data) => data?.filter((alert: any) => !alert.isRead) || [],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const getBadgeVariant = (score?: number) => {
    if (!score) return "secondary";
    if (score >= 8) return "default"; // Green
    if (score >= 6) return "secondary"; // Yellow
    return "destructive"; // Red
  };

  const getBadgeText = (score?: number) => {
    if (!score) return "Loading...";
    if (score >= 8) return "Good Trading Day";
    if (score >= 6) return "Moderate Day";
    return "Poor Conditions";
  };

  const getTooltipText = (analysis?: any) => {
    if (!analysis) return "Loading market analysis...";
    return `Volatility: ${analysis.volatility >= 7 ? '✅' : '❌'}, News: ${analysis.newsImpact <= 3 ? '✅' : '❌'}, Trend: ${analysis.trendStrength >= 7 ? '✅' : '❌'}`;
  };

  return (
    <header className="trading-bg-slate border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <p className="text-sm text-gray-400">{formatDateTime(new Date())}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Smart Day Analyzer Badge */}
          <div className="flex items-center space-x-2">
            <Badge 
              variant={getBadgeVariant(marketAnalysis?.overallScore)}
              className="badge-good"
            >
              <div className="w-2 h-2 bg-current rounded-full mr-1"></div>
              {getBadgeText(marketAnalysis?.overallScore)}
            </Badge>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="p-1">
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{getTooltipText(marketAnalysis)}</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Alert Bell */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="relative p-2">
                <Bell className="w-5 h-5" />
                {alerts && alerts.length > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {alerts.length}
                  </Badge>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {alerts && alerts.length > 0 
                  ? `${alerts.length} unread alert${alerts.length > 1 ? 's' : ''}`
                  : 'No new alerts'
                }
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </header>
  );
}
