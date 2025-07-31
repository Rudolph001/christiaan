import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/use-theme";
import { Download, Upload, RotateCcw, Trash2, TestTube } from "lucide-react";

export default function Settings() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<any>({});

  const { data: settings, isLoading } = useQuery({
    queryKey: ["/api/settings"],
    onSuccess: (data) => {
      setFormData(data);
    }
  });

  const updateSettings = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("PUT", "/api/settings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    },
  });

  const testDiscordWebhook = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/discord/test");
    },
    onSuccess: () => {
      toast({
        title: "Test successful",
        description: "Discord webhook is working correctly",
      });
    },
    onError: () => {
      toast({
        title: "Test failed",
        description: "Discord webhook test failed",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateSettings.mutate(formData);
  };

  const handleReset = () => {
    if (settings) {
      setFormData(settings);
      toast({
        title: "Settings reset",
        description: "Settings have been reset to last saved values",
      });
    }
  };

  const handleExportData = () => {
    // This would typically download all user data
    toast({
      title: "Export started",
      description: "Your data export will be downloaded shortly",
    });
  };

  const handleClearData = () => {
    // This would show a confirmation dialog first
    toast({
      title: "Clear data",
      description: "This action requires confirmation",
      variant: "destructive",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-32 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trading Settings */}
        <Card className="trading-bg-slate trading-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Trading Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="startingBalance" className="text-sm font-medium text-gray-300">
                Starting Balance
              </Label>
              <Input
                id="startingBalance"
                type="number"
                value={formData.startingBalance || ""}
                onChange={(e) => handleInputChange('startingBalance', e.target.value)}
                className="trading-input mt-1"
                placeholder="50000"
              />
            </div>
            
            <div>
              <Label htmlFor="riskPercentage" className="text-sm font-medium text-gray-300">
                Risk per Trade (%)
              </Label>
              <Input
                id="riskPercentage"
                type="number"
                step="0.1"
                min="0.1"
                max="5"
                value={formData.riskPercentage || ""}
                onChange={(e) => handleInputChange('riskPercentage', e.target.value)}
                className="trading-input mt-1"
                placeholder="1.0"
              />
            </div>
            
            <div>
              <Label htmlFor="tradingFee" className="text-sm font-medium text-gray-300">
                Trading Fee (%)
              </Label>
              <Input
                id="tradingFee"
                type="number"
                step="0.001"
                min="0"
                value={formData.tradingFee || ""}
                onChange={(e) => handleInputChange('tradingFee', e.target.value)}
                className="trading-input mt-1"
                placeholder="0.075"
              />
            </div>
            
            <div>
              <Label htmlFor="maxTradesPerDay" className="text-sm font-medium text-gray-300">
                Max Trades per Day
              </Label>
              <Input
                id="maxTradesPerDay"
                type="number"
                min="1"
                max="50"
                value={formData.maxTradesPerDay || ""}
                onChange={(e) => handleInputChange('maxTradesPerDay', parseInt(e.target.value))}
                className="trading-input mt-1"
                placeholder="10"
              />
            </div>
          </CardContent>
        </Card>

        {/* AI & Alerts Settings */}
        <Card className="trading-bg-slate trading-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">AI & Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="discordWebhook" className="text-sm font-medium text-gray-300">
                Discord Webhook URL
              </Label>
              <div className="flex space-x-2 mt-1">
                <Input
                  id="discordWebhook"
                  type="url"
                  value={formData.discordWebhook || ""}
                  onChange={(e) => handleInputChange('discordWebhook', e.target.value)}
                  className="trading-input flex-1"
                  placeholder="https://discord.com/api/webhooks/..."
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => testDiscordWebhook.mutate()}
                  disabled={testDiscordWebhook.isPending || !formData.discordWebhook}
                >
                  <TestTube className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="aiConfidenceThreshold" className="text-sm font-medium text-gray-300">
                AI Confidence Threshold (%)
              </Label>
              <Input
                id="aiConfidenceThreshold"
                type="number"
                min="50"
                max="95"
                value={formData.aiConfidenceThreshold || ""}
                onChange={(e) => handleInputChange('aiConfidenceThreshold', parseInt(e.target.value))}
                className="trading-input mt-1"
                placeholder="70"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium text-gray-300">
                  Enable Weekend Crypto Trading
                </Label>
                <p className="text-xs text-gray-400">
                  Allow AI to trade crypto pairs during weekends
                </p>
              </div>
              <Switch
                checked={formData.weekendTradingEnabled || false}
                onCheckedChange={(checked) => handleInputChange('weekendTradingEnabled', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium text-gray-300">
                  Auto-execute AI Trades
                </Label>
                <p className="text-xs text-gray-400">
                  Automatically execute high-confidence AI signals
                </p>
              </div>
              <Switch
                checked={formData.autoExecuteAI || false}
                onCheckedChange={(checked) => handleInputChange('autoExecuteAI', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card className="trading-bg-slate trading-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Display Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium text-gray-300">
                  Theme
                </Label>
                <p className="text-xs text-gray-400">
                  Choose your preferred theme
                </p>
              </div>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
            </div>
            
            <div>
              <Label htmlFor="currency" className="text-sm font-medium text-gray-300">
                Currency Display
              </Label>
              <Select 
                value={formData.currency || "USD"} 
                onValueChange={(value) => handleInputChange('currency', value)}
              >
                <SelectTrigger className="trading-select mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="timezone" className="text-sm font-medium text-gray-300">
                Time Zone
              </Label>
              <Select 
                value={formData.timezone || "EST"} 
                onValueChange={(value) => handleInputChange('timezone', value)}
              >
                <SelectTrigger className="trading-select mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EST">Eastern Time (EST)</SelectItem>
                  <SelectItem value="GMT">Greenwich Mean Time (GMT)</SelectItem>
                  <SelectItem value="CET">Central European Time (CET)</SelectItem>
                  <SelectItem value="JST">Japan Standard Time (JST)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="trading-bg-slate trading-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full bg-gray-700 hover:bg-gray-600"
              onClick={handleExportData}
            >
              <Download className="w-4 h-4 mr-2" />
              Export All Data
            </Button>
            
            <Button
              variant="outline"
              className="w-full bg-gray-700 hover:bg-gray-600"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import Data
            </Button>
            
            <Separator />
            
            <Button
              variant="outline"
              className="w-full warning-bg-amber hover:bg-amber-600 text-amber-100"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset AI Learning
            </Button>
            
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleClearData}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Data
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Save Settings */}
      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          className="bg-gray-700 hover:bg-gray-600"
          onClick={handleReset}
          disabled={updateSettings.isPending}
        >
          Reset to Defaults
        </Button>
        <Button
          className="btn-profit"
          onClick={handleSave}
          disabled={updateSettings.isPending}
        >
          {updateSettings.isPending ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
