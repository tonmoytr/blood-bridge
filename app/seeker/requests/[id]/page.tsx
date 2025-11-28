"use client";

import { BloodGroupBadge, TrustScoreBadge, UrgencyIndicator } from "@/components/features";
import { SidebarLayout } from "@/components/layout/sidebar-layout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IRequest } from "@/types/database";
import { formatDistanceToNow } from "date-fns";
import {
    ArrowLeft,
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    Droplet,
    Edit,
    FileText,
    Loader2,
    MapPin,
    MessageSquare,
    Phone,
    User,
    XCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SeekerRequestDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("overview");
  const [request, setRequest] = useState<IRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);

  // Get request ID from params
  useEffect(() => {
    params.then((p) => setRequestId(p.id));
  }, [params]);

  // Fetch request details
  useEffect(() => {
    if (!requestId) return;

    const fetchRequest = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/requests/${requestId}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch request details");
        }

        const data = await response.json();
        setRequest(data.request);
      } catch (error: any) {
        console.error("Error fetching request:", error);
        setError(error.message);
        toast.error("Failed to load request details");
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [requestId]);

  if (loading) {
    return (
      <SidebarLayout userType="seeker">
        <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-emergency-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading request details...</p>
            </div>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  if (error || !request) {
    return (
      <SidebarLayout userType="seeker">
        <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Request</h2>
              <p className="text-gray-600 mb-4">{error || "Request not found"}</p>
              <Button onClick={() => router.back()}>Go Back</Button>
            </div>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  // Calculate stats
  const totalResponses = request.acceptedDonorId ? 1 : 0;
  const acceptedCount = request.status === 'ACCEPTED' ? 1 : 0;
  const pendingCount = 0; // We don't track pending responses yet

  return (
    <SidebarLayout userType="seeker">
      <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">My Request Details</h1>
              <p className="text-gray-600 mt-1">Request ID: {request._id}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Badge variant="outline" className="text-sm px-4 py-2">
                {request.status}
              </Badge>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-2 border-emergency-200 bg-emergency-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-emergency-600 flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-emergency-900">{totalResponses}</p>
                    <p className="text-sm text-emergency-700">Total Responses</p>
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
                    <p className="text-3xl font-bold text-gray-900">{acceptedCount}</p>
                    <p className="text-sm text-gray-600">Accepted</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-warning-100 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-warning-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{pendingCount}</p>
                    <p className="text-sm text-gray-600">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Request Overview</TabsTrigger>
              <TabsTrigger value="responses">
                Donor Responses ({totalResponses})
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">Patient Information</CardTitle>
                      <CardDescription>Your emergency blood request details</CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <UrgencyIndicator level={request.urgency} />
                      {request.trustScore && <TrustScoreBadge level={request.trustScore} />}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Blood Group & Units */}
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Blood Group Needed</p>
                      <BloodGroupBadge bloodGroup={request.bloodGroup} size="lg" />
                    </div>
                    <Separator orientation="vertical" className="h-16" />
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Units Required</p>
                      <p className="text-4xl font-bold text-emergency-600">{request.unitsNeeded}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Patient Details */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Patient Name</p>
                        <p className="font-semibold text-gray-900">{request.patientName}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Needed By</p>
                        <p className="font-semibold text-emergency-600">
                          {formatDistanceToNow(new Date(request.neededBy), { addSuffix: true })}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(request.neededBy).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Hospital</p>
                        <p className="font-semibold text-gray-900">{request.hospitalName}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-semibold text-gray-900">
                          {request.location?.thana || request.thana}, {request.location?.district || request.district}
                        </p>
                        <p className="text-xs text-gray-500">{request.location?.division || request.division} Division</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Posted</p>
                        <p className="font-semibold text-gray-900">
                          {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Prescription */}
                  {request.hasPrescription && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <p className="font-semibold text-gray-900">Prescription Uploaded</p>
                          <Badge variant="outline" className="ml-auto">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Verified
                          </Badge>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Additional Info */}
                  {request.additionalInfo && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <p className="font-semibold text-gray-900">Additional Information</p>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-900">{request.additionalInfo}</p>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button className="flex-1 bg-trust-600 hover:bg-trust-700">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Mark as Fulfilled
                </Button>
                <Button variant="outline" className="flex-1">
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel Request
                </Button>
              </div>
            </TabsContent>

            {/* Responses Tab */}
            <TabsContent value="responses" className="space-y-6">
              {totalResponses === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No responses yet</h3>
                    <p className="text-gray-600">Donors will appear here once they accept your request</p>
                  </CardContent>
                </Card>
              ) : (
                request.acceptedDonorId && typeof request.acceptedDonorId === 'object' && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-emergency-100 text-emergency-700 text-lg font-bold">
                              {request.acceptedDonorId.name ? request.acceptedDonorId.name.split(' ').map((n: string) => n[0]).join('') : 'D'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-xl">{request.acceptedDonorId.name}</CardTitle>
                            <CardDescription>
                              Accepted {formatDistanceToNow(new Date(request.acceptedAt!), { addSuffix: true })}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className="bg-trust-600">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Accepted
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Donor Details */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <Droplet className="h-5 w-5 text-emergency-600" fill="currentColor" />
                          <div>
                            <p className="text-sm text-gray-600">Blood Group</p>
                            <BloodGroupBadge bloodGroup={request.acceptedDonorId.bloodGroup} size="sm" />
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <MapPin className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Location</p>
                            <p className="font-semibold text-gray-900">
                              {request.acceptedDonorId.location?.thana}, {request.acceptedDonorId.location?.district}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Total Donations</p>
                            <p className="font-semibold text-gray-900">{request.acceptedDonorId.totalDonations || 0}</p>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Contact Info */}
                      <div className="space-y-3">
                        <p className="font-semibold text-gray-900">Contact Information</p>
                        <div className="flex items-center gap-3 bg-trust-50 rounded-lg p-4">
                          <Phone className="h-5 w-5 text-trust-600" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-600">Phone Number</p>
                            <p className="font-mono font-semibold text-trust-900">{request.acceptedDonorId.phone}</p>
                          </div>
                          <Button size="sm" className="bg-trust-600 hover:bg-trust-700">
                            <Phone className="mr-2 h-4 w-4" />
                            Call Now
                          </Button>
                        </div>
                        <Button variant="outline" className="w-full">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Send Message
                        </Button>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button className="flex-1 bg-trust-600 hover:bg-trust-700">
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Confirm Donation Received
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SidebarLayout>
  );
}
