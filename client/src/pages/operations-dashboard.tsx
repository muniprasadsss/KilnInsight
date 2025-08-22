import { useQuery } from "@tanstack/react-query";
import { useWebSocket } from "@/hooks/use-websocket";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KPIGrid } from "@/components/dashboard/kpi-grid";
import { MetricsChart } from "@/components/charts/metrics-chart";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Power, Pause, Play, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { EquipmentStatus, SensorReading, ProductionData } from "@shared/schema";

interface EquipmentItem extends EquipmentStatus {
  commands?: string[];
}

export default function OperationsDashboard() {
  const { lastMessage } = useWebSocket();
  const [realtimeData, setRealtimeData] = useState<any>({});

  const { data: equipmentStatus = [] } = useQuery<EquipmentStatus[]>({
    queryKey: ['/api/equipment-status'],
  });

  const { data: sensorReadings = [] } = useQuery<SensorReading[]>({
    queryKey: ['/api/sensor-readings/latest'],
  });

  const { data: productionData = [] } = useQuery<ProductionData[]>({
    queryKey: ['/api/production-data'],
  });

  // Handle real-time updates
  useEffect(() => {
    if (lastMessage?.type === 'sensor_reading') {
      setRealtimeData((prev: any) => ({
        ...prev,
        [lastMessage.data.sensorId]: lastMessage.data
      }));
    }
  }, [lastMessage]);

  // Mock KPI data - in real app would come from API
  const kpis = [
    {
      id: "production-rate",
      title: "Production Rate", 
      value: "108.3",
      unit: "TPH",
      change: 2.3,
      changeLabel: "+2.3% vs target",
      target: "106 TPH",
      status: "good" as const
    },
    {
      id: "energy-efficiency",
      title: "Energy Efficiency",
      value: "701.8", 
      unit: "kcal/kg",
      change: 1.2,
      changeLabel: "+1.2% vs baseline",
      target: "695 kcal/kg",
      status: "warning" as const
    },
    {
      id: "availability",
      title: "Equipment Availability",
      value: "94.7",
      unit: "%",
      change: -0.8,
      changeLabel: "-0.8% from yesterday", 
      target: "95%",
      status: "warning" as const
    },
    {
      id: "quality-index",
      title: "Quality Index",
      value: "8.9",
      unit: "/10",
      change: 0.5,
      changeLabel: "+0.5 improvement",
      target: "9.0",
      status: "good" as const
    },
    {
      id: "fuel-consumption",
      title: "Fuel Consumption",
      value: "6,956",
      unit: "kg/h", 
      change: -2.1,
      changeLabel: "-2.1% optimization",
      target: "7,100 kg/h",
      status: "good" as const
    },
    {
      id: "emissions",
      title: "NOx Emissions",
      value: "332",
      unit: "ppm",
      change: 8.3,
      changeLabel: "+8.3% above target",
      target: "300 ppm",
      status: "critical" as const
    }
  ];

  // Mock equipment data
  const equipmentData: EquipmentItem[] = [
    {
      id: "1",
      equipmentId: "PRH-01",
      equipmentName: "Preheater System",
      location: "preheater",
      status: "running",
      efficiency: 94.2,
      lastMaintenance: new Date('2024-01-15'),
      nextMaintenance: new Date('2024-03-15'),
      timestamp: new Date(),
      commands: ["Stop", "Restart", "Maintenance Mode"]
    },
    {
      id: "2", 
      equipmentId: "KLN-01",
      equipmentName: "Rotary Kiln",
      location: "rotary_kiln", 
      status: "running",
      efficiency: 96.8,
      lastMaintenance: new Date('2024-01-20'),
      nextMaintenance: new Date('2024-02-20'),
      timestamp: new Date(),
      commands: ["Emergency Stop", "Speed Control", "Maintenance Mode"]
    },
    {
      id: "3",
      equipmentId: "CLR-01", 
      equipmentName: "Cooler System",
      location: "cooler",
      status: "maintenance",
      efficiency: 0,
      lastMaintenance: new Date(),
      nextMaintenance: new Date('2024-02-28'),
      timestamp: new Date(),
      commands: ["Start", "Test Mode"]
    },
    {
      id: "4",
      equipmentId: "ESP-01",
      equipmentName: "ESP Unit",
      location: "cooler", 
      status: "fault",
      efficiency: 45.2,
      lastMaintenance: new Date('2024-01-10'),
      nextMaintenance: new Date('2024-02-10'),
      timestamp: new Date(),
      commands: ["Reset", "Maintenance Mode", "Bypass"]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running": return <CheckCircle className="w-5 h-5 text-status-normal" />;
      case "fault": return <AlertTriangle className="w-5 h-5 text-status-critical" />;
      case "maintenance": return <Clock className="w-5 h-5 text-status-warning" />;
      case "stopped": return <Pause className="w-5 h-5 text-black-200" />;
      default: return <AlertTriangle className="w-5 h-5 text-black-200" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "text-status-normal";
      case "fault": return "text-status-critical";
      case "maintenance": return "text-status-warning";
      case "stopped": return "text-black-200";
      default: return "text-black-200";
    }
  };

  return (
    <div className="p-6 space-y-6 bg-white min-h-full">
      {/* KPI Grid */}
      <KPIGrid kpis={kpis} />

      {/* Main Content Tabs */}
      <Tabs defaultValue="equipment" className="space-y-6">
        <TabsList className="bg-gray-100 border border-gray-200">
          <TabsTrigger value="equipment">Equipment Status</TabsTrigger>
          <TabsTrigger value="production">Production Flow</TabsTrigger>
          <TabsTrigger value="controls">Process Controls</TabsTrigger>
          <TabsTrigger value="trends">Performance Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="equipment">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {equipmentData.map((equipment) => (
              <Card key={equipment.id} className="bg-industrial-card border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(equipment.status)}
                      <div>
                        <CardTitle className="text-lg">{equipment.equipmentName}</CardTitle>
                        <p className="text-sm text-black-200">{equipment.equipmentId}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={
                        equipment.status === 'running' ? 'default' :
                        equipment.status === 'fault' ? 'destructive' :
                        equipment.status === 'maintenance' ? 'secondary' : 'outline'
                      }
                    >
                      {equipment.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {equipment.status === 'running' && (
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Efficiency</span>
                          <span className="font-mono">{equipment.efficiency}%</span>
                        </div>
                        <Progress 
                          value={equipment.efficiency || 0} 
                          className="h-2"
                        />
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-black-200">Last Maintenance</span>
                        <div className="font-mono">
                          {equipment.lastMaintenance?.toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-black-200">Next Maintenance</span>
                        <div className="font-mono">
                          {equipment.nextMaintenance?.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {equipment.commands?.map((command, index) => (
                        <Button
                          key={index}
                          variant="default"
                          size="sm"
                          className="text-xs bg-industrial-accent"
                          disabled={equipment.status === 'maintenance'}
                        >
                          {command}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="production">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card className="bg-industrial-card border-gray-700">
              <CardHeader>
                <CardTitle>Production Flow Monitor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-4 h-4 bg-status-normal rounded-full animate-pulse"></div>
                      <div>
                        <div className="font-medium">Raw Material Feed</div>
                        <div className="text-sm text-black-200">Conveyor Belt 1</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-lg">117.8 tph</div>
                      <div className="text-sm text-status-normal">Normal</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-4 h-4 bg-status-warning rounded-full animate-pulse"></div>
                      <div>
                        <div className="font-medium">Kiln Feed</div>
                        <div className="text-sm text-black-200">Pre-homogenization</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-lg">115.2 tph</div>
                      <div className="text-sm text-status-warning">Slight Drop</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-4 h-4 bg-status-normal rounded-full animate-pulse"></div>
                      <div>
                        <div className="font-medium">Cement Production</div>
                        <div className="text-sm text-black-200">Final Output</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-lg">108.3 tph</div>
                      <div className="text-sm text-status-normal">On Target</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-industrial-card border-gray-700">
              <CardHeader>
                <CardTitle>Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Fineness (Blaine)</span>
                      <span className="font-mono">342 m²/kg</span>
                    </div>
                    <Progress value={85} className="h-2" />
                    <div className="text-xs text-black-200 mt-1">Target: 350 m²/kg</div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Compressive Strength</span>
                      <span className="font-mono">52.3 MPa</span>
                    </div>
                    <Progress value={92} className="h-2" />
                    <div className="text-xs text-black-200 mt-1">Target: 50 MPa</div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Chemical Composition</span>
                      <span className="font-mono">98.2%</span>
                    </div>
                    <Progress value={98} className="h-2" />
                    <div className="text-xs text-black-200 mt-1">LSF: 0.94, SM: 2.1</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="controls">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-industrial-card border-gray-700">
              <CardHeader>
                <CardTitle>Kiln Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium">Kiln Speed</label>
                    <div className="flex items-center space-x-4 mt-2">
                      <Button variant="default" size="sm">-</Button>
                      <div className="flex-1 bg-industrial-accent">
                        <Progress value={67} className="h-3" />
                      </div>
                      <Button variant="default" size="sm">+</Button>
                      <span className="font-mono bg-industrial-accent text-sm">2.01 rpm</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Fuel Flow Rate</label>
                    <div className="flex items-center space-x-4 mt-2">
                      <Button variant="default" size="sm">-</Button>
                      <div className="flex-1 bg-industrial-accent">
                        <Progress value={78} className="h-3" />
                      </div>
                      <Button variant="default" size="sm">+</Button>
                      <span className="font-mono bg-industrial-accent text-sm">6,956 kg/h</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Primary Air Flow</label>
                    <div className="flex items-center space-x-4 mt-2">
                      <Button variant="default" size="sm">-</Button>
                      <div className="flex-1 bg-industrial-accent">
                        <Progress value={82} className="h-3" />
                      </div>
                      <Button variant="default" size="sm">+</Button>
                      <span className="font-mono bg-industrial-accent text-sm">24,500 m³/h</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-industrial-card border-gray-700">
              <CardHeader>
                <CardTitle>Emergency Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    variant="destructive" 
                    size="lg" 
                    className="w-full h-16 text-lg font-bold bg-industrial-accent"
                  >
                    <Power className="w-6 h-6 mr-2" />
                    EMERGENCY STOP
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="default" className=" h-12 bg-industrial-accent">
                      <Pause className="w-4 h-4 mr-2" />
                      Pause Production
                    </Button>
                    <Button variant="default" className=" h-12 bg-industrial-accent">
                      <Play className="w-4 h-4 mr-2" />
                      Resume Production
                    </Button>
                  </div>
                  
                  <Button variant="default" className="w-full  h-12 bg-industrial-accent">
                    <Settings className="w-4 h-4 mr-2" />
                    Maintenance Mode
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <div className="space-y-6">
            <MetricsChart title="Production & Efficiency Trends" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-industrial-card border-gray-700">
                <CardHeader>
                  <CardTitle>Energy Consumption Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-black-200">
                    Energy consumption chart would be displayed here
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-industrial-card border-gray-700">
                <CardHeader>
                  <CardTitle>Quality Index Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-black-200">
                    Quality metrics trend chart would be displayed here
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
