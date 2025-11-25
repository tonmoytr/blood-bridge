import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";

type TrustLevel = "HIGH" | "MEDIUM" | "LOW";

interface TrustScoreBadgeProps {
  level: TrustLevel;
  className?: string;
  showIcon?: boolean;
}

export function TrustScoreBadge({ 
  level, 
  className,
  showIcon = true 
}: TrustScoreBadgeProps) {
  const trustConfig = {
    HIGH: {
      label: "Verified",
      icon: ShieldCheck,
      className: "bg-trust-600 hover:bg-trust-700 text-white border-trust-700",
    },
    MEDIUM: {
      label: "Moderate",
      icon: Shield,
      className: "bg-cooldown-500 hover:bg-cooldown-600 text-white border-cooldown-600",
    },
    LOW: {
      label: "Unverified",
      icon: ShieldAlert,
      className: "bg-gray-500 hover:bg-gray-600 text-white border-gray-600",
    },
  };

  const config = trustConfig[level];
  const Icon = config.icon;

  return (
    <Badge className={cn("font-semibold gap-1", config.className, className)}>
      {showIcon && <Icon className="h-3 w-3" />}
      {config.label}
    </Badge>
  );
}
