import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Expand, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
 import failure from "../../../../public/kiln_failure_modes.png"
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

   const markers = [
    { id: 1, x: 34, y: 25, label: "Point A", value:35, color: "bg-red-500" },
    { id: 2, x: 67, y: 68, label: "Point B", value:39, color: "bg-blue-500" },
    { id: 3, x: 13, y: 58, label: "Point B", value:50, color: "bg-yellow-500" },
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
        <div className="relative w-[500px] h-[400px]">
      {/* Background Image */}
      <img
        src={failure}
        alt="diagram"
        className="w-full h-full object-contain"
      />

      {/* Dynamic markers */}
      {markers.map((m) => (
        <div key={m.id} className={`absolute ${m.color} absolute  top-[-5px]  text-s rounded px-1 flex item-center flex-col  animate-flicker `} style={{ left: `${m.x}%`, top: `${m.y}%`, }}>
          <div className="lable" >{m.label}</div>
          <div className="value">{m.value}</div> 
        </div>
      ))}
    </div>
      </CardContent>
    </Card>
  );
}
