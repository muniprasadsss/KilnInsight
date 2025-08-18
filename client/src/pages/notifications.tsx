import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Bell, Mail, MessageSquare, Phone, Settings, Users, Check, X, Plus, Trash2 } from "lucide-react";
import { Alert } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface NotificationRule {
  id: string;
  name: string;
  description: string;
  triggerType: "anomaly" | "threshold" | "equipment" | "maintenance";
  severity: "critical" | "warning" | "normal";
  enabled: boolean;
  channels: string[];
  recipients: string[];
  conditions: Record<string, any>;
  createdAt: Date;
  lastTriggered?: Date;
}

interface NotificationChannel {
  id: string;
  type: "email" | "sms" | "webhook" | "slack";
  name: string;
  configuration: Record<string, any>;
  enabled: boolean;
  status: "active" | "error" | "disabled";
  lastUsed?: Date;
}

interface RecipientGroup {
  id: string;
  name: string;
  description: string;
  members: string[];
  roles: string[];
  enabled: boolean;
}

interface NotificationLog {
  id: string;
  ruleName: string;
  channel: string;
  recipient: string;
  subject: string;
  status: "sent" | "failed" | "pending";
  timestamp: Date;
  errorMessage?: string;
}

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("rules");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock data - in real app would come from APIs
  const notificationRules: NotificationRule[] = [
    {
      id: "1",
      name: "Critical Equipment Failure",
      description: "Alert when critical equipment failures occur",
      triggerType: "equipment",
      severity: "critical",
      enabled: true,
      channels: ["email", "sms"],
      recipients: ["operators", "maintenance"],
      conditions: { equipmentStatus: "fault", location: "any" },
      createdAt: new Date('2024-01-15'),
      lastTriggered: new Date('2024-01-27T14:21:15')
    },
    {
      id: "2",
      name: "Anomaly Detection Alert", 
      description: "Notify when anomalies are detected in sensor readings",
      triggerType: "anomaly",
      severity: "warning",
      enabled: true,
      channels: ["email", "slack"],
      recipients: ["operators", "engineers"],
      conditions: { confidenceLevel: ">80", sensorType: "any" },
      createdAt: new Date('2024-01-10'),
      lastTriggered: new Date('2024-01-27T13:45:12')
    },
    {
      id: "3",
      name: "Maintenance Due Reminder",
      description: "Remind about upcoming maintenance schedules",
      triggerType: "maintenance",
      severity: "normal",
      enabled: true,
      channels: ["email"],
      recipients: ["maintenance"],
      conditions: { daysInAdvance: 3 },
      createdAt: new Date('2024-01-05')
    }
  ];

  const notificationChannels: NotificationChannel[] = [
    {
      id: "1",
      type: "email",
      name: "Corporate Email Server",
      configuration: {
        smtpServer: "mail.company.com",
        port: 587,
        username: "kiln-alerts@company.com",
        useSSL: true
      },
      enabled: true,
      status: "active",
      lastUsed: new Date('2024-01-27T14:21:15')
    },
    {
      id: "2",
      type: "sms", 
      name: "Twilio SMS Service",
      configuration: {
        accountSid: "AC*********************",
        fromNumber: "+1234567890"
      },
      enabled: true,
      status: "active",
      lastUsed: new Date('2024-01-27T14:21:15')
    },
    {
      id: "3",
      type: "slack",
      name: "Operations Slack Channel",
      configuration: {
        webhookUrl: "https://hooks.slack.com/services/***",
        channel: "#kiln-alerts"
      },
      enabled: true,
      status: "active",
      lastUsed: new Date('2024-01-27T13:45:12')
    },
    {
      id: "4",
      type: "webhook",
      name: "External API Webhook",
      configuration: {
        url: "https://api.external-system.com/alerts",
        method: "POST",
        headers: { "Authorization": "Bearer ***" }
      },
      enabled: false,
      status: "disabled"
    }
  ];

  const recipientGroups: RecipientGroup[] = [
    {
      id: "1",
      name: "Operations Team",
      description: "24/7 operations personnel",
      members: ["john.doe@company.com", "jane.smith@company.com", "+1234567890"],
      roles: ["operator", "shift-supervisor"],
      enabled: true
    },
    {
      id: "2",
      name: "Maintenance Team", 
      description: "Equipment maintenance specialists",
      members: ["mike.johnson@company.com", "sarah.wilson@company.com"],
      roles: ["maintenance-tech", "maintenance-supervisor"],
      enabled: true
    },
    {
      id: "3",
      name: "Engineering Team",
      description: "Process and control engineers",
      members: ["alex.brown@company.com", "lisa.davis@company.com"],
      roles: ["engineer", "senior-engineer"],
      enabled: true
    }
  ];

  const notificationLogs: NotificationLog[] = [
    {
      id: "1",
      ruleName: "Critical Equipment Failure",
      channel: "Email",
      recipient: "john.doe@company.com",
      subject: "CRITICAL: Burner Trip Detected",
      status: "sent",
      timestamp: new Date('2024-01-27T14:21:30')
    },
    {
      id: "2",
      ruleName: "Critical Equipment Failure", 
      channel: "SMS",
      recipient: "+1234567890",
      subject: "CRITICAL ALERT: Kiln Equipment Failure",
      status: "sent",
      timestamp: new Date('2024-01-27T14:21:25')
    },
    {
      id: "3",
      ruleName: "Anomaly Detection Alert",
      channel: "Slack",
      recipient: "#kiln-alerts",
      subject: "Anomaly Detected: Cyclone Blockage",
      status: "sent",
      timestamp: new Date('2024-01-27T13:45:20')
    },
    {
      id: "4",
      ruleName: "Maintenance Due Reminder",
      channel: "Email",
      recipient: "mike.johnson@company.com",
      subject: "Maintenance Due: ESP Unit Cleaning",
      status: "failed",
      timestamp: new Date('2024-01-26T09:00:00'),
      errorMessage: "SMTP connection timeout"
    }
  ];

  const getChannelIcon = (type: string) => {
    switch (type) {
      case "email": return <Mail className="w-4 h-4" />;
      case "sms": return <Phone className="w-4 h-4" />;
      case "slack": return <MessageSquare className="w-4 h-4" />;
      case "webhook": return <Settings className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": case "sent": return "text-status-normal";
      case "error": case "failed": return "text-status-critical";
      case "disabled": case "pending": return "text-gray-400";
      default: return "text-gray-400";
    }
  };

  const handleToggleRule = (ruleId: string, enabled: boolean) => {
    console.log('Toggling notification rule:', ruleId, enabled);
    toast({
      title: enabled ? "Rule Enabled" : "Rule Disabled",
      description: `Notification rule has been ${enabled ? "enabled" : "disabled"}.`,
    });
  };

  const handleTestChannel = (channelId: string) => {
    console.log('Testing notification channel:', channelId);
    toast({
      title: "Test Notification Sent",
      description: "A test notification has been sent through the selected channel.",
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Notifications Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-industrial-card border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Rules</p>
                <p className="text-2xl font-bold text-white">
                  {notificationRules.filter(r => r.enabled).length}
                </p>
              </div>
              <Bell className="text-3xl text-industrial-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-industrial-card border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Channels</p>
                <p className="text-2xl font-bold text-white">
                  {notificationChannels.filter(c => c.enabled).length}
                </p>
                <p className="text-xs text-status-normal">
                  {notificationChannels.filter(c => c.status === 'active').length} Active
                </p>
              </div>
              <Settings className="text-3xl text-status-normal" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-industrial-card border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Today's Notifications</p>
                <p className="text-2xl font-bold text-white">47</p>
                <p className="text-xs text-gray-400">
                  {notificationLogs.filter(l => l.status === 'failed').length} Failed
                </p>
              </div>
              <Mail className="text-3xl text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-industrial-card border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Recipients</p>
                <p className="text-2xl font-bold text-white">
                  {recipientGroups.reduce((sum, group) => sum + group.members.length, 0)}
                </p>
              </div>
              <Users className="text-3xl text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Notification Management */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-industrial-card border border-gray-700">
          <TabsTrigger value="rules">Notification Rules</TabsTrigger>
          <TabsTrigger value="channels">Delivery Channels</TabsTrigger>
          <TabsTrigger value="recipients">Recipient Groups</TabsTrigger>
          <TabsTrigger value="logs">Delivery Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="rules">
          <Card className="bg-industrial-card border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Notification Rules</CardTitle>
                <Button className="bg-industrial-accent">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notificationRules.map((rule) => (
                  <Card key={rule.id} className="bg-gray-800 border-gray-600">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <Switch 
                            checked={rule.enabled}
                            onCheckedChange={(checked) => handleToggleRule(rule.id, checked)}
                          />
                          <div>
                            <h3 className="font-semibold text-white">{rule.name}</h3>
                            <p className="text-sm text-gray-400">{rule.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={
                            rule.severity === 'critical' ? 'destructive' :
                            rule.severity === 'warning' ? 'secondary' : 'outline'
                          }>
                            {rule.severity}
                          </Badge>
                          <Badge variant="outline">{rule.triggerType}</Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Channels:</span>
                          <div className="flex space-x-2 mt-1">
                            {rule.channels.map((channel, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {channel}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-400">Recipients:</span>
                          <div className="flex space-x-2 mt-1">
                            {rule.recipients.map((recipient, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {recipient}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-400">Last Triggered:</span>
                          <div className="font-mono text-white mt-1">
                            {rule.lastTriggered?.toLocaleString() || 'Never'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-2 mt-4">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Test
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {notificationChannels.map((channel) => (
              <Card key={channel.id} className="bg-industrial-card border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getChannelIcon(channel.type)}
                      <div>
                        <CardTitle className="text-lg">{channel.name}</CardTitle>
                        <Badge variant="outline" className="mt-1">
                          {channel.type.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={
                        channel.status === 'active' ? 'default' :
                        channel.status === 'error' ? 'destructive' : 'secondary'
                      }>
                        {channel.status}
                      </Badge>
                      <Switch checked={channel.enabled} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm space-y-2">
                      {Object.entries(channel.configuration).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-400">{key}:</span>
                          <span className="font-mono text-white">
                            {key.toLowerCase().includes('password') || key.toLowerCase().includes('token') || key.toLowerCase().includes('key')
                              ? '***********'
                              : String(value)
                            }
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    {channel.lastUsed && (
                      <div className="text-sm">
                        <span className="text-gray-400">Last used:</span>
                        <span className="font-mono text-white ml-2">
                          {channel.lastUsed.toLocaleString()}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleTestChannel(channel.id)}
                      >
                        Test Channel
                      </Button>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recipients">
          <Card className="bg-industrial-card border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recipient Groups</CardTitle>
                <Button className="bg-industrial-accent">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Group
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recipientGroups.map((group) => (
                  <Card key={group.id} className="bg-gray-800 border-gray-600">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <Switch checked={group.enabled} />
                          <div>
                            <h3 className="font-semibold text-white">{group.name}</h3>
                            <p className="text-sm text-gray-400">{group.description}</p>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {group.members.length} members
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Members:</span>
                          <div className="mt-2 space-y-1">
                            {group.members.map((member, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                {member.includes('@') ? <Mail className="w-3 h-3" /> : <Phone className="w-3 h-3" />}
                                <span className="font-mono text-white text-xs">{member}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-400">Roles:</span>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {group.roles.map((role, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {role}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-2 mt-4">
                        <Button variant="outline" size="sm">
                          Edit Members
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit Roles
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card className="bg-industrial-card border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Notification Delivery Logs</CardTitle>
                <div className="space-x-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32 bg-gray-800 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="sent">Sent Only</SelectItem>
                      <SelectItem value="failed">Failed Only</SelectItem>
                      <SelectItem value="pending">Pending Only</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
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
                    <TableHead className="text-gray-300">Rule</TableHead>
                    <TableHead className="text-gray-300">Channel</TableHead>
                    <TableHead className="text-gray-300">Recipient</TableHead>
                    <TableHead className="text-gray-300">Subject</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Error</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notificationLogs.map((log) => (
                    <TableRow key={log.id} className="border-gray-800 hover:bg-gray-800">
                      <TableCell className="text-white font-mono text-sm">
                        {log.timestamp.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-white">
                        {log.ruleName}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {log.channel}
                      </TableCell>
                      <TableCell className="text-gray-300 font-mono text-sm">
                        {log.recipient}
                      </TableCell>
                      <TableCell className="text-gray-300 max-w-xs truncate">
                        {log.subject}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {log.status === 'sent' && <Check className="w-4 h-4 text-status-normal" />}
                          {log.status === 'failed' && <X className="w-4 h-4 text-status-critical" />}
                          {log.status === 'pending' && <Bell className="w-4 h-4 text-status-warning" />}
                          <Badge variant={
                            log.status === 'sent' ? 'default' :
                            log.status === 'failed' ? 'destructive' : 'secondary'
                          }>
                            {log.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-status-critical text-sm max-w-xs truncate">
                        {log.errorMessage || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
