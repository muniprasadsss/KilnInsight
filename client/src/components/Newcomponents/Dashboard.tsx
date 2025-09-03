import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PolarAngleAxis, RadialBar, RadialBarChart, TooltipProps } from "recharts";
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
import { CheckCircle, AlertTriangle, XCircle, Clock, Circle } from "lucide-react";
import trendsData from "../../../../public/dashboardTrends.json"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";


const pieData1 = [
  { name: "Critical", value: 3 },
  { name: "Warning", value: 7 },
];

const pieData2 = [
  { name: "Planned", value: 8 },
  { name: "Unplanned", value: 2 },
];

const COLORS = ["#2198cfff", "#e75787ff"];

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
    <div className="p-1 flex flex-col gap-2">
      {/* Row 1: KPIs + Trend */}
      <div className="top-trends flex gap-2 ">
        {/* Production Trend */}
        <Card className="bg-white shadow-lg rounded-xl p-3 w-full" style={{height:"9rem"}}>
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-xs text-gray-600 font-medium">Production (tph)</h5>
            <Circle className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-blue-600">108.19</div>

          <CardContent className="p-0 mt-2 h-8">
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
            <p className= "text-xs"> 108.09</p>
          </div>

        </Card>
        {/* Fuel Flow Trend */}
        <Card className="bg-white shadow-lg rounded-xl p-3 w-full" style={{height:"9rem"}}>
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-xs text-gray-600 font-medium">Fuel Flow (kgph)</h5>
             <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          <div className="text-xl font-bold text-green-600">{fuelFlowTrend[fuelFlowTrend.length - 1]?.value}</div>
          <CardContent className="p-0 mt-2 h-8">
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
            <p className= "text-xs">7024.14</p>
          </div>
        </Card>
        {/* Specific Energy Trend */}
        <Card className="bg-white shadow-lg rounded-xl p-3 w-full" style={{height:"9rem"}}>
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-xs text-gray-600 font-medium">Specific Energy (kcal/kg)</h5>
           <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </div>
          <div className="text-xl font-bold text-yellow-500">{energyTrend[energyTrend.length - 1]?.value}</div>
          <CardContent className="p-0 mt-2 h-8">
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
            <p className= "text-xs"> 698.69</p>
          </div>
        </Card>
        {/* Availability Trend */}
        <Card className="bg-white shadow-lg rounded-xl p-3 w-full" style={{height:"9rem"}}>
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-xs text-gray-600 font-medium">Availability (%)</h5>
             <XCircle className="h-4 w-4 text-red-600" />
          </div>
          <div className="text-xl font-bold text-orange-600">{availabilityTrend[availabilityTrend.length - 1]?.value}</div>
          <CardContent className="p-0 mt-2 h-8">
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
            <p className= "text-xs">90.67</p>
          </div>
        </Card>
      </div>

      <div className=" flex flex-col gap-4">
          <Card className="shadow-md bg-white">
            <CardHeader className="p-2 font-large text-gray-800">
              <CardTitle> Alerts <span className="text-red-600">!</span></CardTitle>
              {/* Alerts */}
            </CardHeader>
            <CardContent>
              <Table>
                {/* Header */}
                <TableHeader>
                  <TableRow className="bg-[#088fd1] text-white font-semibold text-sm">
                    <TableHead className="text-white">DateTime</TableHead>
                    <TableHead className="text-white">Region</TableHead>
                    <TableHead className="text-white">Sensor Name</TableHead>
                    <TableHead className="text-white">Sensor ID</TableHead>
                    <TableHead className="text-white">Status</TableHead>
                  </TableRow>
                </TableHeader>

                {/* Body */}
                <TableBody>
                  <TableRow className="text-sm">
                    <TableCell className="font-medium text-gray-800">8/8/2025 17:35</TableCell>
                    <TableCell className="text-gray-700">Rotary Klin</TableCell>
                    <TableCell className="text-gray-700">feed rate tph</TableCell>
                    <TableCell className="text-gray-700">FR-005</TableCell>
                    <TableCell className="font-semibold text-red-600">Critical</TableCell>
                  </TableRow>

                  <TableRow className="text-sm">
                    <TableCell className="font-medium text-gray-800">8/8/2025 17:32</TableCell>
                    <TableCell className="text-gray-700">Rotary Klin</TableCell>
                    <TableCell className="text-gray-700">production tph</TableCell>
                    <TableCell className="text-gray-700">PH-112</TableCell>
                    <TableCell className="font-semibold text-red-600">Critical</TableCell>
                  </TableRow>

                  <TableRow className="text-sm">
                    <TableCell className="font-medium text-gray-800">8/8/2025 16:00</TableCell>
                    <TableCell className="text-gray-700">Rotary Klin</TableCell>
                    <TableCell className="text-gray-700">O2 pct</TableCell>
                    <TableCell className="text-gray-700">OP-605</TableCell>
                    <TableCell className="font-semibold text-yellow-600">Warning</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

      {/* Row 2: Pie Charts */}
      {/* Row 2: Pie Charts + Efficiency + Alerts */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
  {/* Anomalies */}
  <Card className="shadow-md bg-white " style={{height:"10rem"}}>
    <CardHeader className="p-1">
      <CardTitle className="text-xs md:text-sm">Anomalies</CardTitle>
    </CardHeader>
    <CardContent className="h-[108px] flex items-center justify-center p-1">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
         <Pie
  data={pieData1}
  dataKey="value"
  outerRadius={50}
  label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, value }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-[10px] font-semibold"
      >
        {value}
      </text>
    );
  }}
