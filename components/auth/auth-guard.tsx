"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for authentication and validate user exists on the server
    const checkAuth = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        router.push("/auth/signin");
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/users/${userId}`);
        if (!res.ok) {
          // invalid or removed user — clear and redirect
          localStorage.removeItem("userId");
          localStorage.removeItem("userRole");
          router.push("/auth/signin");
        } else {
          const data = await res.json();
          // If API returns user object, allow access
          if (data && (data.user || data.name || data._id)) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("userId");
            localStorage.removeItem("userRole");
            router.push("/auth/signin");
          }
        }
      } catch (err) {
        console.error("Auth validation failed", err);
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");
        router.push("/auth/signin");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-emergency-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
