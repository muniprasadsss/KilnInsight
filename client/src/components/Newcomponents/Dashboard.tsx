import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
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
} from "recharts";

// Example mock data
const lineData = [
  { time: "10:00", value: 30 },
  { time: "11:00", value: 45 },
  { time: "12:00", value: 60 },
  { time: "13:00", value: 50 },
  { time: "14:00", value: 80 },
];
const data = [
  { value: 40 },
  { value: 45 },
  { value: 30 },
  { value: 50 },
  { value: 42 },
  { value: 60 },
  { value: 48 },
];

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
  { name: "Kiln A", value: 120 },
  { name: "Kiln B", value: 180 },
  { name: "Kiln C", value: 90 },
  { name: "Kiln D", value: 140 },
];

const factors = [
  { name: "Temperature", value: 80 },
  { name: "Pressure", value: 65 },
  { name: "Speed", value: 50 },
  { name: "Load", value: 30 },
];

export default function Dashboard() {
  return (
    <div className="p-1  flex flex-col gap-6">
      {/* Row 1: KPIs + Trend */}
      <div className="top-trends flex gap-2">
        <Card className="bg-white shadow-md rounded-2xl p-4 w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <h5 className="text-sm text-gray-600 font-medium">
                Total Energy Usage Trend
                </h5>
                <span className="text-gray-400 text-xs">T1</span>
            </div>

            {/* Metric */}
            <div className="text-4xl font-bold text-gray-900">41.8k</div>
            <div className="text-sm text-red-500">-19.1% Compared to Previous Day</div>

            {/* Mini Chart */}
            <CardContent className="p-0 mt-2 h-20">
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <Tooltip content={() => null} />
                    <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    dot={false}
                    fillOpacity={0.2}
                    />
                </LineChart>
                </ResponsiveContainer>
            </CardContent>
            </Card>
        <Card className="bg-white shadow-md rounded-2xl p-4 w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <h5 className="text-sm text-gray-600 font-medium">
                Total Energy Usage Trend
                </h5>
                <span className="text-gray-400 text-xs">T1</span>
            </div>

            {/* Metric */}
            <div className="text-4xl font-bold text-gray-900">41.8k</div>
            <div className="text-sm text-red-500">-19.1% Compared to Previous Day</div>

            {/* Mini Chart */}
            <CardContent className="p-0 mt-2 h-20">
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <Tooltip content={() => null} />
                    <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    dot={false}
                    fillOpacity={0.2}
                    />
                </LineChart>
                </ResponsiveContainer>
            </CardContent>
            </Card>
        <Card className="bg-white shadow-md rounded-2xl p-4 w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <h5 className="text-sm text-gray-600 font-medium">
                Total Energy Usage Trend
                </h5>
                <span className="text-gray-400 text-xs">T1</span>
            </div>

            {/* Metric */}
            <div className="text-4xl font-bold text-gray-900">41.8k</div>
            <div className="text-sm text-red-500">-19.1% Compared to Previous Day</div>

            {/* Mini Chart */}
            <CardContent className="p-0 mt-2 h-20">
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <Tooltip content={() => null} />
                    <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    dot={false}
                    fillOpacity={0.2}
                    />
                </LineChart>
                </ResponsiveContainer>
            </CardContent>
            </Card>
        <Card className="bg-white shadow-md rounded-2xl p-4 w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <h5 className="text-sm text-gray-600 font-medium">
                Total Energy Usage Trend
                </h5>
                <span className="text-gray-400 text-xs">T1</span>
            </div>

            {/* Metric */}
            <div className="text-4xl font-bold text-gray-900">41.8k</div>
            <div className="text-sm text-red-500">-19.1% Compared to Previous Day</div>

            {/* Mini Chart */}
            <CardContent className="p-0 mt-2 h-20">
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <Tooltip content={() => null} />
                    <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    dot={false}
                    fillOpacity={0.2}
                    />
                </LineChart>
                </ResponsiveContainer>
            </CardContent>
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
              <th className="py-2">Region</th>
              <th>Sensor</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">Zone A</td>
              <td>Temp Sensor</td>
              <td className="text-red-600 font-semibold">Critical</td>
              <td><button className="text-blue-600">View</button></td>
            </tr>
            <tr>
              <td className="py-2">Zone B</td>
              <td>Pressure Sensor</td>
              <td className="text-yellow-600 font-semibold">Warning</td>
              <td><button className="text-blue-600">View</button></td>
            </tr>
            <tr>
              <td className="py-2">Zone B</td>
              <td>Pressure Sensor</td>
              <td className="text-yellow-600 font-semibold">Warning</td>
              <td><button className="text-blue-600">View</button></td>
            </tr>
            <tr>
              <td className="py-2">Zone B</td>
              <td>Pressure Sensor</td>
              <td className="text-yellow-600 font-semibold">Warning</td>
              <td><button className="text-blue-600">View</button></td>
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
  <div className="bottom col-span-1 md:col-span-1 xl:col-span-3 flex">
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
            <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
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
  <div className="bottom col-span-1 md:col-span-1 xl:col-span-3 flex">
    <Card className="shadow-md bg-white w-full">
      <CardHeader>
        <CardTitle>Optimization Status</CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
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
  );
}
