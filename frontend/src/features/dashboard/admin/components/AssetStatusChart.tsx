import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  data: {
    tersedia: number;
    dipinjam: number;
    diperbaiki: number;
    diserahkan: number;
    dihapus: number;
  };
}

const COLORS = {
  Tersedia: "#22c55e", // Green
  Dipinjam: "#3b82f6", // Blue
  Diperbaiki: "#f59e0b", // Amber
  Diserahkan: "#8b5cf6", // Violet
  Dihapus: "#ef4444", // Red
};

const AssetStatusChart = ({ data }: Props) => {
  // Ubah data dari API menjadi format array untuk Recharts
  const chartData = [
    { name: "Tersedia", value: data.tersedia, color: COLORS.Tersedia },
    { name: "Dipinjam", value: data.dipinjam, color: COLORS.Dipinjam },
    { name: "Diperbaiki", value: data.diperbaiki, color: COLORS.Diperbaiki },
    { name: "Diserahkan", value: data.diserahkan, color: COLORS.Diserahkan },
    { name: "Dihapus", value: data.dihapus, color: COLORS.Dihapus },
  ].filter((item) => item.value > 0); // Hanya tampilkan yang nilainya > 0

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Distribusi Status Aset</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] flex items-center justify-center">
        {chartData.length === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada data aset</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60} // Ini yang bikin bentuknya donut
                outerRadius={90}
                paddingAngle={3}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e4e4e7",
                  fontSize: "12px",
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                formatter={(value) => (
                  <span style={{ color: "#71717a", fontSize: "12px" }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default AssetStatusChart;
