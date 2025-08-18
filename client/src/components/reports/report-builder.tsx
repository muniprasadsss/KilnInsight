import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download, Eye, Save } from "lucide-react";
import { format } from "date-fns";

interface ReportConfig {
  name: string;
  type: string;
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  sections: string[];
  format: string;
  frequency: string;
}

interface ReportBuilderProps {
  onGenerate: (config: ReportConfig) => void;
  onSave: (config: ReportConfig) => void;
  onPreview: (config: ReportConfig) => void;
}

export function ReportBuilder({ onGenerate, onSave, onPreview }: ReportBuilderProps) {
  const [config, setConfig] = useState<ReportConfig>({
    name: "",
    type: "operational",
    dateRange: { from: null, to: null },
    sections: [],
    format: "pdf",
    frequency: "manual"
  });

  const reportTypes = [
    { value: "operational", label: "Operational Report" },
    { value: "anomaly", label: "Anomaly Analysis Report" },
    { value: "efficiency", label: "Efficiency Report" },
    { value: "maintenance", label: "Maintenance Report" },
    { value: "environmental", label: "Environmental Report" },
  ];

  const availableSections = [
    { id: "executive-summary", label: "Executive Summary" },
    { id: "kpi-dashboard", label: "KPI Dashboard" },
    { id: "anomaly-analysis", label: "Anomaly Analysis" },
    { id: "production-metrics", label: "Production Metrics" },
    { id: "energy-efficiency", label: "Energy Efficiency" },
    { id: "environmental-data", label: "Environmental Data" },
    { id: "maintenance-log", label: "Maintenance Log" },
    { id: "sensor-readings", label: "Sensor Readings" },
    { id: "recommendations", label: "Recommendations" },
  ];

  const handleSectionToggle = (sectionId: string, checked: boolean) => {
    setConfig(prev => ({
      ...prev,
      sections: checked 
        ? [...prev.sections, sectionId]
        : prev.sections.filter(s => s !== sectionId)
    }));
  };

  const isConfigValid = config.name && config.type && config.sections.length > 0;

  return (
    <Card className="bg-industrial-card border-gray-700">
      <CardHeader>
        <CardTitle>Report Builder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="report-name">Report Name</Label>
            <Input
              id="report-name"
              placeholder="Enter report name"
              value={config.name}
              onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
              className="bg-gray-800 border-gray-600"
            />
          </div>
          <div>
            <Label htmlFor="report-type">Report Type</Label>
            <Select
              value={config.type}
              onValueChange={(value) => setConfig(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger className="bg-gray-800 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Date Range */}
        <div>
          <Label>Date Range</Label>
          <div className="flex space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-gray-800 border-gray-600 justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {config.dateRange.from ? format(config.dateRange.from, "PPP") : "Start date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={config.dateRange.from || undefined}
                  onSelect={(date) => setConfig(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, from: date || null }
                  }))}
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-gray-800 border-gray-600 justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {config.dateRange.to ? format(config.dateRange.to, "PPP") : "End date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={config.dateRange.to || undefined}
                  onSelect={(date) => setConfig(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, to: date || null }
                  }))}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Report Sections */}
        <div>
          <Label>Report Sections</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {availableSections.map(section => (
              <div key={section.id} className="flex items-center space-x-2">
                <Checkbox
                  id={section.id}
                  checked={config.sections.includes(section.id)}
                  onCheckedChange={(checked) => handleSectionToggle(section.id, !!checked)}
                />
                <Label htmlFor={section.id} className="text-sm">
                  {section.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Format and Frequency */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="format">Output Format</Label>
            <Select
              value={config.format}
              onValueChange={(value) => setConfig(prev => ({ ...prev, format: value }))}
            >
              <SelectTrigger className="bg-gray-800 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF Document</SelectItem>
                <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                <SelectItem value="html">HTML Report</SelectItem>
                <SelectItem value="csv">CSV Data</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="frequency">Frequency</Label>
            <Select
              value={config.frequency}
              onValueChange={(value) => setConfig(prev => ({ ...prev, frequency: value }))}
            >
              <SelectTrigger className="bg-gray-800 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual Generation</SelectItem>
                <SelectItem value="daily">Daily Automated</SelectItem>
                <SelectItem value="weekly">Weekly Automated</SelectItem>
                <SelectItem value="monthly">Monthly Automated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4">
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => onPreview(config)}
              disabled={!isConfigValid}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              variant="outline"
              onClick={() => onSave(config)}
              disabled={!config.name}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Template
            </Button>
          </div>
          <Button
            className="bg-industrial-accent"
            onClick={() => onGenerate(config)}
            disabled={!isConfigValid}
          >
            <Download className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
