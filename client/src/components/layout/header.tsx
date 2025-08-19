import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  description: string;
  isConnected: boolean;
}

export function Header({ title, description, isConnected }: HeaderProps) {
  const currentTime = new Date().toLocaleString();

  return (
    <header className="bg-industrial-card border-b border-gray-700 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-black-200">{description}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div 
              className={cn(
                "w-3 h-3 rounded-full",
                isConnected ? "bg-status-normal animate-pulse" : "bg-gray-500"
              )}
            />
            <span className="text-sm">
              {isConnected ? "Live Data" : "Disconnected"}
            </span>
          </div>
          <div className="text-sm text-black-200">
            Last Update: {currentTime}
          </div>
          <Button variant="ghost" size="icon">
            <User className="h-4 w-4 text-black-200" />
          </Button>
        </div>
      </div>
    </header>
  );
}
