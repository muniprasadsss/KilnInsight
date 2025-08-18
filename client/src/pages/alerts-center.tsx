import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Bell, Check, X, Filter, Search, Settings } from "lucide-react";
import { Alert } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AlertsCenter() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: alerts = [] } = useQuery<Alert[]>({
    queryKey: ['/api/alerts'],
  });

  const acknowledgeAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      await apiRequest('PATCH', `/api/alerts/${alertId}/acknowledge`, {
        acknowledgedBy: 'Current User' // In real app, get from auth context
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
      toast({
        title: "Alert Acknowledged",
        description: "The alert has been successfully acknowledged.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to acknowledge alert.",
        variant: "destructive",
      });
    },
  });

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === "all" || alert.severity === filterSeverity;
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "acknowledged" && alert.acknowledged) ||
                         (filterStatus === "unacknowledged" && !alert.acknowledged);
    
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const activeAlerts = alerts.filter(a => !a.acknowledged);
  const acknowledgedAlerts = alerts.filter(a => a.acknowledged);

  const severityStats = {
    critical: alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length,
    warning: alerts.filter(a => a.severity === 'warning' && !a.acknowledged).length,
    normal: alerts.filter(a => a.severity === 'normal' && !a.acknowledged).length,
  };

  const handleAcknowledge = (alertId: string) => {
    acknowledgeAlertMutation.mutate(alertId);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Alerts Center</h1>
          <p className="text-gray-400">Manage and configure system alerts and notifications</p>
        </div>
        <Button className="bg-industrial-accent">
          <Settings className="w-4 h-4 mr-2" />
          Alert Configuration
        </Button>
      </div>

      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-industrial-card border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Active</p>
                <p className="text-2xl font-bold text-white">{activeAlerts.length}</p>
              </div>
              <Bell className="text-3xl text-industrial-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-industrial-card border-gray-700 border-l-4 border-status-critical">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Critical</p>
                <p className="text-2xl font-bold text-status-critical">{severityStats.critical}</p>
              </div>
              <Bell className="text-3xl text-status-critical" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-industrial-card border-gray-700 border-l-4 border-status-warning">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Warning</p>
                <p className="text-2xl font-bold text-status-warning">{severityStats.warning}</p>
              </div>
              <Bell className="text-3xl text-status-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-industrial-card border-gray-700 border-l-4 border-status-normal">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Normal</p>
                <p className="text-2xl font-bold text-status-normal">{severityStats.normal}</p>
              </div>
              <Bell className="text-3xl text-status-normal" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Management */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="bg-industrial-card border border-gray-700">
          <TabsTrigger value="active">Active Alerts ({activeAlerts.length})</TabsTrigger>
          <TabsTrigger value="acknowledged">Acknowledged ({acknowledgedAlerts.length})</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <Card className="bg-industrial-card border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Active Alerts</CardTitle>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search alerts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-600"
                    />
                  </div>
                  <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                    <SelectTrigger className="w-32 bg-gray-800 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severity</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Timestamp</TableHead>
                    <TableHead className="text-gray-300">Title</TableHead>
                    <TableHead className="text-gray-300">Message</TableHead>
                    <TableHead className="text-gray-300">Severity</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlerts
                    .filter(alert => !alert.acknowledged)
                    .map((alert) => (
                    <TableRow key={alert.id} className="border-gray-800 hover:bg-gray-800">
                      <TableCell className="text-white font-mono text-sm">
                        {alert.timestamp.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-white font-medium">
                        {alert.title}
                      </TableCell>
                      <TableCell className="text-gray-300 max-w-md truncate">
                        {alert.message}
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          alert.severity === 'critical' ? 'destructive' :
                          alert.severity === 'warning' ? 'secondary' : 'outline'
                        }>
                          {alert.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-green-400 hover:text-green-300"
                            onClick={() => handleAcknowledge(alert.id)}
                            disabled={acknowledgeAlertMutation.isPending}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-400 hover:text-red-300"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredAlerts.filter(alert => !alert.acknowledged).length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No active alerts found
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="acknowledged">
          <Card className="bg-industrial-card border-gray-700">
            <CardHeader>
              <CardTitle>Acknowledged Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Timestamp</TableHead>
                    <TableHead className="text-gray-300">Title</TableHead>
                    <TableHead className="text-gray-300">Severity</TableHead>
                    <TableHead className="text-gray-300">Acknowledged By</TableHead>
                    <TableHead className="text-gray-300">Acknowledged At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {acknowledgedAlerts.map((alert) => (
                    <TableRow key={alert.id} className="border-gray-800 hover:bg-gray-800">
                      <TableCell className="text-white font-mono text-sm">
                        {alert.timestamp.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-white">{alert.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{alert.severity}</Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {alert.acknowledgedBy || 'System'}
                      </TableCell>
                      <TableCell className="text-gray-300 font-mono text-sm">
                        {alert.acknowledgedAt?.toLocaleString() || 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuration">
          <div className="grid gap-6">
            <Card className="bg-industrial-card border-gray-700">
              <CardHeader>
                <CardTitle>Alert Thresholds</CardTitle>
                <p className="text-gray-400">Configure alert thresholds for different sensors</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { sensor: "Preheater Temperature", current: "580°C", critical: "600°C", warning: "590°C" },
                    { sensor: "NOx Emissions", current: "350 ppm", critical: "400 ppm", warning: "375 ppm" },
                    { sensor: "O2 Percentage", current: "2.5%", critical: "2.0%", warning: "2.2%" },
                    { sensor: "Fuel Flow Rate", current: "5000 kg/h", critical: "4500 kg/h", warning: "4750 kg/h" },
                  ].map((config, index) => (
                    <div key={index} className="grid grid-cols-4 gap-4 p-4 bg-gray-800 rounded-lg">
                      <div>
                        <label className="text-sm text-gray-400">Sensor</label>
                        <div className="font-medium">{config.sensor}</div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Current Value</label>
                        <div className="font-mono">{config.current}</div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Warning Threshold</label>
                        <Input 
                          defaultValue={config.warning}
                          className="bg-gray-700 border-gray-600 mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Critical Threshold</label>
                        <Input 
                          defaultValue={config.critical}
                          className="bg-gray-700 border-gray-600 mt-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-industrial-card border-gray-700">
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <p className="text-gray-400">Configure how and when to receive notifications</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Alert Types</h3>
                      {[
                        { label: "Critical Alerts", enabled: true },
                        { label: "Warning Alerts", enabled: true },
                        { label: "Normal Alerts", enabled: false },
                        { label: "System Maintenance", enabled: true },
                      ].map((setting, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">{setting.label}</span>
                          <Switch defaultChecked={setting.enabled} />
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">Delivery Methods</h3>
                      {[
                        { label: "Email Notifications", enabled: true },
                        { label: "SMS Alerts", enabled: false },
                        { label: "Dashboard Popup", enabled: true },
                        { label: "Audio Alerts", enabled: true },
                      ].map((setting, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">{setting.label}</span>
                          <Switch defaultChecked={setting.enabled} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
