import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeatmapChart } from "@/components/charts/heatmap-chart";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Play, Download, Save, BarChart3, TrendingUp, AlertTriangle } from "lucide-react";
import { Anomaly, FailureMode } from "@shared/schema";

export default function AdvancedAnalytics() {
  const [queryBuilder, setQueryBuilder] = useState({
    timeRange: "7d",
    sensors: [],
    conditions: [],
    aggregation: "avg"
  });

  const { data: anomalies = [] } = useQuery<Anomaly[]>({
    queryKey: ['/api/anomalies'],
  });

  const { data: failureModes = [] } = useQuery<FailureMode[]>({
    queryKey: ['/api/failure-modes'],
  });

  // Mock heatmap data for failure patterns
  const failureHeatmapData = [
    { x: "00-04", y: "Preheater", value: 2 },
    { x: "04-08", y: "Preheater", value: 1 },
    { x: "08-12", y: "Preheater", value: 0 },
    { x: "12-16", y: "Preheater", value: 3 },
    { x: "16-20", y: "Preheater", value: 4 },
    { x: "20-24", y: "Preheater", value: 2 },
    { x: "00-04", y: "Rotary Kiln", value: 5 },
    { x: "04-08", y: "Rotary Kiln", value: 3 },
    { x: "08-12", y: "Rotary Kiln", value: 1 },
    { x: "12-16", y: "Rotary Kiln", value: 7 },
    { x: "16-20", y: "Rotary Kiln", value: 8 },
    { x: "20-24", y: "Rotary Kiln", value: 6 },
    { x: "00-04", y: "Cooler", value: 1 },
    { x: "04-08", y: "Cooler", value: 0 },
    { x: "08-12", y: "Cooler", value: 2 },
    { x: "12-16", y: "Cooler", value: 4 },
    { x: "16-20", y: "Cooler", value: 3 },
    { x: "20-24", y: "Cooler", value: 1 },
  ];

  // Mock impact analysis data
  const impactAnalysis = [
    {
      failure: "Burner Trip",
      frequency: 23,
      avgDowntime: 45,
      productionLoss: 1200,
      energyWaste: 15000,
      severity: "critical"
    },
    {
      failure: "Cyclone Blockage", 
      frequency: 15,
      avgDowntime: 32,
      productionLoss: 800,
      energyWaste: 8500,
      severity: "critical"
    },
    {
      failure: "ESP Overheat",
      frequency: 42,
      avgDowntime: 18,
      productionLoss: 450,
      energyWaste: 3200,
      severity: "warning"
    },
    {
      failure: "Sensor Drift",
      frequency: 67,
      avgDowntime: 5,
      productionLoss: 0,
      energyWaste: 500,
      severity: "warning"
    },
  ];

  const predictiveInsights = [
    {
      type: "Maintenance Prediction",
      equipment: "Preheater Cyclone 4",
      prediction: "Blockage likely in 3-4 days",
      confidence: 87,
      action: "Schedule preventive cleaning",
      severity: "warning"
    },
    {
      type: "Performance Degradation",
      equipment: "Kiln Main Drive",
      prediction: "Efficiency drop expected next week",
      confidence: 73,
      action: "Check lubrication system",
      severity: "normal"
    },
    {
      type: "Fuel Quality Issue",
      equipment: "Main Burner",
      prediction: "Combustion instability risk",
      confidence: 92,
      action: "Request fuel quality analysis",
      severity: "critical"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-industrial-card border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black-200 text-sm">Pattern Analysis</p>
                <p className="text-2xl font-bold text-white">156</p>
                <p className="text-xs text-black-200">Patterns Identified</p>
              </div>
              <BarChart3 className="text-3xl text-industrial-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-industrial-card border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black-200 text-sm">Prediction Accuracy</p>
                <p className="text-2xl font-bold text-white">84.2%</p>
                <p className="text-xs text-status-normal">↑ 2.1% improvement</p>
              </div>
              <TrendingUp className="text-3xl text-status-normal" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-industrial-card border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black-200 text-sm">Risk Score</p>
                <p className="text-2xl font-bold text-status-warning">6.7</p>
                <p className="text-xs text-black-200">Medium Risk Level</p>
              </div>
              <AlertTriangle className="text-3xl text-status-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="heatmaps" className="space-y-6">
        <TabsList className="bg-industrial-card border border-gray-700">
          <TabsTrigger value="heatmaps">Failure Heatmaps</TabsTrigger>
          <TabsTrigger value="impact">Impact Analysis</TabsTrigger>
          <TabsTrigger value="predictive">Predictive Insights</TabsTrigger>
          <TabsTrigger value="query">Query Builder</TabsTrigger>
        </TabsList>

        <TabsContent value="heatmaps">
          <div className="space-y-6">
            <HeatmapChart 
              title="Failure Patterns by Time and Location"
              data={failureHeatmapData}
              width={800}
              height={300}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-industrial-card border-gray-700">
                <CardHeader>
                  <CardTitle>Top Failure Modes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {failureModes.slice(0, 5).map((mode, index) => (
                      <div key={mode.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-industrial-accent rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{mode.name}</div>
                            <div className="text-sm text-black-200">{mode.location}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono">
                            {Math.floor(Math.random() * 30 + 10)} occurrences
                          </div>
                          <div className="text-sm text-black-200">Last 30 days</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-industrial-card border-gray-700">
                <CardHeader>
                  <CardTitle>Seasonal Patterns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Winter Pattern (Dec-Feb)</span>
                        <span className="text-status-critical">High Risk</span>
                      </div>
                      <div className="text-xs text-black-200">
                        Increased fuel consumption anomalies due to cold weather
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Summer Pattern (Jun-Aug)</span>
                        <span className="text-status-warning">Medium Risk</span>
                      </div>
                      <div className="text-xs text-black-200">
                        ESP overheating issues during hot weather
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Maintenance Season (Apr-May)</span>
                        <span className="text-status-normal">Low Risk</span>
                      </div>
                      <div className="text-xs text-black-200">
                        Scheduled maintenance reduces unexpected failures
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="impact">
          <Card className="bg-industrial-card border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Failure Impact Analysis</CardTitle>
                <Button variant="default" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-2 font-medium text-gray-300">Failure Type</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-300">Frequency (30d)</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-300">Avg Downtime</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-300">Production Loss (TPH)</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-300">Energy Waste (kcal)</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-300">Severity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {impactAnalysis.map((item, index) => (
                      <tr key={index} className="border-b border-gray-800 hover:bg-gray-800">
                        <td className="py-3 px-2 font-medium text-white">{item.failure}</td>
                        <td className="py-3 px-2 font-mono">{item.frequency}</td>
                        <td className="py-3 px-2 font-mono">{item.avgDowntime} min</td>
                        <td className="py-3 px-2 font-mono">{item.productionLoss.toLocaleString()}</td>
                        <td className="py-3 px-2 font-mono">{item.energyWaste.toLocaleString()}</td>
                        <td className="py-3 px-2">
                          <Badge variant={
                            item.severity === 'critical' ? 'destructive' :
                            item.severity === 'warning' ? 'secondary' : 'outline'
                          }>
                            {item.severity}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictive">
          <div className="space-y-6">
            <Card className="bg-industrial-card border-gray-700">
              <CardHeader>
                <CardTitle>Predictive Maintenance Insights</CardTitle>
                <p className="text-black-200">AI-powered predictions based on historical patterns</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {predictiveInsights.map((insight, index) => (
                    <div key={index} className="p-4 bg-gray-800 rounded-lg border-l-4 border-industrial-accent">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <Badge variant="default">{insight.type}</Badge>
                          <span className="font-medium">{insight.equipment}</span>
                        </div>
                        <div className="text-sm">
                          Confidence: <span className="font-mono">{insight.confidence}%</span>
                        </div>
                      </div>
                      <p className="text-gray-300 mb-2">{insight.prediction}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-black-200">
                          Recommended Action: {insight.action}
                        </span>
                        <Badge variant={
                          insight.severity === 'critical' ? 'destructive' :
                          insight.severity === 'warning' ? 'secondary' : 'outline'
                        }>
                          {insight.severity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-industrial-card border-gray-700">
              <CardHeader>
                <CardTitle>Risk Assessment Matrix</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-status-normal/20 border border-status-normal rounded-lg">
                    <div className="text-2xl font-bold text-status-normal">23%</div>
                    <div className="text-sm text-black-200">Low Risk</div>
                  </div>
                  <div className="p-4 bg-status-warning/20 border border-status-warning rounded-lg">
                    <div className="text-2xl font-bold text-status-warning">54%</div>
                    <div className="text-sm text-black-200">Medium Risk</div>
                  </div>
                  <div className="p-4 bg-status-critical/20 border border-status-critical rounded-lg">
                    <div className="text-2xl font-bold text-status-critical">23%</div>
                    <div className="text-sm text-black-200">High Risk</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="query">
          <Card className="bg-industrial-card border-gray-700">
            <CardHeader>
              <CardTitle>Custom Analytics Query Builder</CardTitle>
              <p className="text-black-200">Build custom queries to analyze your data</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="time-range">Time Range</Label>
                    <Select
                      value={queryBuilder.timeRange}
                      onValueChange={(value) => setQueryBuilder(prev => ({ ...prev, timeRange: value }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1d">Last 24 Hours</SelectItem>
                        <SelectItem value="7d">Last 7 Days</SelectItem>
                        <SelectItem value="30d">Last 30 Days</SelectItem>
                        <SelectItem value="90d">Last 90 Days</SelectItem>
                        <SelectItem value="1y">Last Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="aggregation">Aggregation</Label>
                    <Select
                      value={queryBuilder.aggregation}
                      onValueChange={(value) => setQueryBuilder(prev => ({ ...prev, aggregation: value }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="avg">Average</SelectItem>
                        <SelectItem value="sum">Sum</SelectItem>
                        <SelectItem value="min">Minimum</SelectItem>
                        <SelectItem value="max">Maximum</SelectItem>
                        <SelectItem value="count">Count</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="custom-query">Custom Query (SQL-like syntax)</Label>
                  <Textarea
                    id="custom-query"
                    placeholder="SELECT sensor_name, AVG(value) FROM sensor_readings WHERE timestamp > NOW() - INTERVAL '7 days' GROUP BY sensor_name"
                    className="bg-gray-800 border-gray-600 h-32 font-mono"
                  />
                </div>

                <div className="flex justify-between">
                  <div className="space-x-2">
                    <Button variant="default">
                      <Save className="w-4 h-4 mr-2" />
                      Save Query
                    </Button>
                    <Button variant="default">
                      Load Template
                    </Button>
                  </div>
                  <Button className="bg-industrial-accent">
                    <Play className="w-4 h-4 mr-2" />
                    Execute Query
                  </Button>
                </div>

                <Card className="bg-gray-800 border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-sm">Query Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center text-black-200 py-8">
                      Execute a query to see results here
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
