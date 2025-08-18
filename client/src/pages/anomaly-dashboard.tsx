import { useQuery } from "@tanstack/react-query";
import { useWebSocket } from "@/hooks/use-websocket";
import { useEffect, useState } from "react";
import { StatusCard } from "@/components/dashboard/status-card";
import { ProcessDiagram } from "@/components/dashboard/process-diagram";
import { AnomalyList } from "@/components/dashboard/anomaly-list";
import { SensorReading } from "@/components/dashboard/sensor-reading";
import { MetricsChart } from "@/components/charts/metrics-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Factory, Flame, Thermometer, Eye, Check, StopCircle, Plus, Settings } from "lucide-react";
import { Anomaly, SensorReading as SensorReadingType } from "@shared/schema";

export default function AnomalyDashboard() {
  const { lastMessage } = useWebSocket();
  const [realtimeSensors, setRealtimeSensors] = useState<SensorReadingType[]>([]);

  // Fetch active anomalies
  const { data: anomalies = [] } = useQuery<Anomaly[]>({
    queryKey: ['/api/anomalies/active'],
  });

  // Fetch latest sensor readings
  const { data: sensorReadings = [] } = useQuery<SensorReadingType[]>({
    queryKey: ['/api/sensor-readings/latest'],
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  // Handle real-time updates
  useEffect(() => {
    if (lastMessage?.type === 'sensor_reading') {
      setRealtimeSensors(prev => {
        const updated = [...prev];
        const existingIndex = updated.findIndex(s => s.sensorId === lastMessage.data.sensorId);
        
        if (existingIndex >= 0) {
          updated[existingIndex] = lastMessage.data;
        } else {
          updated.push(lastMessage.data);
        }
        
        return updated.slice(-6); // Keep only latest 6 sensors
      });
    }
  }, [lastMessage]);

  const latestSensors = realtimeSensors.length > 0 ? realtimeSensors : sensorReadings;

  // Calculate system status based on anomalies
  const criticalAnomalies = anomalies.filter(a => a.severity === 'critical').length;
  const warningAnomalies = anomalies.filter(a => a.severity === 'warning').length;
  
  const systemStatus = criticalAnomalies > 0 ? 'CRITICAL' : 
                     warningAnomalies > 0 ? 'WARNING' : 'NORMAL';

  const systemStatusColor = systemStatus === 'CRITICAL' ? 'text-status-critical' :
                           systemStatus === 'WARNING' ? 'text-status-warning' : 'text-status-normal';

  // Mock events for the table
  const recentEvents = [
    {
      id: "1",
      timestamp: "14:21:15",
      type: "Burner Trip",
      severity: "Critical",
      location: "Rotary Kiln",
      duration: "36 min",
      status: "Active"
    },
    {
      id: "2", 
      timestamp: "14:16:23",
      type: "Cyclone Blockage",
      severity: "Critical",
      location: "Preheater",
      duration: "25 min",
      status: "Active"
    },
    {
      id: "3",
      timestamp: "14:09:45",
      type: "ESP Overheat",
      severity: "Warning",
      location: "Cooler",
      duration: "28 min",
      status: "Active"
    },
    {
      id: "4",
      timestamp: "13:45:12",
      type: "Sensor Drift O2",
      severity: "Warning",
      location: "Gas Analysis",
      duration: "686 min",
      status: "Resolved"
    }
  ];

  const handleAnalyzeAnomaly = (anomaly: Anomaly) => {
    // Navigate to root cause analysis with this anomaly
    console.log('Analyzing anomaly:', anomaly);
  };

  const getSensorProgress = (sensor: SensorReadingType) => {
    // Define ranges for each sensor type
    const ranges: Record<string, { min: number; max: number }> = {
      "temp_preheater_1": { min: 400, max: 600 },
      "speed_kiln_1": { min: 1.5, max: 2.5 },
      "o2_percent_1": { min: 0, max: 8 },
      "nox_ppm_1": { min: 0, max: 500 },
      "fuel_flow_1": { min: 5000, max: 8000 },
      "feed_rate_1": { min: 80, max: 150 },
    };

    const range = ranges[sensor.sensorId] || { min: 0, max: 100 };
    return range;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatusCard
          title="System Status"
          value={systemStatus}
          change={`${anomalies.length} Active Anomalies`}
          changeType="negative"
          icon={<AlertTriangle className={systemStatusColor} />}
          className={systemStatus === 'CRITICAL' ? 'border-l-4 border-status-critical' : ''}
        />
        
        <StatusCard
          title="Production Rate"
          value={108.3}
          unit=" TPH"
          change="↑ 2.3% vs target"
          changeType="positive"
          icon={<Factory className="text-industrial-accent" />}
        />
        
        <StatusCard
          title="Energy Efficiency"
          value={701.8}
          unit=" kcal/kg"
          change="↑ 1.2% vs baseline"
          changeType="negative"
          icon={<Flame className="text-status-warning" />}
        />
        
        <StatusCard
          title="Kiln Zones Temp"
          value={1347}
          unit="°C"
          change="Within range"
          changeType="positive"
          icon={<Thermometer className="text-status-normal" />}
        />
      </div>

      {/* Process Diagram and Anomalies */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ProcessDiagram />
        <AnomalyList anomalies={anomalies} onAnalyze={handleAnalyzeAnomaly} />
      </div>

      {/* Charts and Metrics */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <MetricsChart />
        
        {/* Live Sensor Readings */}
        <Card className="bg-industrial-card border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Live Sensor Readings</CardTitle>
              <Button variant="outline" size="sm" className="bg-gray-700">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {latestSensors.map((sensor) => {
                const range = getSensorProgress(sensor);
                return (
                  <SensorReading
                    key={sensor.id}
                    name={sensor.sensorName}
                    value={sensor.value}
                    unit={sensor.unit}
                    min={range.min}
                    max={range.max}
                    quality={sensor.quality as "good" | "warning" | "bad"}
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Events Table */}
      <Card className="bg-industrial-card border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Recent Events & Alerts</CardTitle>
            <div className="flex space-x-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-40 bg-gray-700 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="critical">Critical Only</SelectItem>
                  <SelectItem value="warnings">Warnings</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="bg-industrial-accent">
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Timestamp</TableHead>
                <TableHead className="text-gray-300">Event Type</TableHead>
                <TableHead className="text-gray-300">Severity</TableHead>
                <TableHead className="text-gray-300">Location</TableHead>
                <TableHead className="text-gray-300">Duration</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentEvents.map((event) => (
                <TableRow key={event.id} className="border-gray-800 hover:bg-gray-800">
                  <TableCell className="text-white">{event.timestamp}</TableCell>
                  <TableCell className="text-white">{event.type}</TableCell>
                  <TableCell>
                    <Badge variant={
                      event.severity === 'Critical' ? 'destructive' : 
                      event.severity === 'Warning' ? 'secondary' : 'default'
                    }>
                      {event.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white">{event.location}</TableCell>
                  <TableCell className="text-white">{event.duration}</TableCell>
                  <TableCell>
                    <Badge variant={
                      event.status === 'Active' ? 'secondary' : 'outline'
                    }>
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" className="text-industrial-accent">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-green-400">
                        <Check className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-3">
        <Button
          size="icon"
          className="w-12 h-12 bg-status-critical hover:bg-red-600 rounded-full shadow-lg"
          title="Emergency Stop"
        >
          <StopCircle className="w-6 h-6" />
        </Button>
        <Button
          size="icon"
          className="w-12 h-12 bg-industrial-accent hover:bg-cyan-600 rounded-full shadow-lg"
          title="Quick Report"
        >
          <Plus className="w-6 h-6" />
        </Button>
        <Button
          size="icon"
          className="w-12 h-12 bg-gray-600 hover:bg-gray-500 rounded-full shadow-lg"
          title="Settings"
        >
          <Settings className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
