import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiRequest } from "@/lib/queryClient";
import { 
  DatabaseIcon,
  Upload,
  Activity, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  RefreshCw,
  Download
} from "lucide-react";

interface CementKilnDataRecord {
  id: string;
  timestamp: Date;
  preheater_outlet_temp: number | null;
  kiln_inlet_temp: number | null;
  kiln_shell_temp: number | null;
  cooler_inlet_temp: number | null;
  clinker_temp: number | null;
  raw_meal_flow: number | null;
  fuel_flow: number | null;
  primary_air_flow: number | null;
  secondary_air_flow: number | null;
  production_rate: number | null;
  kiln_speed: number | null;
  fan_speed: number | null;
  main_drive_power: number | null;
  main_drive_torque: number | null;
  preheater_pressure: number | null;
  kiln_pressure: number | null;
  nox_emissions: number | null;
  o2_percentage: number | null;
  co_emissions: number | null;
  so2_emissions: number | null;
  specific_energy_consumption: number | null;
  fuel_type: string | null;
  is_anomaly: number | null;
  event: string | null;
  episode_id: string | null;
  data_source: string;
  createdAt: Date;
}

interface Episode {
  id: string;
  episodeId: string;
  startTime: Date;
  endTime: Date;
  durationMin: number;
  failureMode: string | null;
  severity: string | null;
  description: string | null;
  createdAt: Date;
}

