"use client";

import { BloodGroupBadge, TrustScoreBadge, UrgencyIndicator } from "@/components/features";
import { SidebarLayout } from "@/components/layout/sidebar-layout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    MapPin,
    MessageSquare,
    Phone,
    User,
    XCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Mock request data
const mockRequest = {
  id: "REQ001",
  patientName: "Ahmed Hassan",
  bloodGroup: "O-" as const,
  unitsNeeded: 2,
  urgency: "CRITICAL" as const,
  hospitalName: "Dhaka Medical College Hospital",
  division: "Dhaka",
  district: "Dhaka",
  thana: "Shahbag",
  contactPhone: "01712345678",
  alternatePhone: "01812345679",
  neededBy: new Date(Date.now() + 2 * 60 * 60 * 1000),
  createdAt: new Date(Date.now() - 30 * 60 * 1000),
  additionalInfo: "Patient is in ICU. Urgent surgery scheduled. Please contact immediately if available.",
  hasPrescription: true,
  status: "OPEN" as const,
  trustScore: "HIGH" as const,
  seekerName: "Fatima Hassan",
  relationship: "Sister",
};

// Mock donor responses
const mockResponses = [
  {
    id: "RESP001",
    donorName: "Karim Rahman",
    bloodGroup: "O+" as const,
    distance: "2.3 km",
    responseTime: new Date(Date.now() - 15 * 60 * 1000),
    status: "accepted" as const,
    phone: "01712345670",
    totalDonations: 12,
    lastDonation: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
  },
  {
    id: "RESP002",
    donorName: "Rafiq Ahmed",
    bloodGroup: "O-" as const,
    distance: "3.8 km",
    responseTime: new Date(Date.now() - 10 * 60 * 1000),
    status: "pending" as const,
    phone: "01812345671",
    totalDonations: 8,
    lastDonation: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
  },
  {
    id: "RESP003",
    donorName: "Salim Khan",
    bloodGroup: "O-" as const,
    distance: "5.1 km",
    responseTime: new Date(Date.now() - 5 * 60 * 1000),
    status: "pending" as const,
    phone: "01912345672",
    totalDonations: 5,
    lastDonation: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
  },
];

export default function SeekerRequestDetailsPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("overview");

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
              <p className="text-gray-600 mt-1">Request ID: {mockRequest.id}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Badge variant="outline" className="text-sm px-4 py-2">
                {mockRequest.status}
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
                    <p className="text-3xl font-bold text-emergency-900">{mockResponses.length}</p>
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
                    <p className="text-3xl font-bold text-gray-900">
                      {mockResponses.filter(r => r.status === "accepted").length}
                    </p>
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
                    <p className="text-3xl font-bold text-gray-900">
                      {mockResponses.filter(r => r.status === "pending").length}
                    </p>
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
                Donor Responses ({mockResponses.length})
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
                      <UrgencyIndicator level={mockRequest.urgency} />
                      <TrustScoreBadge level={mockRequest.trustScore} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Blood Group & Units */}
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Blood Group Needed</p>
                      <BloodGroupBadge bloodGroup={mockRequest.bloodGroup} size="lg" />
                    </div>
                    <Separator orientation="vertical" className="h-16" />
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Units Required</p>
                      <p className="text-4xl font-bold text-emergency-600">{mockRequest.unitsNeeded}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Details Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Patient Name</p>
                        <p className="font-semibold text-gray-900">{mockRequest.patientName}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Needed By</p>
                        <p className="font-semibold text-gray-900">
                          {formatDistanceToNow(mockRequest.neededBy, { addSuffix: true })}
                        </p>
                        <p className="text-xs text-gray-500">
                          {mockRequest.neededBy.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Hospital</p>
                        <p className="font-semibold text-gray-900">{mockRequest.hospitalName}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-semibold text-gray-900">
                          {mockRequest.thana}, {mockRequest.district}
                        </p>
                        <p className="text-xs text-gray-500">{mockRequest.division} Division</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Posted</p>
                        <p className="font-semibold text-gray-900">
                          {formatDistanceToNow(mockRequest.createdAt, { addSuffix: true })}
                        </p>
                      </div>
                    </div>

                    {mockRequest.hasPrescription && (
                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-trust-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Prescription</p>
                          <Badge variant="outline" className="text-trust-600 border-trust-600">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>

                  {mockRequest.additionalInfo && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Additional Information</p>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="text-gray-900">{mockRequest.additionalInfo}</p>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Actions */}
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
            <TabsContent value="responses" className="space-y-4">
              {mockResponses.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No responses yet</h3>
                    <p className="text-gray-600">Donors will appear here when they respond to your request</p>
                  </CardContent>
                </Card>
              ) : (
                mockResponses.map((response) => (
                  <Card key={response.id} className={response.status === "accepted" ? "border-2 border-trust-200 bg-trust-50" : ""}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-emergency-600 text-white text-lg">
                              {response.donorName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-xl">{response.donorName}</CardTitle>
                            <CardDescription>
                              Responded {formatDistanceToNow(response.responseTime, { addSuffix: true })}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className={response.status === "accepted" ? "bg-trust-600 text-white" : "bg-warning-600 text-white"}>
                          {response.status === "accepted" ? (
                            <>
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Accepted
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </>
                          )}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <Droplet className="h-5 w-5 text-emergency-600" fill="currentColor" />
                          <div>
                            <p className="text-sm text-gray-600">Blood Group</p>
                            <BloodGroupBadge bloodGroup={response.bloodGroup} size="sm" />
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Distance</p>
                            <p className="font-semibold text-gray-900">{response.distance}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Total Donations</p>
                            <p className="font-semibold text-gray-900">{response.totalDonations}</p>
                          </div>
                        </div>
                      </div>

                      {response.status === "accepted" && (
                        <div className="bg-white p-4 rounded-lg border border-trust-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Phone className="h-4 w-4 text-trust-600" />
                            <p className="text-sm font-semibold text-trust-900">Contact Information</p>
                          </div>
                          <p className="font-mono text-lg text-gray-900">{response.phone}</p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button className="flex-1 bg-emergency-600 hover:bg-emergency-700">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Message Donor
                        </Button>
                        {response.status === "pending" && (
                          <Button variant="outline" className="flex-1">
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Accept Donor
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SidebarLayout>
  );
}
