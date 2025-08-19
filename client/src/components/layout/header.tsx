import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Settings, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  description: string;
  isConnected: boolean;
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
}

export function Header({ title, description, isConnected, onToggleSidebar, isSidebarCollapsed }: HeaderProps) {
  const currentTime = new Date().toLocaleString();

  return (
    <header className="w-full bg-industrial-card border-b border-gray-700 p-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Sidebar Toggle Button */}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onToggleSidebar}
            className="hover:bg-gray-700"
            data-testid="button-toggle-sidebar"
          >
            {isSidebarCollapsed ? (
              <Menu className="h-5 w-5 text-gray-300" />
            ) : (
              <X className="h-5 w-5 text-gray-300" />
            )}
          </Button>
          
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <img 
              src="/logo.svg" 
              alt="Kiln Monitor Logo" 
              className="h-10 w-10"
              data-testid="img-logo"
            />
            <div>
              <h2 className="text-2xl font-bold text-white" data-testid="text-title">{title}</h2>
              <p className="text-gray-400 text-sm" data-testid="text-description">{description}</p>
            </div>
          </div>
        </div>
        
        {/* Right side controls */}
        <div className="flex items-center space-x-4">
          {/* Connection Status */}
          <div className="flex items-center space-x-2">
            <div 
              className={cn(
                "w-3 h-3 rounded-full",
                isConnected ? "bg-green-500 animate-pulse" : "bg-gray-500"
              )}
              data-testid="status-connection"
            />
            <span className="text-sm text-gray-300">
              {isConnected ? "Live Data" : "Disconnected"}
            </span>
          </div>
          
          {/* Last Update Time */}
          <div className="text-sm text-gray-400" data-testid="text-last-update">
            Last Update: {currentTime}
          </div>
          
          {/* User Profile */}
          <Button variant="ghost" size="icon" data-testid="button-user-profile">
            <User className="h-4 w-4 text-gray-300" />
          </Button>
          
          {/* Settings */}
          <Button variant="ghost" size="icon" data-testid="button-settings">
            <Settings className="h-4 w-4 text-gray-300" />
          </Button>
        </div>
      </div>
    </header>
  );
}
