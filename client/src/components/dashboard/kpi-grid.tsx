import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPIItem {
  id: string;
  title: string;
  value: string;
  unit?: string;
  change: number;
  changeLabel: string;
  target?: string;
  status: "good" | "warning" | "critical";
}

interface KPIGridProps {
  kpis: KPIItem[];
}

export function KPIGrid({ kpis }: KPIGridProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "good": return "text-status-normal";
      case "warning": return "text-status-warning";
      case "critical": return "text-status-critical";
      default: return "text-gray-400";
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4" />;
    if (change < 0) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getChangeColor = (change: number, status: string) => {
    if (status === "critical") return "text-status-critical";
    if (change > 0) return "text-status-normal";
    if (change < 0) return "text-status-critical";
    return "text-gray-400";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {kpis.map((kpi) => (
        <Card key={kpi.id} className="bg-industrial-card border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-400">{kpi.title}</h3>
              <div className={cn("w-3 h-3 rounded-full", 
                kpi.status === "good" ? "bg-status-normal" :
                kpi.status === "warning" ? "bg-status-warning" : "bg-status-critical"
              )} />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-white">
                {kpi.value}
              </span>
              {kpi.unit && (
                <span className="text-lg text-gray-300">{kpi.unit}</span>
              )}
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className={cn("flex items-center space-x-1 text-xs", 
                getChangeColor(kpi.change, kpi.status)
              )}>
                {getChangeIcon(kpi.change)}
                <span>{kpi.changeLabel}</span>
              </div>
              {kpi.target && (
                <div className="text-xs text-gray-400">
                  Target: {kpi.target}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
