import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { 
  Factory, 
  AlertTriangle, 
  Search, 
  Bell, 
  Gauge, 
  BarChart3, 
  FileText, 
  Database, 
  Mail, 
  Shield,
  Activity
} from "lucide-react";

interface NavigationItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const navigationItems: NavigationItem[] = [
  { path: "/", label: "Anomaly Dashboard", icon: AlertTriangle, badge: 3 },
  { path: "/sensors", label: "Sensor Dashboard", icon: Activity },
  { path: "/root-cause", label: "Root Cause Analysis", icon: Search },
  { path: "/alerts", label: "Alerts Center", icon: Bell, badge: 12 },
  { path: "/operations", label: "Operations Dashboard", icon: Gauge },
  { path: "/analytics", label: "Advanced Analytics", icon: BarChart3 },
  { path: "/reporting", label: "User Reporting", icon: FileText },
  { path: "/data-management", label: "Data Management", icon: Database },
  { path: "/notifications", label: "Notifications", icon: Mail },
  { path: "/security", label: "Security", icon: Shield },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <nav className="w-64 bg-industrial-card border-r border-gray-700 flex-shrink-0">
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-8">
          <Factory className="text-industrial-accent text-2xl" />
          <h1 className="text-xl font-bold">Kiln Monitor</h1>
        </div>
        
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            
            return (
              <li key={item.path}>
                <Link href={item.path}>
                  <a
                    className={cn(
                      "flex items-center space-x-3 p-3 rounded-lg transition-colors",
                      isActive
                        ? "bg-industrial-accent text-white"
                        : "text-gray-300 hover:text-white hover:bg-gray-700"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <Badge 
                        variant={item.badge > 10 ? "destructive" : "secondary"}
                        className="ml-auto"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
