import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface SecurityBadgeProps {
  score: number;
  className?: string;
}

export function SecurityBadge({ score, className }: SecurityBadgeProps) {
  let colorClass = "";
  let Icon = Shield;
  let label = "Unknown";

  if (score >= 80) {
    colorClass = "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20";
    Icon = ShieldCheck;
    label = "High Security";
  } else if (score >= 50) {
    colorClass = "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20";
    Icon = ShieldAlert;
    label = "Medium Security";
  } else {
    colorClass = "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border-rose-500/20";
    Icon = ShieldAlert;
    label = "Low Security";
  }

  return (
    <Badge variant="outline" className={cn("px-2.5 py-1 gap-1.5", colorClass, className)}>
      <Icon className="h-3.5 w-3.5" />
      <span className="font-medium">{label} ({score}/100)</span>
    </Badge>
  );
}
