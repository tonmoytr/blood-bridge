import {
    BloodGroupBadge,
    CooldownProgress,
    StatusBadge
} from "@/components/features";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { currentDonor } from "@/lib/mock-data";
import {
    ArrowRight,
    Award,
    Bell,
    Calendar,
    Clock,
    Droplet,
    Heart,
    Settings
} from "lucide-react";
import Link from "next/link";

export default function DonorDashboard() {
  const donor = currentDonor;
  const isInCooldown = donor.status === "COOLDOWN";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Droplet className="h-8 w-8 text-emergency-600" fill="currentColor" />
              <span className="text-2xl font-bold text-gray-900">BloodBridge</span>
            </Link>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Welcome Section */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {donor.name}!</h1>
            <p className="text-gray-600 mt-1">Your donation dashboard</p>
          </div>

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
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Blood Group</p>
                  <BloodGroupBadge bloodGroup={donor.bloodGroup} size="lg" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Total Donations</p>
                  <p className="text-3xl font-bold text-gray-900">{donor.totalDonations}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Location</p>
                  <p className="text-lg font-semibold text-gray-900">{donor.location.thana}</p>
                  <p className="text-sm text-gray-600">{donor.location.district}</p>
                </div>
              </div>

              {isInCooldown && donor.cooldownDaysRemaining && (
                <>
                  <Separator />
                  <CooldownProgress 
                    daysRemaining={donor.cooldownDaysRemaining} 
                    totalDays={120}
                  />
                </>
              )}

              {!isInCooldown && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between bg-trust-50 p-4 rounded-lg border border-trust-200">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-trust-600 flex items-center justify-center">
                        <Heart className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-trust-900">You're ready to donate!</p>
                        <p className="text-sm text-trust-700">Check emergency requests near you</p>
                      </div>
                    </div>
                    <Link href="/donor/requests">
                      <Button className="bg-trust-600 hover:bg-trust-700">
                        View Requests
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </>
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

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
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

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
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
  );
}
