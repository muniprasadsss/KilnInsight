import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "../../../public/logo.svg";
import logo_shot from "../../../../public/logo-shot.png";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
interface HeaderProps {
  title: string;
  description: string;
  isConnected: boolean;
}

export function Header({ title, description, isConnected }: HeaderProps) {
  const currentTime = new Date().toLocaleString();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userData");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/"; // redirect to login
  };

  return (
    <header className="w-full border-b p-3 z-50" style={{ backgroundColor: '#fff', borderBottomColor: '#e2e8f0' }}>
      <div className="w-full flex items-center justify-between">
        {/* Left side - Logo with Title */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            {/* Logo */}
            <img src={logo} alt="KilnInsight Logo" className="h-8 w-auto" />
            <div className="h-8 bg-gray-500 mx-0" style={{ width: '1px' }} />
            <div>
              <h2 className="text-2xl font-bold text-[rgb(8,143,209)]" style={{ fontSize: '24px', fontWeight: '500', color: '#088fd1' }} data-testid="text-title">{title}</h2>
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
                true ? "bg-green-500 animate-pulse" : "bg-gray-500"
              )}
              data-testid="status-connection"
            />
            <span className="text-sm text-gray-700">
              {true ? "Live Data" : "Disconnected"}
            </span>
          </div>

          {/* Last Update Time */}
          <div className="text-sm text-gray-600" data-testid="text-last-update">
            Last Update: {currentTime}
          </div>

          {/* User Profile */}
          {/* <Button variant="ghost" size="icon" data-testid="button-user-profile">
            <User className="h-4 w-4 text-gray-700" />
          </Button> */}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" data-testid="button-user-profile">
                <User className="h-4 w-4 text-gray-700" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white w-35">
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2 p-2 border-0 cursor-pointer hover:bg-[#f1f5f9]  focus:outline-none focus:ring-0"
                onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>


          {/* Settings */}
          <Button variant="ghost" size="icon" data-testid="button-settings">
            <Settings className="h-4 w-4 text-gray-700" />
          </Button>
        </div>
      </div>
    </header>
  );
}