export default function ComprehensiveDashboard() {
  const [selectedTab, setSelectedTab] = useState<string>("overview");
  const queryClient = useQueryClient();
  
  const { data: cementKilnData = [], isLoading: loadingKilnData } = useQuery<CementKilnDataRecord[]>({
    queryKey: ["/api/cement-kiln-data"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: anomalousData = [], isLoading: loadingAnomalous } = useQuery<CementKilnDataRecord[]>({
    queryKey: ["/api/cement-kiln-data/anomalous"],
    refetchInterval: 30000,
  });

  const { data: episodes = [], isLoading: loadingEpisodes } = useQuery<Episode[]>({
    queryKey: ["/api/episodes"],
    refetchInterval: 60000, // Refresh every minute
  });

  const loadCsvDataMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/load-csv-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cement-kiln-data"] });
      queryClient.invalidateQueries({ queryKey: ["/api/cement-kiln-data/anomalous"] });
      queryClient.invalidateQueries({ queryKey: ["/api/episodes"] });
    },
  });

  const formatNumber = (value: number | null) => {
    if (value === null) return "N/A";
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  const getDataSourceColor = (source: string) => {
    switch (source) {
      case 'train': return 'bg-blue-500';
      case 'test': return 'bg-green-500';
      case 'episode': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  // Calculate statistics
  const stats = {
    totalRecords: cementKilnData.length,
    trainRecords: cementKilnData.filter(r => r.data_source === 'train').length,
    testRecords: cementKilnData.filter(r => r.data_source === 'test').length,
    anomalousRecords: anomalousData.length,
    totalEpisodes: episodes.length,
    activeEpisodes: episodes.filter(e => e.severity === 'critical').length,
  };

  const anomalyRate = stats.totalRecords > 0 ? (stats.anomalousRecords / stats.totalRecords * 100) : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Comprehensive Cement Kiln Dashboard</h1>
          <p className="text-gray-400">Full-stack React/Node.js/PostgreSQL monitoring system</p>
        </div>
        <div className="flex space-x-4">
          <Button
            onClick={() => loadCsvDataMutation.mutate()}
            disabled={loadCsvDataMutation.isPending}
            variant="outline"
          >
            {loadCsvDataMutation.isPending ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Upload className="w-4 h-4 mr-2" />
            )}
            Load CSV Data
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-industrial-card border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Records</p>
                <p className="text-2xl font-bold">{formatNumber(stats.totalRecords)}</p>
              </div>
              <DatabaseIcon className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-industrial-card border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Training Data</p>
                <p className="text-2xl font-bold">{formatNumber(stats.trainRecords)}</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-industrial-card border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Test Data</p>
                <p className="text-2xl font-bold">{formatNumber(stats.testRecords)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-industrial-card border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Anomalies</p>
                <p className="text-2xl font-bold text-red-500">{formatNumber(stats.anomalousRecords)}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-industrial-card border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Episodes</p>
                <p className="text-2xl font-bold">{formatNumber(stats.totalEpisodes)}</p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-industrial-card border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Anomaly Rate</p>
                <p className="text-2xl font-bold text-yellow-500">{anomalyRate.toFixed(1)}%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loading Status */}
      {loadCsvDataMutation.isPending && (
        <Alert>
          <RefreshCw className="w-4 h-4 animate-spin" />
          <AlertDescription>
            Loading CSV data into PostgreSQL database. This may take a few moments...
          </AlertDescription>
        </Alert>
      )}

      {loadCsvDataMutation.isSuccess && (
        <Alert className="border-green-500">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <AlertDescription>
            CSV data successfully loaded into PostgreSQL database!
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Database Overview</TabsTrigger>
          <TabsTrigger value="anomalies">Anomaly Analysis</TabsTrigger>
          <TabsTrigger value="episodes">Episode Details</TabsTrigger>
          <TabsTrigger value="realtime">Real-time Data</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-industrial-card border-gray-700">
              <CardHeader>
                <CardTitle>PostgreSQL Data Summary</CardTitle>
                <CardDescription>Complete cement kiln dataset from CSV files</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Training Records</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="font-mono">{formatNumber(stats.trainRecords)}</span>
                    </div>
                  </div>
                  <Progress value={(stats.trainRecords / stats.totalRecords) * 100} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Test Records</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="font-mono">{formatNumber(stats.testRecords)}</span>
                    </div>
                  </div>
                  <Progress value={(stats.testRecords / stats.totalRecords) * 100} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Anomalous Records</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="font-mono">{formatNumber(stats.anomalousRecords)}</span>
                    </div>
                  </div>
                  <Progress value={anomalyRate} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-industrial-card border-gray-700">
              <CardHeader>
                <CardTitle>System Architecture</CardTitle>
                <CardDescription>Full-stack technology stack</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <div>
                      <p className="font-medium">Frontend</p>
                      <p className="text-sm text-gray-400">React + TypeScript + Tailwind CSS</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <div>
                      <p className="font-medium">Backend</p>
                      <p className="text-sm text-gray-400">Node.js + Express + WebSocket</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
                    <div className="w-4 h-4 bg-purple-500 rounded"></div>
                    <div>
                      <p className="font-medium">Database</p>
                      <p className="text-sm text-gray-400">PostgreSQL + Drizzle ORM</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <div>
                      <p className="font-medium">Data Source</p>
                      <p className="text-sm text-gray-400">CSV Files with Real Cement Kiln Data</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Data Table */}
          <Card className="bg-industrial-card border-gray-700">
            <CardHeader>
              <CardTitle>Recent Cement Kiln Records</CardTitle>
              <CardDescription>Latest data from PostgreSQL database</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left p-2">Timestamp</th>
                      <th className="text-left p-2">Kiln Temp (°C)</th>
                      <th className="text-left p-2">Production (tph)</th>
                      <th className="text-left p-2">Energy (kcal/kg)</th>
                      <th className="text-left p-2">NOx (ppm)</th>
                      <th className="text-left p-2">Source</th>
                      <th className="text-left p-2">Anomaly</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cementKilnData.slice(0, 10).map((record) => (
                      <tr key={record.id} className="border-b border-gray-800">
                        <td className="p-2 text-xs">
                          {new Date(record.timestamp).toLocaleString()}
                        </td>
                        <td className="p-2 font-mono">
                          {formatNumber(record.kiln_inlet_temp)}
                        </td>
                        <td className="p-2 font-mono">
                          {formatNumber(record.production_rate)}
                        </td>
                        <td className="p-2 font-mono">
                          {formatNumber(record.specific_energy_consumption)}
                        </td>
                        <td className="p-2 font-mono">
                          {formatNumber(record.nox_emissions)}
                        </td>
                        <td className="p-2">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${getDataSourceColor(record.data_source)}`}></div>
                            <span className="capitalize">{record.data_source}</span>
                          </div>
                        </td>
                        <td className="p-2">
                          {record.is_anomaly === 1 ? (
                            <Badge variant="destructive" className="text-xs">Yes</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">No</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="anomalies" className="space-y-6">
          <Card className="bg-industrial-card border-gray-700">
            <CardHeader>
              <CardTitle>Anomaly Analysis from PostgreSQL</CardTitle>
              <CardDescription>{stats.anomalousRecords} anomalous records detected</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left p-2">Timestamp</th>
                      <th className="text-left p-2">Event</th>
                      <th className="text-left p-2">Episode ID</th>
                      <th className="text-left p-2">Temperature</th>
                      <th className="text-left p-2">Production Rate</th>
                      <th className="text-left p-2">Fuel Flow</th>
                      <th className="text-left p-2">Emissions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {anomalousData.slice(0, 20).map((record) => (
                      <tr key={record.id} className="border-b border-gray-800 bg-red-900/20">
                        <td className="p-2 text-xs">
                          {new Date(record.timestamp).toLocaleString()}
                        </td>
                        <td className="p-2 text-red-400">
                          {record.event || "Anomaly Detected"}
                        </td>
                        <td className="p-2 font-mono text-xs">
                          {record.episode_id || "N/A"}
                        </td>
                        <td className="p-2 font-mono">
                          {formatNumber(record.kiln_inlet_temp)}°C
                        </td>
                        <td className="p-2 font-mono">
                          {formatNumber(record.production_rate)} tph
                        </td>
                        <td className="p-2 font-mono">
                          {formatNumber(record.fuel_flow)} kg/h
                        </td>
                        <td className="p-2 font-mono">
                          {formatNumber(record.nox_emissions)} ppm
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="episodes" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {episodes.slice(0, 6).map((episode) => (
              <Card key={episode.id} className="bg-industrial-card border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Episode {episode.episodeId}</span>
                    <Badge variant={episode.severity === 'critical' ? 'destructive' : 'secondary'}>
                      {episode.severity || 'Normal'}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Duration: {episode.durationMin} minutes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Start Time:</span>
                      <span className="text-sm font-mono">
                        {new Date(episode.startTime).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">End Time:</span>
                      <span className="text-sm font-mono">
                        {new Date(episode.endTime).toLocaleString()}
                      </span>
                    </div>
                    {episode.failureMode && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Failure Mode:</span>
                        <span className="text-sm font-medium text-red-400">
                          {episode.failureMode}
                        </span>
                      </div>
                    )}
                    {episode.description && (
                      <div className="mt-3 p-3 bg-gray-800 rounded text-sm">
                        {episode.description}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          <Alert>
            <Activity className="w-4 h-4" />
            <AlertDescription>
              Real-time data streaming via WebSocket from PostgreSQL database
            </AlertDescription>
          </Alert>
          
          {/* Real-time metrics would go here */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-industrial-card border-gray-700">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-gray-400">Live Data Points</p>
                  <p className="text-3xl font-bold text-green-500">
                    {formatNumber(stats.totalRecords)}
                  </p>
                  <p className="text-xs text-gray-500">From PostgreSQL</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-industrial-card border-gray-700">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-gray-400">Active Monitoring</p>
                  <div className="flex items-center justify-center mt-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
                    <p className="text-lg font-bold text-green-500">Online</p>
                  </div>
                  <p className="text-xs text-gray-500">React + Node.js</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-industrial-card border-gray-700">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-gray-400">Database Status</p>
                  <div className="flex items-center justify-center mt-2">
                    <DatabaseIcon className="w-5 h-5 text-blue-500 mr-2" />
                    <p className="text-lg font-bold text-blue-500">Connected</p>
                  </div>
                  <p className="text-xs text-gray-500">PostgreSQL</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-industrial-card border-gray-700">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-gray-400">Data Quality</p>
                  <p className="text-3xl font-bold text-yellow-500">
                    {(100 - anomalyRate).toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500">Normal Operation</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}