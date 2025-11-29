"use client";

import { BloodGroupBadge } from "@/components/features";
import { SidebarLayout } from "@/components/layout/sidebar-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle, Calendar, CheckCircle2, Clock, Loader2, MapPin, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SeekerHistoryPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const seekerId = localStorage.getItem("userId");
        if (!seekerId) {
          toast.error("Please log in to view history");
          setIsLoading(false);
          return;
        }
        const response = await fetch(`/api/requests?seekerId=${seekerId}&sortBy=createdAt&sortOrder=desc`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch history");
        }

        const data = await response.json();
        // Filter for completed and cancelled requests
        const historyRequests = data.requests.filter(
          (r: any) => r.status === "COMPLETED" || r.status === "CANCELLED"
        );
        setRequests(historyRequests);
      } catch (err) {
        console.error("Error fetching history:", err);
        setError("Failed to load history");
        toast.error("Failed to load history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const completedRequests = requests.filter(r => r.status === "COMPLETED");
  const cancelledRequests = requests.filter(r => r.status === "CANCELLED");

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
              <h3 className="text-lg font-semibold text-red-900">Error Loading History</h3>
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
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Request History</h1>
            <p className="text-gray-600 mt-1">View your past blood requests</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4">
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
                    <XCircle className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{cancelledRequests.length}</p>
                    <p className="text-sm text-gray-600">Cancelled</p>
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
                    <p className="text-sm text-gray-600">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Completed Requests */}
          {completedRequests.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Completed Requests</h2>
              <div className="space-y-4">
                {completedRequests.map((request) => (
                  <Card key={request._id} className="border-trust-200 bg-trust-50">
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

                      <div className="flex items-center gap-4 text-sm text-gray-600 pt-4 border-t">
                        <span>Completed {formatDistanceToNow(new Date(request.completedAt || request.updatedAt), { addSuffix: true })}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Cancelled Requests */}
          {cancelledRequests.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cancelled Requests</h2>
              <div className="space-y-4">
                {cancelledRequests.map((request) => (
                  <Card key={request._id} className="opacity-75">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{request.patientName}</CardTitle>
                          <CardDescription>Request ID: {request._id}</CardDescription>
                        </div>
                        <Badge variant="outline" className="text-gray-600 border-gray-400">
                          <XCircle className="h-3 w-3 mr-1" />
                          Cancelled
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

                      <div className="flex items-center gap-4 text-sm text-gray-600 pt-4 border-t">
                        <span>Cancelled {formatDistanceToNow(new Date(request.updatedAt), { addSuffix: true })}</span>
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No history yet</h3>
                <p className="text-gray-600">Your completed and cancelled requests will appear here</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}
