import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Pencil, Trash2, FileText } from "lucide-react";
import type { SOP } from "@/types/sop";

interface SOPCardProps {
  sop: SOP;
  onEdit: (sop: SOP) => void;
  onDelete: (id: string) => void;
}

const categoryColor = (cat: string) => {
  const map: Record<string, string> = {
    Aset: "bg-primary/10 text-primary",
    Kendaraan: "bg-accent text-accent-foreground",
    Ruangan: "bg-secondary text-secondary-foreground",
    Umum: "bg-muted text-muted-foreground",
    Keamanan: "bg-destructive/10 text-destructive",
  };
  return map[cat] || "bg-muted text-muted-foreground";
};

export default function SOPCard({ sop, onEdit, onDelete }: SOPCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base">{sop.title}</CardTitle>
              <CardDescription className="mt-1">{sop.description}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="outline" className={categoryColor(sop.category)}>
              {sop.category}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(sop)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onDelete(sop.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Accordion type="single" collapsible>
          <AccordionItem value="steps">
            <AccordionTrigger className="py-2 text-sm text-muted-foreground hover:no-underline">
              Lihat {sop.steps.length} Langkah
            </AccordionTrigger>
            <AccordionContent>
              <ol className="space-y-2 mt-2">
                {sop.steps.map((step) => (
                  <li key={step.order} className="flex gap-3 text-sm">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                      {step.order}
                    </span>
                    <span className="pt-0.5">{step.description}</span>
                  </li>
                ))}
              </ol>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
          <span>Dibuat: {sop.createdAt}</span>
          <span>Diperbarui: {sop.updatedAt}</span>
        </div>
      </CardContent>
    </Card>
  );
}