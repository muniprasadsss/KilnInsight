import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TooltipProps } from "recharts";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  Area,
} from "recharts";
import trendsData from "../../../../public/dashboardTrends.json"


const pieData1 = [
  { name: "Critical", value: 3 },
  { name: "Warning", value: 7 },
  { name: "Normal", value: 15 },
];

const pieData2 = [
  { name: "Maintenance", value: 5 },
  { name: "Failure", value: 2 },
  { name: "Idle", value: 8 },
];

const COLORS = ["#dc2626", "#f59e0b", "#16a34a"];

const barData = [
  { name: "Daily", value: 701.23 },
  { name: "Weekly", value: 699.65 },
  { name: "Monthly", value: 697.12 },
  
];

const factors = [
  { name: "fuel flow kgph", value: 45 },
  { name: "feed rate tph", value: 35 },
  { name: "primary fan speed rpm", value: 15 },
];

export default function Dashboard() {
  // Custom tooltip for trend charts
  function makeTooltip(cardName: string) {
    return function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
      if (active && payload && payload.length && payload[0].value !== undefined) {
        return (
          <div className="bg-white p-2 rounded shadow text-xs border border-gray-200">
            <div><span className="font-semibold">{cardName}</span></div>
            <div>Value: <span className="font-bold">{payload[0].value}</span></div>
          </div>
        );
      }
      return null;
    };
  }
  // Prepare trend data for each card

  // Helper to get min/max for y-axis domain
  interface TrendDataPoint {
    time: string;
    value: number;
  }

  function getDomain(arr: TrendDataPoint[]): [number, number] {
    const vals = arr.map((d) => d.value);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    // Add padding for better visualization
    const pad = (max - min) * 0.15;
    return [min - pad, max + pad];
  }

  const productionTrend = trendsData.map((item) => ({ time: item["timestamp"], value: item["production(tph)"] }));
  const fuelFlowTrend = trendsData.map((item) => ({ time: item["timestamp"], value: item["fuel_flow(kgph)"] }));
  const energyTrend = trendsData.map((item) => ({ time: item["timestamp"], value: item["specific_energy(kcal-kg)"] }));
  const availabilityTrend = trendsData.map((item) => ({ time: item["timestamp"], value: item["availability(%)"] }));

  const productionDomain = getDomain(productionTrend);
  const fuelFlowDomain = getDomain(fuelFlowTrend);
  const energyDomain = getDomain(energyTrend);
  const availabilityDomain = getDomain(availabilityTrend);

  return (
    <div className="p-1 flex flex-col gap-6">
      {/* Row 1: KPIs + Trend */}
      <div className="top-trends flex gap-2">
  {/* Production Trend */}
  <Card className="bg-white shadow-lg rounded-2xl p-4 w-full">
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-sm text-gray-600 font-medium">Production (tph)</h5>
            <span className="text-gray-400 text-xs">T1</span>
          </div>
          <div className="text-4xl font-bold text-gray-900">108.19</div>
        
          <CardContent className="p-0 mt-2 h-20">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={productionTrend}>
                <YAxis domain={productionDomain} hide />
                <Tooltip content={makeTooltip("Production (tph)")} />
                <defs>
                  <linearGradient id="prodShadow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2} dot={false} fillOpacity={0.2} />
                <Area type="monotone" dataKey="value" stroke="none" fill="url(#prodShadow)" fillOpacity={1} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
          <div className="average flex items-center" >
            <span className="text-gray-500 text-xs mr-1" >Average:</span> 
            <h6> 108.09</h6>
          </div>
         
        </Card>
        {/* Fuel Flow Trend */}
  <Card className="bg-white shadow-lg rounded-2xl p-4 w-full">
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-sm text-gray-600 font-medium">Fuel Flow (kgph)</h5>
            <span className="text-gray-400 text-xs">T2</span>
          </div>
          <div className="text-4xl font-bold text-gray-900">{fuelFlowTrend[fuelFlowTrend.length-1]?.value}</div>
          <CardContent className="p-0 mt-2 h-20">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fuelFlowTrend}>
                <YAxis domain={fuelFlowDomain} hide />
                <Tooltip content={makeTooltip("Fuel Flow (kgph)")} />
                <defs>
                  <linearGradient id="fuelShadow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2} dot={false} fillOpacity={0.2} />
                <Area type="monotone" dataKey="value" stroke="none" fill="url(#fuelShadow)" fillOpacity={1} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
           <div className="average flex items-center" >
            <span className="text-gray-500 text-xs mr-1" >Average:</span> 
            <h6>7024.14</h6>
          </div>
        </Card>
        {/* Specific Energy Trend */}
  <Card className="bg-white shadow-lg rounded-2xl p-4 w-full">
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-sm text-gray-600 font-medium">Specific Energy (kcal/kg)</h5>
            <span className="text-gray-400 text-xs">T3</span>
          </div>
          <div className="text-4xl font-bold text-gray-900">{energyTrend[energyTrend.length-1]?.value}</div>
          <CardContent className="p-0 mt-2 h-20">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={energyTrend}>
                <YAxis domain={energyDomain} hide />
                <Tooltip content={makeTooltip("Specific Energy (kcal/kg)")} />
                <defs>
                  <linearGradient id="energyShadow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2} dot={false} fillOpacity={0.2} />
                <Area type="monotone" dataKey="value" stroke="none" fill="url(#energyShadow)" fillOpacity={1} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
           <div className="average flex items-center" >
            <span className="text-gray-500 text-xs mr-1" >Average:</span> 
            <h6> 698.69</h6>
          </div>
        </Card>
        {/* Availability Trend */}
  <Card className="bg-white shadow-lg rounded-2xl p-4 w-full">
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-sm text-gray-600 font-medium">Availability (%)</h5>
            <span className="text-gray-400 text-xs">T4</span>
          </div>
          <div className="text-4xl font-bold text-gray-900">{availabilityTrend[availabilityTrend.length-1]?.value}</div>
          <CardContent className="p-0 mt-2 h-20">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={availabilityTrend}>
                <YAxis domain={availabilityDomain} hide />
                <Tooltip content={makeTooltip("Availability (%)")} />
                <defs>
                  <linearGradient id="availShadow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2} dot={false} fillOpacity={0.2} />
                <Area type="monotone" dataKey="value" stroke="none" fill="url(#availShadow)" fillOpacity={1} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
           <div className="average flex items-center" >
            <span className="text-gray-500 text-xs mr-1" >Average:</span> 
            <h6>90.67</h6>
          </div>
        </Card>
      </div>
     

      {/* Row 2: Pie Charts */}
