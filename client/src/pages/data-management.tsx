import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Database, Wifi, AlertTriangle, CheckCircle, Settings, RefreshCw, Upload } from "lucide-react";
import { SensorReading } from "@shared/schema";

interface DataSource {
  id: string;
  name: string;
  type: "sensor" | "manual" | "csv" | "api";
  status: "connected" | "disconnected" | "error";
  lastSync: Date;
  recordCount: number;
  quality: number;
  enabled: boolean;
}

interface TagMapping {
  id: string;
  sourceTag: string;
  displayName: string;
  unit: string;
  dataType: string;
  location: string;
  quality: "good" | "warning" | "bad";
  lastValue: string;
  lastUpdate: Date;
}

export default function DataManagement() {
  const [selectedDataSource, setSelectedDataSource] = useState<string>("");
  const [tagMappings, setTagMappings] = useState<TagMapping[]>([]);

  const { data: sensorReadings = [] } = useQuery<SensorReading[]>({
    queryKey: ['/api/sensor-readings/latest'],
  });

  // Mock data sources
  const dataSources: DataSource[] = [
    {
      id: "1",
      name: "Process Control System (PCS)",
      type: "sensor",
      status: "connected",
      lastSync: new Date(),
      recordCount: 15420,
      quality: 98.5,
      enabled: true
    },
    {
      id: "2", 
      name: "Laboratory Information System (LIS)",
      type: "manual",
      status: "connected",
      lastSync: new Date(Date.now() - 5 * 60 * 1000),
      recordCount: 234,
      quality: 95.2,
      enabled: true
    },
    {
      id: "3",
      name: "Energy Management System (EMS)",
      type: "api",
      status: "error",
      lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
      recordCount: 8765,
      quality: 85.1,
      enabled: false
    },
    {
      id: "4",
      name: "Historical CSV Import",
      type: "csv",
      status: "disconnected", 
      lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000),
      recordCount: 5432,
      quality: 92.3,
      enabled: true
    }
  ];

  // Mock tag mappings
  const defaultTagMappings: TagMapping[] = [
    {
      id: "1",
      sourceTag: "AI_TEMP_001",
      displayName: "Preheater Temperature",
      unit: "°C",
      dataType: "float",
      location: "preheater",
      quality: "good",
      lastValue: "544.2",
      lastUpdate: new Date()
    },
    {
      id: "2",
      sourceTag: "AI_SPEED_001", 
      displayName: "Kiln Speed",
      unit: "rpm",
      dataType: "float",
      location: "rotary_kiln",
      quality: "good", 
      lastValue: "2.01",
      lastUpdate: new Date()
    },
    {
      id: "3",
      sourceTag: "AI_O2_001",
      displayName: "O2 Percentage",
      unit: "%",
      dataType: "float",
      location: "rotary_kiln",
      quality: "warning",
      lastValue: "3.98",
      lastUpdate: new Date(Date.now() - 5 * 60 * 1000)
    },
    {
      id: "4",
      sourceTag: "AI_NOX_001",
      displayName: "NOx Emissions",
      unit: "ppm", 
      dataType: "float",
      location: "stack",
      quality: "bad",
      lastValue: "332",
      lastUpdate: new Date(Date.now() - 15 * 60 * 1000)
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected": return <CheckCircle className="w-4 h-4 text-status-normal" />;
      case "error": return <AlertTriangle className="w-4 h-4 text-status-critical" />;
      case "disconnected": return <Wifi className="w-4 h-4 text-gray-400" />;
      default: return <Database className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected": return "text-status-normal";
      case "error": return "text-status-critical"; 
      case "disconnected": return "text-gray-400";
      default: return "text-gray-400";
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "good": return "text-status-normal";
      case "warning": return "text-status-warning";
      case "bad": return "text-status-critical";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Data Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-industrial-card border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Data Sources</p>
                <p className="text-2xl font-bold text-white">{dataSources.length}</p>
                <p className="text-xs text-status-normal">
                  {dataSources.filter(d => d.status === 'connected').length} Active
                </p>
              </div>
              <Database className="text-3xl text-industrial-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-industrial-card border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Data Quality</p>
                <p className="text-2xl font-bold text-white">94.3%</p>
                <p className="text-xs text-status-normal">↑ 2.1% improvement</p>
              </div>
              <CheckCircle className="text-3xl text-status-normal" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-industrial-card border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Records</p>
                <p className="text-2xl font-bold text-white">29.8K</p>
                <p className="text-xs text-gray-400">Last 24 hours</p>
              </div>
              <Database className="text-3xl text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-industrial-card border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Storage Used</p>
                <p className="text-2xl font-bold text-white">2.4GB</p>
                <p className="text-xs text-gray-400">of 10GB allocated</p>
              </div>
              <Database className="text-3xl text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Management Tabs */}
      <Tabs defaultValue="sources" className="space-y-6">
        <TabsList className="bg-industrial-card border border-gray-700">
          <TabsTrigger value="sources">Data Sources</TabsTrigger>
          <TabsTrigger value="mappings">Tag Mappings</TabsTrigger>
          <TabsTrigger value="quality">Data Quality</TabsTrigger>
          <TabsTrigger value="connectors">Connectors</TabsTrigger>
        </TabsList>

        <TabsContent value="sources">
          <Card className="bg-industrial-card border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Data Source Management</CardTitle>
                <Button className="bg-industrial-accent">
                  Add Data Source
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Source Name</TableHead>
                    <TableHead className="text-gray-300">Type</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Last Sync</TableHead>
                    <TableHead className="text-gray-300">Records</TableHead>
                    <TableHead className="text-gray-300">Quality</TableHead>
                    <TableHead className="text-gray-300">Enabled</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataSources.map((source) => (
                    <TableRow key={source.id} className="border-gray-800 hover:bg-gray-800">
                      <TableCell className="text-white">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(source.status)}
                          <span className="font-medium">{source.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{source.type.toUpperCase()}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          source.status === 'connected' ? 'default' :
                          source.status === 'error' ? 'destructive' : 'secondary'
                        }>
                          {source.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300 font-mono text-sm">
                        {source.lastSync.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-gray-300 font-mono">
                        {source.recordCount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-gray-300 font-mono">
                        {source.quality.toFixed(1)}%
                      </TableCell>
                      <TableCell>
                        <Switch checked={source.enabled} />
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" className="text-industrial-accent">
                            <Settings className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-green-400">
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mappings">
          <div className="space-y-6">
            <Card className="bg-industrial-card border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Tag Mapping Configuration</CardTitle>
                  <div className="space-x-2">
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Import Mappings
                    </Button>
                    <Button className="bg-industrial-accent">
                      Add Mapping
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Source Tag</TableHead>
                      <TableHead className="text-gray-300">Display Name</TableHead>
                      <TableHead className="text-gray-300">Unit</TableHead>
                      <TableHead className="text-gray-300">Location</TableHead>
                      <TableHead className="text-gray-300">Quality</TableHead>
                      <TableHead className="text-gray-300">Last Value</TableHead>
                      <TableHead className="text-gray-300">Last Update</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {defaultTagMappings.map((mapping) => (
                      <TableRow key={mapping.id} className="border-gray-800 hover:bg-gray-800">
                        <TableCell className="text-white font-mono">
                          {mapping.sourceTag}
                        </TableCell>
                        <TableCell className="text-white">
                          {mapping.displayName}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {mapping.unit}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {mapping.location}
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            mapping.quality === 'good' ? 'default' :
                            mapping.quality === 'warning' ? 'secondary' : 'destructive'
                          }>
                            {mapping.quality}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-300 font-mono">
                          {mapping.lastValue} {mapping.unit}
                        </TableCell>
                        <TableCell className="text-gray-300 font-mono text-sm">
                          {mapping.lastUpdate.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="text-industrial-accent">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quality">
          <div className="space-y-6">
            <Card className="bg-industrial-card border-gray-700">
              <CardHeader>
                <CardTitle>Data Quality Monitoring</CardTitle>
                <p className="text-gray-400">Real-time data quality metrics and validation</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Completeness</span>
                        <span className="font-mono">97.8%</span>
                      </div>
                      <Progress value={97.8} className="h-2" />
                      <div className="text-xs text-gray-400 mt-1">Missing data points: 156</div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Accuracy</span>
                        <span className="font-mono">94.2%</span>
                      </div>
                      <Progress value={94.2} className="h-2" />
                      <div className="text-xs text-gray-400 mt-1">Out-of-range values: 412</div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Timeliness</span>
                        <span className="font-mono">99.1%</span>
                      </div>
                      <Progress value={99.1} className="h-2" />
                      <div className="text-xs text-gray-400 mt-1">Delayed updates: 23</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Consistency</span>
                        <span className="font-mono">91.5%</span>
                      </div>
                      <Progress value={91.5} className="h-2" />
                      <div className="text-xs text-gray-400 mt-1">Inconsistent values: 67</div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Validity</span>
                        <span className="font-mono">96.7%</span>
                      </div>
                      <Progress value={96.7} className="h-2" />
                      <div className="text-xs text-gray-400 mt-1">Invalid formats: 89</div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Uniqueness</span>
                        <span className="font-mono">98.9%</span>
                      </div>
                      <Progress value={98.9} className="h-2" />
                      <div className="text-xs text-gray-400 mt-1">Duplicate records: 34</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-industrial-card border-gray-700">
              <CardHeader>
                <CardTitle>Data Quality Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { sensor: "NOx Sensor", issue: "Values exceeding expected range", severity: "critical", count: 23 },
                    { sensor: "O2 Analyzer", issue: "Intermittent communication loss", severity: "warning", count: 8 },
                    { sensor: "Temperature Sensor 4", issue: "Drift detected in calibration", severity: "warning", count: 12 },
                    { sensor: "Flow Meter", issue: "Duplicate timestamp entries", severity: "normal", count: 5 }
                  ].map((issue, index) => (
                    <div key={index} className="p-4 bg-gray-800 rounded-lg border-l-4 border-status-warning">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <AlertTriangle className="w-5 h-5 text-status-warning" />
                          <span className="font-medium">{issue.sensor}</span>
                          <Badge variant={
                            issue.severity === 'critical' ? 'destructive' :
                            issue.severity === 'warning' ? 'secondary' : 'outline'
                          }>
                            {issue.severity}
                          </Badge>
                        </div>
                        <span className="text-sm font-mono">{issue.count} occurrences</span>
                      </div>
                      <p className="text-gray-300 text-sm">{issue.issue}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="connectors">
          <div className="space-y-6">
            <Card className="bg-industrial-card border-gray-700">
              <CardHeader>
                <CardTitle>Real-time Data Connectors</CardTitle>
                <p className="text-gray-400">Configure connections to external systems</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-gray-800 border-gray-600">
                    <CardHeader>
                      <CardTitle className="text-lg">OPC UA Connector</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="opc-server">Server URL</Label>
                          <Input
                            id="opc-server"
                            defaultValue="opc.tcp://plc-server:4840"
                            className="bg-gray-700 border-gray-600"
                          />
                        </div>
                        <div>
                          <Label htmlFor="opc-username">Username</Label>
                          <Input
                            id="opc-username"
                            defaultValue="operator"
                            className="bg-gray-700 border-gray-600"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch defaultChecked />
                          <Label>Auto-reconnect</Label>
                        </div>
                        <Button className="w-full">Test Connection</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-600">
                    <CardHeader>
                      <CardTitle className="text-lg">Modbus TCP Connector</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="modbus-host">Host</Label>
                            <Input
                              id="modbus-host"
                              defaultValue="192.168.1.100"
                              className="bg-gray-700 border-gray-600"
                            />
                          </div>
                          <div>
                            <Label htmlFor="modbus-port">Port</Label>
                            <Input
                              id="modbus-port"
                              defaultValue="502"
                              className="bg-gray-700 border-gray-600"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="slave-id">Slave ID</Label>
                          <Input
                            id="slave-id"
                            defaultValue="1"
                            className="bg-gray-700 border-gray-600"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch defaultChecked />
                          <Label>Enable polling</Label>
                        </div>
                        <Button className="w-full">Test Connection</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-600">
                    <CardHeader>
                      <CardTitle className="text-lg">MQTT Connector</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="mqtt-broker">Broker URL</Label>
                          <Input
                            id="mqtt-broker"
                            defaultValue="mqtt://broker.local:1883"
                            className="bg-gray-700 border-gray-600"
                          />
                        </div>
                        <div>
                          <Label htmlFor="mqtt-topic">Topic Pattern</Label>
                          <Input
                            id="mqtt-topic"
                            defaultValue="kiln/+/sensors/+"
                            className="bg-gray-700 border-gray-600"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch defaultChecked />
                          <Label>Use SSL/TLS</Label>
                        </div>
                        <Button className="w-full">Test Connection</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-600">
                    <CardHeader>
                      <CardTitle className="text-lg">Database Connector</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="db-type">Database Type</Label>
                          <Select defaultValue="postgresql">
                            <SelectTrigger className="bg-gray-700 border-gray-600">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="postgresql">PostgreSQL</SelectItem>
                              <SelectItem value="mysql">MySQL</SelectItem>
                              <SelectItem value="sqlserver">SQL Server</SelectItem>
                              <SelectItem value="oracle">Oracle</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="db-connection">Connection String</Label>
                          <Input
                            id="db-connection"
                            defaultValue="postgresql://user:pass@db:5432/kiln"
                            className="bg-gray-700 border-gray-600"
                            type="password"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch />
                          <Label>Enable connection pooling</Label>
                        </div>
                        <Button className="w-full">Test Connection</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
