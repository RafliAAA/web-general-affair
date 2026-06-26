import { MoreHorizontal, SquarePen, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import type { Procurement } from "../../../types/procurement"

interface Props {
  procurements: Procurement[];
  onEdit: (procurement: Procurement) => void;
  onDelete: (id: string) => void;
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const ProcurementTable = ({ procurements, onEdit, onDelete }: Props) => {
  const navigate = useNavigate();

  if (procurements.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        Tidak ada data purchase request
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nomor PR</TableHead>
          <TableHead>End user</TableHead>
          <TableHead>PR Date</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Remarks</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {procurements.map((p) => (
          <TableRow
            key={p.procurement_id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => navigate(`/pengadaan/${p.procurement_id}`)}
          >
            <TableCell className="font-medium">{p.pr_number}</TableCell>
            <TableCell>{p.end_user}</TableCell>
            <TableCell>{formatDate(p.pr_date)}</TableCell>
            <TableCell>{formatDate(p.due_date)}</TableCell>
            <TableCell className="max-w-48 truncate text-muted-foreground text-sm">
              {p.remarks || "—"}
            </TableCell>
            <TableCell
              className="text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => navigate(`/pengadaan/${p.procurement_id}`)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Detail
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => onEdit(p)}>
                    <SquarePen className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => onDelete(p.procurement_id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Hapus
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ProcurementTable;
