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
    <Card className={cn("bg-white shadow-sm hover:shadow-lg transition-all duration-200", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">
              {value}{unit && <span className="text-lg font-medium text-gray-600">{unit}</span>}
            </p>
            {change && (
              <p className={cn("text-sm mt-2 font-medium", changeColors[changeType])}>
                {change}
              </p>
            )}
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
            <div className="text-2xl">
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
