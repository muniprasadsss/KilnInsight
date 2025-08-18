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

  return (
    <div className="flex h-screen overflow-hidden bg-industrial-dark">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Header title={title} description={description} isConnected={isConnected} />
        {children}
      </main>
    </div>
  );
}
