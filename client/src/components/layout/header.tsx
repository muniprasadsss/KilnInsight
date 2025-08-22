import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Settings, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "../../../../public/logo.svg";
import logo_shot from "../../../../public/logo-shot.png";
interface HeaderProps {
  title: string;
  description: string;
  isConnected: boolean;
}

export function Header({ title, description, isConnected, onToggleSidebar, isSidebarCollapsed }: HeaderProps) {
  const currentTime = new Date().toLocaleString();

  return (
    <header className="w-full border-b p-4 z-50" style={{ backgroundColor: '#fff', borderBottomColor: '#e2e8f0' }}>
      <div className="w-full flex items-center justify-between">
        {/* Left side - Logo with Title */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            {/* Logo */}
            <img src={logo} alt="KilnInsight Logo" className="h-12 w-auto" />

            <div>
              <h2 className="text-2xl font-bold text-gray-900" data-testid="text-title">{title}</h2>
              <p className="text-gray-600 text-sm" data-testid="text-description">{description}</p>
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
            <span className="text-sm text-gray-700">
              {isConnected ? "Live Data" : "Disconnected"}
            </span>
          </div>
          
          {/* Last Update Time */}
          <div className="text-sm text-gray-600" data-testid="text-last-update">
            Last Update: {currentTime}
          </div>
          
          {/* User Profile */}
          <Button variant="ghost" size="icon" data-testid="button-user-profile">
            <User className="h-4 w-4 text-gray-700" />
          </Button>
          
          {/* Settings */}
          <Button variant="ghost" size="icon" data-testid="button-settings">
            <Settings className="h-4 w-4 text-gray-700" />
          </Button>
        </div>
      </div>
    </header>
  );
}