>
  {pieData1.map((_, i) => (
    <Cell key={i} fill={COLORS[i % COLORS.length]} />
  ))}
</Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>

  {/* Downtime */}
  <Card className="shadow-md bg-white" style={{height:"10rem"}}>
    <CardHeader className="p-1">
      <CardTitle className="text-xs md:text-sm">Downtime</CardTitle>
    </CardHeader>
    <CardContent className="h-[108px] flex items-center justify-center p-1">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
  data={pieData2}
  dataKey="value"
  outerRadius={50}
  label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, value }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-[10px] font-semibold"
      >
        {value}
      </text>
    );
  }}
>
  {pieData2.map((_, i) => (
    <Cell key={i} fill={COLORS[i % COLORS.length]} />
  ))}
</Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>

{/* Efficiency */}
{/* Efficiency */}
<Card
  className="shadow-md bg-white"
  style={{ height: "fit-content" }}
>
  <CardHeader className="p-2">
    <CardTitle className="text-sm md:text-base font-semibold">
      OEE
    </CardTitle>
  </CardHeader>

  <CardContent className="h-[120px] flex items-center justify-between px-3 pb-3">
    {/* Radial Chart */}
    <div className="flex-1 flex items-center justify-center">
      <ResponsiveContainer width={120} height={120}>
        <RadialBarChart
          innerRadius="70%"
          outerRadius="100%"
          data={[{ name: "Efficiency", value: 76, fill: "#10b981" }]}
          startAngle={180}
          endAngle={0}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar background dataKey="value" cornerRadius={5} />
          {/* Center Label */}
          <text
            x="50%"
            y="60%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-sm font-bold fill-gray-700"
          >
            76%
          </text>
        </RadialBarChart>
      </ResponsiveContainer>
    </div>

    {/* KPIs */}
    <div className="flex flex-col gap-2 w-1/3">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-green-100 text-green-600">
          <span className="text-[12px]">⏱</span>
        </div>
        <div>
          <p className="text-[10px] text-gray-500">Avail.</p>
          <p className="text-xs font-semibold">92%</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <span className="text-[12px]">📈</span>
        </div>
        <div>
          <p className="text-[10px] text-gray-500">Perf.</p>
          <p className="text-xs font-semibold">88%</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
          <span className="text-[12px]">⭐</span>
        </div>
        <div>
          <p className="text-[10px] text-gray-500">Qual.</p>
          <p className="text-xs font-semibold">95%</p>
        </div>
      </div>
    </div>
  </CardContent>
</Card>



</div>



      {/* Row 4: Energy Consumed (Bar Chart) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-2">
        {/* Energy Consumed */}
        <div className="bottom col-span-1 md:col-span-1 xl:col-span-4 flex">
          <Card className="shadow-md bg-white w-full p-0">
            <CardHeader className="p-2 font-medium">
              {/* <CardTitle ></CardTitle>
               */}
               Energy Consumed
            </CardHeader>
            <CardContent className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[695, 705]} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#4eafdbff" radius={[3, 2, 0, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Contributing Factors */}
        <div className="bottom col-span-1 md:col-span-2 xl:col-span-6 flex">
          <Card className="shadow-md w-full bg-white">
            <CardHeader className="p-2 font-medium">
              {/* <CardTitle></CardTitle> */}
              Top Contributing Factors
            </CardHeader>
            <CardContent className="h-[220px]">
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
      <div className="bottom col-span-1 md:col-span-1 xl:col-span-2 flex flex-col gap-3">
  <div className="optimization w-full flex flex-col gap-3">
    <Card className="bg-white w-full shadow-md flex-1 flex flex-col items-center justify-center min-h-[56px] md:min-h-[64px] xl:min-h-[72px]">
      
      <div className="flex items-center flex-col justify-between mb-2">
            <h5 className="text-xs text-gray-600 font-medium">Optimization achieved</h5>
            
          </div>
          <div className="text-xl font-bold text-blue-600"> 2.43%</div>
    </Card>

    <Card className="shadow-md bg-white w-full flex-1">
      <CardHeader className="px-3 pt-3 pb-1">
        <CardTitle className="text-sm md:text-base xl:text-base font-medium">
          Optimization Status
        </CardTitle>
      </CardHeader>

      <CardContent className="text-xs md:text-sm xl:text-sm space-y-1 px-3 pb-3">
        <p>
          Last Run:{" "}
          <span className="font-normal">Aug 28, 2025 10:00 AM</span>
        </p>
        <p>
          Next Run:{" "}
          <span className="font-normal">Aug 30, 2025 10:00 AM</span>
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
