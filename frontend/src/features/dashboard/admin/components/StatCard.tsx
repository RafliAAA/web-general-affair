import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  description?: string;
  colorClass?: string;
}

const StatCard = ({
  label,
  value,
  icon: Icon,
  description,
  colorClass = "bg-primary/10 text-primary",
}: StatCardProps) => {
  return (
    <div className="rounded-xl border bg-card p-5 transition-shadow hover:shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full",
            colorClass,
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-2">
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
