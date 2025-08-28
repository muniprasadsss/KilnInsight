import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { DatePicker } from '../ui/DatePicker';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';

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

const Optimisation: React.FC = () => {

    const kpiData: KPIData = {
        KPI: "specific energy (kcal/kg)",
        before: 705,
        after: 690,
        percentage: 2.127659574,
    };

    const manipulatedData: ManipulatedData[] = [
        { variable: "fuel flow (kgph)", actual: 6950, optimized: 6800, percentage: 2.16 },
        { variable: "primary fan speed (rpm)", actual: 1460, optimized: 1440, percentage: 1.37 },
        { variable: "secondary fan speed (rpm)", actual: 978, optimized: 965, percentage: 1.33 },
        { variable: "draft fan vfd speed (pct)", actual: 71.5, optimized: 70, percentage: 2.1 },
        { variable: "feed rate (tph)", actual: 116, optimized: 118, percentage: -1.72 },
        { variable: "kiln speed (rpm)", actual: 2.01, optimized: 2.05, percentage: -1.99 },
    ];

    const formatPercentage = (val: number) => (
        <span style={{ color: val >= 0 ? "green" : "red", fontWeight: 600 }}>
            {val.toFixed(2)}%
        </span>
    );

    const data = [
        { time: "17:18", actual: 696.611, optimised: 689.826 },
        { time: "17:19", actual: 700.194, optimised: 692.409 },
        { time: "17:20", actual: 698.95, optimised: 692.165 },
        { time: "17:21", actual: 695.649, optimised: 690 },
        { time: "17:22", actual: 699.674, optimised: 699.674 },
        { time: "17:23", actual: 696.254, optimised: 696.254 },
        { time: "17:24", actual: 694.912, optimised: 694.912 },
        { time: "17:25", actual: 698.26, optimised: 689.475 },
        { time: "17:26", actual: 697.755, optimised: 691.97 },
        { time: "17:27", actual: 697.042, optimised: 690.257 },
        { time: "17:28", actual: 698.818, optimised: 690.033 },
        { time: "17:29", actual: 697.67, optimised: 697.67 },
        { time: "17:30", actual: 700.404, optimised: 700.404 },
        { time: "17:31", actual: 696, optimised: 696 },
        { time: "17:32", actual: 697.494, optimised: 688.709 },
        { time: "17:33", actual: 695.775, optimised: 686.99 },
        { time: "17:34", actual: 699.42, optimised: 691.635 },
        { time: "17:35", actual: 696.397, optimised: 690.612 },
        { time: "17:36", actual: 693.75, optimised: 684.965 },
        { time: "17:37", actual: 695.336, optimised: 686.551 },
        { time: "17:38", actual: 696.898, optimised: 689.113 },
        { time: "17:39", actual: 698.127, optimised: 690.342 },
        { time: "17:40", actual: 698.727, optimised: 691.942 },
        { time: "17:41", actual: 697.01, optimised: 691.225 },
        { time: "17:42", actual: 699.523, optimised: 692.738 },
        { time: "17:43", actual: 697.889, optimised: 691.104 },
        { time: "17:44", actual: 696.249, optimised: 690.464 },
        { time: "17:45", actual: 699.092, optimised: 694.307 },
        { time: "17:46", actual: 697.853, optimised: 689.068 },
        { time: "17:47", actual: 697.345, optimised: 690.56 },
        { time: "17:48", actual: 696.105, optimised: 688.32 },
        { time: "17:49", actual: 698.417, optimised: 690.632 },
        { time: "17:50", actual: 693.939, optimised: 689.154 },
        { time: "17:51", actual: 697.456, optimised: 688.671 },
        { time: "17:52", actual: 702.627, optimised: 694.842 },
        { time: "17:53", actual: 699.348, optimised: 690.563 },
        { time: "17:54", actual: 700.296, optimised: 693.511 },
        { time: "17:55", actual: 698.212, optimised: 691.427 },
        { time: "17:56", actual: 696.22, optimised: 691.435 },
        { time: "17:57", actual: 697.716, optimised: 690.931 },
        { time: "17:58", actual: 699.112, optimised: 694.327 },
        { time: "17:59", actual: 698.501, optimised: 693.716 },
        { time: "18:00", actual: 699.663, optimised: 690.878 },
        { time: "18:01", actual: 698.504, optimised: 690.719 },
        { time: "18:02", actual: 695.408, optimised: 688.623 },
        { time: "18:03", actual: 695.739, optimised: 689.954 },
        { time: "18:04", actual: 699.203, optimised: 692.418 },
        { time: "18:05", actual: 698.535, optimised: 698.535 },
        { time: "18:06", actual: 701.743, optimised: 701.743 },
        { time: "18:07", actual: 697.862, optimised: 697.862 },
        { time: "18:08", actual: 694.991, optimised: 686.206 },
        { time: "18:09", actual: 696.597, optimised: 689.812 },
        { time: "18:10", actual: 696.967, optimised: 688.182 },
        { time: "18:11", actual: 696.554, optimised: 690.769 },
        { time: "18:12", actual: 696.4, optimised: 688.615 },
        { time: "18:13", actual: 700.881, optimised: 695.096 },
    ];

    // Chart config with colors + labels
    const chartConfig = {
        actual: {
            label: "Actual",
            color: "#eb695b", // Tailwind orange-500
        },
        optimised: {
            label: "Optimised",
            color: "#22c55e", // Tailwind green-500
        },
    }

    return (
        <>
            <div className="p-3 shadow-md mb-6 flex items-center">

                {/* Right side: Buttons + Date Picker */}
                <div className="flex items-center gap-6">
                    <div className="text-gray-600 text-[13px]">
                        Last Data Refreshed: August 6, 2025 at 6 PM
                    </div>
                    <button className="px-3 py-1 border border-gray-300 text-sm hover:bg-gray-100">
                        TODAY
                    </button>
                    <button className="px-3 py-1 border border-gray-300 text-sm hover:bg-gray-100">
                        LAST 7 DAYS
                    </button>
                    <button className="px-3 py-1 border border-gray-300 text-sm hover:bg-gray-100">
                        LAST 1 MONTH
                    </button>

                    {/* Date Picker */}
                    <div className="flex items-center px-3 py-1 text-sm text-gray-600">
                        <DatePicker />
                    </div>

                    {/* Apply button */}
                    <button className="bg-[#088fd1] text-white px-4 py-1 text-sm hover:bg-[#0678a8] hover:shadow-lg">
                        APPLY
                    </button>
                </div>
            </div>

            <div className="bg-white p-2 rounded-lg shadow-md mb-8">
                <h2 className="text-l font-bold text-gray-800 mb-4">
                    Actual vs Optimised Specific Energy
                </h2>

                <ChartContainer config={chartConfig} className="w-full h-[400px]">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" label={{
                            value: "Time", // static X-axis label
                            position: "insideBottom",
                            offset: -15,
                            style: { textAnchor: "middle", fill: "#374151", fontWeight: 500 },
                        }} />
                        <YAxis domain={['dataMin - 5', 'dataMax + 5']}
                        tickFormatter={(value: number) => value.toFixed(1)}
                            label={{
                                value: "Specific Energy (kcal/kg)",
                                angle: -90,
                                offset: 0,   // tweak offset
                                position: "insideLeft",
                                style: { textAnchor: "middle", fill: "#374151", fontWeight: 500 },
                            }} /> {/* adjust for better view */}
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                            type="monotone"
                            dataKey="actual"
                            stroke={chartConfig.actual.color}
                            // dot={{ r: 2 }}
                            dot={{ r: 3, fill: chartConfig.actual.color }}
                            strokeWidth={2}
                        />
                        <Line
                            type="monotone"
                            dataKey="optimised"
                            stroke={chartConfig.optimised.color}
                            // dot={{ r: 2 }}
                            dot={{ r: 3, fill: chartConfig.optimised.color }}
                            strokeWidth={2}
                        />
                        <ChartLegend content={<ChartLegendContent />} wrapperStyle={{ paddingTop: 15 }} />
                    </LineChart>
                </ChartContainer>
            </div>

            <div className='flex gap-2 mb-8'>
                <div className="tables flex-1">
                    {/* KPI Section */}

                    <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto mb-8">
                        {/* KPI Section */}
                        <h2 className="text-l font-bold text-gray-800 mb-4">
                            Optimized Recommendation
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
                        <h2 className="text-l font-bold text-gray-800 mb-4">
                            Recommendation Table
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
                </div>
                <div className="btn flex gap-2 mb-8 flex-col">
                    <div>
                        {/* <Button className="w-full mt-3  hover:rgb(8, 143, 209)" style={{ backgroundColor: "rgb(8, 143, 209)" }}>
                            RERUN OPTIMIZER
                        </Button> */}
                        <button className="w-full bg-[#088fd1] text-white px-6 py-2 text-sm hover:bg-[#0678a8] hover:shadow-lg">
                            APPLY
                        </button>
                    </div>
                    <div className=''>
                        {/* <Card className="p-0">
                            <CardHeader className="bg-red-50 p-2">
                                <CardTitle className="text-lg flex items-center gap-2 text-[#333]">
                                    <AlertTriangle className="h-5 w-5 text-red-500" />
                                    ALERTS
                                </CardTitle>
                            </CardHeader>
                            <CardContent className=" bg-white space-y-2 text-sm" style={{borderRadius:'0px !important'}}>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span>Next scheduled run:</span>
                                </div>
                                <div className="text-muted-foreground">August 6, 2025 at 7 PM</div>
                                <div className="flex items-center gap-2 text-red-600">
                                    <AlertTriangle className="h-4 w-4" />
                                    <span>Last scheduled run:</span>
                                </div>
                                <div className="text-muted-foreground">August 6, 2025 at 6 PM</div>
                            </CardContent>
                        </Card> */}
                        <div className="shadow-md mt-4">

                            <div className="p-2" style={{ backgroundColor: "#fff5f5" }}>
                                <h2 className="text-lg flex items-center gap-2 font-semibold" style={{ color: "#333" }}>
                                    <AlertTriangle className="h-5 w-5 text-red-500" />
                                    ALERTS
                                </h2>
                            </div>

                            <div className="p-3 text-sm space-y-2" style={{ backgroundColor: "#fff" }}>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span>Next scheduled run:</span>
                                </div>
                                <div style={{ color: "#6b7280" }}>August 6, 2025 at 7 PM</div>

                                <div className="flex items-center gap-2" style={{ color: "#dc2626" }}>
                                    <AlertTriangle className="h-4 w-4" />
                                    <span>Last scheduled run:</span>
                                </div>
                                <div style={{ color: "#6b7280" }}>August 6, 2025 at 6 PM</div>
                            </div>

                        </div>
                    </div>

                </div>

            </div>
        </>
    )
}

export default Optimisation
