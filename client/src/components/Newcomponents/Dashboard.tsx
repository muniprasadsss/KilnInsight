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
import trendsData from "../../../../public/dashboardTrends.json"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";


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
    <div className="p-1 flex flex-col gap-2">
      {/* Row 1: KPIs + Trend */}
      <div className="top-trends flex gap-2 ">
        {/* Production Trend */}
        <Card className="bg-white shadow-lg rounded-xl p-1 w-full">
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-xs text-gray-600 font-medium">Production (tph)</h5>
            <span className="text-gray-400 text-xs">T1</span>
          </div>
          <div className="text-lg font-bold text-gray-900">108.19</div>

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
            <h6> 108.09</h6>
          </div>

        </Card>
        {/* Fuel Flow Trend */}
        <Card className="bg-white shadow-lg rounded-xl p-3 w-full">
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-xs text-gray-600 font-medium">Fuel Flow (kgph)</h5>
            <span className="text-gray-400 text-xs">T2</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{fuelFlowTrend[fuelFlowTrend.length - 1]?.value}</div>
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
            <h6>7024.14</h6>
          </div>
        </Card>
        {/* Specific Energy Trend */}
        <Card className="bg-white shadow-lg rounded-xl p-3 w-full">
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-xs text-gray-600 font-medium">Specific Energy (kcal/kg)</h5>
            <span className="text-gray-400 text-xs">T3</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{energyTrend[energyTrend.length - 1]?.value}</div>
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
            <h6> 698.69</h6>
          </div>
        </Card>
        {/* Availability Trend */}
        <Card className="bg-white shadow-lg rounded-xl p-3 w-full">
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-xs text-gray-600 font-medium">Availability (%)</h5>
            <span className="text-gray-400 text-xs">T4</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{availabilityTrend[availabilityTrend.length - 1]?.value}</div>
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
            <h6>90.67</h6>
          </div>
        </Card>
      </div>

      {/* Row 2: Pie Charts */}
      {/* Row 2: Pie Charts + Efficiency + Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Left Side (40%) */}
        <div className="xl:col-span-5 flex flex-col gap-4">
          <div className="flex gap-4">
            {/* Anomalies */}
            <Card className="shadow-md w-1/2 bg-white">
              <CardHeader className="p-2">
                <CardTitle className="text-sm md:text-sm xl:text-base">Anomalies</CardTitle>
              </CardHeader>
              <CardContent className="h-[190px] flex items-center justify-center">
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

            {/* Downtime */}
            <Card className="shadow-md w-1/2 bg-white">
              <CardHeader className="p-2">
                <CardTitle className="text-sm md:text-sm xl:text-base">Downtime</CardTitle>
              </CardHeader>
              <CardContent className="h-[190px] flex items-center justify-center">
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

          {/* Effectiveness / Efficiency Gauge */}
          {/* Effectiveness / Efficiency Gauge */}
          <Card className="shadow-lg bg-white" style={{ boxShadow: "0 2px 12px 0 #10b981" }}>
            <CardHeader className="p-2">
              <CardTitle className="text-sm md:text-sm xl:text-base">Efficiency</CardTitle>
            </CardHeader>
            <CardContent className="h-[140px] flex items-center justify-between gap-2">
              {/* Left: Radial Chart */}
              <div className="flex-1 flex items-center justify-center min-h-[100px]">
                <ResponsiveContainer width={100} height={100}>
                  <RadialBarChart
                    innerRadius={40}
                    outerRadius={50}
                    data={[{ name: "Efficiency", value: 76, fill: "#10b981" }]}
                    startAngle={180}
                    endAngle={0}
                  >
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar background dataKey="value" />
                    <text
                      x={50}
                      y={60}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-xs font-semibold fill-gray-700"
                    >
                      76%
                    </text>
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>

              {/* Right: KPIs */}
              <div className="flex flex-col gap-1 w-1/3">
                {/* Availability */}
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 flex items-center justify-center rounded-full bg-green-100 text-green-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500">Availability</p>
                    <p className="text-xs font-semibold">92%</p>
                  </div>
                </div>

                {/* Performance */}
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 flex items-center justify-center rounded-full bg-green-100 text-green-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 17v-6h13M9 11L4 6m0 0l5 5m-5-5v12"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500">Performance</p>
                    <p className="text-xs font-semibold">88%</p>
                  </div>
                </div>

                {/* Quality */}
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c.637 0 1.27.098 1.866.29l3.59 1.197a2 2 0 011.305 2.52l-1.164 3.49A6.978 6.978 0 0112 20a6.978 6.978 0 01-5.597-2.503l-1.164-3.49a2 2 0 011.305-2.52l3.59-1.197A6.978 6.978 0 0112 8z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500">Quality</p>
                    <p className="text-xs font-semibold">95%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Side (60%) Alerts Table */}
        <div className="xl:col-span-7 flex flex-col gap-4">
          <Card className="shadow-md bg-white">
            <CardHeader className="p-2 font-medium">
              {/* <CardTitle>Alerts</CardTitle> */}
              Alerts
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
    <Card className="bg-white w-full shadow-md flex-1 flex items-center justify-center min-h-[56px] md:min-h-[64px] xl:min-h-[72px]">
      <CardContent className="w-full text-center p-2">
        <h3 className="text-sm md:text-base xl:text-base font-medium">
          Optimization achieved till date
        </h3>
      </CardContent>
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
