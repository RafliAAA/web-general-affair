import { MoreHorizontal, Trash2, Eye } from "lucide-react";
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
import type { Disposal } from "../services/disposalService";

interface Props {
  disposals: Disposal[];
  onDelete: (id: string) => void;
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const DisposalTable = ({ disposals, onDelete }: Props) => {
  const navigate = useNavigate();

  if (disposals.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        Tidak ada data disposal
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nomor memo</TableHead>
          <TableHead>Subjek</TableHead>
          <TableHead>Tanggal memo</TableHead>
          <TableHead>Deskripsi</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {disposals.map((d) => (
          <TableRow
            key={d.disposal_id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => navigate(`/penghapusan/${d.disposal_id}`)}
          >
            <TableCell className="font-medium">{d.memo_number}</TableCell>
            <TableCell>{d.subject}</TableCell>
            <TableCell>{formatDate(d.memo_date)}</TableCell>
            <TableCell className="max-w-64 truncate text-muted-foreground text-sm">
              {d.description || "—"}
            </TableCell>
            <TableCell
              className="text-center w-12"
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
                    onClick={() => navigate(`/disposal/${d.disposal_id}`)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Detail
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => onDelete(d.disposal_id)}
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

export default DisposalTable;
