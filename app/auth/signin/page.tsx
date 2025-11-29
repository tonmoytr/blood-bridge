"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Droplet, Phone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function SignInPage() {
  const router = useRouter();
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if (!mobileNumber || !/^\d{11}$/.test(mobileNumber)) {
      toast.error("Please enter a valid 11-digit mobile number");
      return;
    }

    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: mobileNumber, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to sign in");
      }

      // Store auth data
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("userRole", "donor"); // Default role

      toast.success("Signed in successfully");
      
      // Redirect
      router.push("/donor");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in. Please check your number or sign up.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emergency-50 via-white to-trust-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emergency-600 to-emergency-700 flex items-center justify-center shadow-lg">
              <Droplet className="h-8 w-8 text-white" fill="currentColor" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emergency-600 to-trust-600 bg-clip-text text-transparent">
              BloodBridge
            </h1>
          </div>
          <p className="text-gray-600">Sign in to save lives</p>
        </div>

        {/* Sign In Card */}
        <Card className="border-2 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Enter your mobile number to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Mobile Number */}
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  maxLength={11}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Sign In Button */}
            <Button 
              onClick={handleSignIn} 
              className="w-full bg-gradient-to-r from-emergency-600 to-trust-600 hover:from-emergency-700 hover:to-trust-700"
              disabled={isLoading || !mobileNumber || mobileNumber.length !== 11 || !password}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>

            {/* Sign Up Link */}
            <div className="text-center text-sm">
              <span className="text-gray-600">Don't have an account? </span>
              <Link href="/auth/signup" className="text-emergency-600 hover:underline font-semibold">
                Sign Up
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          By signing in, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}
