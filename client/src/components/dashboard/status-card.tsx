import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatusCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  className?: string;
}

export function StatusCard({ 
  title, 
  value, 
  unit, 
  change, 
  changeType = "neutral", 
  icon, 
  className 
}: StatusCardProps) {
  const changeColors = {
    positive: "text-status-normal",
    negative: "text-status-critical",
    neutral: "text-industrial-muted"
  };

  return (
    <Card className={cn("card-enhanced", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-industrial-secondary text-sm font-medium mb-1">{title}</p>
            <p className="text-3xl font-bold text-industrial-primary">
              {value}{unit && <span className="text-lg font-medium text-industrial-secondary">{unit}</span>}
            </p>
            {change && (
              <p className={cn("text-sm mt-2 font-medium", changeColors[changeType])}>
                {change}
              </p>
            )}
          </div>
          <div className="p-3 rounded-xl bg-industrial-accent text-white shadow-lg">
            <div className="text-2xl">
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
