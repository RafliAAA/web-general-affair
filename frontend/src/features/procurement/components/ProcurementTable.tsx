import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Check, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { Procurement } from "../../../types/procurement";

// 🌟 PASTIKAN onApprove ADA DI SINI
interface Props {
  procurements: Procurement[];
  onView?: (id: string) => void;
  onApprove?: (procurement: Procurement) => void;
  onEdit?: (procurement: Procurement) => void;
  onDelete?: (id: string) => void;
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// 🌟 PASTIKAN onApprove DITANGKAP DI PARAMETER INI
const ProcurementTable = ({
  procurements,
  onView,
  onApprove,
  onEdit,
  onDelete,
}: Props) => {
  if (procurements.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        Tidak ada data
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Nomor PR</TableHead>
            <TableHead>End User</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Jatuh Tempo</TableHead>
            {/* <TableHead>Status</TableHead> */}
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {procurements.map((p) => (
            <TableRow key={p.procurement_id}>
              <TableCell className="font-medium">{p.pr_number}</TableCell>
              <TableCell>{p.end_user}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(p.pr_date)}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(p.due_date)}
              </TableCell>
              {/* <TableCell>
                <StatusBadge status={p.status} />
              </TableCell> */}
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onView && (
                      <DropdownMenuItem
                        onClick={() => onView(p.procurement_id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Detail
                      </DropdownMenuItem>
                    )}

                    {/* 🌟 INI BAGIAN APPROVE NYA */}
                    {onApprove && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-green-600 focus:text-green-600"
                          onClick={() => onApprove(p)}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Approve
                        </DropdownMenuItem>
                      </>
                    )}

                    {onEdit && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onEdit(p)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                      </>
                    )}

                    {onDelete && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => onDelete(p.procurement_id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Hapus
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProcurementTable;
