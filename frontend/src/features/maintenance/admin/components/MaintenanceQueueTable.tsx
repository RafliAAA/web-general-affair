import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  queue: any[];
  onVerify: (id: string) => void;
}

const MaintenanceQueueTable = ({ queue, onVerify }: Props) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">Antrian Verifikasi</p>

        {queue.length > 0 && (
          <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">
            {queue.length}
          </span>
        )}
      </div>

      <div className="rounded-lg border bg-card">
        {queue.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            Tidak ada antrian verifikasi
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama aset</TableHead>
                <TableHead>Dilaporkan oleh</TableHead>
                <TableHead>Tanggal lapor</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>

            <TableBody>
              {queue.map((m) => (
                <TableRow key={m.maintenance_id}>
                  <TableCell className="font-medium">
                    {m.asset.asset_name}
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    {m.reporter.profile?.name}
                  </TableCell>

                  <TableCell>{formatDate(m.createdAt)}</TableCell>

                  <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                    {m.description}
                  </TableCell>

                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-green-600 hover:text-green-700 border-green-200 hover:border-green-300"
                      onClick={() => onVerify(m.maintenance_id)}
                    >
                      <CheckCircle className="h-3.5 w-3.5 mr-1" />
                      Verifikasi
                    </Button>
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

export default MaintenanceQueueTable;
