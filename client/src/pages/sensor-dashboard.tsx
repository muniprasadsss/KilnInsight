import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { MetricsChart } from "@/components/charts/metrics-chart";
import { HeatmapChart } from "@/components/charts/heatmap-chart";
import { 
  ThermometerIcon, 
  Gauge, 
  Wind, 
  Flame, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3
} from "lucide-react";

interface SensorReading {
  id: string;
  sensorId: string;
  sensorName: string;
  value: number;
  unit: string;
  location: string;
  quality: string | null;
  timestamp: Date;
}

export default function SensorDashboard() {
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("1h");
  
  const { data: sensorReadings = [], isLoading } = useQuery<SensorReading[]>({
    queryKey: ["/api/sensor-readings/latest"],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Group sensors by location and type
  const sensorGroups = {
    temperature: sensorReadings.filter(s => s.unit === '°C'),
    pressure: sensorReadings.filter(s => s.unit === 'mbar'),
    flow: sensorReadings.filter(s => s.unit.includes('kg/h') || s.unit.includes('tph') || s.unit.includes('m³/h')),
    speed: sensorReadings.filter(s => s.unit === 'rpm'),
    emissions: sensorReadings.filter(s => s.unit === 'ppm' || s.unit === '%'),
    energy: sensorReadings.filter(s => s.unit.includes('kcal') || s.unit.includes('kW')),
    torque: sensorReadings.filter(s => s.unit === 'kNm'),
    percentage: sensorReadings.filter(s => s.unit === '%' && !s.sensorName.toLowerCase().includes('o2'))
  };

  const locationGroups = {
    preheater: sensorReadings.filter(s => s.location === 'preheater'),
    rotary_kiln: sensorReadings.filter(s => s.location === 'rotary_kiln'),
    cooler: sensorReadings.filter(s => s.location === 'cooler')
  };

  const getStatusColor = (quality: string | null) => {
    switch (quality) {
      case 'good': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'bad': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (quality: string | null) => {
    switch (quality) {
      case 'good': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'bad': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSensorIcon = (sensorName: string) => {
    const name = sensorName.toLowerCase();
    if (name.includes('temp')) return <ThermometerIcon className="w-4 h-4" />;
    if (name.includes('speed') || name.includes('rpm')) return <Gauge className="w-4 h-4" />;
    if (name.includes('flow') || name.includes('fan')) return <Wind className="w-4 h-4" />;
    if (name.includes('fuel') || name.includes('burner')) return <Flame className="w-4 h-4" />;
    if (name.includes('pressure')) return <Activity className="w-4 h-4" />;
    return <BarChart3 className="w-4 h-4" />;
  };

  const formatValue = (value: number, unit: string) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k ${unit}`;
    }
    return `${value.toFixed(2)} ${unit}`;
  };

  const filteredSensors = selectedLocation === "all" 
    ? sensorReadings 
    : sensorReadings.filter(s => s.location === selectedLocation);

  // Prepare heatmap data for temperature visualization
  const temperatureHeatmapData = sensorGroups.temperature.map(sensor => ({
    x: sensor.location,
    y: sensor.sensorName,
    value: sensor.value,
    label: `${sensor.value.toFixed(1)}${sensor.unit}`
  }));

  const chartData = sensorGroups.temperature.slice(0, 6).map((sensor, index) => ({
    timestamp: new Date(sensor.timestamp).toLocaleTimeString(),
    productionRate: sensorGroups.flow.find(s => s.sensorName.includes('Production'))?.value || 0,
    energyEfficiency: sensor.value / 2 // Simplified energy efficiency calculation
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-black-200">Loading sensor data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-white min-h-full">
      <div className="flex items-center justify-end">
       
        <div className="flex space-x-4">
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="preheater">Preheater</SelectItem>
              <SelectItem value="rotary_kiln">Rotary Kiln</SelectItem>
              <SelectItem value="cooler">Cooler</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">1 Hour</SelectItem>
              <SelectItem value="4h">4 Hours</SelectItem>
              <SelectItem value="24h">24 Hours</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sensors</p>
                <p className="text-2xl font-bold text-gray-900">{sensorReadings.length}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Locations</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Good Quality</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sensorReadings.filter(s => s.quality === 'good').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Warnings</p>
                <p className="text-2xl font-bold text-yellow-500">
                  {sensorReadings.filter(s => s.quality === 'warning').length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="by-type" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100">
          <TabsTrigger value="by-type">By Sensor Type</TabsTrigger>
          <TabsTrigger value="by-location">By Location</TabsTrigger>
          <TabsTrigger value="charts">Visual Analytics</TabsTrigger>
          <TabsTrigger value="details">Detailed View</TabsTrigger>
        </TabsList>

        <TabsContent value="by-type" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Temperature Sensors */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-900">
                  <ThermometerIcon className="w-5 h-5 text-red-400" />
                  <span>Temperature Sensors ({sensorGroups.temperature.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {sensorGroups.temperature.map((sensor) => (
                    <div key={sensor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(sensor.quality)}
                        <div>
                          <p className="font-medium text-black text-sm">{sensor.sensorName}</p>
                          <p className="text-xs text-black-200">{sensor.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-black text-lg">{formatValue(sensor.value, sensor.unit)}</p>
                        <Badge variant={sensor.quality === 'good' ? 'default' : 'destructive'} className="text-xs">
                          {sensor.quality || 'unknown'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Flow Sensors */}
            <Card className="bg-industrial-card border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-black">
                  <Wind className="w-5 h-5 text-blue-400" />
                  <span>Flow Sensors ({sensorGroups.flow.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {sensorGroups.flow.map((sensor) => (
                    <div key={sensor.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(sensor.quality)}
                        <div>
                          <p className="font-medium text-sm">{sensor.sensorName}</p>
                          <p className="text-xs text-black-200">{sensor.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-lg">{formatValue(sensor.value, sensor.unit)}</p>
                        <Badge variant={sensor.quality === 'good' ? 'default' : 'destructive'} className="text-xs">
                          {sensor.quality || 'unknown'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Speed Sensors */}
            <Card className="bg-industrial-card border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Gauge className="w-5 h-5 text-green-400" />
                  <span>Speed Sensors ({sensorGroups.speed.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sensorGroups.speed.map((sensor) => (
                    <div key={sensor.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(sensor.quality)}
                        <div>
                          <p className="font-medium text-sm">{sensor.sensorName}</p>
                          <p className="text-xs text-black-200">{sensor.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-lg">{formatValue(sensor.value, sensor.unit)}</p>
                        <Badge variant={sensor.quality === 'good' ? 'default' : 'destructive'} className="text-xs">
                          {sensor.quality || 'unknown'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Emissions Sensors */}
            <Card className="bg-industrial-card border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-purple-400" />
                  <span>Emissions Sensors ({sensorGroups.emissions.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sensorGroups.emissions.map((sensor) => (
                    <div key={sensor.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(sensor.quality)}
                        <div>
                          <p className="font-medium text-sm">{sensor.sensorName}</p>
                          <p className="text-xs text-black-200">{sensor.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-lg">{formatValue(sensor.value, sensor.unit)}</p>
                        <Badge variant={sensor.quality === 'good' ? 'default' : 'destructive'} className="text-xs">
                          {sensor.quality || 'unknown'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="by-location" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {Object.entries(locationGroups).map(([location, sensors]) => (
              <Card key={location} className="bg-industrial-card border-gray-700">
                <CardHeader>
                  <CardTitle className=" text-black">{location.replace('_', ' ')} ({sensors.length} sensors)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {sensors.map((sensor) => (
                      <div key={sensor.id} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                        <div className="flex items-center space-x-2">
                          {getSensorIcon(sensor.sensorName)}
                          <div>
                            <p className="font-medium text-xs">{sensor.sensorName}</p>
                            <div className="flex items-center space-x-1">
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(sensor.quality)}`}></div>
                              <span className="text-xs text-black-200">{sensor.quality}</span>
                            </div>
                          </div>
                        </div>
                        <p className="font-mono text-sm">{formatValue(sensor.value, sensor.unit)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="charts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-industrial-card border-gray-700">
              <CardHeader>
                <CardTitle>Temperature Trends</CardTitle>
                <CardDescription>Recent temperature sensor readings</CardDescription>
              </CardHeader>
              <CardContent>
                <MetricsChart 
                  title="Temperature vs Time"
                  data={chartData}
                />
              </CardContent>
            </Card>
            
            {temperatureHeatmapData.length > 0 && (
              <Card className="bg-industrial-card border-gray-700">
                <CardHeader>
                  <CardTitle>Temperature Heatmap</CardTitle>
                  <CardDescription>Temperature distribution across locations</CardDescription>
                </CardHeader>
                <CardContent>
                  <HeatmapChart 
                    title="Location vs Temperature"
                    data={temperatureHeatmapData}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <Card className="bg-industrial-card border-gray-700">
            <CardHeader>
              <CardTitle>All Sensor Readings</CardTitle>
              <CardDescription>
                Complete list of {filteredSensors.length} sensors 
                {selectedLocation !== "all" && ` in ${selectedLocation.replace('_', ' ')}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left p-2">Sensor</th>
                      <th className="text-left p-2">Location</th>
                      <th className="text-left p-2">Value</th>
                      <th className="text-left p-2">Unit</th>
                      <th className="text-left p-2">Quality</th>
                      <th className="text-left p-2">Last Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSensors.map((sensor) => (
                      <tr key={sensor.id} className="border-b border-gray-800">
                        <td className="p-2">
                          <div className="flex items-center space-x-2">
                            {getSensorIcon(sensor.sensorName)}
                            <span>{sensor.sensorName}</span>
                          </div>
                        </td>
                        <td className="p-2 capitalize">{sensor.location.replace('_', ' ')}</td>
                        <td className="p-2 font-mono">{sensor.value.toFixed(2)}</td>
                        <td className="p-2">{sensor.unit}</td>
                        <td className="p-2">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(sensor.quality)}
                            <span className="capitalize">{sensor.quality || 'unknown'}</span>
                          </div>
                        </td>
                        <td className="p-2 text-black-200">
                          {new Date(sensor.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}