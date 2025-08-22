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

interface SidebarProps {
  isCollapsed?: boolean;
}

export function Sidebar({ isCollapsed = false }: SidebarProps) {
  const [location] = useLocation();

  return (
    <nav
      className={`${isCollapsed ? 'w-16' : 'w-64'} flex-shrink-0 transition-all duration-300 shadow-lg border-r`}
      style={{ backgroundColor: 'rgb(8, 143, 209)' }}
      data-testid="nav-sidebar"
    >


        <div className="pt-4">
        <div className="list p-2">
           <ul className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            
            return (
              <li key={item.path}>
                <Link href={item.path}>
                  <div
                    className={cn(
                      "flex items-center p-3 rounded-lg transition-colors relative group cursor-pointer text-white",
                      isCollapsed ? "justify-center" : "space-x-3",
                      isActive
                        ? "shadow-md"
                        : "hover:text-white"
                    )}
                    style={isActive
                      ? { backgroundColor: 'rgb(29, 116, 160)' }
                      : {}
                    }
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'rgb(29, 116, 160)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = '';
                      }
                    }}
                    data-testid={`link-${item.path.replace('/', '') || 'home'}`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <>
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <Badge 
                            variant={item.badge > 10 ? "destructive" : "secondary"}
                            className="ml-auto"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                    
                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-md border shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {item.label}
                        {item.badge && (
                          <span className="ml-2 notification-badge">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
        </div>
       
      </div>
    </nav>
  );
}
