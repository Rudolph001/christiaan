import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertTriangle, Info } from "lucide-react";

export default function AIInsights() {
  const { data: alerts } = useQuery({
    queryKey: ["/api/alerts"],
    select: (data) => data?.slice(0, 3) || [], // Get latest 3 alerts
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Mock insights if no real data
  const mockInsights = [
    {
      id: "1",
      type: "update",
      message: "AI learned from yesterday's GBPUSD pattern. Confidence increased by 12%.",
      confidence: 85,
      createdAt: new Date()
    },
    {
      id: "2", 
      type: "opportunity",
      message: "EURUSD showing bullish divergence on 15m chart. 73% confidence.",
      confidence: 73,
      createdAt: new Date()
    },
    {
      id: "3",
      type: "warning",
      message: "High volatility expected during NFP release at 8:30 AM EST.",
      confidence: 90,
      createdAt: new Date()
    }
  ];

  const displayInsights = alerts && alerts.length > 0 ? alerts : mockInsights;

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity':
        return TrendingUp;
      case 'warning':
        return AlertTriangle;
      default:
        return Info;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity':
        return 'profit-green';
      case 'warning':
        return 'warning-amber';
      default:
        return 'trading-text-blue';
    }
  };

  const getInsightBgColor = (type: string) => {
    switch (type) {
      case 'opportunity':
        return 'alert-success';
      case 'warning':
        return 'alert-warning';
      default:
        return 'alert-info';
    }
  };

  const getInsightTitle = (type: string) => {
    switch (type) {
      case 'opportunity':
        return 'Opportunity Alert';
      case 'warning':
        return 'Risk Warning';
      default:
        return 'Strategy Update';
    }
  };

  return (
    <Card className="trading-bg-slate trading-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">AI Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayInsights.map((insight: any) => {
            const Icon = getInsightIcon(insight.type);
            return (
              <div key={insight.id} className={getInsightBgColor(insight.type)}>
                <div className="flex items-start space-x-2">
                  <div className={`w-2 h-2 rounded-full mt-2 ${getInsightColor(insight.type)}`}></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className={`text-sm font-medium ${getInsightColor(insight.type)}`}>
                        {getInsightTitle(insight.type)}
                      </div>
                      {insight.confidence && (
                        <Badge variant="outline" className="text-xs">
                          {insight.confidence}%
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-gray-300">
                      {insight.message}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
