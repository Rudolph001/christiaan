import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Edit, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatPrice, formatTime, formatDate } from "@/lib/trading-utils";

interface TradeTableProps {
  showFilters?: boolean;
}

export default function TradeTable({ showFilters = true }: TradeTableProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    symbol: '',
    source: '',
    startDate: '',
    endDate: ''
  });

  const { data: trades, isLoading } = useQuery({
    queryKey: ["/api/trades", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await fetch(`/api/trades?${params}`);
      return response.json();
    },
  });

  const deleteTrade = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/trades/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trades"] });
      toast({
        title: "Trade deleted",
        description: "Trade has been successfully deleted",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete trade",
        variant: "destructive",
      });
    },
  });

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      symbol: '',
      source: '',
      startDate: '',
      endDate: ''
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {showFilters && (
          <div className="trading-bg-slate rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse h-10 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        )}
        <div className="trading-bg-slate rounded-lg">
          <div className="animate-pulse space-y-4 p-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showFilters && (
        <div className="trading-bg-slate rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={filters.symbol} onValueChange={(value) => handleFilterChange('symbol', value)}>
              <SelectTrigger className="trading-input">
                <SelectValue placeholder="All Symbols" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Symbols</SelectItem>
                <SelectItem value="EURUSD">EURUSD</SelectItem>
                <SelectItem value="GBPJPY">GBPJPY</SelectItem>
                <SelectItem value="BTCUSD">BTCUSD</SelectItem>
                <SelectItem value="ETHUSD">ETHUSD</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.source} onValueChange={(value) => handleFilterChange('source', value)}>
              <SelectTrigger className="trading-input">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="ai">AI Trades</SelectItem>
                <SelectItem value="manual">Manual Trades</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="trading-input"
            />

            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="trading-input"
            />
          </div>
          
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={clearFilters} size="sm">
              Clear Filters
            </Button>
          </div>
        </div>
      )}

      <div className="trading-bg-slate rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="trading-table">
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Entry</TableHead>
                <TableHead>Exit</TableHead>
                <TableHead>P&L</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trades && trades.length > 0 ? (
                trades.map((trade: any) => {
                  const isProfit = parseFloat(trade.pnl || "0") > 0;
                  return (
                    <TableRow key={trade.id}>
                      <TableCell>
                        <div>
                          <div className="text-sm">{formatTime(trade.entryTime)}</div>
                          <div className="text-xs text-gray-400">{formatDate(trade.entryTime)}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{trade.symbol}</TableCell>
                      <TableCell>
                        <Badge
                          variant={trade.type === 'long' ? 'default' : 'secondary'}
                          className={trade.type === 'long' ? 'badge-good' : 'badge-poor'}
                        >
                          {trade.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatPrice(trade.entryPrice, trade.symbol)}</TableCell>
                      <TableCell>{trade.exitPrice ? formatPrice(trade.exitPrice, trade.symbol) : '-'}</TableCell>
                      <TableCell>
                        <span className={`font-medium ${isProfit ? 'profit-green' : 'loss-red'}`}>
                          {trade.pnl ? formatCurrency(trade.pnl) : 'Pending'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={trade.source === 'ai' ? 'bg-blue-900 bg-opacity-50 text-blue-300' : 'bg-gray-700 text-gray-300'}
                        >
                          {trade.source === 'ai' ? 'AI' : 'Manual'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-400 max-w-48 truncate">
                        {trade.notes || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" className="p-1">
                            <Edit className="w-4 h-4 trading-text-blue" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1"
                            onClick={() => deleteTrade.mutate(trade.id)}
                            disabled={deleteTrade.isPending}
                          >
                            <Trash2 className="w-4 h-4 loss-red" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-gray-400 py-8">
                    No trades found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
