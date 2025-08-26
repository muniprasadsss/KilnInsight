import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine,
    ReferenceArea
} from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import historical_image from '../../../../public/historical_tab_image.jpg'

const metricOptions = [
    { label: "Feed Rate Tph", key: "feed_rate_tph", color: "#17e217", timeToFailure: "18:06" },
    { label: "Production Tph", key: "production_tph", color: "#088FD1", timeToFailure: "18:06" },
    { label: "O2 Pct", key: "o2_pct", color: "#f59e0b", timeToFailure: "18:06" },
];

// Your static dataset
const staticData = [
    { feed_rate_tph: 114.257, production_tph: 108.255, o2_pct: 3.797 },
    { feed_rate_tph: 116.129, production_tph: 108.224, o2_pct: 3.748 },
    { feed_rate_tph: 116.879, production_tph: 105.823, o2_pct: 3.744 },
    { feed_rate_tph: 117.265, production_tph: 108.055, o2_pct: 3.654 },
    { feed_rate_tph: 116.855, production_tph: 107.283, o2_pct: 3.773 },
    { feed_rate_tph: 117.427, production_tph: 107.498, o2_pct: 3.655 },
    { feed_rate_tph: 117.126, production_tph: 110.005, o2_pct: 3.766 },
    { feed_rate_tph: 115.801, production_tph: 107.571, o2_pct: 3.782 },
    { feed_rate_tph: 117.193, production_tph: 108.493, o2_pct: 3.772 },
    { feed_rate_tph: 115.839, production_tph: 107.207, o2_pct: 3.739 },
    { feed_rate_tph: 114.954, production_tph: 106.572, o2_pct: 3.797 },
    { feed_rate_tph: 117.275, production_tph: 108.044, o2_pct: 3.656 },
    { feed_rate_tph: 107.275, production_tph: 106.177, o2_pct: 3.79 },
    { feed_rate_tph: 96.234, production_tph: 107.347, o2_pct: 3.79 },
    { feed_rate_tph: 81.213, production_tph: 99.12, o2_pct: 3.721 },
    { feed_rate_tph: 78.231, production_tph: 95.12, o2_pct: 3.709 },
    { feed_rate_tph: 65.23, production_tph: 87.92, o2_pct: 3.914 },
    { feed_rate_tph: 51.123, production_tph: 70.89, o2_pct: 3.915 },
    { feed_rate_tph: 44.23, production_tph: 67.23, o2_pct: 3.919 },
    { feed_rate_tph: 33.231, production_tph: 67.12, o2_pct: 3.928 },
    { feed_rate_tph: 28.123, production_tph: 65.12, o2_pct: 3.929 },
    { feed_rate_tph: 21.231, production_tph: 64.12, o2_pct: 3.931 },
    { feed_rate_tph: 15.123, production_tph: 56.23, o2_pct: 3.932 },
    { feed_rate_tph: 15.12, production_tph: 51.12, o2_pct: 3.94 },
    { feed_rate_tph: 10.23, production_tph: 46.23, o2_pct: 3.99 },
    { feed_rate_tph: 5.843, production_tph: 40.4, o2_pct: 4.135 },
    { feed_rate_tph: 5.81, production_tph: 32.353, o2_pct: 4.293 },
    { feed_rate_tph: 5.761, production_tph: 32.93, o2_pct: 4.465 },
    { feed_rate_tph: 5.785, production_tph: 32.205, o2_pct: 4.488 },
    { feed_rate_tph: 5.862, production_tph: 32.765, o2_pct: 4.513 },
    { feed_rate_tph: 5.912, production_tph: 32.219, o2_pct: 4.732 },
    { feed_rate_tph: 5.804, production_tph: 32.034, o2_pct: 4.394 },
    { feed_rate_tph: 5.745, production_tph: 32.012, o2_pct: 4.524 },
    { feed_rate_tph: 5.744, production_tph: 31.816, o2_pct: 4.569 },
    { feed_rate_tph: 5.738, production_tph: 31.897, o2_pct: 4.623 },
    { feed_rate_tph: 5.835, production_tph: 32.037, o2_pct: 4.42 },
    { feed_rate_tph: 5.775, production_tph: 32.756, o2_pct: 4.478 },
    { feed_rate_tph: 5.812, production_tph: 32.243, o2_pct: 4.432 },
    { feed_rate_tph: 5.818, production_tph: 32.265, o2_pct: 4.5 },
    { feed_rate_tph: 5.787, production_tph: 32.656, o2_pct: 4.378 },
    { feed_rate_tph: 5.784, production_tph: 32.416, o2_pct: 4.539 },
    { feed_rate_tph: 5.848, production_tph: 32.327, o2_pct: 4.341 },
    { feed_rate_tph: 5.757, production_tph: 32.632, o2_pct: 4.51 },
    { feed_rate_tph: 5.975, production_tph: 32.049, o2_pct: 4.434 },
    { feed_rate_tph: 5.878, production_tph: 32.824, o2_pct: 4.633 },
    { feed_rate_tph: 5.846, production_tph: 31.951, o2_pct: 4.495 },
    { feed_rate_tph: 5.747, production_tph: 32.459, o2_pct: 4.482 },
    { feed_rate_tph: 5.955, production_tph: 32.293, o2_pct: 4.5 },
    { feed_rate_tph: 5.718, production_tph: 32.064, o2_pct: 4.536 },
    { feed_rate_tph: 5.744, production_tph: 32.292, o2_pct: 4.345 },
    { feed_rate_tph: 5.827, production_tph: 32.132, o2_pct: 4.551 },
    { feed_rate_tph: 5.88, production_tph: 32.125, o2_pct: 4.424 },
    { feed_rate_tph: 5.832, production_tph: 32.42, o2_pct: 4.548 },
    { feed_rate_tph: 5.827, production_tph: 31.826, o2_pct: 4.372 },
    { feed_rate_tph: 5.764, production_tph: 32.639, o2_pct: 4.452 },
    { feed_rate_tph: 5.834, production_tph: 32.2, o2_pct: 4.513 },
]

