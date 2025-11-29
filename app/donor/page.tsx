"use client";

import {
    DonorCard
} from "@/components/features";
import { SidebarLayout } from "@/components/layout/sidebar-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCooldownStatusMessage, getNextEligibleDate, isDonorEligible } from "@/lib/donor-utils";
import { IRequest, IUser } from "@/types/database";
import {
    AlertCircle,
    ArrowRight,
    Award,
    Calendar,
    Clock,
    Droplet,
    Heart,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DonorDashboard() {
  const [donor, setDonor] = useState<IUser | null>(null);
  const [activeMissions, setActiveMissions] = useState<IRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const donorId = localStorage.getItem("userId");
        
        if (!donorId) {
          toast.error("Please log in to view dashboard");
          // Optional: redirect to login
          // router.push("/auth/signin");
          setLoading(false);
          return;
        }

        // Fetch donor data
        const donorResponse = await fetch(`/api/users/${donorId}`);
        if (donorResponse.ok) {
          const donorData = await donorResponse.json();
          setDonor(donorData.user);
        }

        // Fetch active missions
        const missionsResponse = await fetch(`/api/requests?acceptedDonorId=${donorId}&status=ACCEPTED`);
        if (missionsResponse.ok) {
          const missionsData = await missionsResponse.json();
          setActiveMissions(missionsData.requests || []);
        }
      } catch (error: any) {
        console.error("Error fetching donor data:", error);
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <SidebarLayout userType="donor">
        <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-emergency-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  if (!donor) {
    return (
      <SidebarLayout userType="donor">
        <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
          <div className="text-center py-12">
            <p className="text-gray-600">Failed to load donor data</p>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  const totalDonations = donor.totalDonations || 0;
  const livesSaved = totalDonations * 3;

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
            {/* Left Column - Digital Card & Stats */}
            <div className="lg:col-span-1 space-y-6">
              {/* Digital Donor Card */}
              <DonorCard donor={donor} />

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Droplet className="h-8 w-8 mx-auto mb-2 text-emergency-600" fill="currentColor" />
                    <p className="text-2xl font-bold text-gray-900">{totalDonations}</p>
                    <p className="text-sm text-gray-600">Donations</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Heart className="h-8 w-8 mx-auto mb-2 text-trust-600" />
                    <p className="text-2xl font-bold text-gray-900">{livesSaved}</p>
                    <p className="text-sm text-gray-600">Lives Saved</p>
                  </CardContent>
                </Card>
              </div>

              {/* Active Missions */}
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-warning-600" />
                  <p className="text-2xl font-bold text-gray-900">{activeMissions.length}</p>
                  <p className="text-sm text-gray-600">Active Missions</p>
                </CardContent>
              </Card>
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
                    {isDonorEligible(donor.lastDonationDate) ? (
                      <Badge className="text-lg px-4 py-2 bg-trust-600 hover:bg-trust-700">Active</Badge>
                    ) : (
                      <Badge variant="outline" className="text-lg px-4 py-2 border-cooldown-600 text-cooldown-700 bg-cooldown-50">
                        In Cooldown
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isDonorEligible(donor.lastDonationDate) ? (
                    // Eligible - Show ready to donate
                    <div className="flex items-center justify-between bg-trust-50 p-6 rounded-lg border border-trust-200">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-full bg-trust-600 flex items-center justify-center">
                          <Heart className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-lg text-trust-900">Ready to save lives!</p>
                          <p className="text-sm text-trust-700">Check emergency requests near you</p>
                        </div>
                      </div>
                      <Link href="/donor/requests">
                        <Button className="bg-trust-600 hover:bg-trust-700" size="lg">
                          View Requests
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    // In Cooldown - Show countdown
                    <div className="bg-cooldown-50 p-6 rounded-lg border-2 border-cooldown-200">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="h-14 w-14 rounded-full bg-cooldown-100 flex items-center justify-center flex-shrink-0">
                          <Clock className="h-7 w-7 text-cooldown-600 animate-pulse" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-lg text-cooldown-900 mb-1">
                            {getCooldownStatusMessage(donor.lastDonationDate).message}
                          </p>
                          <p className="text-sm text-cooldown-700 mb-3">
                            Your body is recovering from your last donation. Thank you for your contribution!
                          </p>
                          {getNextEligibleDate(donor.lastDonationDate) && (
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-cooldown-600" />
                              <span className="text-cooldown-800">
                                Next eligible date: <span className="font-semibold">
                                  {getNextEligibleDate(donor.lastDonationDate)?.toLocaleDateString('en-GB')}
                                </span>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-cooldown-200">
                        <div className="flex items-center gap-2 text-cooldown-800 mb-2">
                          <AlertCircle className="h-4 w-4" />
                          <p className="text-sm font-semibold">During cooldown period:</p>
                        </div>
                        <ul className="text-sm text-cooldown-700 space-y-1 ml-6 list-disc">
                          <li>Blood requests are hidden for your safety</li>
                          <li>You cannot accept new donation requests</li>
                          <li>Focus on rest and recovery</li>
                        </ul>
                      </div>
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
                    {donor.badges && donor.badges.length > 0 ? (
                      donor.badges.map((badge) => (
                        <Badge 
                          key={badge} 
                          variant="outline" 
                          className="text-base px-4 py-2 border-2 border-cooldown-500 text-cooldown-700 bg-cooldown-50"
                        >
                          <Award className="h-4 w-4 mr-2" />
                          {badge}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">Complete donations to earn badges!</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                <Link href="/donor/requests">
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
                </Link>

                <Link href="/donor/history">
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
                </Link>
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
