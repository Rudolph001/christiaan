import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  TrendingUp, 
  BookOpen, 
  Wallet, 
  BarChart3, 
  Settings,
  Moon,
  Sun
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import SessionControl from "@/components/trading/session-control";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Live Chart", href: "/chart", icon: TrendingUp },
  { name: "Trade Journal", href: "/journal", icon: BookOpen },
  { name: "Wallet", href: "/wallet", icon: Wallet },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  return (
    <div className="w-64 trading-bg-slate shadow-lg flex flex-col">
      {/* Logo & Brand */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold trading-text-blue">AI Trading Assistant</h1>
        <p className="text-sm text-gray-400 mt-1">Advanced Trading Platform</p>
      </div>

      {/* Trading Session Control */}
      <div className="p-4 border-b border-gray-700">
        <SessionControl />
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <a className={`nav-link ${isActive ? 'active' : ''}`}>
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Theme Toggle */}
      <div className="p-4 border-t border-gray-700">
        <Button
          variant="ghost"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
        >
          {theme === "dark" ? (
            <>
              <Sun className="w-4 h-4" />
              <span className="text-sm">Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4" />
              <span className="text-sm">Dark Mode</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
