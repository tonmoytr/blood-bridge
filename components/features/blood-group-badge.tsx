import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type BloodGroup = "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";

interface BloodGroupBadgeProps {
  bloodGroup: BloodGroup;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function BloodGroupBadge({ 
  bloodGroup, 
  className,
  size = "md" 
}: BloodGroupBadgeProps) {
  // Negative blood groups get emergency red styling
  const isNegative = bloodGroup.includes("-");
  
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5 font-bold",
  };

  return (
    <Badge
      className={cn(
        "font-bold",
        sizeClasses[size],
        isNegative 
          ? "bg-emergency-600 hover:bg-emergency-700 text-white border-emergency-700" 
          : "bg-emergency-500 hover:bg-emergency-600 text-white border-emergency-600",
        className
      )}
    >
      {bloodGroup}
    </Badge>
  );
}
