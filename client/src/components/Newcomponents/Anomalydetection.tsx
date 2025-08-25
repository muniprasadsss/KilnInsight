import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
    ReferenceLine, ReferenceArea
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

interface KPIData {
    KPI: string;
    before: number;
    after: number;
    percentage: number;
}

interface ManipulatedData {
    variable: string;
    actual: number;
    optimized: number;
    percentage: number;
}

// Dummy data shaped like screenshot
const dummyData = Array.from({ length: 200 }).map((_, i) => {
    const base = 45 + i * 0.1;
    return {
        time: new Date().getTime() + i * 60000,
        actual: base + (Math.random() * 2 - 1),
        predicted: base + (Math.random() * 2 - 1),
        difference: Math.max(0, Math.random() * (i > 120 ? (i - 120) / 5 : 2)),
        forecasted: i > 120 ? base + (i - 120) * 0.15 : null,
    };
});

// mark anomaly start
const anomalyIndex = 120;
const anomalyTs = dummyData[anomalyIndex]?.time;

const sensorData = [
    {
        name: "Feed Rate Tph",
        max: 127.16,
        min: 81.12,
        current: 51.12,
        risk: 90,
        time: "33 mins",
        priority: "Critical",
    },
    {
        name: "Production Tph",
        max: 112.5,
        min: 95,
        current: 70.89,
        risk: 86,
        time: "41 mins",
        priority: "Critical",
    },
    {
        name: "O2 Pct",
        max: 3.9,
        min: 3.1,
        current: 3.92,
        risk: 75,
        time: "91 mins",
        priority: "Warning",
    },
];

const sensorMetrics = [
    {
        label: "Green Sensors",
        value: 278.8,
        description: "Operating normally",
        icon: <CheckCircle className="h-5 w-5 text-green-600" />,
        color: "green-600",
    },
    {
        label: "Amber Sensors",
        value: 898.5,
        description: "Requires attention",
        icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
        color: "yellow-600",
    },
    {
        label: "Red Sensors",
        value: 987.4,
        description: "Immediate action needed",
        icon: <XCircle className="h-5 w-5 text-red-600" />,
        color: "red-600",
    },
];

