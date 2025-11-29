"use client";

import { BloodGroupBadge, TrustScoreBadge, UrgencyIndicator } from "@/components/features";
import { SidebarLayout } from "@/components/layout/sidebar-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle, Calendar, CheckCircle2, Clock, Loader2, MapPin, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SeekerRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const seekerId = localStorage.getItem("userId");
        if (!seekerId) {
          toast.error("Please log in to view requests");
          setIsLoading(false);
          return;
        }
        const response = await fetch(`/api/requests?seekerId=${seekerId}&sortBy=createdAt&sortOrder=desc`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch requests");
        }

        const data = await response.json();
        setRequests(data.requests);
      } catch (err) {
        console.error("Error fetching requests:", err);
        setError("Failed to load your requests");
        toast.error("Failed to load requests");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const activeRequests = requests.filter(r => r.status === "OPEN" || r.status === "ACCEPTED");
  const completedRequests = requests.filter(r => r.status === "COMPLETED" || r.status === "CANCELLED");

  if (isLoading) {
    return (
      <SidebarLayout userType="seeker">
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-emergency-600" />
        </div>
      </SidebarLayout>
    );
  }

  if (error) {
    return (
      <SidebarLayout userType="seeker">
        <div className="container mx-auto px-4 py-8">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-900">Error Loading Requests</h3>
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
    <SidebarLayout userType="seeker">
      <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Requests</h1>
              <p className="text-gray-600 mt-1">Manage your blood requests</p>
            </div>
            <Button asChild className="bg-emergency-600 hover:bg-emergency-700">
              <Link href="/request/new">
                <Plus className="mr-2 h-4 w-4" />
                New Request
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-emergency-100 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-emergency-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{activeRequests.length}</p>
                    <p className="text-sm text-gray-600">Active Requests</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-trust-100 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-trust-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{completedRequests.length}</p>
                    <p className="text-sm text-gray-600">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{requests.length}</p>
                    <p className="text-sm text-gray-600">Total Requests</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Requests */}
          {activeRequests.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Active Requests</h2>
              <div className="space-y-4">
                {activeRequests.map((request) => (
                  <Card key={request._id} className="border-2 border-emergency-200">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{request.patientName}</CardTitle>
                          <CardDescription>Request ID: {request._id}</CardDescription>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {request.status === 'ACCEPTED' && (
                            <Badge className="bg-trust-600 text-white">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Accepted by Donor
                            </Badge>
                          )}
                          <UrgencyIndicator level={request.urgency} />
                          <TrustScoreBadge level={request.trustScore} />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <BloodGroupBadge bloodGroup={request.bloodGroup} size="md" />
                          <span className="text-gray-600">{request.unitsNeeded} unit(s) needed</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="font-semibold text-gray-900">{request.hospitalName}</p>
                            <p className="text-sm text-gray-600">
                              {request.location?.thana || request.thana}, {request.location?.district || request.district}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Posted {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}</span>
                          <span>•</span>
                          <span>{request.status === 'ACCEPTED' ? '1 response' : '0 responses'}</span>
                        </div>
                        <Button asChild variant="outline">
                          <Link href={`/seeker/requests/${request._id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Completed Requests */}
          {completedRequests.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Completed Requests</h2>
              <div className="space-y-4">
                {completedRequests.map((request) => (
                  <Card key={request._id} className="opacity-75">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{request.patientName}</CardTitle>
                          <CardDescription>Request ID: {request._id}</CardDescription>
                        </div>
                        <Badge className="bg-trust-600 text-white">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <BloodGroupBadge bloodGroup={request.bloodGroup} size="md" />
                          <span className="text-gray-600">{request.unitsNeeded} unit(s)</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="font-semibold text-gray-900">{request.hospitalName}</p>
                            <p className="text-sm text-gray-600">
                              {request.location?.thana || request.thana}, {request.location?.district || request.district}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Completed {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}</span>
                          <span>•</span>
                          <span>0 responses</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {requests.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No requests yet</h3>
                <p className="text-gray-600 mb-6">Create your first emergency blood request</p>
                <Button asChild className="bg-emergency-600 hover:bg-emergency-700">
                  <Link href="/request/new">
                    <Plus className="mr-2 h-4 w-4" />
                    New Request
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}
