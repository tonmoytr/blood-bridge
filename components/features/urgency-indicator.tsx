import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AlertCircle, Clock, Zap } from "lucide-react";

type UrgencyLevel = "CRITICAL" | "HIGH" | "NORMAL";

interface UrgencyIndicatorProps {
  level: UrgencyLevel;
  className?: string;
  showIcon?: boolean;
}

export function UrgencyIndicator({ 
  level, 
  className,
  showIcon = true 
}: UrgencyIndicatorProps) {
  const urgencyConfig = {
    CRITICAL: {
      label: "Critical",
      icon: Zap,
      className: "bg-emergency-600 hover:bg-emergency-700 text-white border-emergency-700 animate-pulse",
    },
    HIGH: {
      label: "High Priority",
      icon: AlertCircle,
      className: "bg-emergency-500 hover:bg-emergency-600 text-white border-emergency-600",
    },
    NORMAL: {
      label: "Normal",
      icon: Clock,
      className: "bg-cooldown-500 hover:bg-cooldown-600 text-white border-cooldown-600",
    },
  };

  const config = urgencyConfig[level];
  const Icon = config.icon;

  return (
    <Badge className={cn("font-semibold gap-1", config.className, className)}>
      {showIcon && <Icon className="h-3 w-3" />}
      {config.label}
    </Badge>
  );
}
