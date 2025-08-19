import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { Anomaly, SensorReading, FailureMode } from "@shared/schema";

export default function RootCauseAnalysis() {
  const [selectedAnomaly, setSelectedAnomaly] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: anomalies = [] } = useQuery<Anomaly[]>({
    queryKey: ['/api/anomalies'],
  });

  const { data: failureModes = [] } = useQuery<FailureMode[]>({
    queryKey: ['/api/failure-modes'],
  });

  const { data: sensorReadings = [] } = useQuery<SensorReading[]>({
    queryKey: ['/api/sensor-readings'],
  });

  const selectedAnomalyData = anomalies.find(a => a.id === selectedAnomaly);
  
  // Mock correlation data
  const correlationData = [
    { sensor: "Fuel Flow Rate", correlation: -0.89, impact: "High", trend: "down" },
    { sensor: "Combustion Air Flow", correlation: -0.76, impact: "High", trend: "down" },
    { sensor: "Preheater Temperature", correlation: -0.65, impact: "Medium", trend: "down" },
    { sensor: "O2 Percentage", correlation: 0.72, impact: "Medium", trend: "up" },
    { sensor: "NOx Emissions", correlation: 0.58, impact: "Low", trend: "up" },
  ];

  // Mock timeline data
  const timelineEvents = [
    { time: "14:19:30", event: "Fuel pressure drop detected", severity: "warning" },
    { time: "14:20:15", event: "Combustion air flow reduced", severity: "warning" },
    { time: "14:20:45", event: "Flame instability detected", severity: "critical" },
    { time: "14:21:15", event: "Burner trip initiated", severity: "critical" },
    { time: "14:21:30", event: "Cool-down sequence started", severity: "normal" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Root Cause Analysis</h1>
          <p className="text-black-200">Deep dive analysis of anomalies and their causal relationships</p>
        </div>
        <Button className="bg-industrial-accent">
          Generate Report
        </Button>
      </div>

      {/* Episode Selection */}
      <Card className="bg-industrial-card border-gray-700">
        <CardHeader>
          <CardTitle>Episode Explorer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search episodes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800 border-gray-600"
              />
            </div>
            <Select value={selectedAnomaly} onValueChange={setSelectedAnomaly}>
              <SelectTrigger className="w-80 bg-gray-800 border-gray-600">
                <SelectValue placeholder="Select anomaly episode" />
              </SelectTrigger>
              <SelectContent>
                {anomalies.map((anomaly) => (
                  <SelectItem key={anomaly.id} value={anomaly.id}>
                    {anomaly.episodeId} - {anomaly.type.replace(/_/g, ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
          
          {selectedAnomalyData && (
            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">
                  {selectedAnomalyData.type.replace(/_/g, ' ').toUpperCase()}
                </h3>
                <Badge variant={selectedAnomalyData.severity === 'critical' ? 'destructive' : 'secondary'}>
                  {selectedAnomalyData.severity}
                </Badge>
              </div>
              <p className="text-gray-300 mb-4">{selectedAnomalyData.description}</p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-black-200">Location:</span> {selectedAnomalyData.location}
                </div>
                <div>
                  <span className="text-black-200">Start Time:</span> {selectedAnomalyData.startTime.toLocaleString()}
                </div>
                <div>
                  <span className="text-black-200">Status:</span> {selectedAnomalyData.status}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Tabs */}
      {selectedAnomalyData && (
        <Tabs defaultValue="correlation" className="space-y-6">
          <TabsList className="bg-industrial-card border border-gray-700">
            <TabsTrigger value="correlation">Sensor Correlation</TabsTrigger>
            <TabsTrigger value="timeline">Event Timeline</TabsTrigger>
            <TabsTrigger value="failure-modes">Failure Modes</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="correlation">
            <Card className="bg-industrial-card border-gray-700">
              <CardHeader>
                <CardTitle>Sensor Correlation Analysis</CardTitle>
                <p className="text-black-200">Correlation between sensors during the anomaly episode</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {correlationData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {item.trend === 'up' ? (
                            <TrendingUp className="w-5 h-5 text-red-400" />
                          ) : (
                            <TrendingDown className="w-5 h-5 text-blue-400" />
                          )}
                          <span className="font-medium">{item.sensor}</span>
                        </div>
                        <Badge variant={
                          item.impact === 'High' ? 'destructive' :
                          item.impact === 'Medium' ? 'secondary' : 'outline'
                        }>
                          {item.impact} Impact
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-lg">
                          {item.correlation > 0 ? '+' : ''}{item.correlation.toFixed(2)}
                        </div>
                        <div className="text-sm text-black-200">Correlation</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline">
            <Card className="bg-industrial-card border-gray-700">
              <CardHeader>
                <CardTitle>Event Timeline</CardTitle>
                <p className="text-black-200">Chronological sequence of events leading to the anomaly</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timelineEvents.map((event, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-16 text-sm text-black-200 font-mono">
                        {event.time}
                      </div>
                      <div className="flex-shrink-0">
                        <div className={`w-3 h-3 rounded-full ${
                          event.severity === 'critical' ? 'bg-status-critical' :
                          event.severity === 'warning' ? 'bg-status-warning' : 'bg-status-normal'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-white">{event.event}</p>
                        <Badge 
                          variant={event.severity === 'critical' ? 'destructive' : 
                                  event.severity === 'warning' ? 'secondary' : 'outline'}
                          className="mt-1"
                        >
                          {event.severity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="failure-modes">
            <Card className="bg-industrial-card border-gray-700">
              <CardHeader>
                <CardTitle>Related Failure Modes</CardTitle>
                <p className="text-black-200">Known failure modes that could cause this type of anomaly</p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {failureModes
                    .filter(fm => fm.location === selectedAnomalyData.location)
                    .map((failureMode) => (
                    <div key={failureMode.id} className="p-4 bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{failureMode.name}</h3>
                        <Badge variant="outline">{failureMode.location}</Badge>
                      </div>
                      <p className="text-gray-300 mb-3">{failureMode.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <h4 className="font-medium text-black-200 mb-1">Symptoms</h4>
                          <ul className="space-y-1">
                            {(failureMode.symptoms as string[])?.map((symptom, index) => (
                              <li key={index} className="text-gray-300">• {symptom}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-black-200 mb-1">Possible Causes</h4>
                          <ul className="space-y-1">
                            {(failureMode.causes as string[])?.map((cause, index) => (
                              <li key={index} className="text-gray-300">• {cause}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-black-200 mb-1">Impacts</h4>
                          <ul className="space-y-1">
                            {(failureMode.impacts as string[])?.map((impact, index) => (
                              <li key={index} className="text-gray-300">• {impact}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations">
            <Card className="bg-industrial-card border-gray-700">
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
                <p className="text-black-200">Suggested actions based on root cause analysis</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-yellow-400" />
                      <h3 className="font-semibold text-yellow-400">Immediate Actions</h3>
                    </div>
                    <ul className="space-y-1 text-gray-300">
                      <li>• Check fuel supply pressure and quality</li>
                      <li>• Inspect burner nozzle for blockages</li>
                      <li>• Verify combustion air system operation</li>
                      <li>• Review fuel feed control system settings</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-blue-400" />
                      <h3 className="font-semibold text-blue-400">Preventive Measures</h3>
                    </div>
                    <ul className="space-y-1 text-gray-300">
                      <li>• Implement fuel quality monitoring system</li>
                      <li>• Schedule regular burner maintenance</li>
                      <li>• Install backup fuel supply system</li>
                      <li>• Enhance combustion monitoring capabilities</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-green-900/20 border border-green-700 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-green-400" />
                      <h3 className="font-semibold text-green-400">Long-term Improvements</h3>
                    </div>
                    <ul className="space-y-1 text-gray-300">
                      <li>• Upgrade burner control system</li>
                      <li>• Implement predictive maintenance program</li>
                      <li>• Install advanced flame monitoring system</li>
                      <li>• Develop operator training program</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
