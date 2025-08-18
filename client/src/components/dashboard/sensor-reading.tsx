import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface SensorReadingProps {
  name: string;
  value: number;
  unit: string;
  min?: number;
  max?: number;
  quality?: "good" | "warning" | "bad";
}

export function SensorReading({ 
  name, 
  value, 
  unit, 
  min = 0, 
  max = 100, 
  quality = "good" 
}: SensorReadingProps) {
  const percentage = ((value - min) / (max - min)) * 100;
  
  const qualityColors = {
    good: "bg-status-normal",
    warning: "bg-status-warning", 
    bad: "bg-status-critical"
  };

  return (
    <div className="p-3 bg-gray-800 rounded-lg">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-gray-300">{name}</span>
        <span className="text-sm font-mono text-white">
          {value}{unit}
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div 
          className={cn("h-2 rounded-full", qualityColors[quality])}
          style={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }}
        />
      </div>
    </div>
  );
}
