import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface SOPHeaderProps {
  onAdd: () => void;
}

export default function SOPHeader({ onAdd }: SOPHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <p className="text-sm text-muted-foreground"></p>
      </div>
      <Button onClick={onAdd} className="gap-2">
        <Plus className="h-4 w-4" />
        Tambah SOP
      </Button>
    </div>
  );
}