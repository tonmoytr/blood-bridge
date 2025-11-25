"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Heart, Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emergency-50 via-white to-trust-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-2 shadow-xl">
        <CardContent className="p-12 text-center space-y-6">
          {/* 404 Icon */}
          <div className="relative">
            <div className="text-9xl font-bold text-gray-200 select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Heart className="h-24 w-24 text-emergency-600 animate-pulse" fill="currentColor" />
            </div>
          </div>

          {/* Message */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-gray-900">
              Page Not Found
            </h1>
            <p className="text-lg text-gray-600">
              Oops! The page you're looking for doesn't exist.
            </p>
            <p className="text-gray-500">
              It might have been moved or deleted, or you may have mistyped the URL.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button
              asChild
              size="lg"
              className="bg-emergency-600 hover:bg-emergency-700"
            >
              <Link href="/">
                <Home className="mr-2 h-5 w-5" />
                Go to Homepage
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Go Back
            </Button>
          </div>

          {/* Help Text */}
          <div className="pt-6 border-t">
            <p className="text-sm text-gray-500">
              Need help? Contact us or explore our{" "}
              <Link href="/" className="text-emergency-600 hover:text-emergency-700 font-semibold">
                emergency blood request platform
              </Link>
              .
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
