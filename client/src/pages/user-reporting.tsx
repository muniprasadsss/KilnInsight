import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ReportBuilder } from "@/components/reports/report-builder";
import { FileText, Download, Eye, Calendar, Clock, User, Trash2 } from "lucide-react";

interface Report {
  id: string;
  name: string;
  type: string;
  status: "generating" | "ready" | "failed";
  createdAt: Date;
  createdBy: string;
  size?: string;
  downloadUrl?: string;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  sections: string[];
  frequency: string;
  lastUsed?: Date;
}

export default function UserReporting() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  // Mock data - in real app would come from API
  const recentReports: Report[] = [
    {
      id: "1",
      name: "Daily Operations Report - Jan 27",
      type: "operational",
      status: "ready",
      createdAt: new Date('2024-01-27T08:00:00'),
      createdBy: "John Doe",
      size: "2.3 MB",
      downloadUrl: "/reports/daily-ops-jan27.pdf"
    },
    {
      id: "2", 
      name: "Weekly Anomaly Analysis",
      type: "anomaly",
      status: "generating",
      createdAt: new Date('2024-01-27T07:30:00'),
      createdBy: "Jane Smith",
    },
    {
      id: "3",
      name: "Monthly Efficiency Report",
      type: "efficiency", 
      status: "ready",
      createdAt: new Date('2024-01-26T16:00:00'),
      createdBy: "Mike Johnson",
      size: "5.7 MB",
      downloadUrl: "/reports/monthly-efficiency.pdf"
    },
    {
      id: "4",
      name: "Environmental Compliance Report",
      type: "environmental",
      status: "failed",
      createdAt: new Date('2024-01-26T14:20:00'),
      createdBy: "Sarah Wilson",
    }
  ];

  const reportTemplates: ReportTemplate[] = [
    {
      id: "1",
      name: "Daily Operations Summary",
      description: "Comprehensive daily report covering production metrics, equipment status, and key alerts",
      type: "operational", 
      sections: ["executive-summary", "kpi-dashboard", "production-metrics", "equipment-status"],
      frequency: "daily",
      lastUsed: new Date('2024-01-27T08:00:00')
    },
    {
      id: "2",
      name: "Anomaly Investigation Report", 
      description: "Detailed analysis of anomalies with root cause analysis and recommendations",
      type: "anomaly",
      sections: ["anomaly-analysis", "root-cause", "sensor-readings", "recommendations"],
      frequency: "manual",
      lastUsed: new Date('2024-01-25T10:30:00')
    },
    {
      id: "3",
      name: "Energy Efficiency Analysis",
      description: "Energy consumption analysis with benchmarking and optimization opportunities", 
      type: "efficiency",
      sections: ["energy-metrics", "efficiency-trends", "benchmarking", "recommendations"],
      frequency: "weekly",
      lastUsed: new Date('2024-01-20T09:15:00')
    },
    {
      id: "4",
      name: "Environmental Compliance",
      description: "Environmental metrics and regulatory compliance status",
      type: "environmental",
      sections: ["emission-data", "compliance-status", "environmental-metrics", "regulatory-summary"],
      frequency: "monthly"
    }
  ];

  const dashboardTemplates = [
    {
      id: "1",
      name: "Operations Overview",
      description: "Real-time operational KPIs and status indicators",
      widgets: 12,
      lastModified: new Date('2024-01-20T14:30:00')
    },
    {
      id: "2", 
      name: "Maintenance Dashboard",
      description: "Equipment health and maintenance scheduling overview",
      widgets: 8,
      lastModified: new Date('2024-01-18T11:20:00')
    },
    {
      id: "3",
      name: "Quality Control",
      description: "Product quality metrics and control charts",
      widgets: 10,
      lastModified: new Date('2024-01-15T16:45:00')
    }
  ];

  const handleGenerateReport = (config: any) => {
    console.log('Generating report with config:', config);
    // In real app, would call API to generate report
  };

  const handleSaveTemplate = (config: any) => {
    console.log('Saving report template:', config);
    // In real app, would save template to database
  };

  const handlePreviewReport = (config: any) => {
    console.log('Previewing report:', config);
    // In real app, would generate preview
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready": return "text-status-normal";
      case "generating": return "text-status-warning";
      case "failed": return "text-status-critical";
      default: return "text-black-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ready": return <FileText className="w-4 h-4 text-status-normal" />;
      case "generating": return <Clock className="w-4 h-4 text-status-warning" />;
      case "failed": return <FileText className="w-4 h-4 text-status-critical" />;
      default: return <FileText className="w-4 h-4 text-black-200" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Reporting Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-industrial-card border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black-200 text-sm">Total Reports</p>
                <p className="text-2xl font-bold text-white">247</p>
              </div>
              <FileText className="text-3xl text-industrial-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-industrial-card border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black-200 text-sm">This Month</p>
                <p className="text-2xl font-bold text-white">23</p>
                <p className="text-xs text-status-normal">↑ 12% from last month</p>
              </div>
              <Calendar className="text-3xl text-status-normal" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-industrial-card border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black-200 text-sm">Templates</p>
                <p className="text-2xl font-bold text-white">12</p>
              </div>
              <FileText className="text-3xl text-black-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-industrial-card border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black-200 text-sm">Dashboards</p>
                <p className="text-2xl font-bold text-white">6</p>
              </div>
              <Eye className="text-3xl text-black-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="generator" className="space-y-6">
        <TabsList className="bg-industrial-card border border-gray-700">
          <TabsTrigger value="generator">Report Generator</TabsTrigger>
          <TabsTrigger value="reports">Recent Reports</TabsTrigger>
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
          <TabsTrigger value="dashboards">Dashboard Builder</TabsTrigger>
        </TabsList>

        <TabsContent value="generator">
          <ReportBuilder
            onGenerate={handleGenerateReport}
            onSave={handleSaveTemplate}
            onPreview={handlePreviewReport}
          />
        </TabsContent>

        <TabsContent value="reports">
          <Card className="bg-industrial-card border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Reports</CardTitle>
                <div className="space-x-2">
                  <Button variant="outline" size="sm">
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Bulk Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Report Name</TableHead>
                    <TableHead className="text-gray-300">Type</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Created</TableHead>
                    <TableHead className="text-gray-300">Created By</TableHead>
                    <TableHead className="text-gray-300">Size</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentReports.map((report) => (
                    <TableRow key={report.id} className="border-gray-800 hover:bg-gray-800">
                      <TableCell className="text-white">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(report.status)}
                          <span>{report.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{report.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          report.status === 'ready' ? 'default' :
                          report.status === 'generating' ? 'secondary' : 'destructive'
                        }>
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300 font-mono text-sm">
                        {report.createdAt.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-gray-300">{report.createdBy}</TableCell>
                      <TableCell className="text-gray-300 font-mono">
                        {report.size || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {report.status === 'ready' && (
                            <>
                              <Button variant="ghost" size="icon" className="text-industrial-accent">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-green-400">
                                <Download className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          <Button variant="ghost" size="icon" className="text-red-400">
                            <Trash2 className="w-4 h-4" />
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

        <TabsContent value="templates">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reportTemplates.map((template) => (
              <Card key={template.id} className="bg-industrial-card border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge variant="outline">{template.type}</Badge>
                  </div>
                  <p className="text-black-200 text-sm">{template.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Sections ({template.sections.length})</h4>
                      <div className="flex flex-wrap gap-2">
                        {template.sections.map((section, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {section.replace('-', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <span className="text-black-200">Frequency: </span>
                        <span className="text-white">{template.frequency}</span>
                      </div>
                      {template.lastUsed && (
                        <div>
                          <span className="text-black-200">Last used: </span>
                          <span className="text-white font-mono">
                            {template.lastUsed.toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        className="bg-industrial-accent"
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        Use Template
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        Duplicate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="dashboards">
          <Card className="bg-industrial-card border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Custom Dashboard Builder</CardTitle>
                <Button className="bg-industrial-accent">
                  Create New Dashboard
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {dashboardTemplates.map((dashboard) => (
                    <Card key={dashboard.id} className="bg-gray-800 border-gray-600">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{dashboard.name}</CardTitle>
                          <Badge variant="outline">{dashboard.widgets} widgets</Badge>
                        </div>
                        <p className="text-black-200 text-sm">{dashboard.description}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-black-200">
                            Modified: {dashboard.lastModified.toLocaleDateString()}
                          </div>
                          <div className="space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <Card className="bg-gray-800 border-gray-600">
                  <CardHeader>
                    <CardTitle>Available Widgets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        "KPI Cards",
                        "Line Charts", 
                        "Bar Charts",
                        "Gauge Charts",
                        "Status Tables",
                        "Alert Lists",
                        "Process Diagrams",
                        "Heatmaps"
                      ].map((widget, index) => (
                        <div key={index} className="p-3 border border-gray-600 rounded-lg text-center cursor-pointer hover:bg-gray-700">
                          <div className="text-sm font-medium">{widget}</div>
                        </div>
                      ))}
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
