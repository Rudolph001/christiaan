import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Download } from "lucide-react";
import TradeTable from "@/components/trading/trade-table";
import AddTradeModal from "@/components/modals/add-trade-modal";
import { useQuery } from "@tanstack/react-query";
import { exportToCSV } from "@/lib/trading-utils";
import { useToast } from "@/hooks/use-toast";

export default function Journal() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { toast } = useToast();

  const { data: trades } = useQuery({
    queryKey: ["/api/trades"],
  });

  const handleExportCSV = () => {
    if (!trades || trades.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no trades to export",
        variant: "destructive",
      });
      return;
    }

    // Transform trades data for CSV export
    const csvData = trades.map((trade: any) => ({
      Date: new Date(trade.entryTime).toISOString().split('T')[0],
      Time: new Date(trade.entryTime).toLocaleTimeString(),
      Symbol: trade.symbol,
      Type: trade.type,
      Source: trade.source,
      'Entry Price': trade.entryPrice,
      'Exit Price': trade.exitPrice || '',
      'P&L': trade.pnl || '',
      Fees: trade.fees || '',
      Notes: trade.notes || ''
    }));

    exportToCSV(csvData, `trades-${new Date().toISOString().split('T')[0]}.csv`);
    
    toast({
      title: "Export successful",
      description: "Trades have been exported to CSV file",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Trade Journal</h2>
        <div className="flex space-x-3">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-trading"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Trade
          </Button>
          <Button
            variant="outline"
            onClick={handleExportCSV}
            className="bg-gray-700 hover:bg-gray-600"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Trade Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="trading-bg-slate">
          <CardContent className="p-4">
            <div className="text-sm text-gray-400">Total Trades</div>
            <div className="text-2xl font-bold text-white">
              {trades ? trades.length : 0}
            </div>
          </CardContent>
        </Card>
        
        <Card className="trading-bg-slate">
          <CardContent className="p-4">
            <div className="text-sm text-gray-400">Winning Trades</div>
            <div className="text-2xl font-bold profit-green">
              {trades ? trades.filter((t: any) => parseFloat(t.pnl || "0") > 0).length : 0}
            </div>
          </CardContent>
        </Card>
        
        <Card className="trading-bg-slate">
          <CardContent className="p-4">
            <div className="text-sm text-gray-400">Losing Trades</div>
            <div className="text-2xl font-bold loss-red">
              {trades ? trades.filter((t: any) => parseFloat(t.pnl || "0") < 0).length : 0}
            </div>
          </CardContent>
        </Card>
        
        <Card className="trading-bg-slate">
          <CardContent className="p-4">
            <div className="text-sm text-gray-400">Win Rate</div>
            <div className="text-2xl font-bold text-white">
              {trades && trades.length > 0 
                ? `${((trades.filter((t: any) => parseFloat(t.pnl || "0") > 0).length / trades.length) * 100).toFixed(1)}%`
                : "0%"
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trade Table */}
      <TradeTable showFilters={true} />

      {/* Add Trade Modal */}
      <AddTradeModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
}
