"use client";

import { BloodGroupBadge, UrgencyIndicator } from "@/components/features";
import { SidebarLayout } from "@/components/layout/sidebar-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle, Calendar, Heart, Loader2, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DonorMissionsPage() {
  const [missions, setMissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const donorId = localStorage.getItem("userId");
        if (!donorId) {
          toast.error("Please log in to view missions");
          setIsLoading(false);
          return;
        }
        const response = await fetch(`/api/requests?acceptedDonorId=${donorId}&status=ACCEPTED&sortBy=acceptedAt&sortOrder=desc`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch missions");
        }

        const data = await response.json();
        setMissions(data.requests);
      } catch (err) {
        console.error("Error fetching missions:", err);
        setError("Failed to load missions");
        toast.error("Failed to load missions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMissions();
  }, []);

  if (isLoading) {
    return (
      <SidebarLayout userType="donor">
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-emergency-600" />
        </div>
      </SidebarLayout>
    );
  }

  if (error) {
    return (
      <SidebarLayout userType="donor">
        <div className="container mx-auto px-4 py-8">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-900">Error Loading Missions</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline" className="border-red-200 hover:bg-red-100">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout userType="donor">
      <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Missions</h1>
            <p className="text-gray-600 mt-1">Blood requests you've accepted</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-emergency-100 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-emergency-600" fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{missions.length}</p>
                    <p className="text-sm text-gray-600">Active Missions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Missions List */}
          {missions.length > 0 ? (
            <div className="space-y-4">
              {missions.map((mission) => (
                <Card key={mission._id} className="border-emergency-200 bg-emergency-50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{mission.patientName}</CardTitle>
                        <CardDescription>Accepted {formatDistanceToNow(new Date(mission.acceptedAt), { addSuffix: true })}</CardDescription>
                      </div>
                      <UrgencyIndicator level={mission.urgency} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <BloodGroupBadge bloodGroup={mission.bloodGroup} size="md" />
                        <span className="text-gray-600">{mission.unitsNeeded} unit(s)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900">Needed By</p>
                          <p className="text-sm text-gray-600">
                            {formatDistanceToNow(new Date(mission.neededBy), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900">{mission.hospitalName}</p>
                        <p className="text-sm text-gray-600">
                          {mission.location?.thana || mission.thana}, {mission.location?.district || mission.district}
                        </p>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white p-4 rounded-lg border border-emergency-200">
                      <p className="text-sm font-semibold text-gray-900 mb-2">Contact Information</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <a href={`tel:${mission.contactPhone}`} className="text-emergency-600 hover:underline font-mono">
                            {mission.contactPhone}
                          </a>
                        </div>
                        {mission.alternatePhone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <a href={`tel:${mission.alternatePhone}`} className="text-emergency-600 hover:underline font-mono">
                              {mission.alternatePhone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t">
                      <Link href={`/request/${mission._id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </Link>
                      <Button className="flex-1 bg-emergency-600 hover:bg-emergency-700">
                        <Phone className="mr-2 h-4 w-4" />
                        Call Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No active missions</h3>
                <p className="text-gray-600 mb-4">You haven't accepted any blood requests yet</p>
                <Link href="/donor/requests">
                  <Button className="bg-emergency-600 hover:bg-emergency-700">
                    Browse Requests
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}
