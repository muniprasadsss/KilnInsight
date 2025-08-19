import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useRef, useState } from "react";

interface MetricsChartProps {
  title?: string;
  data?: Array<{
    timestamp: string;
    productionRate: number;
    energyEfficiency: number;
  }>;
}

export function MetricsChart({ title = "Key Metrics Trends", data }: MetricsChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);
  const [timeRange, setTimeRange] = useState("24h");

  // Default data for demonstration
  const defaultData = [
    { timestamp: "00:00", productionRate: 105, energyEfficiency: 702 },
    { timestamp: "04:00", productionRate: 108, energyEfficiency: 701 },
    { timestamp: "08:00", productionRate: 110, energyEfficiency: 699 },
    { timestamp: "12:00", productionRate: 106, energyEfficiency: 703 },
    { timestamp: "16:00", productionRate: 108, energyEfficiency: 701 },
    { timestamp: "20:00", productionRate: 107, energyEfficiency: 700 },
    { timestamp: "24:00", productionRate: 109, energyEfficiency: 702 },
  ];

  const chartData = data || defaultData;

  useEffect(() => {
    if (!canvasRef.current) return;

    // Dynamically import Chart.js to avoid SSR issues
    import('chart.js/auto').then((Chart) => {
      const ctx = canvasRef.current!.getContext('2d');
      if (!ctx) return;

      // Destroy existing chart
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      chartRef.current = new Chart.default(ctx, {
        type: 'line',
        data: {
          labels: chartData.map(d => d.timestamp),
          datasets: [
            {
              label: 'Production Rate (TPH)',
              data: chartData.map(d => d.productionRate),
              borderColor: '#00ACC1',
              backgroundColor: 'rgba(0, 172, 193, 0.1)',
              tension: 0.4,
              pointBackgroundColor: '#00ACC1',
              pointBorderColor: '#00ACC1',
            },
            {
              label: 'Energy Efficiency (kcal/kg)',
              data: chartData.map(d => d.energyEfficiency),
              borderColor: '#FF9800',
              backgroundColor: 'rgba(255, 152, 0, 0.1)',
              tension: 0.4,
              pointBackgroundColor: '#FF9800',
              pointBorderColor: '#FF9800',
              yAxisID: 'y1',
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          plugins: {
            legend: {
              labels: {
                color: '#FFFFFF',
                usePointStyle: true,
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleColor: '#FFFFFF',
              bodyColor: '#FFFFFF',
              borderColor: '#00ACC1',
              borderWidth: 1,
            }
          },
          scales: {
            x: {
              ticks: {
                color: '#B0BEC5'
              },
              grid: {
                color: '#424242'
              }
            },
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              ticks: {
                color: '#B0BEC5'
              },
              grid: {
                color: '#424242'
              },
              title: {
                display: true,
                text: 'Production Rate (TPH)',
                color: '#00ACC1'
              }
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              ticks: {
                color: '#B0BEC5'
              },
              grid: {
                drawOnChartArea: false,
              },
              title: {
                display: true,
                text: 'Energy Efficiency (kcal/kg)',
                color: '#FF9800'
              }
            },
          }
        }
      });
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [chartData]);

  return (
    <Card className="bg-white border-gray-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40 bg-white border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <canvas ref={canvasRef} className="max-w-full max-h-full" />
        </div>
      </CardContent>
    </Card>
  );
}
