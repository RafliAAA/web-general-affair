import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  data: { month: string; count: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-popover p-2 shadow-md">
        <p className="text-xs font-medium text-popover-foreground">
          {label}: <span className="text-blue-600">{payload[0].value}</span> Laporan
        </p>
      </div>
    );
  }
  return null;
};

const MaintenanceTrendChart = ({ data }: Props) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Tren Laporan Kerusakan</CardTitle>
      </CardHeader>
      <CardContent className="h-[280px] pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            
            {/* Gunakan grid horizontal saja dengan warna yang sangat samar */}
            <CartesianGrid 
              horizontal={true} 
              vertical={false} 
              stroke="#f4f4f5" 
            />
            
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "#71717a" }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#71717a" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              width={30}
            />
            
            {/* Gunakan Custom Tooltip yang sudah kita buat */}
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ stroke: "#d4d4d8", strokeWidth: 1, strokeDasharray: "3 3" }}
            />
            
            <Area
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#colorCount)"
              dot={false} // Sembunyikan titik secara default
              activeDot={{ r: 4, fill: "#3b82f6", stroke: "#ffffff", strokeWidth: 2 }} // Munculkan titik saat di-hover
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MaintenanceTrendChart;