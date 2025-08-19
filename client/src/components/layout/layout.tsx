import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useWebSocket } from "@/hooks/use-websocket";

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export function Layout({ children, title, description }: LayoutProps) {
  const { isConnected } = useWebSocket();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title={title} 
          description={description} 
          isConnected={isConnected}
          onToggleSidebar={handleToggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
        />
        <Sidebar isCollapsed={isSidebarCollapsed} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
