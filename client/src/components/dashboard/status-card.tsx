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
    neutral: "text-black-200"
  };

  return (
    <Card className={cn("bg-industrial-card border-gray-700", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-black-200 text-sm">{title}</p>
            <p className="text-2xl font-bold text-white">
              {value}{unit && <span className="text-lg">{unit}</span>}
            </p>
            {change && (
              <p className={cn("text-xs mt-1", changeColors[changeType])}>
                {change}
              </p>
            )}
          </div>
          <div className="text-3xl">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