const Anomalydetection = () => {
    const [dataSlider] = useState(0);

    const WINDOW = 150;
    const visibleData = dummyData.slice(dataSlider, dataSlider + WINDOW);

    const anomalyInView =
        anomalyIndex >= dataSlider && anomalyIndex < dataSlider + WINDOW;

    const formatted = new Date(anomalyTs).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });

    const kpiData: KPIData = {
        KPI: "specific energy kcal per kg",
        before: 705,
        after: 690,
        percentage: 2.127659574,
    };

    const manipulatedData: ManipulatedData[] = [
        { variable: "fuel flow kgph", actual: 6950, optimized: 6800, percentage: 2.16 },
        { variable: "primary fan speed rpm", actual: 1460, optimized: 1440, percentage: 1.37 },
        { variable: "secondary fan speed rpm", actual: 978, optimized: 965, percentage: 1.33 },
        { variable: "draft fan vfd speed pct", actual: 71.5, optimized: 70, percentage: 2.1 },
        { variable: "feed rate tph", actual: 116, optimized: 118, percentage: -1.72 },
        { variable: "kiln speed rpm", actual: 2.01, optimized: 2.05, percentage: -1.99 },
    ];

    const formatPercentage = (val: number) => (
        <span style={{ color: val >= 0 ? "green" : "red", fontWeight: 600 }}>
            {val.toFixed(2)}%
        </span>
    );

    return (
        <>
            {/* --- Status Cards --- */}
            <h5 className="mb-4">Live Parameters with RAG</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {sensorMetrics.map((metric, idx) => (
                    <Card
                        key={idx}
                        className="bg-white shadow-md rounded-2xl hover:shadow-lg transition-shadow border-0"
                    >
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-700">
                                {metric.label}
                            </CardTitle>
                            {metric.icon}
                        </CardHeader>
                        <CardContent>
                            <div className={`text-3xl font-bold text-${metric.color}`}>
                                {metric.value}
                            </div>
                            <p className="text-xs text-gray-500">{metric.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md max-w-5xl mx-auto mb-8">
                {/* Header */}
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Table
                </h2>

                <Table>
                    <TableHeader>
                        <TableRow className="bg-[#088fd1] text-white font-semibold text-sm">
                            <TableHead className="text-white">Sensor Name</TableHead>
                            <TableHead className="text-white">Max</TableHead>
                            <TableHead className="text-white">Min</TableHead>
                            <TableHead className="text-white">Current</TableHead>
                            <TableHead className="text-white">Risk Score</TableHead>
                            <TableHead className="text-white">Time Until Failure</TableHead>
                            <TableHead className="text-white">Priority</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {sensorData.map((sensor, idx) => (
                            <TableRow key={idx} className="text-sm">
                                {/* Sensor */}
                                <TableCell className="font-medium text-gray-800">
                                    {sensor.name}
                                </TableCell>

                                {/* Max */}
                                <TableCell className="text-gray-700">{sensor.max}</TableCell>

                                {/* Min */}
                                <TableCell className="text-gray-700">{sensor.min}</TableCell>

                                {/* Current */}
                                <TableCell className="text-gray-700">{sensor.current}</TableCell>

                                {/* Risk with progress bar */}
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-700">{sensor.risk}%</span>
                                        <div className="w-24 bg-gray-200 rounded-full h-2 overflow-hidden">
                                            <div
                                                className="bg-sky-500 h-2"
                                                style={{ width: `${sensor.risk}%` }}
                                            />
                                        </div>
                                    </div>
                                </TableCell>

                                {/* Time Until Failure */}
                                <TableCell className="text-red-600 font-medium">
                                    {sensor.time}
                                </TableCell>

                                {/* Priority Badge */}
                                <TableCell>
                                    {sensor.priority === "Critical" ? (
                                        <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                                            Critical
                                        </span>
                                    ) : sensor.priority === "Warning" ? (
                                        <span className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-full">
                                            Warning
                                        </span>
                                    ) : (
                                        <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                                            Normal
                                        </span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* --- Chart Card --- */}
            <Card className="bg-white shadow-md rounded-2xl p-4 border-0 mb-6">
                <CardHeader>
                    <CardTitle className="text-lg font-medium text-gray-700">
                        Trend of the anomaly sensor
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="w-full h-[450px]">
                        <ChartContainer
                            config={{
                                actual: { label: "Actual", color: "#17e217" },
                                predicted: { label: "Predicted", color: "#088FD1" },
                                difference: { label: "Residual", color: "#fbbf24" },
                                forecasted: { label: "Forecasted", color: "#f59e0b" },
                            }}
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={visibleData}
                                    margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis
                                        dataKey="time"
                                        tickFormatter={(value) =>
                                            new Date(value).toLocaleTimeString("en-GB", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: false,
                                            })
                                        }
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                        tick={{ fontSize: 9, dy: 8, fill: "#374151" }}
                                    />
                                    <YAxis
                                        domain={[0, 90]}
                                        stroke="#6b7280"
                                        width={50}
                                        ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90]}
                                        label={{
                                            value: "ΔP Fuel Gas Side",
                                            angle: -90,
                                            position: "insideLeft",
                                        }}
                                    />
                                    <ChartTooltip content={<ChartTooltipContent />} />

                                    {/* Lines */}
                                    <Line
                                        type="monotone"
                                        dataKey="actual"
                                        stroke="#17e217"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="predicted"
                                        stroke="#088FD1"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="difference"
                                        stroke="#fbbf24"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="forecasted"
                                        stroke="#f59e0b"
                                        strokeWidth={2}
                                        strokeDasharray="5 5"
                                        dot={false}
                                    />

                                    {/* Red anomaly vertical line */}
                                    {anomalyInView && (
                                        <>
                                            <ReferenceLine
                                                x={anomalyTs}
                                                stroke="#dc2626"
                                                strokeWidth={3}
                                                label={{
                                                    value: "Anomaly",
                                                    position: "right",
                                                    style: { fill: "#dc2626", fontWeight: "bold" },
                                                }}
                                            />
                                            <ReferenceArea
                                                x1={anomalyTs}
                                                x2={dummyData[anomalyIndex + 1]?.time}
                                                fill="#dc2626"
                                                fillOpacity={0.1}
                                            />
                                        </>
                                    )}
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>

            {/* --- Info Panel - Bottom --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {/* Anomaly Detected */}
                <div className="bg-[#fff5f5] p-3 sm:p-4 rounded-lg border border-[#f8d7da]">
                    <h4 className="font-semibold text-[#842029] mb-2 text-sm sm:text-base">
                        Failure type
                    </h4>
                    <p className="text-xs sm:text-sm text-[#842029]">
                        <span className="font-medium">Timestamp:</span> {formatted}
                    </p>
                </div>

                {/* Time until Failure */}
                <div className="bg-[#fff8f5] p-3 sm:p-4 rounded-lg border border-[#ffe6d5]">
                    <h4 className="font-semibold text-[#ad4e00] mb-2 text-sm sm:text-base">
                        Time until Failure
                    </h4>
                    <p className="text-xs sm:text-sm text-[#ad4e00] font-medium">
                        2 days
                    </p>
                </div>

                {/* Recommendation */}
                <div className="bg-[#f5f9ff] p-3 sm:p-4 rounded-lg border border-[#cfe2ff]">
                    <h4 className="font-semibold text-[#084298] mb-2 text-sm sm:text-base">
                        Recommendation
                    </h4>
                    <small className="text-xs sm:text-sm text-[#084298]">
                        Based on current ΔP increase rate schedule soot-blowing immediately
                        for optimal efficiency
                    </small>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto mb-8">
                {/* KPI Section */}
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Optimize All Recommendation
                </h2>

                {/* KPI Table */}
                <Table>
                    <TableHeader>
                        <TableRow className="bg-[#088fd1] text-white">
                            <TableHead className="text-white">KPI</TableHead>
                            <TableHead className="text-white">Before Optimization</TableHead>
                            <TableHead className="text-white">After Optimization</TableHead>
                            <TableHead className="text-white">Optimization %</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-medium text-gray-800">
                                {kpiData.KPI}
                            </TableCell>
                            <TableCell className="text-gray-700">{kpiData.before}</TableCell>
                            <TableCell className="text-gray-700">{kpiData.after}</TableCell>
                            <TableCell className="text-green-600 font-semibold">
                                {formatPercentage(kpiData.percentage)}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>

            {/* Manipulated Variables Section */}
            <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Manipulated parameters Optimization
                </h2>

                <Table>
                    {/* Header */}
                    <TableHeader>
                        <TableRow className="bg-[#088fd1] text-white font-semibold text-sm">
                            <TableHead className="text-white">Manipulated Variable</TableHead>
                            <TableHead className="text-white">Actual Value</TableHead>
                            <TableHead className="text-white">Optimized Value</TableHead>
                            <TableHead className="text-white">Optimized %</TableHead>
                        </TableRow>
                    </TableHeader>

                    {/* Body */}
                    <TableBody>
                        {manipulatedData.map((row, index) => (
                            <TableRow key={index} className="text-sm">
                                <TableCell className="font-medium text-gray-800">
                                    {row.variable}
                                </TableCell>
                                <TableCell className="text-gray-700">{row.actual}</TableCell>
                                <TableCell className="text-gray-700">{row.optimized}</TableCell>
                                <TableCell
                                    className={`font-semibold ${row.percentage > 0 ? "text-green-600" : "text-red-600"
                                        }`}
                                >
                                    {formatPercentage(row.percentage)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
};

export default Anomalydetection;
