import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { generateBalanceChartData } from "@/lib/trading-utils";

export default function BalanceChart() {
  const { data: trades } = useQuery({
    queryKey: ["/api/trades"],
  });

  const { data: wallet } = useQuery({
    queryKey: ["/api/wallet"],
  });

  // Generate chart data from trades and starting balance
  const chartData = trades && wallet 
    ? generateBalanceChartData(trades, parseFloat(wallet.startingBalance))
    : [];

  // Mock data for demonstration if no real data
  const mockData = [
    { date: '2024-01-01', balance: 50000 },
    { date: '2024-01-02', balance: 50247 },
    { date: '2024-01-03', balance: 50189 },
    { date: '2024-01-04', balance: 50456 },
    { date: '2024-01-05', balance: 50712 },
    { date: '2024-01-06', balance: 50934 },
    { date: '2024-01-07', balance: 51248 },
    { date: '2024-01-08', balance: 51487 },
    { date: '2024-01-09', balance: 51723 },
    { date: '2024-01-10', balance: 52156 },
    { date: '2024-01-11', balance: 52543 },
    { date: '2024-01-12', balance: 52890 },
    { date: '2024-01-13', balance: 53234 },
    { date: '2024-01-14', balance: 53678 },
    { date: '2024-01-15', balance: 54123 },
  ];

  const displayData = chartData.length > 0 ? chartData : mockData;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Card className="trading-bg-slate trading-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Balance Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={displayData}>
              <defs>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF"
                fontSize={12}
                tickFormatter={formatDate}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
                tickFormatter={formatCurrency}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '6px'
                }}
                labelStyle={{ color: '#D1D5DB' }}
                formatter={(value: number) => [formatCurrency(value), 'Balance']}
                labelFormatter={(label: string) => `Date: ${formatDate(label)}`}
              />
              <Area 
                type="monotone" 
                dataKey="balance" 
                stroke="#10B981" 
                strokeWidth={2}
                fill="url(#balanceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
