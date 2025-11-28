"use client";

import { BloodGroupBadge } from "@/components/features";
import { SidebarLayout } from "@/components/layout/sidebar-layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IRequest } from "@/types/database";
import { formatDistanceToNow } from "date-fns";
import {
    Award,
    Building2,
    Calendar,
    CheckCircle2,
    Droplet,
    Heart,
    Loader2,
    MapPin,
    TrendingUp
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DonorHistoryPage() {
  const [completedDonations, setCompletedDonations] = useState<IRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        // TODO: Replace with real donor ID from auth
        const donorId = "6927e833f8cd4defb21cc1c1";
        const response = await fetch(`/api/requests?acceptedDonorId=${donorId}&status=COMPLETED&sortBy=completedAt&sortOrder=desc`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch donation history");
        }

        const data = await response.json();
        setCompletedDonations(data.requests || []);
      } catch (error: any) {
        console.error("Error fetching history:", error);
        toast.error("Failed to load donation history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const totalDonations = completedDonations.length;
  const totalUnits = completedDonations.reduce((sum, d) => sum + d.unitsNeeded, 0);
  const livesSaved = totalDonations * 3;

  if (loading) {
    return (
      <SidebarLayout userType="donor">
        <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-emergency-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading donation history...</p>
            </div>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout userType="donor">
      <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Donation History</h1>
            <p className="text-gray-600 mt-1">Your life-saving contributions</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-2 border-trust-200 bg-trust-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-trust-600 flex items-center justify-center">
                    <Droplet className="h-6 w-6 text-white" fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-trust-900">{totalDonations}</p>
                    <p className="text-sm text-trust-700">Total Donations</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-emergency-100 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-emergency-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{totalUnits}</p>
                    <p className="text-sm text-gray-600">Units Donated</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-cooldown-100 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-cooldown-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{livesSaved}</p>
                    <p className="text-sm text-gray-600">Lives Saved</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Donation Timeline</CardTitle>
              <CardDescription>Your complete donation history</CardDescription>
            </CardHeader>
            <CardContent>
              {completedDonations.length === 0 ? (
                <div className="text-center py-12">
                  <Droplet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No donations yet</h3>
                  <p className="text-gray-600">Start saving lives by accepting blood requests</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {completedDonations.map((donation, index) => (
                    <Link key={donation._id} href={`/donor/mission/${donation._id}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            {/* Timeline dot */}
                            <div className="flex flex-col items-center">
                              <div className="h-10 w-10 rounded-full bg-trust-100 flex items-center justify-center">
                                <CheckCircle2 className="h-5 w-5 text-trust-600" />
                              </div>
                              {index < completedDonations.length - 1 && (
                                <div className="w-0.5 h-full bg-gray-200 mt-2" />
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <div className="flex items-center gap-3 mb-2">
                                    <BloodGroupBadge bloodGroup={donation.bloodGroup} size="sm" />
                                    <Badge className="bg-trust-600">Completed</Badge>
                                  </div>
                                  <h3 className="font-semibold text-gray-900">{donation.patientName}</h3>
                                </div>
                                <div className="text-right">
                                  <p className="text-2xl font-bold text-trust-600">{donation.unitsNeeded}</p>
                                  <p className="text-xs text-gray-600">units</p>
                                </div>
                              </div>

                              <div className="space-y-1 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <Building2 className="h-4 w-4" />
                                  {donation.hospitalName}
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  {donation.location?.thana}, {donation.location?.district}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  Completed {donation.completedAt ? formatDistanceToNow(new Date(donation.completedAt), { addSuffix: true }) : 'recently'}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Achievements */}
          {totalDonations > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-cooldown-600" />
                  Achievements Unlocked
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {totalDonations >= 1 && (
                    <Badge variant="outline" className="text-base px-4 py-2 border-2 border-cooldown-500 text-cooldown-700 bg-cooldown-50">
                      <Award className="h-4 w-4 mr-2" />
                      First Donation
                    </Badge>
                  )}
                  {totalDonations >= 5 && (
                    <Badge variant="outline" className="text-base px-4 py-2 border-2 border-cooldown-500 text-cooldown-700 bg-cooldown-50">
                      <Award className="h-4 w-4 mr-2" />
                      Hero (5 Donations)
                    </Badge>
                  )}
                  {totalDonations >= 10 && (
                    <Badge variant="outline" className="text-base px-4 py-2 border-2 border-cooldown-500 text-cooldown-700 bg-cooldown-50">
                      <Award className="h-4 w-4 mr-2" />
                      Legend (10 Donations)
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}
