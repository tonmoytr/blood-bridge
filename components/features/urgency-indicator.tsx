import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, Clock, Info } from "lucide-react";

type UrgencyLevel = "CRITICAL" | "URGENT_6H" | "URGENT_12H" | "HIGH" | "NORMAL";

interface UrgencyIndicatorProps {
  level: UrgencyLevel;
  className?: string;
}

export function UrgencyIndicator({ level, className }: UrgencyIndicatorProps) {
  const config = {
    CRITICAL: {
      color: "bg-emergency-600 text-white",
      icon: AlertCircle,
      label: "Critical",
      animate: true,
    },
    URGENT_6H: {
      color: "bg-orange-500 text-white",
      icon: Clock,
      label: "6 Hours",
      animate: false,
    },
    URGENT_12H: {
      color: "bg-cooldown-500 text-white",
      icon: Clock,
      label: "12 Hours",
      animate: false,
    },
    HIGH: {
      color: "bg-trust-600 text-white",
      icon: AlertTriangle,
      label: "High",
      animate: false,
    },
    NORMAL: {
      color: "bg-gray-500 text-white",
      icon: Info,
      label: "Normal",
      animate: false,
    },
  };

  const { color, icon: Icon, label, animate } = config[level];

  return (
    <Badge
      className={cn(
        color,
        animate && "animate-pulse",
        "flex items-center gap-1.5 px-3 py-1",
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </Badge>
  );
}