<div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
  {/* Left Side (40%) */}
  <div className="xl:col-span-5 flex gap-4">
    <Card className="shadow-md w-1/2 bg-white">
      <CardHeader>
        <CardTitle>Anomalies</CardTitle>
      </CardHeader>
      <CardContent className="h-[250px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={pieData1} dataKey="value" outerRadius={80} label>
              {pieData1.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>

    <Card className="shadow-md w-1/2 bg-white">
      <CardHeader>
        <CardTitle>Downtime</CardTitle>
      </CardHeader>
      <CardContent className="h-[250px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={pieData2} dataKey="value" outerRadius={80} label>
              {pieData2.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </div>

  {/* Right Side (60%) */}
  <div className="xl:col-span-7 flex flex-col gap-4">
    <Card className="shadow-md bg-white">
      <CardHeader>
        <CardTitle>Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="py-2">DateTime</th>
              <th>Region</th>
              <th>Sensor Name</th>
              <th>Sensor ID</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">8/8/2025 17:35</td>
              <td>Rotary Klin</td>
              <td >feed rate tph</td>
              <td>FR-005</td>
              <td className="text-red-600 font-semibold" >Critical</td>
            </tr>
            <tr>
              <td className="py-2">8/8/2025 17:32</td>
              <td>Rotary Klin</td>
              <td >production tph</td>
              <td>PH-112</td>
              <td className="text-red-600 font-semibold" >Critical</td>
            </tr>
            <tr>
              <td className="py-2">8/8/2025 16:00</td>
              <td>Rotary Klin</td>
              <td >O2 pct</td>
              <td>OP-605</td>
              <td className="text-yellow-600 font-semibold" >Warning</td>
            </tr>
           
          </tbody>
        </table>
      </CardContent>
    </Card>
  </div>
</div>


      {/* Row 4: Energy Consumed (Bar Chart) */}
     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4">
  {/* Energy Consumed */}
  <div className="bottom col-span-1 md:col-span-1 xl:col-span-4 flex">
    <Card className="shadow-md bg-white w-full">
      <CardHeader>
        <CardTitle>Energy Consumed</CardTitle>
      </CardHeader>
      <CardContent className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#10b981" radius={[3, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </div>

  {/* Top Contributing Factors */}
  <div className="bottom col-span-1 md:col-span-2 xl:col-span-6 flex">
    <Card className="shadow-md w-full bg-white">
      <CardHeader>
        <CardTitle>Top Contributing Factors</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={factors}
            margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
          >
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fontSize: 12 }}
              width={100}
            />
            <XAxis type="number" hide />
            <Tooltip />
            <Bar
              dataKey="value"
              fill="#088fd1"
              radius={[0, 6, 6, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </div>

  {/* Optimization Status */}
  <div className="bottom col-span-1 md:col-span-1 xl:col-span-2 flex flex-col gap-4 ">
    <div className="optimization w-full flex flex-col gap-4">
      <Card className="bg-white w-full shadow-md flex-1 flex items-center justify-center min-h-[64px] md:min-h-[80px] xl:min-h-[96px]">
        <CardContent className="w-full text-center">
          <h3 className="text-base md:text-lg xl:text-xl font-semibold">Optimization achieved till date</h3>
        </CardContent>
      </Card>
      <Card className="shadow-md bg-white w-full flex-1">
        <CardHeader className="px-4 pt-4 pb-2">
          <CardTitle className="text-base md:text-lg xl:text-xl">Optimization Status</CardTitle>
        </CardHeader>
        <CardContent className="text-sm md:text-base xl:text-lg space-y-2 px-4 pb-4">
          <p>
            Last Run:{" "}
            <span className="font-medium">Aug 28, 2025 10:00 AM</span>
          </p>
          <p>
            Next Run:{" "}
            <span className="font-medium">Aug 30, 2025 10:00 AM</span>
          </p>
          <p>
            Status:{" "}
            <span className="text-green-600 font-semibold">Running</span>
          </p>
        </CardContent>
      </Card>
    </div>
  </div>
  </div>
     
    </div>
  );
}