// Dummy data with three metrics
const dummyData = Array.from({ length: 200 }).map((_, i) => ({
    time: new Date().getTime() + i * 60000,
    feed_rate_tph: 50 + Math.random() * 10,
    production_tph: 70 + Math.random() * 10,
    o2_pct: 680 + Math.random() * 20,
    forecasted: i > 120 ? 50 + Math.random() * 10 + (i - 120) * 0.1 : null,
}));

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
    // { key: "fuel_type", label: "Fuel Type", value: "Coal" },
];

const failureData = [
    {
        date: "02/15/2025",
        zoneId: "Z4-201",
        section: "Rotary Kiln – Zone 4",
        failureType: "Thermal Stress",
        rootCause: "Coating collapse (Zone-4 Temp↑, Torque↑, CO↑)",
        downtime: "72h",
        action: "Rebuilt coating and stabilized temperature",
    },
    {
        date: "01/28/2025",
        zoneId: "PH-112",
        section: "Preheater",
        failureType: "Blockage/Overheat",
        rootCause: "Cyclone blockage (Temp↑, Pressure↑, O₂↓)",
        downtime: "60h",
        action: "Cleared cyclone blockage and normalized pressure",
    },
    {
        date: "01/12/2025",
        zoneId: "BF-056",
        section: "Kiln Inlet Fan",
        failureType: "Mechanical/Electrical",
        rootCause: "Primary fan failure (Draft loss, O₂↓, CO↑)",
        downtime: "36h",
        action: "Repaired/replaced fan motor, restored draft",
    },
    {
        date: "12/22/2024",
        zoneId: "B-TR-089",
        section: "Burner",
        failureType: "Trip/Shutdown",
        rootCause: "Fuel cut-off (Fuel=0, Temp↓, O₂↑, CO spike)",
        downtime: "48h",
        action: "Reignited burner and stabilized feed-fuel ratio",
    },
    {
        date: "12/05/2024",
        zoneId: "CL-077",
        section: "Cooler/ESP",
        failureType: "Overheat",
        rootCause: "ESP overheating (ESP Temp↑, CO↑)",
        downtime: "54h",
        action: "Reduced load, cooled ESP, restored flow",
    },
    {
        date: "11/16/2024",
        zoneId: "NOx-401",
        section: "Emission Stack",
        failureType: "Sensor Failure",
        rootCause: "NOx sensor stuck at constant value",
        downtime: "20h",
        action: "Replaced NOx sensor and recalibrated",
    },
    {
        date: "10/29/2024",
        zoneId: "O₂-315",
        section: "Kiln Exit Gas",
        failureType: "Sensor Drift",
        rootCause: "Gradual O₂ reading bias",
        downtime: "30h",
        action: "Recalibrated O₂ sensor and validated readings",
    },
    {
        date: "10/10/2024",
        zoneId: "RM-083",
        section: "Preheater Feed",
        failureType: "Feed Stop",
        rootCause: "Raw meal feed interruption (Feed=0, O₂↑)",
        downtime: "42h",
        action: "Restarted feed system, resumed raw meal flow",
    },
];

