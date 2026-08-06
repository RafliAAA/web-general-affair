import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  data: {
    menungguVerifikasi: number;
    menungguDikerjakan: number;
    sedangDikerjakan: number;
    selesai: number;
    tidakDapatDiperbaiki: number;
  };
}

const MaintenanceBarChart = ({ data }: Props) => {
  // Ubah data ke format array untuk Recharts
  const chartData = [
    { name: "Antrian Verif", value: data.menungguVerifikasi, color: "#eab308" },
    { name: "Antrian Kerja", value: data.menungguDikerjakan, color: "#f97316" },
    { name: "Dikerjakan", value: data.sedangDikerjakan, color: "#3b82f6" },
    { name: "Selesai", value: data.selesai, color: "#22c55e" },
    { name: "Gagal", value: data.tidakDapatDiperbaiki, color: "#ef4444" },
  ];

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Perbandingan Jumlah Tiket</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e4e4e7"
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "#71717a" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#71717a" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: "#f4f4f5" }}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e4e4e7",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
              {chartData.map((entry, index) => (
                <Cell key={`bar-cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MaintenanceBarChart;
