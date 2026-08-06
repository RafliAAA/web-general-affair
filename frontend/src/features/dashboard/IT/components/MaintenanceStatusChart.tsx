import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
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

const MaintenanceStatusChart = ({ data }: Props) => {
  const chartData = [
    { name: "Menunggu Verifikasi", value: data.menungguVerifikasi, color: "#eab308" },
    { name: "Antrian Dikerjakan", value: data.menungguDikerjakan, color: "#f97316" },
    { name: "Sedang Dikerjakan", value: data.sedangDikerjakan, color: "#3b82f6" },
    { name: "Selesai", value: data.selesai, color: "#22c55e" },
    { name: "Tidak Dapat Diperbaiki", value: data.tidakDapatDiperbaiki, color: "#ef4444" },
  ].filter((item) => item.value > 0);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Distribusi Status Perbaikan</CardTitle>
      </CardHeader>
      <CardContent className="h-75 flex items-center justify-center">
        {chartData.length === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada data maintenance</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
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
                  fontSize: "12px"
                }} 
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                formatter={(value) => <span style={{ color: "#71717a", fontSize: "12px" }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default MaintenanceStatusChart;