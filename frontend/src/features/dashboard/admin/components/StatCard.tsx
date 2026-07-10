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
    <div className="rounded-lg border bg-card p-5 w-full gap-2 space-y-3">
      <div className="flex  items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className={`p-2 rounded-md ${colorClass}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-semibold">{value}</p>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

export default StatCard;