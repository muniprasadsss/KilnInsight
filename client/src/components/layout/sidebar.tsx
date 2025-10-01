import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Activity,
  Menu,
  Home,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import React from "react";

interface NavigationItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const navigationItems: NavigationItem[] = [
  { path: "/dashboard", label: "Dashboard", icon: Home },
  { path: "/anomaly", label: "Anomaly Detection", icon: AlertTriangle },
  { path: "/optimization", label: "Optimization", icon: SlidersHorizontal },
  { path: "/reporting", label: "User Reporting", icon: FileText },
  { path: "/data-management", label: "Data Management", icon: Database },
  { path: "/notifications", label: "Notifications", icon: Mail },
  { path: "/security", label: "Security", icon: Shield },
];

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export function Sidebar({ isCollapsed = false, onToggleSidebar }: SidebarProps) {
  const [location] = useLocation();
  const [dashboardOpen, setDashboardOpen] = React.useState(false);

  return (
    <nav
      className={`${isCollapsed ? 'w-16' : 'w-64'} flex-shrink-0 transition-all duration-300 shadow-lg border-r`}
      style={{ backgroundColor: 'rgb(8, 143, 209)' }}
      data-testid="nav-sidebar"
    >
      {/* Toggle button at the top */}
      <div className={`p-3 border-b border-white/20 ${isCollapsed ? 'flex justify-center' : 'flex justify-start'} flex items-center justify-center`}>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="text-white hover:bg-white/20 hover:text-white"
          data-testid="button-toggle-sidebar"
        >
          <Menu className="h-8 w-8" />
        </Button>
      </div>

      <div className="pt-4">
        <div className="list p-2">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = location === item.path;
              const Icon = item.icon;

              // Special handling for Dashboard with submenus
              if (item.path === "/dashboard") {
                return (
                  <li key={item.path}>
                    <div
                      className={cn(
                        "flex items-center p-3 rounded-lg transition-colors relative group cursor-pointer text-white justify-between",
                        isActive ? "shadow-md" : "hover:text-white"
                      )}
                      style={isActive
                        ? { backgroundColor: 'rgba(26, 79, 104, 1)', color: '#fff !important' }
                        : {}
                      }
                    >
                      <div
                        className="flex items-center space-x-3"
                        onClick={() => {
                          window.location.href = item.path; // navigate to /dashboard
                        }}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        {!isCollapsed && <span className="truncate">{item.label}</span>}
                      </div>

                      {!isCollapsed && (
                        <button
                          className="ml-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDashboardOpen(!dashboardOpen);
                          }}
                        >
                          {dashboardOpen ? <ChevronUp /> : <ChevronDown />}
                        </button>
                      )}
                    </div>

                    {/* Submenus */}
                    {dashboardOpen && !isCollapsed && (
                      <ul className="ml-8 mt-1 space-y-1">
                        <li
                          className="p-2 text-sm text-white rounded hover:bg-white/20 cursor-pointer"
                          onClick={() => window.open("https://powergen.visionaizesignalminer.com/dashboard/pulveriser-mills", "_blank")}
                        >
                          Pulveriser Mill
                        </li>
                        <li
                          className="p-2 text-sm text-white rounded hover:bg-white/20 cursor-pointer"
                          onClick={() => window.open("https://powergen.visionaizesignalminer.com/dashboard/fan", "_blank")}
                        >
                          Fan
                        </li>
                      </ul>
                    )}
                  </li>
                );
              }

              // Regular menu items
              return (
                <li key={item.path}>
                  <Link href={item.path}>
                    <div
                      className={cn(
                        "flex items-center p-3 rounded-lg transition-colors relative group cursor-pointer text-white",
                        isCollapsed ? "justify-center" : "space-x-3",
                        isActive ? "shadow-md" : "hover:text-white"
                      )}
                      style={isActive ? { backgroundColor: 'rgba(26, 79, 104, 1)' } : {}}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
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
