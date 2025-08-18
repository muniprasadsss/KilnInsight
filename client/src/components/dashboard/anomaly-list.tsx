import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Anomaly } from "@shared/schema";

interface AnomalyListProps {
  anomalies: Anomaly[];
  onAnalyze?: (anomaly: Anomaly) => void;
}

export function AnomalyList({ anomalies, onAnalyze }: AnomalyListProps) {
  const severityColors = {
    critical: "border-status-critical",
    warning: "border-status-warning",
    normal: "border-status-normal"
  };

  const severityBadgeColors = {
    critical: "bg-status-critical",
    warning: "bg-status-warning", 
    normal: "bg-status-normal"
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 60) {
      return `${diffMins} min ago`;
    } else {
      const diffHours = Math.floor(diffMins / 60);
      return `${diffHours} hr ago`;
    }
  };

  return (
    <Card className="bg-industrial-card border-gray-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Active Anomalies</CardTitle>
          <Badge variant="destructive">
            {anomalies.length} Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {anomalies.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              No active anomalies detected
            </div>
          ) : (
            anomalies.map((anomaly) => (
              <div 
                key={anomaly.id}
                className={cn(
                  "p-4 bg-white rounded-lg border-l-4 border border-gray-200",
                  severityColors[anomaly.severity as keyof typeof severityColors]
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={cn(
                    "font-medium",
                    anomaly.severity === 'critical' ? 'text-status-critical' : 
                    anomaly.severity === 'warning' ? 'text-status-warning' : 'text-status-normal'
                  )}>
                    {anomaly.type.replace(/_/g, ' ').split(' ').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </span>
                  <span className="text-xs text-gray-600">
                    {getTimeAgo(anomaly.startTime)}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  {anomaly.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    Episode ID: {anomaly.episodeId}
                  </span>
                  <Button 
                    size="sm" 
                    className="bg-industrial-accent hover:bg-industrial-accent/80"
                    onClick={() => onAnalyze?.(anomaly)}
                  >
                    Analyze
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
