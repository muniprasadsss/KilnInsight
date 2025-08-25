"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";

// Dummy chart data
const energyData = [
    696.611, 700.194, 698.95, 695.649, 699.674, 696.254, 694.912, 698.26,
    697.755, 697.042, 698.818, 697.67, 700.404, 696, 697.494, 695.775, 699.42,
    696.397, 693.75, 695.336, 696.898, 698.127, 698.727, 697.01, 699.523,
    697.889, 696.249, 699.092, 697.853, 697.345, 696.105, 698.417, 693.939,
    697.456, 702.627, 699.348, 700.296, 698.212, 696.22, 697.716, 699.112,
    698.501, 699.663, 698.504, 695.408, 695.739, 699.203, 698.535, 701.743,
    697.862, 694.991, 696.597, 696.967, 696.554, 696.4, 700.881,
];

const startHour = 18;
const startMinute = 15;
const numberOfPoints = energyData.length;
const interval = 5; // minutes

const timeLabels: string[] = [];

for (let i = 0; i < numberOfPoints; i++) {
    let totalMinutes = startHour * 60 + startMinute + i * interval;
    let hour = Math.floor(totalMinutes / 60);
    let minute = totalMinutes % 60;
    timeLabels.push(
        `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
    );
}

const chartDataWithTime = energyData.map((val, idx) => ({
    time: timeLabels[idx],
    value: val,
}));

// const chartData = energyData.map((val, index) => ({
//     index,
//     value: val,
// }));

// Chart config

const chartConfig = {
    value: {
        label: "Specific Energy (kcal/kg)",
        color: "#3b82f6",
    },
};

// ✅ Dummy metrics for 17 cards
const metrics = [
    { key: "timestamp", label: "Timestamp", value: "Sep-25 14:40" },
    { key: "preheater_temp_C", label: "Preheater Temp (°C)", value: 850 },
    { key: "kiln_zone_1_temp_C", label: "Kiln Zone 1 Temp (°C)", value: 1150 },
    { key: "kiln_zone_2_temp_C", label: "Kiln Zone 2 Temp (°C)", value: 1200 },
    { key: "kiln_zone_3_temp_C", label: "Kiln Zone 3 Temp (°C)", value: 1250 },
    { key: "kiln_zone_4_temp_C", label: "Kiln Zone 4 Temp (°C)", value: 1280 },
    { key: "kiln_zone_5_temp_C", label: "Kiln Zone 5 Temp (°C)", value: 1300 },
    { key: "clinker_temp_C", label: "Clinker Temp (°C)", value: 1450 },
    { key: "kiln_speed_rpm", label: "Kiln Speed (rpm)", value: 4.2 },
    { key: "feed_rate_tph", label: "Feed Rate (tph)", value: 250 },
    { key: "production_tph", label: "Production (tph)", value: 245 },
    { key: "fuel_flow_kgph", label: "Fuel Flow (kg/h)", value: 7800 },
    { key: "specific_energy_kcal_per_kg", label: "Specific Energy (kcal/kg)", value: 698 },
    { key: "O2_pct", label: "O₂ (%)", value: 3.2 },
    { key: "CO_ppm", label: "CO (ppm)", value: 120 },
    { key: "NOx_ppm", label: "NOx (ppm)", value: 450 },
    { key: "kiln_pressure_mbar", label: "Kiln Pressure (mbar)", value: -2.5 },
    { key: "primary_fan_speed_rpm", label: "Primary Fan Speed (rpm)", value: 1450 },
    { key: "secondary_fan_speed_rpm", label: "Secondary Fan Speed (rpm)", value: 1380 },
    { key: "clinker_CaO_pct", label: "Clinker CaO (%)", value: 65.5 },
    { key: "clinker_SiO2_pct", label: "Clinker SiO₂ (%)", value: 21.8 },
    { key: "burner_valve_position_pct", label: "Burner Valve Position (%)", value: 78 },
    { key: "ESP_inlet_temp_C", label: "ESP Inlet Temp (°C)", value: 280 },
    { key: "draft_fan_vfd_speed_pct", label: "Draft Fan VFD Speed (%)", value: 62 },
    { key: "kiln_torque_kNm", label: "Kiln Torque (kNm)", value: 145 },
    { key: "fuel_type", label: "Fuel Type", value: "Coal" },
];

const Dashboard = () => {
    return (
        <>
            {/* --- Summary Tiles Row --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="bg-white shadow-md rounded-2xl hover:shadow-lg transition-shadow border-0">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-700">
                            No. of Green Sensors
                        </CardTitle>
                        <CheckCircle className="h-5 w-5 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">278.8</div>
                        <p className="text-xs text-gray-500">Operating normally</p>
                    </CardContent>
                </Card>

                <Card className="bg-white shadow-md rounded-2xl hover:shadow-lg transition-shadow border-0">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-700">
                            No. of Amber Sensors
                        </CardTitle>
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-yellow-600">898.5</div>
                        <p className="text-xs text-gray-500">Requires attention</p>
                    </CardContent>
                </Card>

                <Card className="bg-white shadow-md rounded-2xl hover:shadow-lg transition-shadow border-0">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-700">
                            No. of Red Sensors
                        </CardTitle>
                        <XCircle className="h-5 w-5 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-red-600">987.4</div>
                        <p className="text-xs text-gray-500">Immediate action needed</p>
                    </CardContent>
                </Card>
            </div>

            {/* --- Line Chart Section --- */}
            <Card className="bg-white shadow-md rounded-2xl p-0 border-0 mb-8">
                <CardHeader>
                    <CardTitle className="text-lg font-medium text-gray-700">
                        LIVE KPI Trend
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div >
                        <ChartContainer config={chartConfig}>
                            <LineChart data={chartDataWithTime}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="time" />
                                <YAxis />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="var(--color-value)"
                                    strokeWidth={2}
                                    dot={false}
                                />
                                <ChartLegend content={<ChartLegendContent />} />
                            </LineChart>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>

            {/* --- 17 Metric Cards Section --- */}
            <div className="mb-6">
                {/* Section Heading */}
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                    Live Parameter Trends
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {metrics.map((m) => (
                        <Card
                            key={m.key}
                            className="bg-white shadow-sm rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
                        >
                            <CardHeader className="pb-1">
                                <CardTitle className="text-xs font-medium text-gray-600">
                                    {m.label}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="text-lg font-semibold text-[#2563eb]">{m.value}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

        </>
    );
};

export default Dashboard;
