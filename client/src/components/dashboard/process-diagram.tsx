import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Expand } from "lucide-react";
import { cn } from "@/lib/utils";

interface FailureLocation {
  id: string;
  name: string;
  severity: "critical" | "warning" | "normal";
  x: number;
  y: number;
  description: string;
}

interface ProcessDiagramProps {
  failures?: FailureLocation[];
}

export function ProcessDiagram({ failures = [] }: ProcessDiagramProps) {
  const defaultFailures: FailureLocation[] = [
    {
      id: "1",
      name: "Cyclone Blockage",
      severity: "critical",
      x: 8,
      y: 4,
      description: "Pressure: ↑ 15%"
    },
    {
      id: "2", 
      name: "Burner Trip",
      severity: "critical",
      x: 44,
      y: 2,
      description: "Fuel Flow: ↓ 85%"
    },
    {
      id: "3",
      name: "ESP Overheat", 
      severity: "warning",
      x: 80,
      y: 4,
      description: "Temp: 285°C"
    }
  ];

  const activeFailures = failures.length > 0 ? failures : defaultFailures;

  const severityColors = {
    critical: "bg-status-critical",
    warning: "bg-status-warning",
    normal: "bg-status-normal"
  };

  return (
    <Card className="bg-white border-gray-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Process Flow & Failure Locations
          </CardTitle>
          <Button variant="outline" size="sm" className="bg-blue-500 text-white hover:bg-blue-600 border-blue-500">
            <Expand className="w-4 h-4 mr-2" />
            Full View
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative h-64 bg-gray-800 rounded-lg overflow-hidden">
          {/* Preheater section */}
          <div className="absolute left-4 top-8 w-16 h-12 bg-yellow-600 rounded border-2 border-yellow-400 flex items-center justify-center">
            <span className="text-xs font-bold">Preheater</span>
          </div>
          
          {/* Flow arrow 1 */}
          <div className="absolute left-20 top-12 w-8 h-1 bg-gray-400"></div>
          <div className="absolute left-26 top-10 w-0 h-0 border-l-4 border-l-gray-400 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
          
          {/* Rotary Kiln section */}
          <div className="absolute left-32 top-6 w-32 h-16 bg-orange-600 rounded border-2 border-orange-400 flex items-center justify-center">
            <span className="text-xs font-bold">Rotary Kiln</span>
          </div>
          
          {/* Flow arrow 2 */}
          <div className="absolute left-64 top-12 w-8 h-1 bg-gray-400"></div>
          <div className="absolute left-70 top-10 w-0 h-0 border-l-4 border-l-gray-400 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
          
          {/* Cooler section */}
          <div className="absolute left-76 top-8 w-16 h-12 bg-purple-600 rounded border-2 border-purple-400 flex items-center justify-center">
            <span className="text-xs font-bold">Cooler</span>
          </div>
          
          {/* Active anomaly indicators */}
          {activeFailures.map((failure) => (
            <div key={failure.id}>
              <div 
                className={cn(
                  "absolute w-3 h-3 rounded-full animate-pulse",
                  severityColors[failure.severity]
                )}
                style={{ left: `${failure.x}px`, top: `${failure.y}px` }}
                title={failure.name}
              />
            </div>
          ))}
          
          {/* Failure mode labels */}
          {activeFailures.map((failure, index) => (
            <div 
              key={`label-${failure.id}`}
              className="absolute text-xs bg-black bg-opacity-75 p-2 rounded"
              style={{ 
                left: `${4 + index * 32}px`, 
                top: "112px" 
              }}
            >
              <div className={cn(
                severityColors[failure.severity].replace('bg-', 'text-')
              )}>
                • {failure.name}
              </div>
              <div className="text-black-200">{failure.description}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
