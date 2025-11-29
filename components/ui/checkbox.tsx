"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import * as React from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, checked, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onCheckedChange) {
        onCheckedChange(e.target.checked);
      }
      if (props.onChange) {
        props.onChange(e);
      }
    };

    return (
      <label className={cn("relative inline-flex items-center cursor-pointer", className)}>
        <input
          type="checkbox"
          ref={ref}
          className="sr-only peer"
          checked={checked}
          onChange={handleChange}
          {...props}
        />
        <div
          className={cn(
            "h-4 w-4 shrink-0 rounded-sm border border-gray-300 bg-white",
            "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-emergency-500 peer-focus-visible:ring-offset-2",
            "peer-checked:bg-emergency-600 peer-checked:border-emergency-600",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
            "transition-colors"
          )}
        >
          {checked && (
            <Check className="h-4 w-4 text-white" strokeWidth={3} />
          )}
        </div>
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
