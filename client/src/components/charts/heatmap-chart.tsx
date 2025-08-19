import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useRef } from "react";

interface HeatmapData {
  x: string;
  y: string;
  value: number;
  label?: string;
}

interface HeatmapChartProps {
  title: string;
  data: HeatmapData[];
  width?: number;
  height?: number;
}

export function HeatmapChart({ title, data, width = 600, height = 400 }: HeatmapChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Get unique x and y values
    const xValues = Array.from(new Set(data.map(d => d.x)));
    const yValues = Array.from(new Set(data.map(d => d.y)));
    
    const cellWidth = (width - 100) / xValues.length;
    const cellHeight = (height - 100) / yValues.length;

    // Get min and max values for color scaling
    const values = data.map(d => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);

    // Color scale function
    const getColor = (value: number) => {
      const normalizedValue = (value - minValue) / (maxValue - minValue);
      
      // Use industrial color scheme
      if (normalizedValue < 0.3) {
        return `hsl(122, 39%, ${50 + normalizedValue * 20}%)`; // Green range
      } else if (normalizedValue < 0.7) {
        return `hsl(35, 100%, ${40 + normalizedValue * 20}%)`; // Orange range  
      } else {
        return `hsl(4, 90%, ${50 + normalizedValue * 20}%)`; // Red range
      }
    };

    // Draw cells
    data.forEach(item => {
      const xIndex = xValues.indexOf(item.x);
      const yIndex = yValues.indexOf(item.y);
      
      const x = 50 + xIndex * cellWidth;
      const y = 50 + yIndex * cellHeight;

      // Fill cell
      ctx.fillStyle = getColor(item.value);
      ctx.fillRect(x, y, cellWidth - 2, cellHeight - 2);

      // Add border
      ctx.strokeStyle = '#424242';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, cellWidth - 2, cellHeight - 2);

      // Add value text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '12px Roboto';
      ctx.textAlign = 'center';
      ctx.fillText(
        item.value.toString(),
        x + cellWidth / 2,
        y + cellHeight / 2 + 4
      );
    });

    // Draw labels
    ctx.fillStyle = '#B0BEC5';
    ctx.font = '12px Roboto';
    ctx.textAlign = 'center';

    // X-axis labels
    xValues.forEach((label, index) => {
      const x = 50 + index * cellWidth + cellWidth / 2;
      ctx.fillText(label, x, height - 20);
    });

    // Y-axis labels
    ctx.textAlign = 'right';
    yValues.forEach((label, index) => {
      const y = 50 + index * cellHeight + cellHeight / 2 + 4;
      ctx.fillText(label, 40, y);
    });

  }, [data, width, height]);

  return (
    <Card className="bg-industrial-card border-gray-700">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <canvas ref={canvasRef} className="border border-gray-600 rounded" />
        </div>
        <div className="mt-4 flex justify-center space-x-4 text-xs text-black-200">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-status-normal rounded"></div>
            <span>Low</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-status-warning rounded"></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-status-critical rounded"></div>
            <span>High</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
