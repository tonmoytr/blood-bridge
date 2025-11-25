import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type DonorStatus = "ACTIVE" | "COOLDOWN" | "SNOOZED" | "BANNED";

interface StatusBadgeProps {
  status: DonorStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    ACTIVE: {
      label: "Active",
      className: "bg-trust-600 hover:bg-trust-700 text-white border-trust-700",
    },
    COOLDOWN: {
      label: "Cooldown",
      className: "bg-cooldown-600 hover:bg-cooldown-700 text-white border-cooldown-700",
    },
    SNOOZED: {
      label: "Snoozed",
      className: "bg-gray-500 hover:bg-gray-600 text-white border-gray-600",
    },
    BANNED: {
      label: "Banned",
      className: "bg-red-900 hover:bg-red-950 text-white border-red-950",
    },
  };

  const config = statusConfig[status];

  return (
    <Badge className={cn("font-semibold", config.className, className)}>
      {config.label}
    </Badge>
  );
}
