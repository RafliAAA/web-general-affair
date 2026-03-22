import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import type { SOP } from "@/types/sop";
import SOPCard from "./SOPCard";

interface SOPListProps {
  sops: SOP[];
  onEdit: (sop: SOP) => void;
  onDelete: (id: string) => void;
}

export default function SOPList({ sops, onEdit, onDelete }: SOPListProps) {
  if (sops.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-muted-foreground">Tidak ada SOP ditemukan.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sops.map((sop) => (
        <SOPCard key={sop.id} sop={sop} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
