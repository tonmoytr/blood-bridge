"use client";

import {
  CooldownProgress,
  DonorCard,
  StatusBadge
} from "@/components/features";
import { SidebarLayout } from "@/components/layout/sidebar-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { currentDonor } from "@/lib/mock-data";
import {
  ArrowRight,
  Award,
  Calendar,
  Clock,
  Droplet,
  Heart
} from "lucide-react";

export default function DonorDashboard() {
  const donor = currentDonor;
  const isInCooldown = donor.status === "COOLDOWN";

  return (
    <SidebarLayout userType="donor">
      <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Welcome Section */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {donor.name}!</h1>
            <p className="text-gray-600 mt-1">Your donation dashboard</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Digital Card & Status */}
            <div className="lg:col-span-1 space-y-6">
              {/* Digital Donor Card */}
              <DonorCard donor={donor} />

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Droplet className="h-8 w-8 mx-auto mb-2 text-emergency-600" fill="currentColor" />
                    <p className="text-2xl font-bold text-gray-900">{donor.totalDonations}</p>
                    <p className="text-sm text-gray-600">Donations</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Heart className="h-8 w-8 mx-auto mb-2 text-trust-600" />
                    <p className="text-2xl font-bold text-gray-900">{donor.totalDonations * 3}</p>
                    <p className="text-sm text-gray-600">Lives Saved</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Column - Status & Actions */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status Card */}
              <Card className="border-2 border-gray-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">Donor Status</CardTitle>
                      <CardDescription>Your current availability</CardDescription>
                    </div>
                    <StatusBadge status={donor.status} className="text-lg px-4 py-2" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isInCooldown && donor.cooldownDaysRemaining && (
                    <CooldownProgress 
                      daysRemaining={donor.cooldownDaysRemaining} 
                      totalDays={120}
                    />
                  )}

                  {!isInCooldown && (
                    <div className="flex items-center justify-between bg-trust-50 p-6 rounded-lg border border-trust-200">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-full bg-trust-600 flex items-center justify-center">
                          <Heart className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-lg text-trust-900">You're ready to donate!</p>
                          <p className="text-sm text-trust-700">Check emergency requests near you</p>
                        </div>
                      </div>
                      <Button className="bg-trust-600 hover:bg-trust-700" size="lg">
                        View Requests
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Badges & Recognition */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-cooldown-600" />
                    Your Badges
                  </CardTitle>
                  <CardDescription>Recognition for your life-saving contributions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {donor.badges.map((badge) => (
                      <Badge 
                        key={badge} 
                        variant="outline" 
                        className="text-base px-4 py-2 border-2 border-cooldown-500 text-cooldown-700 bg-cooldown-50"
                      >
                        <Award className="h-4 w-4 mr-2" />
                        {badge}
                      </Badge>
                    ))}
                  </div>
                  {donor.badges.length === 0 && (
                    <p className="text-gray-500 text-sm">Complete donations to earn badges!</p>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-emergency-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-emergency-100 flex items-center justify-center">
                        <Droplet className="h-6 w-6 text-emergency-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">Emergency Requests</h3>
                        <p className="text-sm text-gray-600">View blood requests near you</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-cooldown-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-cooldown-100 flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-cooldown-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">Donation History</h3>
                        <p className="text-sm text-gray-600">View your past donations</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Snooze Controls */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gray-600" />
                    Availability Controls
                  </CardTitle>
                  <CardDescription>Temporarily pause notifications if needed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline">Snooze for 7 days</Button>
                    <Button variant="outline">Snooze for 1 month</Button>
                    <Button variant="outline">Custom duration</Button>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    While snoozed, you won't appear in donor searches
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