const Anomalydetection = () => {
    const [selectedMetric, setSelectedMetric] = useState(metricOptions[0]);

    const [dataSlider] = useState(0);

    const WINDOW = 150;
    const visibleData = dummyData.slice(dataSlider, dataSlider + WINDOW);

    const anomalyInView =
        anomalyIndex >= dataSlider && anomalyIndex < dataSlider + WINDOW;

    const chartConfig: ChartConfig = {
        [selectedMetric.key]: { label: selectedMetric.label, color: selectedMetric.color },
        forecasted: { label: "Forecasted", color: "#f59e0b" },
        anomaly: { label: "Anomaly", color: "#dc2626" },
    };

    // for showing only forecasted line after anomaly 

    const dataWithMaskedMetric = visibleData.map(d => {
        if (new Date(d.time) > new Date(anomalyTs)) {
            return { ...d, [selectedMetric.key]: null }; // remove metric after anomaly
        }
        return d;
    });
    return (
        <>
            <Tabs defaultValue="live" className="w-full">
                {/* Make it grid with 12 cols, each tab takes col-span-6 */}
                <TabsList className="grid grid-cols-12 gap-2 w-full mx-auto shadow-md">
                    <TabsTrigger value="live" className="col-span-6 w-full">
                        Live
                    </TabsTrigger>
                    <TabsTrigger value="historical" className="col-span-6 w-full">
                        Historical
                    </TabsTrigger>
                </TabsList>

                {/* Live content */}
                <TabsContent value="live" className="mt-4">

                    <h5 className="text-l font-bold text-gray-800 mb-4">Live Parameter</h5>

                    <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
                        {metrics.map((metric, idx) => {
                            let textColor = "text-green-600"; // default green

                            if (metric.key === "feed_rate_tph" || metric.key === "production_tph") {
                                textColor = "text-red-600";
                            } else if (metric.key === "O2_pct") {
                                textColor = "text-orange-500";
                            }

                            return (
                                <Card
                                    key={idx}
                                    className="bg-white shadow-md rounded-2xl hover:shadow-lg transition-shadow border border-gray-200"
                                >
                                    <CardHeader className="flex flex-row items-center justify-between pb-2 p-2">
                                        <CardTitle className="text-sm font-medium text-gray-700">
                                            {metric.label}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-2">
                                        <div className={`text-md font-bold ${textColor}`}>
                                            {metric.value}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md max-w-5xl mx-auto mb-8">
                        {/* Header */}
                        <h2 className="text-l font-bold text-gray-800 mb-4">
                            Table Failure Prediction
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
                        <CardHeader className="flex mb-4">
                            <h5 className="text-l font-bold text-gray-800 mb-4">Trend of the anomaly sensor</h5>
                            <div className="flex items-center">
                                <CardTitle className="text-lg font-medium text-gray-700 mr-2">
                                Select sensor to show trend :
                                </CardTitle>
                                <Select
                                    value={selectedMetric.key}
                                    onValueChange={(value) =>
                                        setSelectedMetric(metricOptions.find((m) => m.key === value)!)
                                    }
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select a metric" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {metricOptions.map((metric) => (
                                            <SelectItem key={metric.key} value={metric.key}>
                                                {metric.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                        </CardHeader>
                        <CardContent>
                            <div className="w-full h-[450px]">
                                <ChartContainer config={chartConfig}>
                                    <ResponsiveContainer width="100%" height="100%">

                                        <LineChart data={dataWithMaskedMetric} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
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
                                            <YAxis stroke="#6b7280" width={50} />

                                            <ChartTooltip content={<ChartTooltipContent />} />

                                            {/* Selected metric (stops at anomaly) */}
                                            <Line
                                                type="monotone"
                                                dataKey={selectedMetric.key}
                                                stroke={selectedMetric.color}
                                                strokeWidth={2}
                                                dot={false}
                                                isAnimationActive={false}
                                                connectNulls={false} // important: don’t connect over null
                                            />

                                            {/* Forecast (keeps going) */}
                                            <Line
                                                type="monotone"
                                                dataKey="forecasted"
                                                stroke="#f59e0b"
                                                strokeWidth={2}
                                                strokeDasharray="5 5"
                                                dot={false}
                                                isAnimationActive={false}
                                            />

                                            {/* Anomaly marker */}
                                            {anomalyInView && (
                                                <>
                                                    <ReferenceLine
                                                        x={anomalyTs}
                                                        stroke="#dc2626"
                                                        strokeWidth={3}
                                                        label={{ value: "Anomaly", position: "right", style: { fill: "#dc2626", fontWeight: "bold" } }}
                                                    />
                                                    <ReferenceArea
                                                        x1={anomalyTs}
                                                        x2={visibleData[anomalyIndex + 1]?.time}
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
                                <span className="font-medium">Timestamp:</span> Raw Meal Feed Stop
                            </p>
                        </div>

                        {/* Time until Failure */}
                        <div className="bg-[#fff8f5] p-3 sm:p-4 rounded-lg border border-[#ffe6d5]">
                            <h4 className="font-semibold text-[#ad4e00] mb-2 text-sm sm:text-base">
                                Time until Failure
                            </h4>
                            <p className="text-xs sm:text-sm text-[#ad4e00] font-medium">
                                {selectedMetric.timeToFailure}
                            </p>
                        </div>

                        {/* Recommendation */}
                        <div className="bg-[#f5f9ff] p-3 sm:p-4 rounded-lg border border-[#cfe2ff]">
                            <h4 className="font-semibold text-[#084298] mb-2 text-sm sm:text-base">
                                Recommendation
                            </h4>
                            <small className="text-xs sm:text-sm text-[#084298]">
                                Stabilize O₂ Control, Inspect and restore raw meal feed and Adjust combustion air.
                            </small>
                        </div>
                    </div>

                </TabsContent>

                {/* Historical content */}
                <TabsContent value="historical" className="mt-4" >
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12 flex justify-center">
                            <img src={historical_image} alt="historical_image"
                            className="rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"/>
                        </div>

                        <div className="col-span-12">
                            <Table>
                                {/* Table Head */}
                                <TableHeader>
                                    <TableRow className="bg-[#088fd1] text-white">
                                        <TableHead className="text-white">Date</TableHead>
                                        <TableHead className="text-white">Zone ID</TableHead>
                                        <TableHead className="text-white">Section</TableHead>
                                        <TableHead className="text-white">Failure Type</TableHead>
                                        <TableHead className="text-white">Root Cause</TableHead>
                                        <TableHead className="text-white">Downtime</TableHead>
                                        <TableHead className="text-white">Action Taken</TableHead>
                                    </TableRow>
                                </TableHeader>

                                {/* Table Body */}
                                <TableBody>
                                    {failureData.map((row, index) => (
                                        <TableRow key={index} className="text-[#333] text-sm">
                                            <TableCell>{row.date}</TableCell>
                                            <TableCell>{row.zoneId}</TableCell>
                                            <TableCell>{row.section}</TableCell>
                                            <TableCell>{row.failureType}</TableCell>
                                            <TableCell>{row.rootCause}</TableCell>
                                            <TableCell>
                                                 <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                                                    {row.downtime}
                                                </span>
                                            </TableCell>
                                            <TableCell>{row.action}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                </TabsContent>
            </Tabs>
        </>
    );
};

export default Anomalydetection;
