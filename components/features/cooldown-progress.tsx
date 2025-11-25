import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CooldownProgressProps {
  daysRemaining: number;
  totalDays: number;
  className?: string;
}

export function CooldownProgress({ 
  daysRemaining, 
  totalDays,
  className 
}: CooldownProgressProps) {
  const percentageComplete = ((totalDays - daysRemaining) / totalDays) * 100;
  const isNearlyReady = daysRemaining <= 7;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Cooldown Progress</span>
        <span className={cn(
          "font-semibold",
          isNearlyReady ? "text-trust-600" : "text-cooldown-600"
        )}>
          {daysRemaining} days remaining
        </span>
      </div>
      <Progress 
        value={percentageComplete} 
        className="h-2"
        indicatorClassName={cn(
          isNearlyReady ? "bg-trust-600" : "bg-cooldown-600"
        )}
      />
      {isNearlyReady && (
        <p className="text-xs text-trust-600 font-medium">
          Almost ready to donate again!
        </p>
      )}
    </div>
  );
}
