export const formatCurrency = (value: string | number, currency: string = 'USD'): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numValue);
};

export const formatPercentage = (value: string | number): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return `${numValue.toFixed(1)}%`;
};

export const formatPrice = (value: string | number, symbol: string): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  const decimals = symbol.includes('JPY') ? 3 : 5;
  return numValue.toFixed(decimals);
};

export const calculatePnL = (
  entryPrice: string | number,
  exitPrice: string | number,
  quantity: string | number,
  type: 'long' | 'short'
): number => {
  const entry = typeof entryPrice === 'string' ? parseFloat(entryPrice) : entryPrice;
  const exit = typeof exitPrice === 'string' ? parseFloat(exitPrice) : exitPrice;
  const qty = typeof quantity === 'string' ? parseFloat(quantity) : quantity;
  
  const priceDiff = type === 'long' ? exit - entry : entry - exit;
  return priceDiff * qty;
};

export const calculateWinRate = (trades: any[]): number => {
  if (trades.length === 0) return 0;
  
  const winningTrades = trades.filter(trade => parseFloat(trade.pnl || '0') > 0);
  return (winningTrades.length / trades.length) * 100;
};

export const calculateRiskAmount = (balance: string | number, riskPercentage: string | number): number => {
  const bal = typeof balance === 'string' ? parseFloat(balance) : balance;
  const risk = typeof riskPercentage === 'string' ? parseFloat(riskPercentage) : riskPercentage;
  
  return (bal * risk) / 100;
};

export const getHeatmapColor = (winRate: number): string => {
  if (winRate >= 80) return 'bg-green-500 bg-opacity-95';
  if (winRate >= 70) return 'bg-green-500 bg-opacity-80';
  if (winRate >= 60) return 'bg-green-500 bg-opacity-70';
  if (winRate >= 50) return 'bg-green-500 bg-opacity-50';
  if (winRate >= 40) return 'bg-yellow-500 bg-opacity-50';
  if (winRate >= 30) return 'bg-yellow-500 bg-opacity-40';
  if (winRate >= 20) return 'bg-red-500 bg-opacity-40';
  return 'bg-red-500 bg-opacity-60';
};

export const formatTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/New_York',
    timeZoneName: 'short'
  });
};

export const exportToCSV = (data: any[], filename: string): void => {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => row[header] || '').join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

export const generateBalanceChartData = (trades: any[], startingBalance: number): any[] => {
  let balance = startingBalance;
  const data = [{ date: new Date().toISOString().split('T')[0], balance }];
  
  trades.forEach(trade => {
    balance += parseFloat(trade.pnl || '0');
    data.push({
      date: new Date(trade.entryTime).toISOString().split('T')[0],
      balance
    });
  });
  
  return data;
};
