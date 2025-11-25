"use client";

import { cn } from "@/lib/utils";
import { Droplet, FileText } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export function RoleToggle() {
  const router = useRouter();
  const pathname = usePathname();
  
  const isDonor = pathname?.startsWith("/donor");
  const isSeeker = pathname?.startsWith("/seeker");

  const handleToggle = (role: "donor" | "seeker") => {
    if (role === "donor" && !isDonor) {
      router.push("/donor");
    } else if (role === "seeker" && !isSeeker) {
      router.push("/seeker");
    }
  };

  return (
    <div className="inline-flex items-center bg-gray-100 rounded-lg px-3 py-2 gap-2">
      {/* Donor Tab */}
      <button
        onClick={() => handleToggle("donor")}
        className={cn(
          "flex items-center gap-1.5 font-medium transition-colors duration-200",
          isDonor
            ? "text-emergency-600"
            : "text-gray-600 hover:text-gray-900"
        )}
      >
        <Droplet className={cn("h-4 w-4", isDonor && "fill-current")} />
        <span>Donor</span>
      </button>

      {/* Separator */}
      <div className="h-5 w-px bg-gray-300" />

      {/* Seeker Tab */}
      <button
        onClick={() => handleToggle("seeker")}
        className={cn(
          "flex items-center gap-1.5 font-medium transition-colors duration-200",
          isSeeker
            ? "text-emergency-600"
            : "text-gray-600 hover:text-gray-900"
        )}
      >
        <FileText className="h-4 w-4" />
        <span>Seeker</span>
      </button>
    </div>
  );
}
