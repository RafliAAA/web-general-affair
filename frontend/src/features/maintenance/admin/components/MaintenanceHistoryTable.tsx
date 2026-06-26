import MaintenanceStatusBadge from "../../user/components/MaintenanceStatusBadge";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

interface Props {
  history: any[];
  onDetail: (id: string) => void;
}

const MaintenanceHistoryTable = ({ history, onDetail }: Props) => {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">Riwayat Maintenance</p>

      <div className="rounded-lg border bg-card">
        {history.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            Belum ada riwayat maintenance
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama aset</TableHead>
                <TableHead>Dilaporkan oleh</TableHead>
                <TableHead>Tanggal lapor</TableHead>
                <TableHead>Diverifikasi oleh</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {history.map((m) => (
                <TableRow
                  key={m.maintenance_id}
                  className="cursor-pointer"
                  onClick={() => onDetail(m.maintenance_id)}
                >
                  <TableCell className="font-medium">
                    {m.asset.asset_name}
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    {m.reporter.profile?.name}
                  </TableCell>

                  <TableCell>{formatDate(m.createdAt)}</TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    {m.verifier?.profile?.name ?? "—"}
                  </TableCell>

                  <TableCell>
                    <MaintenanceStatusBadge status={m.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default MaintenanceHistoryTable;
